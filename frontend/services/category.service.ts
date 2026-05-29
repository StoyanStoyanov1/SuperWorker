import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/endpoints";
import { Category } from "@/types";

export const categoryService = {
    async getAll(): Promise<Category[]> {
        const { data } = await api.get(ENDPOINTS.categories.all);
        return data.data;
    },

    async create(category: { name: string; parentId?: string | null }): Promise<Category> {
        const { data } = await api.post(ENDPOINTS.categories.base, category);
        return data;
    },

    async update(id: string, category: { name?: string; parentId?: string | null }): Promise<Category> {
        const { data } = await api.put(`${ENDPOINTS.categories.base}/${id}`, category);
        return data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`${ENDPOINTS.categories.base}/${id}`);
    },

    async getById(id: string): Promise<Category> {
        const { data } = await api.get(`${ENDPOINTS.categories.base}/id/${id}`);
        return data;
    }
};