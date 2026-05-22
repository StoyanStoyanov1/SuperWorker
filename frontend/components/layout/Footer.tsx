import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t border-border bg-slate-950 text-slate-200 mt-auto">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid gap-8 md:grid-cols-3">
                    <div>
                        <h3 className="font-semibold text-white mb-3">E-Commerce</h3>
                        <p className="text-sm text-slate-400">
                            Your one-stop shop for everything you need.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-3">Navigation</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/" className="transition hover:text-white">Home</Link></li>
                            <li><Link href="/products" className="transition hover:text-white">Products</Link></li>
                            <li><Link href="/cart" className="transition hover:text-white">Cart</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-slate-800 mt-8 pt-6 text-center text-sm text-slate-500">
                    © {new Date().getFullYear()} E-Commerce. All rights reserved.
                </div>
            </div>
        </footer>
    );
}