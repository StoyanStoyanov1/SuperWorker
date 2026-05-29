"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/services/cart.service";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CartList from "@/components/cart/CartList";
import CartSummary from "@/components/cart/CartSummary";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CartPage() {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isHydrated) return;
        if (!isAuthenticated) router.push("/login");
    }, [isAuthenticated, isHydrated, router]);

    const { data: cart, isLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: () => cartService.getCart(),
        enabled: isAuthenticated,
    });

    const { mutate: removeItem } = useMutation({
        mutationFn: (itemId: string) => cartService.removeItem(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Item removed");
        },
    });

    const { mutate: updateItem } = useMutation({
        mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
            cartService.updateItem(itemId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update quantity");
        },
    });

    const { mutate: clearCart } = useMutation({
        mutationFn: () => cartService.clearCart(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Cart cleared");
        },
    });

    if (!isAuthenticated || !isHydrated) return null;

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-[28px] border border-border bg-white p-4 shadow-sm">
                        <Skeleton className="h-24 w-full rounded-2xl" />
                    </div>
                ))}
            </div>
        );
    }

    const items = cart?.cartItems || [];
    const total = items.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
    );

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="rounded-[28px] border border-border bg-white p-10 shadow-sm text-center">
                    <h1 className="text-3xl font-semibold mb-4">Your cart is empty</h1>
                    <p className="text-slate-600 mb-6">Add some products to get started.</p>
                    <Link href="/products">
                        <Button className="cursor-pointer">Browse products</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="rounded-[28px] border border-border bg-white p-8 shadow-sm mb-8">
                <h1 className="text-3xl font-semibold text-slate-950">Your cart</h1>
                <p className="mt-2 text-sm text-slate-600">Review your selected items before checkout.</p>
            </div>
            <CartList 
                items={items} 
                onRemove={(id) => removeItem(id)} 
                onUpdate={(id, q) => updateItem({ itemId: id, quantity: q })}
            />
            <CartSummary total={total} onClear={() => clearCart()} />
        </div>
    );
}