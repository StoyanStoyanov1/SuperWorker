"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";

export default function Navbar() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } finally {
            logout();
            toast.success("Logged out successfully");
            router.push("/login");
        }
    };
    console.log(user);
    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-xl shadow-sm">
            <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-4">
                    <Link href="/" className="inline-flex items-center gap-3 text-xl font-semibold tracking-tight text-slate-950">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">S</span>
                        E-Commerce
                    </Link>
                    <Link href="/products" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
                        Products
                    </Link>
                    {isAuthenticated && (
                        <Link href="/orders" className="text-sm font-medium text-slate-600 transition hover:text-slate-950">
                            Orders
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            {user?.role.name === "SELLER" || user?.role.name === "ADMIN" ? (
                                <Link href="/products/create">
                                    <Button variant="outline" size="sm" className="cursor-pointer">
                                        + Add Product
                                    </Button>
                                </Link>
                            ) : null}

                            <Link href="/cart">
                                <Button variant="ghost" size="icon">
                                    <ShoppingCart className="h-5 w-5" />
                                </Button>
                            </Link>

                            <span className="hidden text-sm font-medium text-slate-600 md:block">
                                {user?.firstName}
                            </span>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="cursor-pointer"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="cursor-pointer">
                                    Sign in
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="cursor-pointer">
                                    Sign up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}