"use client";

import { motion } from "framer-motion";
import { Stethoscope, Baby, Brain, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";

import Link from "next/link";

const services = [
    { icon: <Stethoscope size={32} />, title: "General Consultation", desc: "For the health needs of you and your family", color: "from-blue-400 to-blue-600", href: "/dashboard/consultation" },
    { icon: <Baby size={32} />, title: "Pediatrics", desc: "Expert care for your child&apos;s health and development", color: "from-pink-400 to-pink-600", href: "/dashboard/consultation" },
    { icon: <Brain size={32} />, title: "Mental Health", desc: "Speak with a therapist about your concerns", color: "from-teal-400 to-teal-600", href: "/dashboard/ai-diagnosis" },
    { icon: <Sparkles size={32} />, title: "Dermatology", desc: "Skin & wellness treatments for a glowing you", color: "from-amber-400 to-amber-600", href: "/dashboard/consultation" },
];

export const Services = () => {
    return (
        <section id="services" className="py-20 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
                    <p className="text-[var(--text-secondary)]">Expert care at your fingertips.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((s, i) => (
                        <Link key={i} href={s.href} className="block h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="glass-panel p-8 flex flex-col justify-between min-h-[320px] group overflow-hidden relative border-t-4 border-t-[var(--gold-primary)] h-full"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${s.color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150`}></div>

                                <div>
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg mb-8 group-hover:rotate-6 transition-transform`}>
                                        {s.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
                                    <p className="text-lg text-[var(--text-secondary)] leading-relaxed">{s.desc}</p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-[var(--glass-border)] flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
                                    <span className="font-bold text-sm uppercase tracking-wider text-[var(--gold-dark)]">Learn More</span>
                                    <div className="w-8 h-8 rounded-full bg-[var(--gold-light)]/30 flex items-center justify-center">
                                        <ArrowRight size={16} className="text-[var(--gold-dark)]" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};
