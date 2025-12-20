"use client";

import { motion } from "framer-motion";
import { Mic, Activity, Globe, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AcousticCheckPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold-primary)] w-fit" style={{ fontFamily: 'var(--font-heading)' }}>
                AI Health Analysis
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Acoustic Check Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-8 text-center"
                >
                    <div className="w-20 h-20 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <Mic size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Acoustic Check</h2>
                    <p className="text-[var(--text-secondary)] mb-8">Record a 10s audio of your cough. Our AI analyzes sound patterns to detect respiratory issues.</p>

                    <div className="w-full h-24 bg-gray-100 rounded-xl mb-6 flex items-center justify-center border-2 border-dashed border-gray-300">
                        <span className="text-gray-400">Audio Waveform Visualizer Placeholder</span>
                    </div>

                    <Button variant="primary" className="w-full justify-center">Start Recording</Button>
                </motion.div>

                {/* Geo Context */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-8"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Globe className="text-blue-500" size={28} />
                        <h2 className="text-2xl font-bold">Geo-Context Scanner</h2>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3 text-sm text-yellow-800 mb-6">
                        <AlertCircle size={20} className="shrink-0" />
                        <p>Current Location: <strong>Mumbai, India</strong>. High pollen count detected. Moderate risk of flu outbreaks reported in your zone.</p>
                    </div>

                    <div className="bg-white/50 rounded-lg p-4 h-48 border border-white flex items-center justify-center text-[var(--text-secondary)]">
                        [Interactive Map Output]
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
