"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button";
import Image from "next/image";
import { useState } from "react";
import { DoctorProfileModal } from "../doctors/DoctorProfileModal";

const doctors = [
    {
        name: "Dr. Anjali Gupta",
        role: "Cardiologist",
        rating: 5,
        img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Dr. Rajesh Verma",
        role: "Pediatrician",
        rating: 5,
        img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Dr. Priya Desai",
        role: "Psychiatrist",
        rating: 4.9,
        img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2070&auto=format&fit=crop"
    },
];

export const TopDoctors = () => {
    const [selectedDoctor, setSelectedDoctor] = useState<{ name: string, role: string, rating: number, img: string } | null>(null);

    return (
        <section id="doctors" className="py-24 px-6 relative bg-[var(--bg-warm)]">
            <DoctorProfileModal
                isOpen={!!selectedDoctor}
                onClose={() => setSelectedDoctor(null)}
                doctor={selectedDoctor}
            />
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>

            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1 rounded-full bg-[var(--gold-light)]/20 text-[var(--gold-dark)] font-bold text-xs uppercase tracking-widest mb-4"
                    >
                        World Class Care
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Specialists</h2>
                    <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
                        Hand-picked from the world&apos;s leading medical institutions to ensure you receive the best care possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {doctors.map((doc, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            whileHover={{ y: -15 }}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(212,175,55,0.2)] transition-all duration-300 border border-[var(--gold-primary)]/10"
                        >
                            {/* Image Container */}
                            <div className="w-full aspect-[4/5] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 z-10"></div>
                                <Image
                                    src={doc.img}
                                    alt={doc.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />

                                {/* Floating Rating */}
                                <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                                    <Star size={14} fill="#fbbf24" className="text-yellow-400" />
                                    <span className="text-sm font-bold">{doc.rating}</span>
                                </div>
                            </div>

                            {/* Content Overlay/Bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-2xl font-bold mb-1">{doc.name}</h3>
                                <p className="text-[var(--gold-light)] font-medium mb-4 flex items-center gap-2">
                                    {doc.role} <ShieldCheck size={16} />
                                </p>

                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pb-2">
                                    <Button
                                        variant="primary"
                                        className="w-full py-2 text-sm justify-center"
                                        onClick={() => setSelectedDoctor(doc)}
                                    >
                                        View Profile
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
