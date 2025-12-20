"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Calendar, MapPin, Award, Stethoscope } from "lucide-react";
import { Button } from "../ui/Button";
import Image from "next/image";

interface DoctorProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctor: {
        name: string;
        role: string;
        rating: number;
        img: string;
    } | null;
}

export const DoctorProfileModal = ({ isOpen, onClose, doctor }: DoctorProfileModalProps) => {
    if (!doctor) return null;

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
                        className="fixed z-[90] w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="grid md:grid-cols-2">
                            {/* Left: Image & Quick Stats */}
                            <div className="relative hidden md:block h-full min-h-[500px]">
                                <Image
                                    src={doctor.img}
                                    alt={doctor.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-8 left-8 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="px-3 py-1 bg-green-500 rounded-full text-xs font-bold">Available Today</div>
                                        <div className="px-3 py-1 bg-yellow-500 rounded-full text-xs font-bold text-black flex items-center gap-1">
                                            <Star size={12} fill="black" /> 5.0 Top Rated
                                        </div>
                                    </div>
                                    <h3 className="text-3xl font-bold mb-1">{doctor.name}</h3>
                                    <p className="opacity-90">{doctor.role} • 15+ Years Experience</p>
                                </div>
                            </div>

                            {/* Right: Details */}
                            <div className="p-8 relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    <X size={20} />
                                </button>

                                {/* Mobile Only Header */}
                                <div className="md:hidden mb-6 flex items-center gap-4">
                                    <div className="w-20 h-20 relative rounded-full overflow-hidden shrink-0">
                                        <Image src={doctor.img} alt={doctor.name} fill className="object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{doctor.name}</h3>
                                        <p className="text-sm text-gray-600">{doctor.role}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-[var(--gold-dark)] uppercase tracking-wider mb-3">About Specialist</h4>
                                        <p className="text-gray-600 leading-relaxed">
                                            {doctor.name} involves a patient-centric approach to medicine, focusing on holistic treatment plans.
                                            Renowned for expertise in complex cases, utilizing the latest AI-driven diagnostic tools provided by TeleMedCare.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <Award className="text-[var(--gold-primary)] mb-2" />
                                            <h5 className="font-bold">Work Experience</h5>
                                            <p className="text-sm text-gray-500">15+ Years</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <Stethoscope className="text-[var(--gold-primary)] mb-2" />
                                            <h5 className="font-bold">Patients</h5>
                                            <p className="text-sm text-gray-500">10k+ Successful Cases</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-[var(--gold-dark)] uppercase tracking-wider mb-3">Qualification</h4>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-3">
                                                <div className="w-2 h-2 mt-2 rounded-full bg-[var(--gold-primary)]"></div>
                                                <div>
                                                    <p className="font-bold">MD, Cardiology</p>
                                                    <p className="text-sm text-gray-500">All India Institute of Medical Sciences (AIIMS)</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-3">
                                                <div className="w-2 h-2 mt-2 rounded-full bg-[var(--gold-primary)]"></div>
                                                <div>
                                                    <p className="font-bold">Residency</p>
                                                    <p className="text-sm text-gray-500">Apollo Hospitals, Delhi</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 flex gap-4">
                                        <Button variant="primary" className="flex-1 justify-center py-3">Book Appointment</Button>
                                        <Button variant="secondary" className="flex-1 justify-center py-3">Video Consult</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
