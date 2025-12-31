"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ambulance, Phone, AlertTriangle, X, MapPin } from "lucide-react";
import { Button } from "../ui/Button";

export const EmergencySOS = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [status, setStatus] = useState<"idle" | "counting" | "dispatched">("idle");

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (status === "counting" && countdown > 0) {
            timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        } else if (status === "counting" && countdown === 0) {
            setStatus("dispatched");
        }
        return () => clearTimeout(timer);
    }, [status, countdown]);

    const handleTrigger = () => {
        setIsOpen(true);
        setStatus("counting");
        setCountdown(5);
    };

    const handleCancel = () => {
        setStatus("idle");
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleTrigger}
                className="fixed bottom-6 left-6 z-50 w-16 h-16 bg-red-600 rounded-full shadow-lg flex items-center justify-center text-white border-4 border-red-400 animate-pulse hover:animate-none"
            >
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                <AlertTriangle size={28} className="relative z-10" />
            </motion.button>

            {/* Critical SOS Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative"
                        >
                            <button onClick={handleCancel} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full z-10">
                                <X size={20} />
                            </button>

                            <div className="p-8 text-center relative overflow-hidden">
                                {status === "counting" && (
                                    <div className="space-y-6 relative z-10">
                                        <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center animate-bounce">
                                            <span className="text-5xl font-bold text-red-600">{countdown}</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-red-600">Requesting Emergency Assistance</h2>
                                        <p className="text-gray-600">Sending your live location to nearest ambulance and emergency contacts...</p>
                                        <div className="flex justify-center">
                                            <Button variant="outline" onClick={handleCancel} className="border-red-200 text-red-600 hover:bg-red-50">
                                                CANCEL REQUEST
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {status === "dispatched" && (
                                    <div className="space-y-6 relative z-10">
                                        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                                            <Ambulance size={40} className="text-green-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">Help is on the way!</h2>
                                            <p className="text-green-600 font-medium">Ambulance Dispatched • ETA 8 Mins</p>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-xl text-left space-y-3 border border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="text-blue-500" size={20} />
                                                <div>
                                                    <p className="text-xs text-gray-500">Location Shared</p>
                                                    <p className="text-sm font-bold">12/A, Linking Road, Bandra West, Mumbai</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Phone className="text-green-500" size={20} />
                                                <div>
                                                    <p className="text-xs text-gray-500">Emergency Contact</p>
                                                    <p className="text-sm font-bold">Notified (+91 98*** *****)</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Button variant="primary" className="w-full bg-red-600 hover:bg-red-700 border-none" onClick={handleCancel}>
                                            Close & Call Support
                                        </Button>
                                    </div>
                                )}

                                {/* Background Pulse Effect */}
                                {status === "counting" && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl animate-pulse -z-0"></div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
