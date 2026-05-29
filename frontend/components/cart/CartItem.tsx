import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types";

interface CartItemProps {
    item: CartItemType;
    onRemove: (itemId: string) => void;
    onUpdate: (itemId: string, quantity: number) => void;
}

export default function CartItem({ item, onRemove, onUpdate }: CartItemProps) {
    const primaryImage = item.product.images?.find(img => img.isPrimary)?.url;
    const currency = item.product.currency === "USD" ? "$" : "€";
    return (
        <div className="flex flex-col gap-4 rounded-[28px] border border-border bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl bg-slate-100">
                    {primaryImage ? (
                        <Image src={primaryImage} alt={item.product.name} fill className="object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400 text-xs">
                            No image
                        </div>
                    )}
                </div>

                <div>
                    <Link href={`/products/${item.product.id}`}>
                        <h3 className="text-base font-semibold text-slate-950 hover:underline">{item.product.name}</h3>
                    </Link>
                    <p className="text-sm text-slate-500 mt-1">
                        {currency}{Number(item.product.price).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => onUpdate(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                        >
                            -
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => onUpdate(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                        >
                            +
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 text-right">
                <div>
                    <p className="font-semibold text-slate-950">
                        {currency}{(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 cursor-pointer mt-1"
                    onClick={() => onRemove(item.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}