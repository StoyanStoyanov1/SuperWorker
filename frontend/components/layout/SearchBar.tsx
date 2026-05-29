"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("search") || "");

    useEffect(() => {
        const updateQueryFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            setQuery(params.get("search") || "");
        };

        window.addEventListener("popstate", updateQueryFromUrl);
        return () => window.removeEventListener("popstate", updateQueryFromUrl);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedQuery = query.trim();
        const params = new URLSearchParams(window.location.search);
        
        if (trimmedQuery) {
            params.set("search", trimmedQuery);
        } else {
            params.delete("search");
        }
        
        // If we are not on the products page, we still need to navigate
        if (window.location.pathname !== "/products") {
            router.push(`/products?${params.toString()}`);
            return;
        }

        const newUrl = `/products?${params.toString()}`;
        window.history.pushState(null, "", newUrl);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };

    return (
        <form 
            onSubmit={handleSearch}
            className="relative hidden max-w-sm flex-1 items-center md:flex"
        >
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 w-full rounded-2xl border border-border bg-slate-50 pl-10 pr-4 text-sm transition-all focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/10"
            />
        </form>
    );
}
