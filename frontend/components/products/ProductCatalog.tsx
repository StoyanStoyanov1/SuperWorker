import ProductCard from "@/components/products/ProductCart";
import { Product } from "@/types";


function productCatalaog(data: Product) {
return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8 rounded-[32px] border border-border bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-950">Products</h1>
                        <p className="text-sm text-slate-600 mt-2">Browse our latest catalog with premium visuals and crisp product cards.</p>
                    </div>
                </div>
            </div>

            {data?.data.length === 0 ? (
                <div className="rounded-[28px] border border-border bg-white p-10 text-center shadow-sm">
                    <p className="text-muted-foreground">No products found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data?.data.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default productCatalaog;