"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Activity, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { diseaseModels, DiseaseConfig } from "@/data/diseaseConfig";

export default function DiseasePredictionPage() {
    const params = useParams();
    const router = useRouter();
    const [config, setConfig] = useState<DiseaseConfig | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (params.id) {
            const disease = diseaseModels.find(d => d.id === params.id);
            if (disease) {
                setConfig(disease);
                // Initialize default values
                if (disease.type === 'tabular') {
                    const defaults: Record<string, any> = {};
                    disease.inputs?.forEach(input => {
                        defaults[input.key] = input.type === 'select' ? input.options?.[0]?.value :
                            input.type === 'number' ? '' : ''; // Empty string for number to allow input
                    });
                    setFormData(defaults);
                }
            }
        }
    }, [params.id]);

    const handleInputChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            // Clear previous results/errors when new file selected
            setResult(null);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!config) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        const API_BASE_URL = "http://localhost:5001"; // Backend URL

        try {
            let response;

            if (config.type === 'tabular') {
                response = await fetch(`${API_BASE_URL}${config.endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
            } else if (config.type === 'image') {
                if (!file) {
                    throw new Error("Please upload an image first.");
                }

                const data = new FormData();
                data.append("image", file); // Must match 'image' key in backend multer

                response = await fetch(`${API_BASE_URL}${config.endpoint}`, {
                    method: 'POST',
                    body: data,
                });
            }

            if (!response) throw new Error("Request failed to initialize");

            const resultData = await response.json();

            if (!response.ok) {
                // Try to extract error message from backend
                const errorMessage = resultData.error || resultData.details || "Prediction failed";
                throw new Error(errorMessage);
            }

            // Success
            setResult(resultData);

        } catch (err: any) {
            console.error("Prediction Error:", err);
            setError(err.message || "An unexpected error occurred during analysis.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!config) {
        return <div className="p-8 text-center text-gray-500">Loading disease configuration...</div>;
    }

    const Icon = config.icon;

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <Button
                variant="outline"
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-2"
            >
                <ArrowLeft size={16} /> Back to Analysis
            </Button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="glass-panel p-6 flex items-center gap-6">
                    <div className="w-16 h-16 bg-[var(--gold-primary)]/10 rounded-2xl flex items-center justify-center shrink-0">
                        <Icon className="text-[var(--gold-dark)]" size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{config.name}</h1>
                        <p className="text-[var(--text-secondary)]">{config.description}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="md:col-span-2 glass-panel p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {config.type === 'tabular' && (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {config.inputs?.map((input) => (
                                        <div key={input.key} className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">
                                                {input.label}
                                            </label>

                                            {input.type === 'select' ? (
                                                <select
                                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--gold-primary)]/50 outline-none bg-white"
                                                    value={formData[input.key] || ''}
                                                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                                                >
                                                    {input.options?.map(opt => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={input.type}
                                                    placeholder={input.placeholder}
                                                    min={input.min}
                                                    max={input.max}
                                                    step={input.step}
                                                    className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--gold-primary)]/50 outline-none"
                                                    value={formData[input.key] || ''}
                                                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                                                    required
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {config.type === 'image' && (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-white transition-colors">
                                    <input
                                        type="file"
                                        id="image-upload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        required={!file} // Only required if no file selected yet
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                                            <Upload className="text-blue-500" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {file ? file.name : "Click to Upload Image"}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Supports JPG, PNG, JPEG
                                            </p>
                                        </div>
                                    </label>

                                    {file && (
                                        <div className="mt-4">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Preview"
                                                className="max-h-48 mx-auto rounded-lg shadow-sm"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="mt-2 text-red-500 hover:text-red-700 h-8 text-sm"
                                                onClick={() => setFile(null)}
                                            >
                                                Remove Image
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-4">
                                <Button
                                    className="w-full justify-center text-lg py-6"
                                    disabled={isLoading || (config.type === 'image' && !file)}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="animate-spin mr-2" /> Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Activity className="mr-2" /> Run Analysis
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Results Section */}
                    <div className="md:col-span-1">
                        {!result && !error && (
                            <div className="glass-panel p-6 h-full flex flex-col items-center justify-center text-center text-gray-400">
                                <Activity size={48} className="mb-4 opacity-20" />
                                <p>Fill out the form and run analysis to see results here.</p>
                            </div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-panel p-6 h-full border-l-4 border-red-500"
                            >
                                <div className="flex items-center gap-2 text-red-600 font-bold mb-4">
                                    <AlertCircle /> Analysis Error
                                </div>
                                <p className="text-gray-600 break-words">{error}</p>
                            </motion.div>
                        )}

                        {result && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-panel p-6 h-full border-l-4 border-[var(--gold-primary)]"
                            >
                                <div className="flex items-center gap-2 text-[var(--gold-dark)] font-bold mb-4">
                                    <CheckCircle /> Analysis Complete
                                </div>

                                {/* Dynamic Result Rendering */}
                                <div className="space-y-4">
                                    {/* Handle various response formats from different models */}
                                    {result.prediction && (
                                        <div>
                                            <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Prediction</div>
                                            <div className="text-2xl font-bold text-gray-900">{result.prediction}</div>
                                        </div>
                                    )}

                                    {result.confidence && (
                                        <div>
                                            <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Confidence</div>
                                            <div className="text-xl font-bold text-gray-900">
                                                {typeof result.confidence === 'number'
                                                    ? (result.confidence < 1 ? (result.confidence * 100).toFixed(1) + '%' : result.confidence + '%')
                                                    : result.confidence}
                                            </div>
                                        </div>
                                    )}

                                    {/* Fallback for simple string responses or unstructured data */}
                                    {Object.keys(result).map((key) => {
                                        if (key === 'prediction' || key === 'confidence' || key === 'success' || key === 'error') return null;
                                        return (
                                            <div key={key}>
                                                <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">{key.replace(/_/g, ' ')}</div>
                                                <div className="text-lg font-medium text-gray-800 break-words">
                                                    {typeof result[key] === 'object' ? JSON.stringify(result[key]) : result[key]}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
