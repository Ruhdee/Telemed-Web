"use client";

import { useState } from "react";
import { LoginModal } from "../auth/LoginModal";
import { RegisterModal } from "../auth/RegisterModal";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold flex items-center gap-2">
                        <div className="w-10 h-10 bg-[var(--gold-primary)] rounded-lg flex items-center justify-center text-white font-heading font-bold">T</div>
                        <span className="text-[var(--gold-dark)]">TeleMed</span>Care
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-sm font-medium hover:text-[var(--gold-primary)] transition-colors">Home</Link>
                        <Link href="/services" className="text-sm font-medium hover:text-[var(--gold-primary)] transition-colors">Services</Link>
                        <Link href="/doctors" className="text-sm font-medium hover:text-[var(--gold-primary)] transition-colors">Doctors</Link>
                        <Link href="#how-it-works" className="text-sm font-medium hover:text-[var(--gold-primary)] transition-colors">How it Works</Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/dashboard">
                                    <Button variant="outline" className="h-10 text-sm">Dashboard</Button>
                                </Link>
                                <Button onClick={logout} variant="glass" className="h-10 text-sm">Logout</Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <button onClick={() => setIsLoginOpen(true)} className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--gold-primary)] transition-colors">Log In</button>
                                <Button onClick={() => setIsRegisterOpen(true)} className="h-10 text-sm" icon={<ChevronRight size={16} />}>Get Started</Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white p-6 border-t border-gray-100 absolute w-full">
                        <div className="flex flex-col gap-4">
                            <Link href="/doctors" className="py-2">Find Doctors</Link>
                            <Link href="/services" className="py-2">Services</Link>

                            <Link href="/about" className="py-2">About</Link>
                            <div className="h-px bg-gray-100 my-2"></div>
                            {user ? (
                                <>
                                    <Link href="/dashboard" className="py-2 font-bold">Dashboard</Link>
                                    <button onClick={logout} className="py-2 text-left text-red-500">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => setIsLoginOpen(true)} variant="glass" className="w-full">Login</Button>
                                    <Button onClick={() => setIsRegisterOpen(true)} className="w-full">Get Started</Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </motion.nav>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
        </>
    );
};
