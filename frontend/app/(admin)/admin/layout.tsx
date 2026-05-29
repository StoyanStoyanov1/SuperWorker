"use client";

import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isHydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isHydrated) {
            if (!user || user.role.name !== "ADMIN") {
                router.push("/");
            }
        }
    }, [user, isHydrated, router]);

    if (!isHydrated || !user || user.role.name !== "ADMIN") {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64">
                    <nav className="space-y-1">
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Admin Menu
                        </div>
                        <a 
                            href="/admin/categories" 
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary"
                        >
                            Categories
                        </a>
                        {/* More links can be added here */}
                    </nav>
                </aside>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
