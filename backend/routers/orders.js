import express from 'express';
import {Order, OrderItem} from "../models/index.js";
import orderItem from "../models/orderItem.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const orderList = await Order.find().populate("user", "name").sort({"dateOrdered": -1});

        if (orderList.length === 0) {
            return res.status(404).json({success: false, message: "No order found."});
        }

        res.status(200).send(orderList);

    } catch (error) {
        res.status(500).json({error, message: error.message});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name")
            .populate({ path: "orderItems", populate: {
                path: "product", populate: "category"
                }})

        if (!order) {
            return res.status(404).json({success: false, message: "No order found."});
        }

        res.status(200).send(order);

    } catch (error) {
        res.status(500).json({error, message: error.message});
    }
});

router.post("/", async (req, res) => {
    try {
        const orderItemsIds = Promise.all(req.body.orderItems.map(async item => {
            let newOrderItem = OrderItem({
                quantity: item.quantity,
                product: item.product,
            });

            newOrderItem = await newOrderItem.save();

            return newOrderItem._id;
        }));

        const orderItemsIdsResolved = await orderItemsIds;

        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            totalPrice: req.body.totalPrice,
            user: req.body.user,
        });

        order = await order.save();

        if (!order) return res.status(400).json({success: false, message: "The order cannot be created."});

        res.status(200).send(order);
    } catch (error) {
        res.status(500).json({error, message: error.message});
    }
})

export default router;