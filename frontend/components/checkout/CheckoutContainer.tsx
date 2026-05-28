"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";
import stripePromise from "@/lib/stripe";
import { cartService } from "@/services/cart.service";
import { addressService } from "@/services/address.service";
import { orderService } from "@/services/order.service";
import AddressSelector from "./AddressSelector";
import AddressForm from "./AddressForm";
import CheckoutSummary from "./CheckoutSummary";
import PaymentForm from "./PaymentForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

type Step = "address" | "payment";

export default function CheckoutContainer() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [step, setStep] = useState<Step>("address");
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [orderId, setOrderId] = useState<string | null>(null);

    const { data: cart, isLoading: cartLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: () => cartService.getCart(),
    });

    const { data: addresses, isLoading: addressesLoading } = useQuery({
        queryKey: ["addresses"],
        queryFn: () => addressService.getAddresses(),
    });

    useEffect(() => {
        if (!cartLoading && (!cart || cart.cartItems.length === 0)) {
            router.push("/cart");
        }
    }, [cart, cartLoading, router]);

    const { mutate: createAddress, isPending: creatingAddress } = useMutation({
        mutationFn: (dto: { street: string; cityId: string }) =>
            addressService.createAddress(dto),
        onSuccess: (newAddress) => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            setSelectedAddressId(newAddress.id);
            setShowAddressForm(false);
            toast.success("Address added!");
        },
        onError: () => toast.error("Failed to add address."),
    });

    const { mutate: placeOrder, isPending: placingOrder } = useMutation({
        mutationFn: (paymentIntentId: string) => orderService.createOrder(selectedAddressId!, paymentIntentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            router.push("/orders");
            toast.success("Order placed successfully!");
        },
        onError: () => toast.error("Failed to place order after payment. Please contact support."),
    });

    const handleConfirmAddress = async () => {
        if (!selectedAddressId) return;
        
        try {
            const { clientSecret } = await orderService.createPaymentIntent();
            setClientSecret(clientSecret);
            setStep("payment");
        } catch (error) {
            toast.error("Failed to initialize payment.");
        }
    };

    const handlePaymentSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["products"] });
        router.push("/orders");
    };

    if (cartLoading || addressesLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

            {step === "address" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h2 className="font-semibold text-lg">Delivery address</h2>
                        {!showAddressForm ? (
                            <AddressSelector
                                addresses={addresses || []}
                                selectedId={selectedAddressId}
                                onSelect={setSelectedAddressId}
                                onAddNew={() => setShowAddressForm(true)}
                            />
                        ) : (
                            <div className="space-y-3">
                                <AddressForm
                                    onSubmit={(data) => createAddress(data)}
                                    isSubmitting={creatingAddress}
                                />
                                <button
                                    onClick={() => setShowAddressForm(false)}
                                    className="text-sm text-muted-foreground hover:underline cursor-pointer"
                                >
                                    ← Back to addresses
                                </button>
                            </div>
                        )}
                    </div>

                    {cart && (
                        <CheckoutSummary
                            cart={cart}
                            onConfirm={handleConfirmAddress}
                            isSubmitting={false}
                            selectedAddressId={selectedAddressId}
                        />
                    )}
                </div>
            )}

            {step === "payment" && clientSecret && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h2 className="font-semibold text-lg">Payment</h2>
                        <Elements
                            stripe={stripePromise}
                            options={{ clientSecret }}
                        >
                            <PaymentForm onSuccess={(pi) => placeOrder(pi)} />
                        </Elements>
                    </div>

                    {cart && (
                        <CheckoutSummary
                            cart={cart}
                            onConfirm={() => {}}
                            isSubmitting={placingOrder}
                            selectedAddressId={selectedAddressId}
                            readOnly
                        />
                    )}
                </div>
            )}
        </div>
    );
}