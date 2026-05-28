"use client";

import { ReactNode, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
    useEffect(() => {
        if (process.env.NODE_ENV === "development") {
            const handler = (e: PromiseRejectionEvent) => {
                // Log reason and stack to help locate source of thrown errors (dev-only)
                // eslint-disable-next-line no-console
                console.debug("unhandledRejection caught:", e.reason, e);
            };
            window.addEventListener("unhandledrejection", handler);
            return () => window.removeEventListener("unhandledrejection", handler);
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-right" />
        </QueryClientProvider>
    );
}