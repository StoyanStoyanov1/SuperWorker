import Stripe from "stripe";
import prisma from "../../prisma/client.js";
import { AppError } from "../../shared/errors/AppError.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const createPaymentIntent = async (orderId: string, userId: string) => {
    const order = await prisma.order.findUnique({
        where: { id: orderId },
    });

    if (!order) throw new AppError("Order not found", 404);
    if (order.userId !== userId) throw new AppError("Forbidden", 403);
    if (order.status !== "PENDING") throw new AppError("Order is not pending", 400);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(order.totalPrice) * 100),
        currency: "eur",
        metadata: {
            orderId: order.id,
            userId,
        },
    });

    return { clientSecret: paymentIntent.client_secret };
};

export const handleWebhook = async (payload: Buffer, signature: string) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch {
        throw new AppError("Invalid webhook signature", 400);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        await prisma.order.update({
            where: { id: orderId },
            data: { status: "CONFIRMED" },
        });
    }

    if (event.type === "payment_intent.payment_failed") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        await prisma.order.update({
            where: { id: orderId },
            data: { status: "CANCELLED" },
        });
    }

    return { received: true };
};