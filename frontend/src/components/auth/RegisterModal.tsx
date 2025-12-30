import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, ArrowRight, User, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { useAuth, UserRole } from "@/context/AuthContext";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState<UserRole>("patient");
    const [error, setError] = useState("");
    const { register } = useAuth();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            await register(name, email, password, role);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    const roles = [
        { id: "patient", label: "Patient", icon: <User size={18} /> },
        { id: "doctor", label: "Doctor", icon: <UserPlus size={18} /> },
        { id: "pharmacist", label: "Pharmacist", icon: <UserPlus size={18} /> },
        { id: "admin", label: "Admin", icon: <UserPlus size={18} /> },
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
                                    <h2 className="text-2xl font-bold">Create Account</h2>
                                    <p className="text-[var(--text-secondary)] text-sm">Join TeleMedCare</p>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-4">
                                {error && (
                                    <div className="text-red-500 text-sm text-center">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--gold-dark)]">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:border-[var(--gold-primary)] focus:ring-2 focus:ring-[var(--gold-primary)]/20 outline-none transition-all"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
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

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--gold-dark)]">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:border-[var(--gold-primary)] focus:ring-2 focus:ring-[var(--gold-primary)]/20 outline-none transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-[var(--gold-dark)]">Role</label>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as UserRole)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-200 focus:border-[var(--gold-primary)] focus:ring-2 focus:ring-[var(--gold-primary)]/20 outline-none transition-all"
                                        required
                                    >
                                        {roles.map((roleOption) => (
                                            <option key={roleOption.id} value={roleOption.id}>
                                                {roleOption.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-full justify-center mt-4"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                            Creating Account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">Sign Up <ArrowRight size={18} /></span>
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
