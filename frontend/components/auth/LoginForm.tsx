"use client";

import { useState } from "react";
import { useForm, useFormState, Path } from "react-hook-form";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import FormWrapper from "@/components/common/FormWrapper";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSuccess?: () => void;
}


export default function LoginForm({onSuccess}: LoginFormProps) {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);
    const [authError, setAuthError] = useState<string | null>(null);

    const customResolver = async (values: unknown) => {
        const result = loginSchema.safeParse(values);
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

    const form = useForm<LoginForm>({
        resolver: customResolver,
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onSubmit",
    });

    const { register, handleSubmit, control, setFocus } = form;
    const { errors } = useFormState({ control });

    const handleInvalid = (errs: unknown) => {
        setAuthError(null);
        if (errs && typeof errs === "object") {
            const keys = Object.keys(errs as Record<string, unknown>);
            const first = keys[0];
            if (first) {
                try { setFocus(first as unknown as Path<LoginForm>); } catch {}
            }
        }
    };


    const onSubmit = async (data: LoginForm) => {
        setAuthError(null);
        try {
            const user = await authService.loginAndGetUser(data);
            setUser(user);
            toast.success("Welcome back!");
            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/");
            }
        } catch (error: unknown) {
                const err = error as Record<string, unknown> | null;
                const response = err && typeof err === "object" ? (err as Record<string, unknown>)['response'] : undefined;
                if (response) {
                    setAuthError("Invalid email or password. Please try again.");
                } else {
                    setAuthError("Cannot connect to server. Please try again later.");
                }
        }
    };

    return (
        <FormWrapper
            onSubmit={handleSubmit(onSubmit, handleInvalid)}
            buttonLabel="Sign in"
            isSubmitting={form.formState.isSubmitting}
            error={authError}
            className="space-y-4"
        >
            
            <Field data-invalid={!!errors.email}> 
                <div className="flex items-center gap-1.5">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                </div>
                <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                {errors.email && <FieldError errors={[errors.email]} />}
            </Field>

            <Field data-invalid={!!errors.password}>
                <div className="flex items-center gap-1.5">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
                {errors.password && <FieldError errors={[errors.password]} />}
            </Field>
        </FormWrapper>
    );
}