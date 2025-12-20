"use client";

import { motion } from "framer-motion";
import { ClipboardList, Activity, Clock, Bell, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NurseDashboard() {
    return (
        <div className="min-h-screen bg-gray-50/50 pb-10">
            <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-teal-700 flex items-center gap-2">
                    <span className="p-2 bg-teal-100 rounded-lg"><Activity size={20} /></span>
                    Nurse Station
                </h1>
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="outline" className="text-xs h-9 flex items-center gap-2">
                            <Home size={16} /> Home
                        </Button>
                    </Link>
                    <Button variant="outline" icon={<Bell size={18} />}>Notifications (3)</Button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vitals Monitor */}
                <section className="lg:col-span-2 space-y-6">
                    <h2 className="font-bold text-lg text-gray-700">Active Monitoring Room</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((bed) => (
                            <motion.div
                                key={bed}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
                                whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold">Bed 0{bed}</h3>
                                        <p className="text-sm text-gray-500">John Doe • Post-Op</p>
                                    </div>
                                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">HR</span>
                                        <span className="font-mono font-bold text-green-600">7{bed} BPM</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">SpO2</span>
                                        <span className="font-mono font-bold text-blue-600">98%</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t flex gap-2">
                                    <button className="flex-1 text-xs bg-gray-100 py-2 rounded hover:bg-gray-200">View Vitals</button>
                                    <button className="flex-1 text-xs bg-red-50 text-red-600 py-2 rounded hover:bg-red-100">Alert Doc</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Task List / Triage */}
                <aside className="bg-white p-6 rounded-2xl shadow-sm h-fit">
                    <h2 className="font-bold text-lg text-gray-700 mb-4 flex items-center gap-2">
                        <ClipboardList /> Triage Tasks
                    </h2>
                    <div className="space-y-3">
                        {[
                            { task: "Verify Rx for Bed 03", priority: "High", color: "bg-red-100 text-red-700" },
                            { task: "Patient Intake - Ward A", priority: "Medium", color: "bg-yellow-100 text-yellow-700" },
                            { task: "Update Ward Inventory", priority: "Low", color: "bg-gray-100 text-gray-700" },
                        ].map((t, i) => (
                            <div key={i} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                    <span className="text-sm font-medium">{t.task}</span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${t.color}`}>{t.priority}</span>
                            </div>
                        ))}
                    </div>
                    <Button variant="primary" className="w-full mt-6 text-sm">Add Task</Button>
                </aside>
            </main>
        </div>
    );
}
