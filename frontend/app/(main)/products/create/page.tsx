"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import CreateProductForm from "@/components/products/CreateProductForm";

export default function CreateProductPage() {
    const router = useRouter();
    const { user, isAuthenticated, isHydrated} = useAuthStore();

    useEffect(() => {
        if (!isHydrated) return;        

        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (user?.role.name !== "SELLER" && user?.role.name !== "ADMIN") {
            router.push("/products");
        }
    }, [isAuthenticated, user, router, isHydrated]);

    if (!isAuthenticated || (user?.role.name !== "SELLER" && user?.role.name !== "ADMIN")) {
        return null;
    }

    return (
    <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
            <h1 className="text-2xl font-semibold">Create Product</h1>
            <p className="text-muted-foreground text-sm mt-1">Fill in the details to list your product</p>
        </div>
        <CreateProductForm />
    </div>
);
}