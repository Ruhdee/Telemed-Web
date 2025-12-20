"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Video, Mic, Camera, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ConsultationPage() {
    const [mode, setMode] = useState<'live' | 'offline'>('live');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tele-Consultation</h1>
                <div className="flex bg-white/50 p-1 rounded-xl">
                    <button
                        onClick={() => setMode('live')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'live' ? 'bg-[var(--gold-primary)] text-white shadow-md' : 'text-[var(--text-secondary)]'}`}
                    >
                        Live Video
                    </button>
                    <button
                        onClick={() => setMode('offline')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'offline' ? 'bg-[var(--gold-primary)] text-white shadow-md' : 'text-[var(--text-secondary)]'}`}
                    >
                        Offline / Async
                    </button>
                </div>
            </div>

            {mode === 'live' ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center min-h-[500px] glass-panel p-8"
                >
                    <div className="w-full max-w-3xl aspect-video bg-gray-900 rounded-2xl relative overflow-hidden shadow-2xl flex items-center justify-center">
                        <div className="text-center text-white/50">
                            <Video size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Waiting for Doctor...</p>
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                            <button className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg hover:scroll-m-1">End</button>
                            <button className="p-4 rounded-full bg-gray-700/50 backdrop-blur text-white hover:bg-gray-600"><Mic /></button>
                            <button className="p-4 rounded-full bg-gray-700/50 backdrop-blur text-white hover:bg-gray-600"><Camera /></button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-2xl mx-auto glass-panel p-8"
                >
                    <h2 className="text-xl font-bold mb-4">Offline Symptom Report</h2>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">Answer a quick questionnaire and record a 10s video. A doctor will review this and prescribe meds.</p>

                    <div className="space-y-4 mb-8">
                        <input className="w-full p-4 rounded-xl bg-white/50 border border-transparent focus:border-[var(--gold-primary)] outline-none" placeholder="Chief Complaint (e.g., Fever, Headache)" />
                        <textarea className="w-full p-4 rounded-xl bg-white/50 border border-transparent focus:border-[var(--gold-primary)] outline-none h-32" placeholder="Describe your symptoms in detail..." />
                    </div>

                    <div className="border-2 border-dashed border-[var(--gold-primary)] rounded-xl p-8 text-center cursor-pointer hover:bg-[var(--gold-light)]/10 transition-colors">
                        <Video size={32} className="mx-auto text-[var(--gold-dark)] mb-2" />
                        <span className="font-semibold text-[var(--gold-dark)]">Record 10s Video</span>
                    </div>

                    <Button variant="primary" className="w-full mt-8 justify-center">Submit Report</Button>
                </motion.div>
            )}
        </div>
    );
}
