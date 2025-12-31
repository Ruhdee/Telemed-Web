"use client";

import { motion } from "framer-motion";

const stats = [
    { label: "Active Patients", value: "12,000+" },
    { label: "Online Specialists", value: "450+" },
    { label: "Consultations", value: "1.2M" },
    { label: "Patient Satisfaction", value: "99.8%" },
];

export const Stats = () => {
    return (
        <section className="py-16 bg-[var(--text-primary)] text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#d4af37 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-center md:text-left border-l border-white/10 pl-6"
                    >
                        <h3 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[var(--gold-light)] to-[var(--gold-primary)] mb-2">
                            {s.value}
                        </h3>
                        <p className="text-white/60 text-sm tracking-widest uppercase">{s.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
