"use client";

import { motion } from "framer-motion";
import { Pill, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

const products = [
    { name: "Vit C Boost", price: "₹450", category: "Wellness", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2030&auto=format&fit=crop" },
    { name: "PainRelief+", price: "₹120", category: "Pain Management", img: "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=2042&auto=format&fit=crop" },
    { name: "DermaCare", price: "₹850", category: "Skincare", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop" },
    { name: "ProBiotics", price: "₹600", category: "Digestion", img: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=1979&auto=format&fit=crop" },
    { name: "Omega 3", price: "₹1200", category: "Heart Health", img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=2069&auto=format&fit=crop" },
    { name: "SleepWell", price: "₹350", category: "Sleep", img: "https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?q=80&w=2014&auto=format&fit=crop" },
];

export default function PharmacyPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/50 p-4 rounded-xl backdrop-blur-sm sticky top-20 z-30">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gold-dark)] to-[var(--text-primary)]">
                        E-Pharmacy
                    </h1>
                    <p className="text-xs text-[var(--text-secondary)]">Premium Supplements & Medicines</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="glass-panel flex items-center px-4 py-2 gap-2 w-64">
                        <Search size={16} className="text-gray-400" />
                        <input className="bg-transparent border-none outline-none text-sm w-full" placeholder="Search medicines..." />
                    </div>
                    <Button variant="outline" icon={<ShoppingCart size={18} />}>Cart (2)</Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -8 }}
                        className="glass-panel p-3 flex flex-col group"
                    >
                        <div className="w-full aspect-square relative rounded-xl overflow-hidden mb-4 bg-gray-100">
                            <Image
                                src={p.img}
                                alt={p.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                                {p.category}
                            </div>
                        </div>

                        <h3 className="font-bold text-lg mb-1">{p.name}</h3>
                        <div className="mt-auto flex justify-between items-center p-2 bg-white/40 rounded-lg">
                            <span className="text-lg font-bold text-[var(--gold-dark)]">{p.price}</span>
                            <button className="w-8 h-8 rounded-full bg-[var(--gold-primary)] text-white flex items-center justify-center hover:bg-[var(--gold-dark)] shadow-md transition-colors">+</button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
