"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { diseaseModels } from "@/data/diseaseConfig";

export default function AIDiagnosisPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold-primary)] w-fit" style={{ fontFamily: 'var(--font-heading)' }}>
                    AI Health Analysis
                </h1>
                <p className="text-[var(--text-secondary)]">
                    Select a health condition below to get an instant AI-powered assessment.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diseaseModels.map((model, index) => {
                    const Icon = model.icon;
                    return (
                        <Link href={`/dashboard/ai-diagnosis/${model.id}`} key={model.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="glass-panel p-6 h-full hover:shadow-lg transition-all cursor-pointer group border border-white/20 hover:border-[var(--gold-primary)]/50"
                            >
                                <div className="w-12 h-12 bg-[var(--gold-primary)]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[var(--gold-primary)]/20 transition-colors">
                                    <Icon className="text-[var(--gold-dark)]" size={24} />
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--gold-dark)] transition-colors">
                                    {model.name}
                                </h3>

                                <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2">
                                    {model.description}
                                </p>

                                <div className="mt-auto flex items-center gap-2 text-sm font-medium text-[var(--gold-dark)] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                                    Start Analysis <ArrowRight size={16} />
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
