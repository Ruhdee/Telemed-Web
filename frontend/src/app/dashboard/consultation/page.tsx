"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Video, Mic, MicOff, Camera, CameraOff, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useWebRTC } from "@/hooks/useWebRTC";

export default function ConsultationPage() {
    const [mode, setMode] = useState<'live' | 'offline'>('live');
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);

    // Hardcoded room for now - in production this would come from params or prop
    const roomId = "consultation-room-1";

    const {
        localStream,
        remoteStream,
        startLocalStream,
        toggleAudio,
        toggleVideo,
        peerId
    } = useWebRTC(roomId);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (mode === 'live') {
            startLocalStream();
        }
    }, [mode]);

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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tele-Consultation</h1>
                <div className="flex bg-white/50 p-1 rounded-xl">
                    <button
                        onClick={() => setMode('live')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'live' ? 'bg-[var(--gold-primary)] text-white shadow-md' : 'text-[var(--text-secondary)]'}`}
                    >
                        Live Video
                    </button>
                    <button
                        onClick={() => setMode('offline')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'offline' ? 'bg-[var(--gold-primary)] text-white shadow-md' : 'text-[var(--text-secondary)]'}`}
                    >
                        Offline / Async
                    </button>
                </div>
            </div>

            {mode === 'live' ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center min-h-[500px] glass-panel p-8"
                >
                    <div className="w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl relative overflow-hidden shadow-2xl flex items-center justify-center">

                        {/* Remote Video (Main) */}
                        {remoteStream ? (
                            <video
                                ref={remoteVideoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-center text-white/50">
                                <Video size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Waiting for Doctor...</p>
                                <p className="text-xs mt-2">Room ID: {roomId}</p>
                            </div>
                        )}

                        {/* Local Video (PIP) */}
                        <div className="absolute top-4 right-4 w-48 aspect-video bg-black/50 rounded-xl overflow-hidden border border-white/20 shadow-lg">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover transform -scale-x-100"
                            />
                            {!cameraOn && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white/50">
                                    <CameraOff size={20} />
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                            <button
                                onClick={handleMicToggle}
                                className={`p-4 rounded-full backdrop-blur text-white hover:bg-gray-600 transition-colors ${micOn ? 'bg-gray-700/50' : 'bg-red-500/80 hover:bg-red-600'}`}
                            >
                                {micOn ? <Mic /> : <MicOff />}
                            </button>

                            <button className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg hover:scroll-m-1">
                                <PhoneOff />
                            </button>

                            <button
                                onClick={handleCameraToggle}
                                className={`p-4 rounded-full backdrop-blur text-white hover:bg-gray-600 transition-colors ${cameraOn ? 'bg-gray-700/50' : 'bg-red-500/80 hover:bg-red-600'}`}
                            >
                                {cameraOn ? <Camera /> : <CameraOff />}
                            </button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-2xl mx-auto glass-panel p-8"
                >
                    <h2 className="text-xl font-bold mb-4">Offline Symptom Report</h2>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">Answer a quick questionnaire and record a 10s video. A doctor will review this and prescribe meds.</p>

                    <div className="space-y-4 mb-8">
                        <input className="w-full p-4 rounded-xl bg-white/50 border border-transparent focus:border-[var(--gold-primary)] outline-none" placeholder="Chief Complaint (e.g., Fever, Headache)" />
                        <textarea className="w-full p-4 rounded-xl bg-white/50 border border-transparent focus:border-[var(--gold-primary)] outline-none h-32" placeholder="Describe your symptoms in detail..." />
                    </div>

                    <div className="border-2 border-dashed border-[var(--gold-primary)] rounded-xl p-8 text-center cursor-pointer hover:bg-[var(--gold-light)]/10 transition-colors">
                        <Video size={32} className="mx-auto text-[var(--gold-dark)] mb-2" />
                        <span className="font-semibold text-[var(--gold-dark)]">Record 10s Video</span>
                    </div>

                    <Button variant="primary" className="w-full mt-8 justify-center">Submit Report</Button>
                </motion.div>
            )}
        </div>
    );
}
