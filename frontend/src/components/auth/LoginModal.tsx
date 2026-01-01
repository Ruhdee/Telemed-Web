import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { useAuth } from "@/context/AuthContext";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const [role, setRole] = useState<"patient" | "doctor" | "nurse" | "pharmacist">("patient");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // @ts-ignore
            await login(email, password, role);
            onClose();
        } catch (err) {
            setError("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

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
                                    <p className="text-[var(--text-secondary)] text-sm">Sign in to your account</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="text-red-500 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--gold-dark)]">Role</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as any)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--gold-primary)]/20 focus:border-[var(--gold-primary)] transition-all bg-white/50"
                                    >
                                        <option value="patient">Patient</option>
                                        <option value="doctor">Doctor</option>
                                        <option value="nurse">Nurse</option>
                                        <option value="pharmacist">Pharmacist</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--gold-dark)]">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:border-[var(--gold-primary)] focus:ring-2 focus:ring-[var(--gold-primary)]/20 outline-none transition-all"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--gold-dark)]">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:border-[var(--gold-primary)] focus:ring-2 focus:ring-[var(--gold-primary)]/20 outline-none transition-all"
                                            placeholder="••••••••"
                                            required
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
                                        <span className="flex items-center gap-2">Sign In <ArrowRight size={18} /></span>
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
