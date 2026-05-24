import { Cart } from "@/types";
import { Button } from "@/components/ui/button";

interface CheckoutSummaryProps {
    cart: Cart;
    onConfirm: () => void;
    isSubmitting: boolean;
    selectedAddressId: string | null;
    readOnly?: boolean;
}

export default function CheckoutSummary({
    cart,
    onConfirm,
    isSubmitting,
    selectedAddressId,
    readOnly
}: CheckoutSummaryProps) {
    const total = cart.cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
    );

    return (
        <div className="rounded-[28px] border border-border bg-white p-6 shadow-sm space-y-5">
            <h2 className="font-semibold text-xl text-slate-950">Order summary</h2>

            <div className="space-y-3">
                {cart.cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm text-slate-600">
                        <span>{item.product.name} × {item.quantity}</span>
                        <span className="font-medium text-slate-950">
                            {item.product.currency === "USD" ? "$" : "€"}
                            {(Number(item.product.price) * item.quantity).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t border-border pt-4 flex justify-between text-base font-semibold text-slate-950">
                <span>Total</span>
                <span>{total.toFixed(2)}</span>
            </div>
            {!readOnly && (
            <Button
                className="w-full cursor-pointer"
                disabled={isSubmitting || !selectedAddressId}
                onClick={onConfirm}
            >
                {isSubmitting ? "Placing order..." : "Place order"}
            </Button>
            )}
            {!selectedAddressId && (
                <p className="text-xs text-red-500 text-center">
                    Please select a delivery address
                </p>
            )}
        </div>
    );
}