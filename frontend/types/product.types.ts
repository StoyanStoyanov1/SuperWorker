export interface Product {
    id: string;
    name: string;
    description: string;
    shortDesc: string;
    price: number;
    stock: number;
    currency: string;
    sellerId: string;
    images: ProductImage[];
    categories: ProductCategory[];
}

export interface ProductImage {
    id: string;
    url: string;
    isPrimary: boolean;
}

export interface Category {
    id: string;
    name: string;
    parentId: string | null;
}

export interface ProductCategory {
    categoryId: string;
    category: Category;
}

export interface CreateProductDto {
    name: string;
    shortDesc: string;
    description: string;
    price: number;
    stock: number;
    currency: string;
    categoryIds: string[];
}