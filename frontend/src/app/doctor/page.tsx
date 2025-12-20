"use client";

import { motion } from "framer-motion";
import { Users, Calendar, AlertTriangle, FileText, Activity, Video, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Mock Data for Doctor's Queue
const upcomingAppointments = [
    {
        id: 1,
        patient: "Prathmesh Tiwari",
        time: "10:00 AM",
        type: "Video Consult",
        symptoms: "High Fever, dry cough (3 days)",
        aiRiskScore: "High",
        riskColor: "bg-red-100 text-red-700",
        summary: "Patient timeline shows progressively worsening cough. Acoustic analysis detected potential bronchitis markers.",
        status: "Waiting"
    },
    {
        id: 2,
        patient: "Anjali Mehta",
        time: "10:30 AM",
        type: "Offline Review",
        symptoms: "Migraine",
        aiRiskScore: "Low",
        riskColor: "bg-green-100 text-green-700",
        summary: "Recurring headache. BP history normal. Requesting update on prescription.",
        status: "Pending Review"
    }
];

export default function DoctorDashboard() {
    return (
        <div className="min-h-screen bg-[var(--bg-warm)] pb-10">
            {/* Top Bar */}
            <nav className="glass-panel sticky top-0 z-40 px-8 py-4 flex justify-between items-center mb-8 mx-4 mt-2">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">Dr</span>
                    Dr. Sharma <span className="text-sm font-normal text-[var(--text-secondary)]">| Cardiology</span>
                </h1>
                <div className="flex gap-4">
                    <Link href="/">
                        <Button variant="secondary" className="h-8 px-3 text-xs flex items-center gap-2">
                            <Home size={14} /> Home
                        </Button>
                    </Link>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center">● Use Status: Online</span>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 space-y-6">
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: "Today&apos;s Patients", val: "12", icon: <Users /> },
                        { label: "Pending Reports", val: "4", icon: <FileText /> },
                        { label: "Critical Alerts", val: "2", icon: <AlertTriangle className="text-red-500" /> },
                        { label: "Avg Consult Time", val: "14m", icon: <Activity /> },
                    ].map((stat, i) => (
                        <div key={i} className="glass-panel p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
                                <h3 className="text-2xl font-bold">{stat.val}</h3>
                            </div>
                            <div className="text-[var(--gold-dark)]">{stat.icon}</div>
                        </div>
                    ))}
                </div>

                <h2 className="text-2xl font-bold mb-4">Patient Queue & AI Insights</h2>

                <div className="space-y-4">
                    {upcomingAppointments.map((appt) => (
                        <motion.div
                            key={appt.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="glass-panel p-6 border-l-4 border-l-[var(--gold-primary)]"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                {/* Patient Basic Info */}
                                <div className="min-w-[200px]">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-bold">{appt.patient}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded ${appt.riskColor} font-bold`}>Risk: {appt.aiRiskScore}</span>
                                    </div>
                                    <p className="text-sm flex items-center gap-2 text-[var(--text-secondary)]">
                                        <Calendar size={14} /> {appt.time} • {appt.type}
                                    </p>
                                    <div className="mt-2 text-sm font-medium text-gray-700">
                                        Complaint: {appt.symptoms}
                                    </div>
                                </div>

                                {/* AI Pre-Consult Summary */}
                                <div className="flex-1 bg-white/50 p-4 rounded-xl border border-dashed border-gray-300">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--gold-dark)] mb-2 flex items-center gap-1">
                                        <FileText size={12} /> AI Pre-Consult Summary
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {appt.summary}
                                    </p>
                                    {appt.aiRiskScore === 'High' && (
                                        <div className="mt-2 flex gap-2">
                                            <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100">🚩 Outbreak Zone Detected</span>
                                            <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-100">⚠️ Abnormal Acoustic Sign</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col justify-center gap-2 min-w-[140px]">
                                    <Button variant="primary" className="w-full text-sm h-10" icon={<Video size={16} />}>Start Consult</Button>
                                    <Button variant="secondary" className="w-full text-sm h-10">View History</Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
