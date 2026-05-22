import { Skeleton } from "@/components/ui/skeleton";


function ProductIsLoading() {
    return (
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-[28px] border border-border bg-white shadow-sm overflow-hidden">
                                <Skeleton className="aspect-square" />
                                <div className="p-4 space-y-2">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-4 w-1/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
}

export default ProductIsLoading;
