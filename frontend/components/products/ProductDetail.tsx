"use client";

import { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import ProductImages from "./ProductImages";

interface ProductDetailProps {
    product: Product;
    onAddToCart: (quantity: number) => void;
    isPending: boolean;
}

export default function ProductDetail({ product, onAddToCart, isPending }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const currency = product.currency === "USD" ? "$" : "€";
    const increment = () => {
    if (quantity < product.stock) setQuantity(q => q + 1);
};

    const decrement = () => {
        if (quantity > 1) setQuantity(q => q - 1);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
        setQuantity(1);
    } else if (value > product.stock) {
        setQuantity(product.stock);
    } else {
        setQuantity(value);
    }
    };  

    return (
        <div className="grid gap-10 lg:grid-cols-[420px_minmax(0,1fr)] items-start">
            <div className="sticky top-24 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
                <ProductImages images={product.images} name={product.name} />
            </div>

            <div className="space-y-6 rounded-[2rem] border border-border bg-white p-8 shadow-sm">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold text-slate-950">{product.name}</h1>
                    {product.shortDesc && (
                        <p className="text-base font-medium text-slate-500">{product.shortDesc}</p>
                    )}
                </div>

                {product.categories?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {product.categories.map((cat) => (
                            <span
                                key={cat.category?.id ?? cat.categoryId}
                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600"
                            >
                                {cat.category?.name ?? cat.categoryId}
                            </span>
                        ))}
                    </div>
                )}

                <div className="border-t border-b py-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Price</span>
                        <p className="text-2xl font-bold text-slate-950">{currency}{Number(product.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">Availability</span>
                        <p className={`text-sm font-medium ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </p>
                    </div>
                </div>

                <p className="text-base leading-7 text-slate-600">{product.description}</p>

                {product.stock > 0 && (
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={decrement}
                            disabled={quantity <= 1}
                            className="cursor-pointer"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="w-16 text-center border rounded-lg py-1.5 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={increment}
                            disabled={quantity >= product.stock}
                            className="cursor-pointer"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        <span className="text-sm text-muted-foreground">Max: {product.stock}</span>
                    </div>
                )}

                <Button
                    className="w-full cursor-pointer"
                    disabled={isPending || product.stock === 0}
                    onClick={() => onAddToCart(quantity)}
                >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isPending ? "Adding..." : "Add to cart"}
                </Button>
            </div>
        </div>
    );
}