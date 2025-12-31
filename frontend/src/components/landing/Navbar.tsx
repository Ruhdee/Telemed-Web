"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { LoginModal } from "../auth/LoginModal";
import { RegisterModal } from "../auth/RegisterModal";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Services", href: "/#services" },
        { name: "Doctors", href: "/#doctors" },
        { name: "How it Works", href: "/#how-it-works" },
    ];

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
    };

    const navigateToDashboard = () => {
        if (user?.role === 'doctor') router.push('/doctor');
        else router.push('/dashboard');
    }

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
                    ? "bg-white/80 backdrop-blur-md shadow-lg py-4"
                    : "bg-transparent py-6"
                    }`}
            >
                <div className="container mx-auto px-4 flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--gold-primary)] to-[var(--gold-dark)] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[var(--gold-primary)]/20">
                            T
                        </div>
                        <span className={`text-xl font-bold ${isScrolled ? "text-gray-900" : "text-gray-900"}`}>
                            TeleMed<span className="text-[var(--gold-primary)]">Care</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-[var(--gold-primary)] transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-900">
                                    Hi, {user.name.split(' ')[0]}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={navigateToDashboard}
                                    className="flex items-center gap-2 px-4 py-2 text-sm"
                                >
                                    <UserIcon size={16} /> Dashboard
                                </Button>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="text-sm font-medium text-gray-600 hover:text-[var(--gold-primary)] transition-colors"
                                >
                                    Log In
                                </button>
                                <Button
                                    variant="primary"
                                    onClick={() => setIsRegisterOpen(true)}
                                    className="shadow-lg shadow-[var(--gold-primary)]/20 px-4 py-2 text-sm"
                                >
                                    Get Started <ChevronRight size={16} className="ml-1" />
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-t border-gray-100"
                        >
                            <div className="container mx-auto px-4 py-6 space-y-4">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-base font-medium text-gray-600 hover:text-[var(--gold-primary)]"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="pt-4 border-t border-gray-100 space-y-3">
                                    {user ? (
                                        <>
                                            <div className="text-sm font-medium text-gray-900 mb-2">Signed in as {user.name}</div>
                                            <Button className="w-full justify-center" onClick={navigateToDashboard}>
                                                Dashboard
                                            </Button>
                                            <Button variant="outline" className="w-full justify-center text-red-500 border-red-200" onClick={handleLogout}>
                                                Log Out
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-center"
                                                onClick={() => {
                                                    setIsLoginOpen(true);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                Log In
                                            </Button>
                                            <Button
                                                variant="primary"
                                                className="w-full justify-center"
                                                onClick={() => {
                                                    setIsRegisterOpen(true);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                Get Started
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Auth Modals */}
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
        </>
    );
};
