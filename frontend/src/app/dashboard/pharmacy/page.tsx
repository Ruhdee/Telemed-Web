"use client";

import { motion } from "framer-motion";
import { Pill, ShoppingCart, Search, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CartModal } from "@/components/dashboard/CartModal";

// Placeholder images for aesthetic consistency since DB doesn't have images yet
const placeholderImages = [
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2030&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=2042&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1979&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=2069&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=2014&auto=format&fit=crop",
];

interface Medicine {
    id: number;
    name: string;
    description: string;
    price: string | number;
    stock: number;
    requiresPrescription: boolean;
}

interface CartItem {
    medicineId: number;
    name: string;
    price: number;
    quantity: number;
}

export default function PharmacyPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deliveryDate, setDeliveryDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/pharma/inventory', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to load inventory");
            const data = await res.json();
            setMedicines(data);
        } catch (err) {
            console.error(err);
            setError("Could not load medicines");
        } finally {
            setLoading(false);
        }
    };

    const addToCart = (med: Medicine) => {
        setCart(prev => {
            const existing = prev.find(item => item.medicineId == med.id);
            if (existing) {
                if (existing.quantity >= med.stock) return prev;
                return prev.map(item => item.medicineId == med.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, {
                medicineId: med.id,
                name: med.name,
                price: parseFloat(String(med.price)),
                quantity: 1
            }];
        });
        setIsCartOpen(true); // Open cart when item added
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.medicineId == id) {
                const med = medicines.find(m => m.id == id);
                if (!med) return item;
                const newQty = item.quantity + delta;
                if (newQty < 1 || newQty > med.stock) return item;
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.medicineId != id));
    };

    const placeOrder = async () => {
        if (!deliveryDate) {
            alert("Please select a delivery date");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/pharma/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    items: cart.map(i => ({ medicineId: i.medicineId, quantity: i.quantity })),
                    deliveryDate
                })
            });
            if (!res.ok) throw new Error("Order failed");

            const data = await res.json();
            setCart([]);
            setIsCartOpen(false);
            setDeliveryDate("");
            setSuccessMsg(`Order placed! Total: ₹${data.grandTotal}`);
            fetchInventory();
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            console.error(err);
            alert("Failed to place order");
        }
    };

    const filteredMedicines = medicines.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="space-y-6">
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                placeOrder={placeOrder}
                deliveryDate={deliveryDate}
                setDeliveryDate={setDeliveryDate}
                cartTotal={cartTotal}
                loadingOrder={false}
            />

            <div className="flex justify-between items-center bg-white/50 p-4 rounded-xl backdrop-blur-sm sticky top-0 z-30 shadow-sm border border-white/20">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gold-dark)] to-[var(--text-primary)]">
                        E-Pharmacy
                    </h1>
                    <p className="text-xs text-[var(--text-secondary)]">Premium Supplements & Medicines</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-panel flex items-center px-4 py-2 gap-2 w-64 bg-white/60">
                        <Search size={16} className="text-gray-400" />
                        <input
                            className="bg-transparent border-none outline-none text-sm w-full"
                            placeholder="Search medicines..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        variant="primary"
                        icon={<ShoppingCart size={18} />}
                        onClick={() => setIsCartOpen(true)}
                    >
                        Cart ({cart.length})
                    </Button>
                </div>
            </div>

            {successMsg && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-100 text-green-800 p-4 rounded-xl font-bold text-center border border-green-200"
                >
                    {successMsg}
                </motion.div>
            )}

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading medicines...</div>
            ) : (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMedicines.map((med, i) => (
                        <motion.div
                            key={med.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -8 }}
                            className={`glass-panel p-3 flex flex-col group ${med.stock === 0 ? 'opacity-60 grayscale' : ''}`}
                        >
                            <div className="w-full aspect-square relative rounded-xl overflow-hidden mb-4 bg-gray-100">
                                <Image
                                    src={placeholderImages[i % placeholderImages.length]}
                                    alt={med.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                                    {med.requiresPrescription ? "Rx" : "OTC"}
                                </div>
                                {med.stock === 0 && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">Out of Stock</span>
                                    </div>
                                )}
                            </div>

                            <h3 className="font-bold text-lg mb-1">{med.name}</h3>
                            <p className="text-xs text-gray-500 mb-4 line-clamp-2">{med.description}</p>

                            <div className="mt-auto flex justify-between items-center p-2 bg-white/40 rounded-lg">
                                <span className="text-lg font-bold text-[var(--gold-dark)]">₹{med.price}</span>
                                <button
                                    onClick={() => addToCart(med)}
                                    disabled={med.stock === 0}
                                    className="w-8 h-8 rounded-full bg-[var(--gold-primary)] text-white flex items-center justify-center hover:bg-[var(--gold-dark)] shadow-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    +
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
