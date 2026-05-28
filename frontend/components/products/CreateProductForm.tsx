"use client";

import { useState } from "react";
import { useForm, Path } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import { uploadImage } from "@/lib/cloudinary";
import FormField from "@/components/common/FormField";
import FormWrapper from "@/components/common/FormWrapper";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import PriceField from "@/components/common/PriceField";


const createProductSchema = z.object({
    name: z.string().min(2).max(50),
    shortDesc: z.string().min(2).max(200),
    description: z.string().min(100).max(5000),
    price: z.coerce.number().positive("Price must be positive"),
    currency: z.enum(["EUR", "USD"]).default("EUR"),
    stock: z.coerce.number().int().nonnegative("Stock must be 0 or more"),
    categoryIds: z.array(z.string()).min(1, "Select at least one category"),
});

type CreateProductForm = z.infer<typeof createProductSchema>;

export default function CreateProductForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [images, setImages] = useState<{ url: string; isPrimary: boolean }[]>([]);
    const [uploading, setUploading] = useState(false);

    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => categoryService.getAll(),
    });

    const customResolver = async (values: unknown) => {
        const result = createProductSchema.safeParse(values);
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

    const form = useForm<CreateProductForm>({
        resolver: customResolver,
       defaultValues: {
        name: "",
        description: "",
        shortDesc: "",
        price: 0,
        currency: "EUR",
        stock: 0,
        categoryIds: [],
    },
    });

    const { setFocus, handleSubmit } = form;

    const { mutate: createProduct, isPending } = useMutation({
        mutationFn: async (data: CreateProductForm) => {
            const product = await productService.create(data);
            for (const img of images) {
                await productService.addImage(product.id, img.url, img.isPrimary);
            }
            return product;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product created!");
            router.push("/products");
        },
        onError: () => {
            toast.error("Failed to create product.");
        },
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploading(true);
        try {
            for (const file of files) {
                const url = await uploadImage(file);
                setImages(prev => [
                    ...prev,
                    { url, isPrimary: prev.length === 0 },
                ]);
            }
            toast.success("Images uploaded!");
        } catch {
            toast.error("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (url: string) => {
        setImages(prev => {
            const filtered = prev.filter(img => img.url !== url);
            if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
                filtered[0].isPrimary = true;
            }
            return filtered;
        });
    };

    const setPrimary = (url: string) => {
        setImages(prev =>
            prev.map(img => ({ ...img, isPrimary: img.url === url }))
        );
    };

    const onSubmit = (data: CreateProductForm) => {
        createProduct(data);
    };
    return (
        <FormWrapper
            onSubmit={handleSubmit(onSubmit)}
            buttonLabel="Create Product"
            isSubmitting={isPending}
            className="space-y-6"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border rounded-xl p-6 space-y-4">
                        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Basic Information</h2>
                        <FormField
                            name="name"
                            label="Product name"
                            placeholder="Product name..."
                            control={form.control}
                        />
                        <FormField
                            name="shortDesc"
                            label="Short Description"
                            placeholder="Short product description..."
                            control={form.control}
                        />
                        <FormField
                            name="description"
                            label="Description"
                            placeholder="Product description..."
                            control={form.control}
                        />
                    </div>

                    <div className="bg-white border rounded-xl p-6 space-y-4">
                        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Images</h2>
                        <div className="flex flex-wrap gap-3">
                            {images.map((img) => (
                                <div key={img.url} className="relative w-24 h-24 rounded-lg overflow-hidden border">
                                    <Image src={img.url} alt="product" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(img.url)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 cursor-pointer"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                    {img.isPrimary && (
                                        <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5">
                                            Primary
                                        </span>
                                    )}
                                    {!img.isPrimary && (
                                        <button
                                            type="button"
                                            onClick={() => setPrimary(img.url)}
                                            className="absolute bottom-0 left-0 right-0 bg-black/30 text-white text-xs text-center py-0.5 cursor-pointer hover:bg-black/50"
                                        >
                                            Set primary
                                        </button>
                                    )}
                                </div>
                            ))}
                            <label className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition">
                                <ImagePlus className="h-6 w-6 text-gray-400" />
                                <span className="text-xs text-gray-400 mt-1">
                                    {uploading ? "Uploading..." : "Add image"}
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border rounded-xl p-6 space-y-4">
                        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Pricing & Stock</h2>
                        <PriceField
                            name="price"
                            currencyName="currency"
                            label="Price"
                            control={form.control}
                        />
                        <FormField
                            name="stock"
                            label="Stock"
                            type="number"
                            placeholder="100"
                            control={form.control}
                            min={0}
                        />
                    </div>

                    <div className="bg-white border rounded-xl p-6 space-y-4">
                        <h2 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Categories</h2>
                        <div className="flex flex-wrap gap-2">
                            {categories?.map((cat) => {
                                const selected = form.watch("categoryIds").includes(cat.id);
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => {
                                            const current = form.getValues("categoryIds");
                                            if (selected) {
                                                form.setValue("categoryIds", current.filter(id => id !== cat.id));
                                            } else {
                                                form.setValue("categoryIds", [...current, cat.id]);
                                            }
                                        }}
                                        className={`px-3 py-1 rounded-full text-sm border transition cursor-pointer ${
                                            selected
                                                ? "bg-gray-900 text-white border-gray-900"
                                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </div>
                        {form.formState.errors.categoryIds && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.categoryIds.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </FormWrapper>
    );
}