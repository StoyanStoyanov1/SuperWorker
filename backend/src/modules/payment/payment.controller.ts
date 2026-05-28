import type { Request, Response, NextFunction } from "express";
import * as paymentService from "./payment.service.js";

export const createPaymentIntent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.body;
        const userId = req.user!.userId;
        
        if (orderId) {
            const result = await paymentService.createPaymentIntent(orderId, userId);
            return res.json(result);
        }
        
        const result = await paymentService.createPaymentIntentFromCart(userId);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const signature = req.headers["stripe-signature"] as string;
        const result = await paymentService.handleWebhook(req.body, signature);
        res.json(result);
    } catch (error) {
        next(error);
    }
};