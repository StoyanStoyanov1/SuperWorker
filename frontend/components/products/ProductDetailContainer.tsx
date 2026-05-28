"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { productService } from "@/services/product.service";
import { cartService } from "@/services/cart.service";
import ProductDetail from "@/components/products/ProductDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useAuthStore from "@/store/authStore";
import AuthModal from "@/components/common/AuthModal";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProductDetailContainer() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [pendingQuantity, setPendingQuantity] = useState(1);

    const { data: product, isLoading } = useQuery({
        queryKey: ["products", id],
        queryFn: () => productService.getById(id),
    });

    const { mutate: addToCart, isPending } = useMutation({
        mutationFn: (quantity: number) => cartService.addItem(id, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Added to cart!");
        },
        onError: () => {
            toast.error("Failed to add to cart.");
        },
    });

    const handleAddToCart = (quantity: number) => {
        if (!isAuthenticated) {
            setPendingQuantity(quantity);
            setAuthModalOpen(true);
            return;
        }
        addToCart(quantity);
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <Skeleton className="aspect-square rounded-xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 text-center">
                <p className="text-muted-foreground">Product not found.</p>
                <Link href="/products">
                    <Button variant="ghost" className="mt-4">Back to products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Link href="/products">
                <Button variant="ghost" size="sm" className="mb-6 cursor-pointer">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to products
                </Button>
            </Link>

            <ProductDetail
                product={product}
                onAddToCart={handleAddToCart}
                isPending={isPending}
            />

            <AuthModal
                open={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onSuccess={() => {
                    setAuthModalOpen(false);
                    addToCart(pendingQuantity);
                }}
            />
        </div>
    );
}