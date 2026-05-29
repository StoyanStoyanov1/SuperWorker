"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Category } from "@/types";
import { categoryService } from "@/services/category.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import FormWrapper from "@/components/common/FormWrapper";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(20, "Name must be max 20 characters"),
    parentId: z.string().nullable().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
    initialData?: Category | null;
    categories: Category[];
    onSuccess: () => void;
}

export default function CategoryForm({ initialData, categories, onSuccess }: CategoryFormProps) {
    const queryClient = useQueryClient();
    
    const form = useForm<CategoryFormValues>({
        defaultValues: {
            name: initialData?.name || "",
            parentId: initialData?.parentId || null,
        },
    });

    const { register, handleSubmit, formState: { errors } } = form;

    const mutation = useMutation({
        mutationFn: (values: CategoryFormValues) => {
            if (initialData) {
                return categoryService.update(initialData.id, values);
            }
            return categoryService.create({
                name: values.name,
                parentId: values.parentId || undefined
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast.success(initialData ? "Category updated" : "Category created");
            onSuccess();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }
    });

    const onSubmit = (data: CategoryFormValues) => {
        mutation.mutate(data);
    };

    // Filter categories to avoid self-referencing and nested loops
    const availableParents = categories.filter(c => c.id !== initialData?.id);

    return (
        <FormWrapper
            onSubmit={handleSubmit(onSubmit)}
            buttonLabel={initialData ? "Update Category" : "Create Category"}
            isSubmitting={mutation.isPending}
            className="space-y-4"
        >
            <Field>
                <FieldLabel htmlFor="name">Category Name</FieldLabel>
                <Input id="name" {...register("name")} placeholder="Enter category name" />
                {errors.name && <FieldError errors={[{ message: errors.name.message } as any]} />}
            </Field>

            <Field>
                <FieldLabel htmlFor="parentId">Parent Category (Optional)</FieldLabel>
                <select
                    id="parentId"
                    {...register("parentId")}
                    className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">No Parent (Root)</option>
                    {availableParents.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </Field>
        </FormWrapper>
    );
}
