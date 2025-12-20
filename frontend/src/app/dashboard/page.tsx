"use client";

import { motion } from "framer-motion";
import { Activity, Clock, FileCheck, ScanFace, Brain, Wind, ArrowRight, Scan } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { DiagnosisUploadModal } from "@/components/dashboard/DiagnosisUploadModal";
import { MedicineReminderWidget } from "@/components/dashboard/MedicineReminderWidget";
import { VitalsScannerModal } from "@/components/dashboard/VitalsScannerModal";
import { ARLensModal } from "@/components/dashboard/ARLensModal";

// Mock Timeline Data
const timeline = [
    { date: "Oct 24", title: "Video Consult", desc: "Dr. Sarah Williams (Cardiology)", type: "consult" },
    { date: "Oct 20", title: "Lab Results", desc: "Bloodwork Analysis Complete", type: "lab" },
    { date: "Oct 15", title: "Symptom Log", desc: "Reported mild fever and cough", type: "symptom" },
];

export default function DashboardPage() {
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const [showVitalsScanner, setShowVitalsScanner] = useState(false);
    const [showARLens, setShowARLens] = useState(false);

    return (
        <div className="space-y-8">
            <DiagnosisUploadModal
                isOpen={!!selectedModel}
                onClose={() => setSelectedModel(null)}
                modelType={selectedModel}
            />
            <VitalsScannerModal isOpen={showVitalsScanner} onClose={() => setShowVitalsScanner(false)} />
            <ARLensModal isOpen={showARLens} onClose={() => setShowARLens(false)} />

            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Hello, Prathmesh</h1>
                    <p className="text-[var(--text-secondary)]">Your health dashboard overview.</p>
                </div>
                <Button variant="primary">New Consultation</Button>
            </header>

            {/* Vitals / Stats Row + Advanced Tools */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                        { label: "Heart Rate", val: "72 bpm", color: "text-red-500", icon: <Activity /> },
                        { label: "BP", val: "120/80", color: "text-blue-500", icon: <Activity /> },
                        { label: "Sleep", val: "7h 30m", color: "text-purple-500", icon: <Clock /> },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="glass-panel p-4 flex flex-col justify-between h-32"
                        >
                            <div className={`self-start p-2 rounded-full bg-white/50 ${stat.color}`}>{stat.icon}</div>
                            <div>
                                <h3 className="text-xl font-bold">{stat.val}</h3>
                                <p className="text-xs text-[var(--text-secondary)]">{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}

                    {/* Advanced Tool Triggers */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowVitalsScanner(true)}
                        className="rounded-2xl shadow-lg border border-white/20 p-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 md:w-32 md:h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                        <ScanFace size={24} className="mb-2" />
                        <div>
                            <h3 className="font-bold leading-tight">Touchless Vitals</h3>
                            <p className="text-xs text-blue-100 opacity-80">Scan via Webcam</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowARLens(true)}
                        className="rounded-2xl shadow-lg border border-white/20 p-4 bg-gradient-to-br from-indigo-900 to-purple-900 text-white cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 md:w-32 md:h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                        <Scan size={24} className="mb-2" />
                        <div>
                            <h3 className="font-bold leading-tight">AR Lens</h3>
                            <p className="text-xs text-purple-100 opacity-80">Read Prescriptions</p>
                        </div>
                    </motion.div>
                </div>

                {/* Stats / Graph Placeholder column if needed, or leave empty if grid handles it */}
                <div className="hidden md:block">
                    {/* Can be used for extra widget/ad */}
                    <div className="glass-panel h-full p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-[var(--gold-light)]/20 to-orange-50/50">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                            <Clock className="text-[var(--gold-primary)]" />
                        </div>
                        <h3 className="font-bold text-gray-800">Next Appt</h3>
                        <p className="text-sm text-gray-500">Tomorrow, 10:00 AM</p>
                        <Button variant="outline" className="mt-4 h-8 text-xs bg-white">Reschedule</Button>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Medicine Reminder Widget - Spans 1 column */}
                <div className="md:col-span-1">
                    <MedicineReminderWidget />
                </div>

                {/* CNN Disease Detection Section - Spans 2 columns */}
                <div className="md:col-span-2 glass-panel p-6 flex flex-col justify-center">
                    <div className="mb-6 flex justify-between items-end">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ScanFace className="text-[var(--gold-gold)]" /> AI Disease Detection
                        </h2>
                        <span className="text-xs font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded">Beta v4.0</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { id: "Brain Tumor", title: "Brain Tumor", icon: <Brain />, color: "text-purple-600 bg-purple-50" },
                            { id: "Tuberculosis", title: "TB Check", icon: <Activity />, color: "text-blue-600 bg-blue-50" },
                            { id: "Skin Disease", title: "Skin Check", icon: <ScanFace />, color: "text-pink-600 bg-pink-50" },
                            { id: "Pneumonia", title: "Pneumonia", icon: <Wind />, color: "text-cyan-600 bg-cyan-50" },
                        ].map((model, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                onClick={() => setSelectedModel(model.id)}
                                className="p-3 rounded-xl border border-gray-100 hover:border-[var(--gold-primary)] transition-all flex flex-col items-center text-center gap-2 cursor-pointer bg-white"
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${model.color}`}>
                                    {model.icon}
                                </div>
                                <h3 className="font-bold text-xs text-gray-800">{model.title}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <section className="glass-panel p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FileCheck className="text-[var(--gold-primary)]" /> Patient Timeline
                </h2>

                <div className="relative border-l-2 border-[var(--gold-primary)]/30 ml-3 space-y-8 pl-8 py-2">
                    {timeline.map((item, i) => (
                        <div key={i} className="relative">
                            <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-[var(--gold-primary)] border-4 border-white shadow-sm"></div>
                            <span className="text-xs font-semibold text-[var(--gold-dark)] uppercase tracking-wider block mb-1">{item.date}</span>
                            <h4 className="font-bold text-lg">{item.title}</h4>
                            <p className="text-[var(--text-secondary)]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
