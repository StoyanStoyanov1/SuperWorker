import { Router } from "express";
import * as PaymentController from "./payment.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import express from "express";

const router = Router();

router.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    PaymentController.handleWebhook
);

router.post("/create-intent", authenticate, PaymentController.createPaymentIntent);

export default router;