import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, ArrowRight, User, Stethoscope, Activity } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { useAuth, UserRole } from "@/context/AuthContext";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>("patient");
    const { login } = useAuth();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API Call
        setTimeout(() => {
            setIsLoading(false);
            login(selectedRole);
            onClose();
        }, 1000);
    };

    const roles = [
        { id: "patient", label: "Patient", icon: <User size={18} /> },
        { id: "doctor", label: "Doctor", icon: <Stethoscope size={18} /> },
        { id: "nurse", label: "Nurse", icon: <Activity size={18} /> },
    ];

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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed z-[70] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md"
                    >
                        <div className="glass-panel p-8 relative overflow-hidden bg-white/80">
                            {/* Decorative gold orb */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--gold-primary)] rounded-full blur-[60px] opacity-30 pointer-events-none"></div>

                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold">Welcome Back</h2>
                                    <p className="text-[var(--text-secondary)] text-sm">Select your role to login</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Role Selection Tabs */}
                            <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-gray-100/50 rounded-xl">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id as UserRole)}
                                        className={`
                                            flex flex-col items-center gap-1 py-2 rounded-lg text-sm font-medium transition-all
                                            ${selectedRole === role.id
                                                ? "bg-white shadow-sm text-[var(--gold-dark)]"
                                                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"}
                                        `}
                                    >
                                        {role.icon}
                                        {role.label}
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--gold-dark)]">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:border-[var(--gold-primary)] focus:ring-2 focus:ring-[var(--gold-primary)]/20 outline-none transition-all"
                                            placeholder={`${selectedRole}@telemed.care`}
                                            defaultValue={`${selectedRole}@telemed.care`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--gold-dark)]">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="password"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:border-[var(--gold-primary)] focus:ring-2 focus:ring-[var(--gold-primary)]/20 outline-none transition-all"
                                            placeholder="••••••••"
                                            defaultValue="password"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="rounded text-[var(--gold-primary)] focus:ring-[var(--gold-primary)]" />
                                        <span className="text-gray-600">Remember me</span>
                                    </label>
                                    <a href="#" className="text-[var(--gold-dark)] hover:underline">Forgot password?</a>
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-full justify-center mt-4"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                            Authenticating...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">Sign In as {roles.find(r => r.id === selectedRole)?.label} <ArrowRight size={18} /></span>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
