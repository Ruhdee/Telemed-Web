"use client";

import { motion } from "framer-motion";
import {
    Home, Stethoscope, FileText, Pill,
    Video, Mic, MessageSquare, MapPin,
    Settings, LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Chatbot } from "@/components/features/Chatbot";
import { EmergencySOS } from "@/components/dashboard/EmergencySOS";


const navItems = [
    { icon: <Home size={20} />, label: "Back to Home", href: "/" },
    { icon: <Stethoscope size={20} />, label: "Overview", href: "/dashboard" },
    { icon: <Video size={20} />, label: "Consultation", href: "/dashboard/consultation" },
    { icon: <Mic size={20} />, label: "AI Diagnosis", href: "/dashboard/ai-diagnosis" },
    { icon: <FileText size={20} />, label: "Records & OCR", href: "/dashboard/records" },
    { icon: <Pill size={20} />, label: "Pharmacy", href: "/dashboard/pharmacy" },
    { icon: <MapPin size={20} />, label: "Find Hospitals", href: "/dashboard/map" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen pt-20 px-4 md:px-8 pb-8 gap-6 flex-col lg:flex-row">
            {/* Mobile Header for Dashboard */}
            <div className="lg:hidden flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Patient Portal</h2>
                <Link href="/">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-sm text-sm font-medium text-[var(--text-secondary)]">
                        <Home size={16} /> Home
                    </div>
                </Link>
            </div>

            <motion.aside
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-64 hidden lg:flex flex-col glass-panel p-4 h-[calc(100vh-120px)] sticky top-24"
            >
                <div className="mb-8 px-4">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gold-dark)] to-[var(--gold-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                        Patient Portal
                    </h2>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer
                  ${isActive
                                        ? "bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-dark)] text-white shadow-lg"
                                        : "hover:bg-white/50 text-[var(--text-secondary)]"}
                `}>
                                    {item.icon}
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto pt-4 border-t border-[var(--gold-primary)]/20">
                    <div className="flex items-center gap-3 px-4 py-2 text-[var(--text-secondary)] hover:text-red-500 cursor-pointer transition-colors">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </div>
                </div>
            </motion.aside>

            <motion.main
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 p-4 lg:p-8 overflow-y-auto"
            >
                <EmergencySOS />
                {children}
            </motion.main>
        </div>
    );
}
