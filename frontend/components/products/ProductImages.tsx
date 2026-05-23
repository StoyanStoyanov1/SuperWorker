"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface ProductImagesProps {
    images: ProductImage[];
    name: string;
}

export default function ProductImages({ images, name }: ProductImagesProps) {
    const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
    const [selected, setSelected] = useState(primaryImage?.url || null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
                <span className="text-gray-400">No image</span>
            </div>
        );
    }

    const slides = images.map(img => ({ src: img.url }));

    return (
        <div className="space-y-3">
            <div
                className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative cursor-zoom-in"
                onClick={() => {
                    const index = images.findIndex(img => img.url === selected);
                    setLightboxIndex(index >= 0 ? index : 0);
                    setLightboxOpen(true);
                }}
            >
                {selected && (
                    <Image
                        src={selected}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                )}
            </div>

            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((img) => (
                        <button
                            key={img.id}
                            onClick={() => setSelected(img.url)}
                            className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                                selected === img.url
                                    ? "border-gray-900"
                                    : "border-transparent"
                            }`}
                        >
                            <Image
                                src={img.url}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                slides={slides}
                index={lightboxIndex}
            />
        </div>
    );
}