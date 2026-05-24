"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "register">("login");

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "login" ? "Sign in" : "Create account"}
                    </DialogTitle>
                </DialogHeader>

                {mode === "login" ? (
                    <>
                        <LoginForm onSuccess={onSuccess} />
                        <p className="text-center text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <button
                                onClick={() => setMode("register")}
                                className="font-medium underline cursor-pointer"
                            >
                                Sign up
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <RegisterForm />
                        <p className="text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <button
                                onClick={() => setMode("login")}
                                className="font-medium underline cursor-pointer"
                            >
                                Sign in
                            </button>
                        </p>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}