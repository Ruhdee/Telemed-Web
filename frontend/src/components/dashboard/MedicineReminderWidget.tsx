"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Check, Plus, Clock } from "lucide-react";

export const MedicineReminderWidget = () => {
    const [meds, setMeds] = useState([
        { id: 1, name: "Vitamin D3", time: "09:00 AM", taken: false },
        { id: 2, name: "Amoxicillin", time: "02:00 PM", taken: false },
        { id: 3, name: "Metformin", time: "08:00 PM", taken: false },
    ]);

    const toggleTaken = (id: number) => {
        setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
    };

    return (
        <div className="glass-panel p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold flex items-center gap-2 text-lg">
                    <Clock className="text-[var(--gold-dark)]" size={20} /> Daily Reminders
                </h3>
                <button className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    <Plus size={16} />
                </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
                <AnimatePresence>
                    {meds.map((med) => (
                        <motion.div
                            key={med.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${med.taken
                                    ? "bg-green-50 border-green-200"
                                    : "bg-white border-gray-100 hover:border-[var(--gold-primary)]"
                                }`}
                            onClick={() => toggleTaken(med.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${med.taken ? "bg-green-100 text-green-600" : "bg-blue-50 text-blue-500"
                                    }`}>
                                    {med.taken ? <Check size={18} /> : <Pill size={18} />}
                                </div>
                                <div>
                                    <p className={`font-bold text-sm ${med.taken ? "text-gray-400 line-through" : "text-gray-800"}`}>
                                        {med.name}
                                    </p>
                                    <p className="text-xs text-gray-500">{med.time}</p>
                                </div>
                            </div>

                            {med.taken && (
                                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">Done</span>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
