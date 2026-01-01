"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Video, Mic, MicOff, Camera, CameraOff, PhoneOff, Upload, Wifi, WifiOff, CheckCircle, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useOfflineConsultation } from "@/hooks/useOfflineConsultation";

export default function ConsultationPage() {
    const [mode, setMode] = useState<'live' | 'offline'>('live');
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);

    // Offline mode states
    const [chiefComplaint, setChiefComplaint] = useState('');
    const [symptomsDescription, setSymptomsDescription] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

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

    const {
        isRecording,
        recordingDuration,
        recordedVideoBlob,
        capturedPhotoBlob,
        mediaStream,
        startRecording,
        stopRecording,
        capturePhoto,
        clearRecording,
        clearPhoto,
        submitOfflineConsultation,
        isOnline,
        pendingUploadsCount,
        isSyncing,
        syncNow,
        error: offlineError
    } = useOfflineConsultation();

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

    const handleSubmitOffline = async () => {
        try {
            await submitOfflineConsultation(chiefComplaint, symptomsDescription);
            setSubmitSuccess(true);
            setChiefComplaint('');
            setSymptomsDescription('');
            
            setTimeout(() => setSubmitSuccess(false), 3000);
        } catch (err) {
            console.error('Submit error:', err);
        }
    };

    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const recordingVideoRef = useRef<HTMLVideoElement>(null);

    // Update video preview when recording
    useEffect(() => {
        if (recordingVideoRef.current && mediaStream) {
            recordingVideoRef.current.srcObject = mediaStream;
        }
    }, [mediaStream]);

    // Update video preview for recorded blob
    useEffect(() => {
        if (videoPreviewRef.current && recordedVideoBlob) {
            const url = URL.createObjectURL(recordedVideoBlob);
            videoPreviewRef.current.src = url;
            return () => URL.revokeObjectURL(url);
        }
    }, [recordedVideoBlob]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Tele-Consultation</h1>
                <div className="flex items-center gap-4">
                    {/* Online/Offline Indicator */}
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/50">
                        {isOnline ? (
                            <>
                                <Wifi size={16} className="text-green-600" />
                                <span className="text-xs text-green-600">Online</span>
                            </>
                        ) : (
                            <>
                                <WifiOff size={16} className="text-red-600" />
                                <span className="text-xs text-red-600">Offline</span>
                            </>
                        )}
                    </div>

                    {/* Pending Uploads Badge */}
                    {pendingUploadsCount > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100">
                            <Upload size={16} className="text-orange-600" />
                            <span className="text-xs text-orange-600">{pendingUploadsCount} pending</span>
                            {isSyncing && <span className="text-xs text-orange-600">Syncing...</span>}
                        </div>
                    )}

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
                    <p className="text-sm text-[var(--text-secondary)] mb-6">Answer a quick questionnaire and record a 10s video or take a photo. A doctor will review this and prescribe meds.</p>

                    {/* Success Message */}
                    {submitSuccess && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-xl flex items-center gap-2">
                            <CheckCircle className="text-green-600" size={20} />
                            <span className="text-green-700">Consultation saved! Will be uploaded when online.</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {offlineError && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-xl flex items-center gap-2">
                            <AlertCircle className="text-red-600" size={20} />
                            <span className="text-red-700">{offlineError}</span>
                        </div>
                    )}

                    <div className="space-y-4 mb-8">
                        <input 
                            className="w-full p-4 rounded-xl bg-white/50 border border-transparent focus:border-[var(--gold-primary)] outline-none" 
                            placeholder="Chief Complaint (e.g., Fever, Headache)"
                            value={chiefComplaint}
                            onChange={(e) => setChiefComplaint(e.target.value)}
                        />
                        <textarea 
                            className="w-full p-4 rounded-xl bg-white/50 border border-transparent focus:border-[var(--gold-primary)] outline-none h-32" 
                            placeholder="Describe your symptoms in detail..."
                            value={symptomsDescription}
                            onChange={(e) => setSymptomsDescription(e.target.value)}
                        />
                    </div>

                    {/* Video Recording Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Video Recording (10 seconds)</h3>
                        
                        {!isRecording && !recordedVideoBlob && (
                            <div 
                                onClick={startRecording}
                                className="border-2 border-dashed border-[var(--gold-primary)] rounded-xl p-8 text-center cursor-pointer hover:bg-[var(--gold-light)]/10 transition-colors"
                            >
                                <Video size={32} className="mx-auto text-[var(--gold-dark)] mb-2" />
                                <span className="font-semibold text-[var(--gold-dark)]">Start Recording</span>
                            </div>
                        )}

                        {isRecording && (
                            <div className="border-2 border-red-500 rounded-xl p-4 bg-black">
                                <video
                                    ref={recordingVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full rounded-lg mb-3"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-white font-semibold">Recording: {recordingDuration}s / 10s</span>
                                    </div>
                                    <Button onClick={stopRecording} variant="secondary" className="text-sm">
                                        Stop Recording
                                    </Button>
                                </div>
                            </div>
                        )}

                        {recordedVideoBlob && (
                            <div className="border-2 border-green-500 rounded-xl p-4 bg-gray-900">
                                <video
                                    ref={videoPreviewRef}
                                    controls
                                    className="w-full rounded-lg mb-3"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="text-green-500" size={20} />
                                        <span className="text-white">Video recorded successfully</span>
                                    </div>
                                    <Button onClick={clearRecording} variant="secondary" className="text-sm flex items-center gap-2">
                                        <Trash2 size={16} />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Photo Capture Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Or Take a Photo</h3>
                        
                        {!capturedPhotoBlob && (
                            <div 
                                onClick={capturePhoto}
                                className="border-2 border-dashed border-[var(--gold-primary)] rounded-xl p-8 text-center cursor-pointer hover:bg-[var(--gold-light)]/10 transition-colors"
                            >
                                <Camera size={32} className="mx-auto text-[var(--gold-dark)] mb-2" />
                                <span className="font-semibold text-[var(--gold-dark)]">Capture Photo</span>
                            </div>
                        )}

                        {capturedPhotoBlob && (
                            <div className="border-2 border-green-500 rounded-xl p-4">
                                <img 
                                    src={URL.createObjectURL(capturedPhotoBlob)} 
                                    alt="Captured symptom" 
                                    className="w-full rounded-lg mb-3"
                                />
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="text-green-500" size={20} />
                                        <span className="text-gray-700">Photo captured successfully</span>
                                    </div>
                                    <Button onClick={clearPhoto} variant="secondary" className="text-sm flex items-center gap-2">
                                        <Trash2 size={16} />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    <Button 
                        onClick={handleSubmitOffline}
                        disabled={!chiefComplaint || !symptomsDescription || (!recordedVideoBlob && !capturedPhotoBlob)}
                        variant="primary" 
                        className="w-full mt-8 justify-center"
                    >
                        Submit Report
                    </Button>

                    {!isOnline && (
                        <p className="text-center text-sm text-orange-600 mt-4">
                            You are offline. Report will be uploaded automatically when connection is restored.
                        </p>
                    )}
                </motion.div>
            )}
        </div>
    );
}
