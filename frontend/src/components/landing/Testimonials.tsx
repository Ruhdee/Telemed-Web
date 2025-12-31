"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

const testimonials = [
    {
        name: "Michael Chen",
        role: "Patient",
        text: "The AI diagnosis feature saved me a trip to the ER. The doctor confirmed it within minutes. Incredible service.",
        img: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
        name: "Emma Davis",
        role: "Mother",
        text: "As a new mom, the 24/7 pediatric access is a lifesaver. The video quality is crystal clear.",
        img: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
        name: "Robert Wilson",
        role: "Senior Citizen",
        text: "The medicine delivery and reminders make managing my heart condition so much easier.",
        img: "https://randomuser.me/api/portraits/men/85.jpg"
    }
];

export const Testimonials = () => {
    return (
        <section className="py-24 px-6 bg-[var(--gold-light)]/5 border-y border-[var(--gold-primary)]/10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Patient Stories</h2>
                    <p className="text-[var(--text-secondary)]">Don&apos;t just take our word for it.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="glass-panel p-8 relative"
                        >
                            <Quote size={40} className="absolute top-4 right-4 text-[var(--gold-primary)] opacity-20" />

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full relative overflow-hidden ring-2 ring-[var(--gold-primary)]">
                                    <Image src={t.img} alt={t.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <h4 className="font-bold">{t.name}</h4>
                                    <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">{t.role}</span>
                                </div>
                            </div>

                            <p className="text-gray-600 italic leading-relaxed">&quot;{t.text}&quot;</p>

                            <div className="mt-4 flex gap-1 text-yellow-500">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
