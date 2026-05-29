"use client";

import { useState } from "react";
import { useForm, Path } from "react-hook-form";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import FormField from "@/components/common/FormField";
import FormWrapper from "@/components/common/FormWrapper";
import DatePickerField from "@/components/common/DatePickerField";
import PhoneField from "@/components/common/PhoneField";



const registerSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[!@#$%^&*]/, "Must contain at least one special character"),
        firstName: z.string().min(2, "Min 2 characters").max(18, "Max 18 characters"),
        lastName: z.string().min(2, "Min 2 characters").max(18, "Max 18 characters"),
    phoneNumber: z.string()
        .regex(/^\+?\d{7,15}$/, "Phone must be 7-15 digits, optionally starting with +"),
        birthday: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Format must be DD-MM-YYYY"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const router = useRouter();
    const [authError, setAuthError] = useState<string | null>(null);

    const customResolver = async (values: unknown) => {
        const result = registerSchema.safeParse(values);
        if (result.success) {
            return { values: result.data, errors: {} };
        }
        const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[] | undefined>;
        const errors: Record<string, { type: string; message: string }> = {};
        Object.keys(fieldErrors).forEach((key) => {
            const msg = fieldErrors[key]?.[0];
            if (msg) {
                errors[key] = { type: "validation", message: msg };
            }
        });
        return { values: {}, errors };
    };

    const form = useForm<RegisterForm>({
        resolver: customResolver,
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            birthday: "",
        },
        mode: "onSubmit",
    });

    const { setFocus, handleSubmit } = form;

    const handleInvalid = (errs: unknown) => {
        setAuthError(null);
        if (errs && typeof errs === "object") {
            const keys = Object.keys(errs as Record<string, unknown>);
            const first = keys[0];
            if (first) {
                try { setFocus(first as unknown as Path<RegisterForm>); } catch {}
            }
        }
    };

    const onSubmit = async (data: RegisterForm) => {
        setAuthError(null);
        try {
            await authService.register(data);
            toast.success("Account created! Please verify your email.");
            router.push("/login");
        } catch (error: unknown) {
            const err = error as Record<string, unknown> | null;
            const response = err && typeof err === "object" ? (err as Record<string, unknown>)['response'] : undefined;
            const status = response && typeof response === 'object' ? (response as Record<string, unknown>)['status'] : undefined;
            if (typeof status === 'number' && status === 409) {
                setAuthError("Email already exists.");
            } else {
                setAuthError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <FormWrapper
            onSubmit={handleSubmit(onSubmit, handleInvalid)}
            buttonLabel="Sign up"
            isSubmitting={form.formState.isSubmitting}
            error={authError}
            className="space-y-4"
        >
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    name="firstName"
                    label="First name"
                    placeholder="John"
                    control={form.control}
                    info="Between 2 and 18 characters"
                />
                <FormField
                    name="lastName"
                    label="Last name"
                    placeholder="Doe"
                    control={form.control}
                    info="Between 2 and 18 characters"
                />
            </div>

            <FormField
                name="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                control={form.control}
                info="Must be a valid email address"
            />

            <FormField
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                control={form.control}
                info="Min 8 chars, uppercase, number and special character"
            />

           <PhoneField
                name="phoneNumber"
                label="Phone number"
                placeholder="+1234567890"
                control={form.control}
            />

            <DatePickerField
                 name="birthday"
                label="Birthday"
                control={form.control}
            />

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium underline">
                    Sign in
                </Link>
            </p>
        </FormWrapper>
    );
}