import {z} from 'zod';

export const CreateOrderSchema = z.object({
    addressId: z.string(),
    paymentIntentId: z.string(),
});

export type OrderDto = z.infer<typeof CreateOrderSchema>;