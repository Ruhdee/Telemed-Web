"use client";

import { motion } from "framer-motion";
import { Phone, AlertCircle } from "lucide-react";

export const EmergencySOS = () => {
    return (
        <div className="fixed bottom-6 left-6 z-50">
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative group cursor-pointer"
            >
                <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                <div className="bg-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg relative z-10 border-2 border-red-400">
                    <p className="font-bold text-xs flex flex-col items-center leading-none">
                        <span>SOS</span>
                    </p>
                </div>

                {/* Pop-out Menu */}
                <div className="absolute bottom-16 left-0 w-48 bg-white rounded-xl shadow-xl p-4 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all transform translate-y-2 group-hover:translate-y-0 text-left border border-red-100">
                    <h3 className="font-bold text-red-600 flex items-center gap-2 text-sm mb-2"><AlertCircle size={14} /> Emergency</h3>
                    <button className="w-full flex items-center gap-2 text-sm p-2 bg-red-50 text-red-800 rounded hover:bg-red-100 mb-2 font-bold">
                        <Phone size={14} fill="currentColor" /> Call Ambulance
                    </button>
                    <p className="text-[10px] text-gray-500">Location tracking enabled for rapid response.</p>
                </div>
            </motion.div>
        </div>
    );
};
