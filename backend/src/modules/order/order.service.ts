import prisma from "../../prisma/client.js";
import type {OrderDto} from "./order.schema.js";
import {AppError} from "../../shared/errors/AppError.js";
import type {OrderStatus} from "@prisma/client";
import { paginate} from "../../shared/pagination/pagination.js";
import logger from "../../shared/logger/logger.js";
import { verifyPaymentIntent } from "../payment/payment.service.js";

export const createOrder = async (userId: string, dto: OrderDto) => {
    // 1. Verify Payment Intent first
    const paymentIntent = await verifyPaymentIntent(dto.paymentIntentId);
    
    if (!paymentIntent || paymentIntent.status !== "succeeded") {
        throw new AppError("Payment not confirmed. Please pay before placing order.", 400);
    }

    if (paymentIntent.metadata.userId !== userId) {
        throw new AppError("Payment session mismatch.", 403);
    }

    const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
            cartItems: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!cart || cart.cartItems.length === 0) throw new AppError("Cart is empty", 400);

    const address = await prisma.address.findUnique({
        where: { id: dto.addressId, userId },
    });

    if (!address) throw new AppError("Address is not found!", 404);

    const totalPrice: number = cart.cartItems.reduce((total, item) => total + Number(item.product.price) * item.quantity, 0);

    // 2. Verify amount matches (within 1 cent tolerance for rounding)
    if (Math.abs(Math.round(totalPrice * 100) - paymentIntent.amount) > 1) {
        throw new AppError("Payment amount mismatch. Cart might have changed.", 400);
    }

    const createdOrder = await prisma.$transaction(async (tx) => {

        for (const item of cart.cartItems) {
            const freshProduct = await tx.product.findUnique({ where: { id: item.productId } });
            if (!freshProduct || freshProduct.stock < item.quantity) {
                throw new AppError(`Product ${item.product.name} has insufficient stock`, 400);
            }
        }

        const newOrder = await tx.order.create({
            data: {
                userId,
                addressId: dto.addressId,
                totalPrice,
                status: "CONFIRMED",
                orderItems: {
                    create: cart.cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
            },
            include: {
                orderItems: true,
            },
        });

        for (const item of cart.cartItems) {
            await tx.product.update({
                where: {id: item.productId},
                data: {stock: {decrement: item.quantity}},
            });
        }

        await tx.cartItem.deleteMany({
            where: {cartId: cart.id},
        });

        return newOrder;
    });

    logger.info("Order created", {orderId: createdOrder.id, userId});

    return createdOrder;
};

export const getOrders = async (userId: string, page: number, limit: number) => {
    const { take, skip } = paginate(page, limit);

    const [data, total] = await Promise.all([
        prisma.order.findMany({
            where: { userId },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                images: true,
                            }
                        }
                    }
                }
            },
            take,
            skip,
        }),
        prisma.order.count({ where: { userId } }),
    ]);

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    }
};

export const getOrderById = async (userId: string, orderId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {orderItems: true},
    });

    if (!order) throw new AppError("Order not found!", 400);
    if (order.userId !== userId) throw new AppError("Forbidden!", 403);

    return order;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const order = await prisma.order.findUnique({where: { id: orderId},});

    if (!order) throw new AppError("Order not found!", 404);

    if (order.status === status) throw new AppError(`Order is already in ${status} status`, 400);

    const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status },
    });

    logger.info("Order updated", {orderId, status});

    return updatedOrder;
};

export const cancelOrder = async (userId: string, orderId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { orderItems: true },
    });

    if (!order) throw new AppError("Order not found", 404);
    if (order.userId !== userId) throw new AppError("Forbidden", 403);
    if (order.status !== "PENDING") throw new AppError("Only pending orders can be cancelled", 400);

    return prisma.$transaction(async (tx) => {
        for (const item of order.orderItems) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } },
            });
        }

        const cancelledOrder = await tx.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" },
        });

        logger.info("Order cancelled", { orderId, userId });

        return cancelledOrder;
    });
};
