export interface ProductFiltersDto {
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: "price" | "createdAt";
    sortOrder?: "asc" | "desc";
}

export function productFilter(filters: ProductFiltersDto ) {
    const where : ProductFiltersDto = {};

    if (filters.search) where.name = {contains: filters.search, mode: "insensitive"};

    if (filters.categoryId) where.categories = {some: {categoryId: filters.categoryId}};

    if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice !== undefined && filters.minPrice !== null) where.price.gte = filters.minPrice;
        if (filters.maxPrice !== undefined && filters.maxPrice !== null) where.price.lte = filters.maxPrice;
    }

    if (filters.inStock) where.stock = {gt: 0};

    return where;
}