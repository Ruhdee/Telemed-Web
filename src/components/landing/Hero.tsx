"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { Calendar, PlayCircle, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { VideoModal } from "../ui/VideoModal";

export const Hero = () => {
    const [isDemoOpen, setIsDemoOpen] = useState(false);

    return (
        <section className="relative min-h-[90vh] pt-32 pb-20 px-6 overflow-hidden flex flex-col justify-center">
            {/* Background Decor */}
            <div className="absolute inset-0 -z-20">
                <Image
                    src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=2574&auto=format&fit=crop"
                    alt="Background"
                    fill
                    className="object-cover opacity-5"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-warm)] via-transparent to-[var(--bg-warm)]"></div>
                {/* Animated Orbs */}
                <div className="absolute top-20 right-20 w-96 h-96 bg-[var(--gold-primary)] rounded-full blur-[150px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-300 rounded-full blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full mb-12">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="z-10"
                >
                    <div className="flex items-center gap-2 mb-8">
                        <span className="h-[2px] w-12 bg-[var(--gold-primary)]"></span>
                        <span className="text-[var(--gold-dark)] uppercase tracking-[0.2em] text-sm font-bold">Premium Healthcare Redefined</span>
                    </div>

                    <h1 className="mb-8 font-bold leading-[1.1]">
                        Your Health, <br />
                        <span className="text-gradient-gold">
                            elevated to Gold Standard.
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-10 max-w-xl leading-relaxed font-light">
                        Connect with world-class specialists instantly. Experience AI-powered diagnostics and concierge medical care from your sanctuary.
                    </p>

                    <div className="flex flex-wrap gap-6">
                        <Button variant="primary" className="h-14 px-8 text-lg shadow-[0_10px_30px_-10px_rgba(212,175,55,0.5)]">
                            Book Priority Consult
                        </Button>
                        <Button
                            variant="glass"
                            className="h-14 px-8 text-lg"
                            onClick={() => setIsDemoOpen(true)}
                        >
                            <PlayCircle className="mr-2" /> Live Demo
                        </Button>
                    </div>
                </motion.div>

                {/* Visual Content (Laptop Mockup) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative perspective-1000"
                >
                    {/* Laptop Frame */}
                    <div className="relative mx-auto bg-[#1a1a1a] rounded-t-2xl border-[4px] border-[#2a2a2a] shadow-2xl aspect-video w-full transform rotate-y-6 hover:rotate-y-0 transition-transform duration-700 ease-out-expo">
                        <div className="absolute inset-0 bg-gray-900 rounded-t-lg overflow-hidden">
                            {/* Video Background */}
                            <video
                                className="w-full h-full object-cover opacity-90"
                                autoPlay
                                muted
                                loop
                                playsInline
                            >
                                <source src="/laptop.mp4" type="video/mp4" />
                            </video>

                            {/* UI Overlay on Screen */}
                            <div className="absolute bottom-4 left-4 right-4 glass-panel p-4 flex justify-between items-center bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                                    <div>
                                        <p className="font-bold text-sm">Dr. Sarah Williams</p>
                                        <p className="text-xs text-white/70">Cardiology • Online</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="p-2 bg-white/20 rounded-full hover:bg-white/30 cursor-pointer backdrop-blur-sm">Video</div>
                                    <div className="p-2 bg-red-500/80 rounded-full hover:bg-red-600 cursor-pointer backdrop-blur-sm">End</div>
                                </div>
                            </div>
                        </div>
                        {/* Glare */}
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                    </div>
                    {/* Laptop Base */}
                    <div className="relative mx-auto bg-[#2a2a2a] rounded-b-xl h-4 w-[105%] -left-[2.5%] shadow-2xl"></div>

                </motion.div>
            </div>

            <VideoModal
                isOpen={isDemoOpen}
                onClose={() => setIsDemoOpen(false)}
                videoSrc="/demo.mp4"
            />

            {/* Trust Bar */}
            <div className="max-w-7xl mx-auto w-full pt-12 border-t border-[var(--gold-primary)]/10 flex flex-wrap justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                {['Generic Hospital', 'MediCross', 'HealthPlus', 'GlobalCare'].map((brand, i) => (
                    <span key={i} className="text-xl font-bold font-heading tracking-widest">{brand}</span>
                ))}
            </div>
        </section>
    );
};
