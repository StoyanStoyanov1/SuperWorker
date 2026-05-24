import Link from "next/link";
import { Product } from "@/types";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const primaryImage = product.images?.find(img => img.isPrimary)?.url;
    const currency = product.currency === "USD" ? "$" : "€";

    return (
        <Link href={`/products/${product.id}`}>
            <div className="group overflow-hidden rounded-[28px] border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl cursor-pointer">
                <div className="relative aspect-square overflow-hidden bg-linear-to-br from-slate-100 to-white">
                    {primaryImage ? (
                        <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No image</span>
                        </div>
                    )}
                </div>
                <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-semibold text-slate-950 truncate">{product.name}</h3>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                            {currency}{Number(product.price).toFixed(2)}
                        </span>
                    </div>
                    <p className="text-sm leading-6 text-slate-600 line-clamp-2">{product.shortDesc}</p>
                </div>
            </div>
        </Link>
    );
}