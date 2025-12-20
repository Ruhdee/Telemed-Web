"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "../ui/Button";
import Link from "next/link";
import { useState } from "react";
import { LoginModal } from "../auth/LoginModal";

export const Navbar = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass-panel m-4 mt-2 flex justify-between items-center max-w-7xl mx-auto"
            >
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-[var(--gold-primary)] to-[var(--gold-dark)] p-2 rounded-full text-white shadow-md">
                        <Plus size={24} strokeWidth={4} />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                        TeleMedCare
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8 font-medium text-[var(--text-secondary)]">
                    <Link href="/dashboard" className="hover:text-[var(--gold-dark)] transition-colors">Patient</Link>
                    <Link href="/doctor" className="hover:text-[var(--gold-dark)] transition-colors">Doctor</Link>
                    <Link href="/nurse" className="hover:text-[var(--gold-dark)] transition-colors">Nurse</Link>
                    {['Services', 'About'].map((item) => (
                        <Link key={item} href={`#${item.toLowerCase()}`} className="hover:text-[var(--gold-dark)] transition-colors">
                            {item}
                        </Link>
                    ))}
                </div>

                <Button
                    variant="primary"
                    className="shadow-[0_4px_14px_0_rgba(212,175,55,0.39)]"
                    onClick={() => setIsLoginOpen(true)}
                >
                    Sign In
                </Button>
            </motion.nav>

            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </>
    );
};
