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
    const [isAdding, setIsAdding] = useState(false);
    const [newMedName, setNewMedName] = useState("");
    const [newMedTime, setNewMedTime] = useState("");

    const toggleTaken = (id: number) => {
        setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
    };

    const handleAdd = () => {
        if (!newMedName.trim() || !newMedTime) {
            alert("Please enter both medicine name and time");
            return;
        }

        try {
            // Convert 24h time to 12h format
            const [hours, minutes] = newMedTime.split(':');
            const h = parseInt(hours, 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const formattedHour = h % 12 || 12; // Convert 0 to 12
            const formattedTime = `${formattedHour.toString().padStart(2, '0')}:${minutes} ${ampm}`;

            setMeds([
                ...meds,
                { id: Date.now(), name: newMedName, time: formattedTime, taken: false }
            ]);
            setNewMedName("");
            setNewMedTime("");
            setIsAdding(false);
        } catch (error) {
            console.error("Error adding medicine:", error);
            alert("Failed to add medicine. Please try again.");
        }
    };

    return (
        <div className="glass-panel p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold flex items-center gap-2 text-lg">
                    <Clock className="text-[var(--gold-dark)]" size={20} /> Daily Reminders
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                    <Plus size={16} className={`transition-transformDuration-300 ${isAdding ? 'rotate-45' : ''}`} />
                </button>
            </div>

            <div className="space-y-3">
                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-gray-50 p-3 rounded-xl border border-gray-200 mb-3 space-y-2"
                        >
                            <input
                                placeholder="Medicine Name"
                                value={newMedName}
                                onChange={e => setNewMedName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                className="w-full text-sm p-2 rounded-lg border border-gray-200"
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    value={newMedTime}
                                    onChange={e => setNewMedTime(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                    className="flex-1 text-sm p-2 rounded-lg border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={handleAdd}
                                    className="bg-[var(--gold-primary)] text-white px-3 py-1 rounded-lg text-sm hover:bg-[var(--gold-dark)] transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </motion.div>
                    )}

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
