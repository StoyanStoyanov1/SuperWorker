"use client";

import { useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface PaymentFormProps {
    onSuccess: () => void;
}

export default function PaymentForm({ onSuccess }: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/orders`,
                },
                redirect: "if_required",
            });

            if (error) {
                toast.error(error.message || "Payment failed");
            } else {
                toast.success("Payment successful!");
                onSuccess();
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={!stripe || isProcessing}
            >
                {isProcessing ? "Processing..." : "Pay now"}
            </Button>
        </form>
    );
}