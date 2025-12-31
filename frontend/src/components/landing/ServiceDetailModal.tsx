"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Heart, Info, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import Link from "next/link";

interface ServiceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: {
        title: string;
        desc: string;
        details: {
            definition: string;
            precautions: string[];
            care: string[];
        };
        link: string;
        color: string;
    } | null;
}

export const ServiceDetailModal = ({ isOpen, onClose, service }: ServiceDetailModalProps) => {
    if (!service) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[80] flex items-center justify-center p-4"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="fixed z-[90] w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className={`p-6 bg-gradient-to-r ${service.color} text-white relative`}>
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-white"
                            >
                                <X size={20} />
                            </button>
                            <h2 className="text-3xl font-bold mb-2">{service.title}</h2>
                            <p className="opacity-90 text-lg">{service.desc}</p>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Definition */}
                            <div>
                                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-3">
                                    <Info className="text-blue-500" /> What is it?
                                </h3>
                                <p className="text-gray-600 leading-relaxed bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    {service.details.definition}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Precautions */}
                                <div>
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                                        <Shield className="text-red-500" /> Precautions
                                    </h3>
                                    <ul className="space-y-2">
                                        {service.details.precautions.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Care */}
                                <div>
                                    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-3">
                                        <Heart className="text-green-500" /> Care Tips
                                    </h3>
                                    <ul className="space-y-2">
                                        {service.details.care.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-100 flex justify-end">
                                <Link href={service.link}>
                                    <Button variant="primary" className="px-8 py-3 h-auto text-base">
                                        Proceed to Service <ArrowRight className="ml-2" size={18} />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
