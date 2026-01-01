"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { Video, Mic, MicOff, Camera, CameraOff, PhoneOff, FileText, User, Activity, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useWebRTC } from "@/hooks/useWebRTC";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// Placeholder data structure to be populated from params/API
const DEFAULT_SUMMARY = {
    name: "Patient",
    age: 45,
    gender: "Male",
    complaint: "Consultation Request",
    history: "Loading history...",
    vitals: {
        bp: "--/--",
        hr: "-- bpm",
        temp: "--°F",
        spo2: "--%"
    },
    aiAnalysis: {
        risk: "Low",
        notes: "No AI analysis provided."
    },
    lastVisit: new Date().toLocaleDateString()
};

function ConsultationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);

    // Derive patient data from URL params
    const patientData = {
        ...DEFAULT_SUMMARY,
        name: searchParams.get('patientName') || DEFAULT_SUMMARY.name,
        aiAnalysis: {
            risk: searchParams.get('risk') || DEFAULT_SUMMARY.aiAnalysis.risk,
            notes: searchParams.get('summary') || DEFAULT_SUMMARY.aiAnalysis.notes
        }
    };

    // Hardcoded room for prototype
    const roomId = "consultation-room-1";

    const {
        localStream,
        remoteStream,
        startLocalStream,
        toggleAudio,
        toggleVideo,
    } = useWebRTC(roomId);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        startLocalStream();
    }, []);

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const handleMicToggle = () => {
        setMicOn(!micOn);
        toggleAudio(!micOn);
    };

    const handleCameraToggle = () => {
        setCameraOn(!cameraOn);
        toggleVideo(!cameraOn);
    };

    const handleEndCall = () => {
        // Cleanup would normally happen here
        router.push('/doctor');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row h-screen overflow-hidden">

            {/* Main Video Area - Takes up 70% width on Desktop */}
            <div className="flex-1 bg-gray-900 relative flex flex-col items-center justify-center p-4">
                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent z-10 flex justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                            {patientData.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight">{patientData.name}</h2>
                            <p className="text-xs opacity-70 flex items-center gap-1"><Clock size={12} /> 00:00:00 (Connecting...)</p>
                        </div>
                    </div>
                    <div className="bg-red-500/20 text-red-100 px-3 py-1 rounded-full text-xs font-bold border border-red-500/50 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> REC
                    </div>
                </div>

                {/* Video Grid */}
                <div className="relative w-full h-full max-h-[800px] flex items-center justify-center">

                    {/* Remote Video (Patient) */}
                    <div className="w-full h-full bg-black rounded-xl overflow-hidden relative shadow-2xl">
                        {remoteStream ? (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40">
                                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-4 animate-pulse">
                                    <User size={48} />
                                </div>
                                <p className="text-lg font-medium">Waiting for {patientData.name}...</p>
                                <p className="text-sm">Room ID: {roomId}</p>
                            </div>
                        )}
                    </div>

                    {/* Local Video (Doctor PIP) */}
                    <motion.div
                        drag
                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }} // Simplified drag constraints
                        className="absolute bottom-24 right-6 w-48 shadow-2xl border-2 border-white/20 rounded-xl overflow-hidden bg-gray-800 cursor-move"
                        style={{ aspectRatio: '16/9' }}
                    >
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform -scale-x-100"
                        />
                        {!cameraOn && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-white/50">
                                <CameraOff size={20} />
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Control Bar */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                    <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/10 flex gap-4 shadow-xl">
                        <button
                            onClick={handleMicToggle}
                            className={`p-4 rounded-full transition-all ${micOn ? 'bg-gray-100/20 text-white hover:bg-gray-100/30' : 'bg-red-500 text-white hover:bg-red-600'}`}
                        >
                            {micOn ? <Mic /> : <MicOff />}
                        </button>

                        <button
                            onClick={handleCameraToggle}
                            className={`p-4 rounded-full transition-all ${cameraOn ? 'bg-gray-100/20 text-white hover:bg-gray-100/30' : 'bg-red-500 text-white hover:bg-red-600'}`}
                        >
                            {cameraOn ? <Camera /> : <CameraOff />}
                        </button>

                        <button
                            onClick={handleEndCall}
                            className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-lg hover:scale-105 transition-all w-16"
                        >
                            <PhoneOff />
                        </button>
                    </div>
                </div>
            </div>

            {/* Sidebar - Patient Details (30% Width) */}
            <div className="w-full md:w-[400px] bg-white border-l border-gray-200 overflow-y-auto flex flex-col h-full shadow-xl z-20">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-1">
                        <FileText className="text-[var(--gold-primary)]" size={20} /> Patient Summary
                    </h3>
                    <p className="text-sm text-gray-500">Real-time consultation overview</p>
                </div>

                <div className="p-6 space-y-8">
                    {/* Key Vitals */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <p className="text-xs text-blue-600 font-bold uppercase mb-1">Blood Pressure</p>
                            <p className="text-xl font-bold text-gray-800">{patientData.vitals.bp}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-xl border border-red-100">
                            <p className="text-xs text-red-600 font-bold uppercase mb-1">Heart Rate</p>
                            <p className="text-xl font-bold text-gray-800">{patientData.vitals.hr}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                            <p className="text-xs text-orange-600 font-bold uppercase mb-1">Temp</p>
                            <p className="text-xl font-bold text-gray-800">{patientData.vitals.temp}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                            <p className="text-xs text-green-600 font-bold uppercase mb-1">SpO2</p>
                            <p className="text-xl font-bold text-gray-800">{patientData.vitals.spo2}</p>
                        </div>
                    </div>

                    {/* Complaint & History */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Activity size={16} className="text-gray-400" /> Current Symptoms
                            </h4>
                            <p className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 text-gray-700 leading-relaxed">
                                {patientData.complaint}
                            </p>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Clock size={16} className="text-gray-400" /> Medical History
                            </h4>
                            <p className="text-sm text-gray-600">
                                {patientData.history}
                            </p>
                        </div>
                    </div>

                    {/* AI Insights */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                        <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                            <BrainIcon size={16} /> AI Assistant Analysis
                        </h4>
                        <p className="text-sm text-indigo-800/80 mb-3">
                            {patientData.aiAnalysis.notes}
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-indigo-500 uppercase">Risk Level:</span>
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200 font-bold">
                                {patientData.aiAnalysis.risk}
                            </span>
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-bold mb-3">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="text-xs justify-start h-10 px-3">
                                Prescribe Meds
                            </Button>
                            <Button variant="outline" className="text-xs justify-start h-10 px-3">
                                Order Lab Tests
                            </Button>
                            <Button variant="outline" className="text-xs justify-start h-10 px-3">
                                View Full EMR
                            </Button>
                            <Button variant="outline" className="text-xs justify-start h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                Report Issue
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DoctorConsultationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading consultation data...</div>}>
            <ConsultationContent />
        </Suspense>
    );
}

// Icon helper
function BrainIcon({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
            <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
            <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
            <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
            <path d="M6 18a4 4 0 0 1-1.938-1.5" />
            <path d="M18 18a4 4 0 0 0 1.938-1.5" />
        </svg>
    )
}
