"use client";

import { motion } from "framer-motion";
import { Upload, FileText, Scan } from "lucide-react";

export default function RecordsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Health Records & OCR</h1>

            <div className="glass-panel p-10 text-center border-2 border-dashed border-[var(--gold-primary)]/50 bg-[var(--gold-light)]/5 cursor-pointer hover:bg-[var(--gold-light)]/10 transition-colors">
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-[var(--gold-dark)]"
                >
                    <Scan size={32} />
                </motion.div>
                <h2 className="text-xl font-bold mb-2">Scan Prescription or Report</h2>
                <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                    Upload a photo of your prescription. Our System uses advanced OCR to extract medicine names, dosages, and creates reminders automatically.
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold-dark)] bg-white px-4 py-2 rounded-lg shadow-sm">
                    <Upload size={16} /> Click to Upload or Drag File
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
                {/* Mock Extracted Data */}
                <div className="glass-panel p-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                    <h3 className="font-bold flex items-center gap-2 mb-4"><FileText size={18} /> Recent Scan (Demo)</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b pb-2">
                            <span>Medicine</span>
                            <span className="font-medium">Amoxicillin 500mg</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span>Frequency</span>
                            <span className="font-medium">2x Daily</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span>Duration</span>
                            <span className="font-medium">5 Days</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
