"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, Video } from "lucide-react";
import { Button } from "../ui/Button";

const steps = [
    { icon: <UserPlus size={24} />, title: "1. Sign Up", desc: "Create your account" },
    { icon: <Search size={24} />, title: "2. Choose a Doctor", desc: "Select a specialist" },
    { icon: <Video size={24} />, title: "3. Start Consultation", desc: "Connect via video call" },
];

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How it Works</h2>
                    <p className="text-[var(--text-secondary)]">Easy steps to get started.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="glass-panel p-8 flex flex-col justify-center min-h-[160px] relative overflow-hidden"
                        >
                            {/* Background highlight */}
                            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[var(--gold-primary)] opacity-5 rounded-full blur-2xl"></div>

                            <div className="flex items-center gap-4 mb-2">
                                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)]">{step.title}</h3>
                            </div>
                            <p className="text-[var(--text-secondary)] pl-0">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 flex justify-end">
                    <Button variant="primary" className="px-8" icon={<Video size={18} />}>
                        Contact Us
                    </Button>
                </div>
            </div>
        </section>
    );
};
