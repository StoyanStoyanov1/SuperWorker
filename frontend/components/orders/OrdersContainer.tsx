"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { orderService } from "@/services/order.service";
import OrderList from "@/components/orders/OrderList";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

export default function OrdersContainer() {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const isHydrated = useAuthStore((state) => state.isHydrated);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!isHydrated) return;
        if (!isAuthenticated) router.push("/login");
    }, [isAuthenticated, isHydrated, router]);

    const { data, isLoading } = useQuery({
        queryKey: ["orders"],
        queryFn: () => orderService.getOrders(),
        enabled: isAuthenticated,
    });

    const { mutate: cancelOrder } = useMutation({
        mutationFn: (id: string) => orderService.cancelOrder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Order cancelled");
        },
        onError: () => {
            toast.error("Failed to cancel order");
        },
    });

    if (!isHydrated || !isAuthenticated) return null;

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    const orders = data?.data || [];

    if (orders.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <h1 className="text-2xl font-semibold mb-4">No orders yet</h1>
                <p className="text-muted-foreground mb-6">Start shopping to place your first order.</p>
                <Link href="/products">
                    <Button className="cursor-pointer">Browse products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Your orders</h1>
            <OrderList orders={orders} onCancel={(id) => cancelOrder(id)} />
        </div>
    );
}