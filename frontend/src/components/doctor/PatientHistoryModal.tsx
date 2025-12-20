"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Calendar, User, Pill } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PatientHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientName: string | null;
}

// Mock History Data
const historyData = [
    {
        date: "Oct 24, 2024",
        diagnosis: "Viral Bronchitis",
        doctor: "Dr. Sharma",
        prescription: "Antibiotics, Cough Syrup",
        status: "Recovered"
    },
    {
        date: "Aug 15, 2024",
        diagnosis: "Routine Checkup",
        doctor: "Dr. Anjali Gupta",
        prescription: "Vitamin D3",
        status: "Normal"
    },
    {
        date: "Jan 10, 2024",
        diagnosis: "Mild Hypertension",
        doctor: "Dr. Williams",
        prescription: "Lifestyle changes",
        status: "Monitoring"
    }
];

export const PatientHistoryModal = ({ isOpen, onClose, patientName }: PatientHistoryModalProps) => {
    if (!patientName) return null;

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
                        className="fixed z-[90] w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl max-h-[85vh] overflow-y-auto"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <FileText className="text-[var(--gold-primary)]" /> Patient History
                                </h3>
                                <p className="text-sm text-gray-500">Records for <span className="font-bold text-gray-800">{patientName}</span></p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {historyData.map((record, i) => (
                                <div key={i} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-lg">{record.diagnosis}</h4>
                                            <span className="text-xs bg-gray-200 px-2 py-1 rounded font-medium">{record.status}</span>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p className="flex items-center gap-2"><Calendar size={14} /> {record.date}</p>
                                            <p className="flex items-center gap-2"><User size={14} /> {record.doctor}</p>
                                            <p className="flex items-center gap-2 text-[var(--gold-dark)]"><Pill size={14} /> Rx: {record.prescription}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <Button variant="outline" className="text-xs h-8">View Report</Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <Button variant="primary" onClick={onClose}>Close</Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
