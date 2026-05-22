import {z} from 'zod';

export const CreateProductSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(2).max(1000),
    shortDesc: z.string().min(2).max(255),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    currency: z.enum(["EUR", "USD"]).default("EUR"),
    categoryIds: z.array(z.string()).min(1)
});
export type CreateProductDto = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(2).max(1000),
    shortDesc: z.string().min(2).max(255),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
}).partial();

export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;
export const CreateProductImageSchema = z.object({
    url: z.string().min(2).max(100),
    isPrimary: z.boolean(),
})


export type CreateProductImage = {
    url: string;
    isPrimary: boolean;
}

