"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useCallback } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

export default function ProductFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [isOpen, setIsOpen] = useState(false);
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
    const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc");
    const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoryService.getAll(),
    });

    useEffect(() => {
        const updateStateFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            setMinPrice(params.get("minPrice") || "");
            setMaxPrice(params.get("maxPrice") || "");
            setSortBy(params.get("sortBy") || "createdAt");
            setSortOrder(params.get("sortOrder") || "desc");
            setCategoryId(params.get("categoryId") || "");
        };

        updateStateFromUrl();

        window.addEventListener("popstate", updateStateFromUrl);
        return () => window.removeEventListener("popstate", updateStateFromUrl);
    }, []);

    const updateParams = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(window.location.search);
        
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        
        // Always reset to page 1 when changing filters
        if (!updates.page) {
            params.delete("page");
        }

        const newUrl = `${pathname}?${params.toString()}`;
        window.history.pushState(null, "", newUrl);
        // Trigger a custom event or just manually trigger popstate listeners
        window.dispatchEvent(new PopStateEvent('popstate'));
    }, [pathname]);

    const handlePriceApply = () => {
        const min = minPrice === "" ? 0 : parseFloat(minPrice);
        const max = maxPrice === "" ? Infinity : parseFloat(maxPrice);
        
        let finalMin = minPrice;
        let finalMax = maxPrice;

        if (min < 0) {
            finalMin = "0";
            setMinPrice("0");
        }

        if (maxPrice !== "" && max < min + 1) {
            finalMax = (min + 1).toString();
            setMaxPrice(finalMax);
        }

        updateParams({ 
            minPrice: finalMin, 
            maxPrice: finalMax 
        });
    };

    const handleClear = () => {
        setMinPrice("");
        setMaxPrice("");
        setSortBy("createdAt");
        setSortOrder("desc");
        setCategoryId("");
        window.history.pushState(null, "", pathname);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    const buildCategoryTree = (categories: any[]) => {
        const map = new Map();
        const roots: any[] = [];

        categories.forEach(cat => {
            map.set(cat.id, { ...cat, children: [] });
        });

        categories.forEach(cat => {
            const node = map.get(cat.id);
            if (cat.parentId && map.has(cat.parentId)) {
                map.get(cat.parentId).children.push(node);
            } else {
                roots.push(node);
            }
        });

        return roots;
    };

    const renderCategoryOptions = (nodes: any[], level = 0) => {
        return nodes.map(node => (
            <React.Fragment key={node.id}>
                <option value={node.id}>
                    {"\u00A0".repeat(level * 4)}{node.name}
                </option>
                {node.children.length > 0 && renderCategoryOptions(node.children, level + 1)}
            </React.Fragment>
        ));
    };

    const categoryTree = categories ? buildCategoryTree(categories) : [];

    return (
        <div className="mb-8">
            <style jsx global>{`
                input[type='number']::-webkit-inner-spin-button,
                input[type='number']::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type='number'] {
                    -moz-appearance: textfield;
                }
            `}</style>
            <div className="flex flex-wrap items-center gap-4">
                <Button 
                    variant="outline" 
                    className="rounded-2xl border-border bg-white shadow-sm"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                    <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </Button>

                <div className="flex items-center gap-2">
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [sBy, sOrder] = e.target.value.split("-");
                            updateParams({ sortBy: sBy, sortOrder: sOrder });
                        }}
                        className="h-10 rounded-2xl border border-border bg-white px-4 text-sm font-medium text-slate-950 shadow-sm focus:border-primary focus:outline-none"
                    >
                        <option value="createdAt-desc">Newest</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>

                {(searchParams.get("search") || 
                  new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("categoryId") || 
                  new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("minPrice") || 
                  new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("maxPrice") ||
                  new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("search")) && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleClear}
                        className="text-slate-500 hover:text-slate-950"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Clear all
                    </Button>
                )}
            </div>

            {isOpen && (
                <div className="mt-4 grid grid-cols-1 gap-6 rounded-[28px] border border-border bg-white p-6 shadow-sm md:grid-cols-3">
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Categories</Label>
                        <select
                            value={categoryId}
                            onChange={(e) => updateParams({ categoryId: e.target.value })}
                            className="h-10 w-full rounded-xl border border-border bg-white px-3 text-sm focus:border-primary focus:outline-none"
                        >
                            <option value="">All Categories</option>
                            {renderCategoryOptions(categoryTree)}
                        </select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Price Range</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                min="0"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || parseFloat(val) >= 0) {
                                        setMinPrice(val);
                                    }
                                }}
                                className="rounded-xl border-border h-10"
                            />
                            <span className="text-slate-400">-</span>
                            <Input
                                type="number"
                                min="0"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || parseFloat(val) >= 0) {
                                        setMaxPrice(val);
                                    }
                                }}
                                className="rounded-xl border-border h-10"
                            />
                        </div>
                        <Button 
                            onClick={handlePriceApply} 
                            className="w-full rounded-xl h-10 cursor-pointer"
                        >
                            Apply Price
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
