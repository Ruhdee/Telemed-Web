"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, FileSearch } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface ARLensModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Initialize Gemini API
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyBYObpz_fIMZgULVeGiHHXiZd9sQimpcsM"; // Fallback for demo if env missing, but prefer env
const genAI = new GoogleGenerativeAI(API_KEY);

export const ARLensModal = ({ isOpen, onClose }: ARLensModalProps) => {
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<{ name: string, dose: string, usage: string } | null>(null);
    const [rawText, setRawText] = useState("");
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Start Camera
    useEffect(() => {
        let stream: MediaStream | null = null;
        if (isOpen) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(s => {
                    stream = s;
                    if (videoRef.current) videoRef.current.srcObject = stream;
                })
                .catch(err => console.error("Camera Error:", err));
        }
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [isOpen]);

    const captureAndAnalyze = async () => {
        if (!videoRef.current || !canvasRef.current || scanning) return;

        setScanning(true);
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            // Processing Resolution
            canvas.width = 800;
            canvas.height = 600;

            // Draw full frame
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Get Base64 string (remove prefix for Gemini)
            const base64Data = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

            // Fallback Logic
            const modelsToTry = ["gemini-flash-latest", "gemini-2.0-flash-exp", "gemini-pro-latest"];
            let success = false;

            for (const modelName of modelsToTry) {
                if (success) break;
                try {
                    console.log(`Attempting Gemini Vision with model: ${modelName}`);
                    const model = genAI.getGenerativeModel({ model: modelName });

                    const prompt = `
                        Analyze this image of a medicine. 
                        Identify the brand name, dosage (strength), and brief usage instructions.
                        Return the result as a STRICT JSON object with keys: "name", "dose", "usage".
                        If no medicine is found, return { "name": "Not Found", "dose": "-", "usage": "Please rescan label" }.
                        Do not use markdown code blocks. Just raw JSON.
                     `;

                    const result = await model.generateContent([
                        prompt,
                        {
                            inlineData: {
                                data: base64Data,
                                mimeType: "image/jpeg",
                            },
                        },
                    ]);

                    const response = await result.response;
                    const text = response.text();
                    setRawText(text);

                    // Safe parsing logic
                    try {
                        const cleanJson = text.replace(/```json|```/g, '').trim();
                        const data = JSON.parse(cleanJson);
                        setResult(data);
                    } catch (e) {
                        console.error("JSON Parse Error", e);
                        setResult({ name: "Analysis Complete", dose: "See details", usage: text.slice(0, 100) });
                    }
                    success = true; // Exit loop if successful

                } catch (err) {
                    console.error(`Gemini Error (${modelName}):`, err);
                    // Continue to next model
                }
            }

            if (!success) {
                setRawText("Failed to connect to AI Vision services. Please verify API Key or try again later.");
            }

            setScanning(false);
        }
    };

    if (!isOpen) return null;

    // Helper to check if dose contains a number
    const showDose = result && /\d/.test(result.dose);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/95 z-[90] flex flex-col"
            >
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20">
                    <span className="text-white font-mono text-sm uppercase tracking-widest bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2">
                        <Sparkles size={16} className="text-blue-400" /> Gemini Vision Lens
                    </span>
                    <button onClick={onClose} className="p-2 bg-black/60 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-colors"><X /></button>
                </div>

                <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gray-900 group">
                    <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Scan Frame - Larger Box as requested */}
                    <motion.div
                        className="w-[500px] h-[300px] border-2 border-white/80 rounded-3xl relative backdrop-blur-[2px] cursor-pointer hover:border-blue-400 transition-colors shadow-2xl overflow-hidden"
                        onClick={captureAndAnalyze}
                    >
                        {/* Corner Markers with Glow */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-500 -ml-1 -mt-1 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-500 -mr-1 -mt-1 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-500 -ml-1 -mb-1 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-500 -mr-1 -mb-1 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>

                        {/* Scanning Laser Line */}
                        {scanning && (
                            <motion.div
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 shadow-[0_0_20px_rgba(96,165,250,1)]"
                            ></motion.div>
                        )}

                        {/* Tap to Scan Hint - High Contrast */}
                        {!scanning && !result && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="bg-black/80 text-white px-6 py-3 rounded-full text-sm font-bold pointer-events-none border border-white/20 shadow-xl backdrop-blur-sm flex items-center gap-2">
                                    <Sparkles size={16} /> Tap to Analyze
                                </span>
                            </div>
                        )}

                        {/* Loading State */}
                        {scanning && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                                <Loader2 className="animate-spin text-white mb-2" size={32} />
                                <span className="text-white font-mono text-xs bg-black/60 px-2 py-1 rounded">Processing with Gemini...</span>
                            </div>
                        )}
                    </motion.div>

                    {/* Result Pop-up */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-10 left-4 right-4 bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl z-30 border border-white/50"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-2xl text-gray-900 flex items-center gap-2">
                                        {result.name}
                                        {/* Only show dose if it contains a number */}
                                        {showDose && (
                                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-bold">{result.dose}</span>
                                        )}
                                    </h3>
                                </div>
                                <Button variant="secondary" className="h-8 text-xs bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={() => { setResult(null); setRawText(""); }}>Reset</Button>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 mb-2">
                                <h4 className="text-xs font-bold text-blue-800 uppercase mb-2 flex items-center gap-1">
                                    <FileSearch size={14} /> Usage Instructions (AI Generated)
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed font-secondary">
                                    {result.usage}
                                </p>
                            </div>

                            <div className="mt-2 text-[10px] text-gray-400 font-mono text-center">
                                Analyzed by Google Gemini 1.5 Flash
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
