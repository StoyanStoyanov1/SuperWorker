"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import ProductIsLoading from "@/components/products/ProductIsLoading";
import ProductError from "@/components/products/ProductError";
import productCatalaog from "@/components/products/ProductCatalog";
import { PaginatedResponse, Product } from "@/types";
import ProductFilters from "@/components/products/ProductFilters";
import { useState, useEffect } from "react";

export default function ProductsPage() {
    const [params, setParams] = useState<URLSearchParams | null>(null);

    useEffect(() => {
        const updateParamsFromUrl = () => {
            setParams(new URLSearchParams(window.location.search));
        };
        
        updateParamsFromUrl();

        window.addEventListener("popstate", updateParamsFromUrl);
        return () => window.removeEventListener("popstate", updateParamsFromUrl);
    }, []);

    const filters = {
        search: params?.get("search") || undefined,
        categoryId: params?.get("categoryId") || undefined,
        minPrice: params?.get("minPrice") ? Number(params?.get("minPrice")) : undefined,
        maxPrice: params?.get("maxPrice") ? Number(params?.get("maxPrice")) : undefined,
        sortBy: (params?.get("sortBy") as any) || undefined,
        sortOrder: (params?.get("sortOrder") as any) || undefined,
        page: params?.get("page") ? Number(params?.get("page")) : undefined,
    };

    const { data, isLoading, error, isPlaceholderData } = useQuery({
        queryKey: ["products", filters],
        queryFn: () => productService.getAll(filters),
        placeholderData: (previousData) => previousData,
    });

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <ProductFilters />
            
            {error ? (
                ProductError()
            ) : isLoading && !data ? (
                ProductIsLoading()
            ) : (
                <div className={isLoading ? "opacity-50 transition-opacity" : ""}>
                    {productCatalaog(data as PaginatedResponse<Product>)}
                </div>
            )}
        </div>
    );
       
}