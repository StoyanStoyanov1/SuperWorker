import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/endpoints";
import { Order, PaginatedResponse } from "@/types";

export const orderService = {
    async getOrders(page = 1, limit = 10): Promise<PaginatedResponse<Order>> {
        const { data } = await api.get(`${ENDPOINTS.orders}?page=${page}&limit=${limit}`);
        return data;
    },

    async getOrderById(id: string): Promise<Order> {
        const { data } = await api.get(`${ENDPOINTS.orders}/${id}`);
        return data;
    },

    async cancelOrder(id: string): Promise<Order> {
        const { data } = await api.patch(`${ENDPOINTS.orders}/${id}/cancel`);
        return data;
    },
    async createOrder(addressId: string, paymentIntentId: string): Promise<Order> {
        const { data } = await api.post(ENDPOINTS.orders, { addressId, paymentIntentId });
        return data;
    },

    async createPaymentIntent(orderId?: string): Promise<{ clientSecret: string }> {
        const { data } = await api.post("/payments/create-intent", { orderId });
        return data;
    },
};