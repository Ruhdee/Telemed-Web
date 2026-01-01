"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

const products = [
    { id: 1, name: "Vit C Boost", price: 450, category: "Wellness", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2030&auto=format&fit=crop" },
    { id: 2, name: "PainRelief+", price: 120, category: "Pain Management", img: "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=2042&auto=format&fit=crop" },
    { id: 3, name: "DermaCare", price: 850, category: "Skincare", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop" },
    { id: 4, name: "ProBiotics", price: 600, category: "Digestion", img: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1979&auto=format&fit=crop" },
    { id: 5, name: "Omega 3", price: 1200, category: "Heart Health", img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=2069&auto=format&fit=crop" },
    { id: 6, name: "SleepWell", price: 350, category: "Sleep", img: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=2014&auto=format&fit=crop" },
];

export default function PharmacyPage() {
    const [cart, setCart] = useState({});
    const [qtyMap, setQtyMap] = useState({});
    const [search, setSearch] = useState("");
    const [cartOpen, setCartOpen] = useState(false);

    /* -------- Quantity handlers (local) -------- */
    const increaseQty = (id) =>
        setQtyMap((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));

    const decreaseQty = (id) =>
        setQtyMap((p) => ({
            ...p,
            [id]: Math.max((p[id] || 0) - 1, 0),
        }));

    /* -------- Add to cart -------- */
    const addToCart = (product) => {
        const qty = qtyMap[product.id];
        if (!qty) return;

        setCart((prev) => ({
            ...prev,
            [product.id]: {
                ...product,
                qty,
            },
        }));

        setQtyMap((p) => ({ ...p, [product.id]: 0 }));
    };

    const cartItems = Object.values(cart);
    const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
    const total = cartItems.reduce((s, i) => s + i.qty * i.price, 0);

    const filteredProducts = useMemo(() => {
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    return (
        <div className="space-y-6 relative">
            {/* HEADER */}
            <div className="flex justify-between items-center bg-white/50 p-4 rounded-xl backdrop-blur-sm sticky top-20 z-30">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gold-dark)] to-[var(--text-primary)]">
                        E-Pharmacy
                    </h1>
                    <p className="text-xs text-[var(--text-secondary)]">
                        Premium Supplements & Medicines
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-panel flex items-center px-4 py-2 gap-2 w-64">
                        <Search size={16} className="text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full"
                            placeholder="Search medicines..."
                        />
                    </div>

                    <Button
                        variant="outline"
                        icon={<ShoppingCart size={18} />}
                        onClick={() => setCartOpen(true)}
                    >
                        Cart ({cartCount})
                    </Button>
                </div>
            </div>

            {/* PRODUCTS */}
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p, i) => {
                    const qty = qtyMap[p.id] || 0;

                    return (
                        <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            whileHover={{ y: -8 }}
                            className="glass-panel p-3 flex flex-col"
                        >
                            <div className="w-full aspect-square relative rounded-xl overflow-hidden mb-4">
                                <Image src={p.img} alt={p.name} fill className="object-cover" />
                                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-bold">
                                    {p.category}
                                </div>
                            </div>

                            <h3 className="font-bold text-lg">{p.name}</h3>

                            <div className="mt-auto space-y-2">
                                <span className="block font-bold text-[var(--gold-dark)]">
                                    ₹{p.price}
                                </span>

                                {/* Qty */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 bg-white/60 px-2 py-1 rounded-full">
                                        <button onClick={() => decreaseQty(p.id)}>−</button>
                                        <span className="font-bold w-5 text-center">{qty}</span>
                                        <button onClick={() => increaseQty(p.id)}>+</button>
                                    </div>

                                    <button
                                        disabled={qty === 0}
                                        onClick={() => addToCart(p)}
                                        className={`px-3 py-1 rounded-full text-sm font-bold ${qty
                                                ? "bg-[var(--gold-primary)] text-white"
                                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                            }`}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* SIDE CART */}
            <AnimatePresence>
                {cartOpen && (
                    <motion.div
                        initial={{ x: 400 }}
                        animate={{ x: 0 }}
                        exit={{ x: 400 }}
                        className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-50 p-4"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-xl">Your Cart</h2>
                            <X className="cursor-pointer" onClick={() => setCartOpen(false)} />
                        </div>

                        {cartItems.length === 0 ? (
                            <p className="text-gray-400 text-sm">Cart is empty</p>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                            <span>{item.name} × {item.qty}</span>
                                            <span>₹{item.qty * item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 border-t pt-4 flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
