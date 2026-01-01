import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, FileText, Video, Radio, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { useAuth } from "@/context/AuthContext";

interface BookAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Doctor {
    id: number;
    name: string;
    specialization: string;
}

export const BookAppointmentModal = ({ isOpen, onClose }: BookAppointmentModalProps) => {
    const [step, setStep] = useState(1);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [formData, setFormData] = useState({
        doctorId: "",
        date: "",
        time: "",
        symptoms: "",
        type: "Video Consult"
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingDoctors, setIsFetchingDoctors] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchDoctors();
            setStep(1);
            setFormData({
                doctorId: "",
                date: "",
                time: "",
                symptoms: "",
                type: "Video Consult"
            });
        }
    }, [isOpen]);

    const fetchDoctors = async () => {
        setIsFetchingDoctors(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5001/api/doctors', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setDoctors(data);
            }
        } catch (error) {
            console.error("Failed to fetch doctors", error);
        } finally {
            setIsFetchingDoctors(false);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');

            // Combine date and time
            const appointmentDate = new Date(`${formData.date}T${formData.time}`);

            const res = await fetch('http://localhost:5001/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    doctorId: parseInt(formData.doctorId),
                    date: appointmentDate.toISOString(),
                    symptoms: formData.symptoms,
                    type: formData.type
                })
            });

            if (res.ok) {
                onClose();
                // Optionally trigger a refresh or toast here
                alert("Appointment booked successfully!");
            } else {
                alert("Failed to book appointment");
            }
        } catch (error) {
            console.error("Booking error", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed z-[70] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl"
                    >
                        <div className="glass-panel p-0 relative overflow-hidden bg-white/90 shadow-2xl rounded-2xl flex flex-col max-h-[90vh]">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white/50">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Calendar className="text-[var(--gold-primary)]" />
                                        Book Appointment
                                    </h2>
                                    <p className="text-sm text-[var(--text-secondary)]">Step {step} of 3</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-8 overflow-y-auto">
                                {step === 1 && (
                                    <div className="space-y-6">
                                        <h3 className="font-semibold text-lg">Select a Doctor</h3>
                                        {isFetchingDoctors ? (
                                            <p className="text-gray-500">Loading doctors...</p>
                                        ) : (
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {doctors.map((doc) => (
                                                    <div
                                                        key={doc.id}
                                                        onClick={() => setFormData({ ...formData, doctorId: doc.id.toString() })}
                                                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${formData.doctorId === doc.id.toString()
                                                            ? "border-[var(--gold-primary)] bg-[var(--gold-light)]/20"
                                                            : "border-gray-100 hover:border-[var(--gold-primary)]/50"
                                                            }`}
                                                    >
                                                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                            Dr
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold">{doc.name}</h4>
                                                            <p className="text-sm text-gray-500">{doc.specialization}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div className="flex justify-end mt-6">
                                            <Button
                                                variant="primary"
                                                disabled={!formData.doctorId}
                                                onClick={() => setStep(2)}
                                            >
                                                Next Step
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-6">
                                        <h3 className="font-semibold text-lg">Schedule & Symptoms</h3>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Date</label>
                                                <input
                                                    type="date"
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                    className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[var(--gold-primary)]"
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Time</label>
                                                <input
                                                    type="time"
                                                    value={formData.time}
                                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                    className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[var(--gold-primary)]"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Symptoms / Reason</label>
                                            <textarea
                                                value={formData.symptoms}
                                                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                                                className="w-full p-3 rounded-lg border border-gray-200 outline-none focus:border-[var(--gold-primary)] min-h-[100px]"
                                                placeholder="Describe your symptoms (e.g., fever, headache)..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {['Video Consult', 'Offline Review'].map((type) => (
                                                <div
                                                    key={type}
                                                    onClick={() => setFormData({ ...formData, type })}
                                                    className={`p-4 rounded-xl border-2 cursor-pointer text-center font-medium ${formData.type === type
                                                        ? "border-[var(--gold-primary)] bg-[var(--gold-light)]/20 text-[var(--gold-dark)]"
                                                        : "border-gray-100 text-gray-500"
                                                        }`}
                                                >
                                                    {type}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between mt-6">
                                            <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                                            <Button
                                                variant="primary"
                                                disabled={!formData.date || !formData.time || !formData.symptoms}
                                                onClick={() => setStep(3)}
                                            >
                                                Review
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-6 text-center">
                                        <div className="w-16 h-16 bg-[var(--gold-light)]/30 rounded-full flex items-center justify-center mx-auto text-[var(--gold-dark)] mb-4">
                                            <Activity size={32} />
                                        </div>
                                        <h3 className="font-bold text-xl">Confirm Appointment</h3>
                                        <p className="text-gray-500">Please review your details before confirming.</p>

                                        <div className="bg-gray-50 p-6 rounded-xl text-left space-y-3 mx-auto max-w-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Doctor</span>
                                                <span className="font-semibold">{doctors.find(d => d.id.toString() === formData.doctorId)?.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Date & Time</span>
                                                <span className="font-semibold">{formData.date} at {formData.time}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Type</span>
                                                <span className="font-semibold">{formData.type}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between mt-8">
                                            <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
                                            <Button
                                                variant="primary"
                                                onClick={handleSubmit}
                                                className="px-8"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? "Confirming..." : "Confirm Booking"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
