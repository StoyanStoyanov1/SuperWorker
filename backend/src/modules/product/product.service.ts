import prisma from "../../prisma/client.js";
import type {CreateProductDto, UpdateProductDto, CreateProductImage} from "./product.schema.js";
import { AppError } from "../../shared/errors/AppError.js";
import {paginate} from "../../shared/pagination/pagination.js"
import {productFilter, type ProductFiltersDto} from "../../shared/filters/productFilter.js";
import logger from "../../shared/logger/logger.js";
import { getCache, setCache, deleteCache, deleteCacheByPattern } from "../../shared/cache/cache.service.js";


export const createProduct = async (dto: CreateProductDto, sellerId: string) => {
    const categories = await prisma.category.findMany({
        where: { id: { in: dto.categoryIds } },
    });

    if (categories.length !== dto.categoryIds.length) {
        throw new AppError("One or more categories not found", 404);
    }

    const newProduct = await prisma.product.create({
        data: {
            name: dto.name,
            description: dto.description,
            shortDesc: dto.shortDesc,
            price: dto.price,
            currency: dto.currency,
            stock: dto.stock,
            sellerId,
            categories: {
                create: dto.categoryIds.map(categoryId => ({ categoryId })),
            },
        },
        include: {
            categories: {
                include: {category: true},
            },
            images: true,
        }
    });

    logger.info(`Product created: ${newProduct.id} by seller ${sellerId}`);
    await deleteCacheByPattern("products:*");

    return newProduct;
};

export const updateProduct = async (productId: string, dto: UpdateProductDto, sellerId: string) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) throw new AppError("Product not found", 404);
    if (product.sellerId !== sellerId) throw new AppError("Forbidden", 403);

    const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
            name: dto.name,
            description: dto.description,
            shortDesc: dto.shortDesc,
            price: dto.price,
            stock: dto.stock,
        },
    });

    logger.info("Updated product: ", {productId});
    await deleteCacheByPattern("products:*");
    await deleteCache(`product:${productId}`);


    return updatedProduct;
};

export const deleteProduct = async (productId: string, sellerId: string) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError("Product not found", 404);
    if (product.sellerId !== sellerId) throw new AppError("Forbidden", 403);
    logger.info("Deleting product: ", { productId });

    await prisma.productCategory.deleteMany({ where: { productId } });
    await prisma.product.delete({ where: { id: productId } });

    await deleteCacheByPattern("products:*");
    await deleteCache(`product:${productId}`);
};

export const updateProductCategory = async (productId: string, categoryIds: string[]) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError("Product not found", 404);

    const categories = await prisma.category.findMany({
        where: { id: { in: categoryIds } },
    });

    if (categories.length !== categoryIds.length) {
        throw new AppError("One or more categories not found", 404);
    }

    await prisma.productCategory.deleteMany({ where: { productId } });

    const updatedCategories = await prisma.productCategory.createMany({
        data: categoryIds.map(categoryId => ({ productId, categoryId })),
    });

    logger.info("Updated categories: ", updatedCategories);

    return updatedCategories;
};

export const getProducts = async (page: number, limit: number, filters: ProductFiltersDto) => {
    const cacheKey = `products:${page}:${limit}:${JSON.stringify(filters)}`;

    const cached = await getCache(cacheKey);
    if (cached) return cached;

    logger.info("Cache miss", { cacheKey });

    const { take, skip } = paginate(page, limit);

    const where: any = productFilter(filters);

    const orderBy = {[filters.sortBy || "createdAt"]: filters.sortOrder || "desc"};

    const [data, total] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy,
            take,
            skip,
            include: {
                categories: {
                    include: { category: true },
                },
                images: true,
            },
        }),
        prisma.product.count({ where }),
    ]);

    const result = {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };

    await setCache(cacheKey, result);

    return result;
};

export const getProductById = async (productId: string) => {

    const cacheKey = `product:${productId}`;

    const cached = await getCache(cacheKey);
    if (cached) {
        logger.info("Cache hit", { cacheKey });
        return cached;
    }

    logger.info("Cache miss", { cacheKey });

    const product = await prisma.product.findUnique({ 
        where: { id: productId },
        include: {
            images: true,
            categories: {
                include: {
                    category: true,
                }
            },
        }
    });
    if (!product) throw new AppError("Product not found", 404);

    await setCache(cacheKey, product);

    return product;
};

export const addProductImage = async (productId: string, dto: CreateProductImage) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new AppError("Product not found", 404);

    if (dto.isPrimary) {
        await prisma.productImage.updateMany({
            where: {productId, isPrimary: true},
            data: {isPrimary: false}
        })
    }

    const hasImages = await prisma.productImage.findFirst({where: {productId}});

    const newProductImage = await prisma.productImage.create({
        data: {
            productId,
            url: dto.url,
            isPrimary: !hasImages ? true : dto.isPrimary,
        }
    });

    logger.info("Added product image: ", newProductImage.id);

    return newProductImage;
}

export const deleteProductImage = async (productId: string, imageId: string) => {
    const image = await prisma.productImage.findUnique({ where: { id: imageId } });

    if (!image) throw new AppError("Image not found", 404);
    if (image.productId !== productId) throw new AppError("Forbidden", 404);
    if (image.isPrimary) throw new AppError("Cannot delete primary image", 404);

    await prisma.productImage.delete({where: {id: imageId}});

    logger.info("Deleted product image: ", imageId);
}

export const changePrimaryProductImage = async (productId: string, imageId: string) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) throw new AppError("Product not found", 404);
    const productImage = await prisma.productImage.findUnique({ where: { id: imageId } });

    if (!productImage) throw new AppError("Image not found", 404);
    if (productImage.productId !== productId) throw new AppError("Forbidden", 404);
    if (productImage.isPrimary) return;

    await prisma.productImage.updateMany({
        where: {productId, isPrimary: true},
        data: {isPrimary: false}
    });

    await prisma.productImage.update({
        where: {id: imageId},
        data: {isPrimary: true},
    });

    logger.info("Changed primary product image: ", imageId);

}