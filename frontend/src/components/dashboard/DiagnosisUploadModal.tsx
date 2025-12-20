"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle, AlertTriangle, Loader2, FileImage } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface DiagnosisUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    modelType: string | null; // "Brain Tumor", "Pneumonia", etc.
}

export const DiagnosisUploadModal = ({ isOpen, onClose, modelType }: DiagnosisUploadModalProps) => {
    const [step, setStep] = useState<"upload" | "scanning" | "result">("upload");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [result, setResult] = useState<{ status: "Normal" | "Detected"; confidence: number; message: string } | null>(null);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setStep("upload");
            setSelectedFile(null);
            setResult(null);
        }
    }, [isOpen]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleAnalyze = () => {
        if (!selectedFile) return;
        setStep("scanning");

        // Simulate API delay
        setTimeout(() => {
            // Mock Logic: Randomly determine result for demo
            const isAbnormal = Math.random() > 0.7; // 30% chance of detection
            setResult({
                status: isAbnormal ? "Detected" : "Normal",
                confidence: Number((85 + Math.random() * 14).toFixed(1)),
                message: isAbnormal
                    ? `Potential signs of ${modelType} detected. Please consult a specialist immediately.`
                    : `No evidence of ${modelType} detected in this scan.`
            });
            setStep("result");
        }, 3000);
    };

    if (!isOpen || !modelType) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[80] flex items-center justify-center p-4"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed z-[90] w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">AI Analysis: {modelType}</h3>
                            <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-gray-700" /></button>
                        </div>

                        <div className="p-6">
                            {/* STEP 1: UPLOAD */}
                            {step === "upload" && (
                                <div className="space-y-6">
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleFileSelect}
                                        />
                                        {selectedFile ? (
                                            <>
                                                <FileImage size={40} className="text-blue-500 mb-2" />
                                                <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
                                                <p className="text-xs text-gray-400">Click to change</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={40} className="text-gray-400 mb-2" />
                                                <p className="text-sm font-medium text-gray-700">Upload {modelType} Scan/Image</p>
                                                <p className="text-xs text-gray-400">JPG, PNG, DICOM supported</p>
                                            </>
                                        )}
                                    </div>
                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        disabled={!selectedFile}
                                        onClick={handleAnalyze}
                                    >
                                        Run Diagnosis
                                    </Button>
                                </div>
                            )}

                            {/* STEP 2: SCANNING */}
                            {step === "scanning" && (
                                <div className="flex flex-col items-center justify-center py-8">
                                    <div className="relative">
                                        <div className="w-20 h-20 border-4 border-[var(--gold-light)] border-t-[var(--gold-primary)] rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="animate-pulse text-[var(--gold-dark)]" />
                                        </div>
                                    </div>
                                    <p className="mt-6 text-lg font-bold text-gray-700">Analyzing Image...</p>
                                    <p className="text-sm text-gray-500">Running CNN Model v4.2</p>
                                </div>
                            )}

                            {/* STEP 3: RESULT */}
                            {step === "result" && result && (
                                <div className="text-center space-y-4">
                                    <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${result.status === 'Detected' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {result.status === 'Detected' ? <AlertTriangle size={36} /> : <CheckCircle size={36} />}
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                                            {result.status === 'Detected' ? 'Abnormality Detected' : 'No Anomalies Found'}
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">Confidence Score: <span className="font-mono font-bold">{result.confidence}%</span></p>
                                    </div>

                                    <div className={`p-4 rounded-xl text-sm text-left ${result.status === 'Detected' ? 'bg-red-50 border border-red-100 text-red-800' : 'bg-green-50 border border-green-100 text-green-800'}`}>
                                        <strong>Interpretation:</strong> {result.message}
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
                                        {result.status === 'Detected' && (
                                            <Button variant="primary" className="flex-1">Consult Doctor</Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
