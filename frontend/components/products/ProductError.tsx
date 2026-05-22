function ProductError () {
    return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="rounded-[28px] border border-border bg-white p-10 text-center shadow-sm">
                    <p className="text-red-500">Failed to load products.</p>
                </div>
            </div>
        );
}

export default ProductError;