"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import ProductIsLoading from "@/components/products/ProductIsLoading";
import ProductError from "@/components/products/ProductError";
import productCatalaog from "@/components/products/ProductCatalog";
import { PaginatedResponse, Product } from "@/types";

export default function ProductsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["products"],
        queryFn: () => productService.getAll(),
    });

    if (isLoading) {
        return ProductIsLoading();
    }

    if (error) {
        return ProductError();
    }
    
    return productCatalaog(data as PaginatedResponse<Product>);
       
}