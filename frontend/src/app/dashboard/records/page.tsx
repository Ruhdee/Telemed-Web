"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Scan, CheckCircle, AlertCircle, Loader2, Pill, Clock, Calendar, User, Info, TestTube } from "lucide-react";

interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
}

interface Test {
    name: string;
    value: string;
    unit: string;
    reference_range: string;
    status?: string;
}

interface ExtractedData {
    data: {
        patient_name?: string;
        medications?: Medication[];
        tests?: Test[];
    };
    timestamp: number;
    modelUsed: string;
    error?: string;
}

export default function RecordsPage() {
    const [activeTab, setActiveTab] = useState('prescriptions');
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<ExtractedData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
    const [extractedReports, setExtractedReports] = useState<ExtractedData[]>([]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        setUploading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('prescription', file);

            const response = await fetch('http://localhost:5000/api/scan-prescription', {
                method: 'POST',
                body: formData,
            });

            const data: ExtractedData = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process image');
            }

            setResult(data);
            setExtractedData(prev => [data, ...prev]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleReportUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        setUploading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('report', file);

            const response = await fetch('http://localhost:5000/api/scan-blood-report', {
                method: 'POST',
                body: formData,
            });

            const data: ExtractedData = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process image');
            }

            setResult(data);
            setExtractedReports(prev => [data, ...prev]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const input = document.getElementById('file-input');
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            input.files = dataTransfer.files;
            handleFileUpload({ target: { files: [file] } });
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Health Records & OCR</h1>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('prescriptions')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'prescriptions'
                            ? 'bg-white text-[var(--gold-dark)] shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    <Pill size={16} />
                    Prescriptions
                </button>
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'reports'
                            ? 'bg-white text-[var(--gold-dark)] shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    <TestTube size={16} />
                    Blood Reports
                </button>
            </div>

            {activeTab === 'prescriptions' ? (
                <>
                    <div
                        className="glass-panel p-10 text-center border-2 border-dashed border-[var(--gold-primary)]/50 bg-[var(--gold-light)]/5 cursor-pointer hover:bg-[var(--gold-light)]/10 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => document.getElementById('file-input').click()}
                    >
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />

                        {uploading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-16 h-16 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-[var(--gold-dark)]"
                            >
                                <Loader2 size={32} />
                            </motion.div>
                        ) : (
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-16 h-16 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-[var(--gold-dark)]"
                            >
                                <Scan size={32} />
                            </motion.div>
                        )}

                        <h2 className="text-xl font-bold mb-2">
                            {uploading ? 'Processing Image...' : 'Scan Prescription'}
                        </h2>
                        <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                            Upload a photo of your prescription. Our System uses advanced OCR to extract medicine names, dosages, and creates reminders automatically.
                        </p>
                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold-dark)] bg-white px-4 py-2 rounded-lg shadow-sm">
                            <Upload size={16} /> Click to Upload or Drag File
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-4 flex items-center gap-3 bg-red-50 border-red-200"
                        >
                            <AlertCircle size={20} className="text-red-600" />
                            <span className="text-red-800">{error}</span>
                        </motion.div>
                    )}

                    {/* Success Message */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-4 flex items-center gap-3 bg-green-50 border-green-200"
                        >
                            <CheckCircle size={20} className="text-green-600" />
                            <span className="text-green-800">Prescription scanned successfully!</span>
                            {/* Data saved to: {result.filename} */}
                        </motion.div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                        {/* Display Extracted Data */}
                        {extractedData.length > 0 ? (
                            extractedData.map((data, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-panel p-6 hover:shadow-lg transition-all"
                                >
                                    <h3 className="font-bold flex items-center gap-2 mb-4">
                                        <FileText size={18} />
                                        Scan #{extractedData.length - index}
                                        <span className="ml-auto text-xs text-[var(--text-secondary)]">
                                            {new Date(data.timestamp).toLocaleString()}
                                        </span>
                                    </h3>

                                    {data.data.medications && data.data.medications.length > 0 ? (
                                        <div className="space-y-6">
                                            {data.data.medications.map((med, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="bg-gradient-to-r from-[var(--gold-light)]/10 to-transparent p-4 rounded-lg border border-[var(--gold-primary)]/20"
                                                >
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className="p-2 bg-[var(--gold-primary)]/10 rounded-full">
                                                            <Pill size={16} className="text-[var(--gold-dark)]" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-lg text-[var(--text-primary)] mb-1">
                                                                {med.name || 'Unknown Medicine'}
                                                            </h4>
                                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1 bg-blue-100 rounded">
                                                                        <Info size={12} className="text-blue-600" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[var(--text-secondary)] text-xs">Dosage</span>
                                                                        <p className="font-medium text-[var(--text-primary)]">{med.dosage || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1 bg-green-100 rounded">
                                                                        <Clock size={12} className="text-green-600" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[var(--text-secondary)] text-xs">Frequency</span>
                                                                        <p className="font-medium text-[var(--text-primary)]">{med.frequency || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1 bg-purple-100 rounded">
                                                                        <Calendar size={12} className="text-purple-600" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[var(--text-secondary)] text-xs">Duration</span>
                                                                        <p className="font-medium text-[var(--text-primary)]">{med.duration || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {med.instructions && (
                                                                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                                                    <div className="flex items-start gap-2">
                                                                        <Info size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                                                                        <div>
                                                                            <span className="text-yellow-800 text-xs font-medium">Special Instructions</span>
                                                                            <p className="text-yellow-700 text-sm mt-1">{med.instructions}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <Pill size={24} className="text-gray-400" />
                                            </div>
                                            <p className="text-[var(--text-secondary)] text-sm">No medications found in the prescription</p>
                                        </div>
                                    )}

                                    {data.data.patient_name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-full">
                                                    <User size={16} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <span className="text-blue-800 text-xs font-medium">Patient Name</span>
                                                    <p className="text-blue-900 font-semibold text-lg">{data.data.patient_name}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}


                                </motion.div>
                            ))
                        ) : (
                            /* Mock Extracted Data - shown only when no real data */
                            <div className="glass-panel p-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                                <h3 className="font-bold flex items-center gap-2 mb-4">
                                    <FileText size={18} /> Recent Scan (Demo)
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between border-b pb-2">
                                        <span>Medicine</span>
                                        <span className="font-medium">Amoxicillin 500mg</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span>Frequency</span>
                                        <span className="font-medium">2x Daily</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span>Duration</span>
                                        <span className="font-medium">5 Days</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div
                        className="glass-panel p-10 text-center border-2 border-dashed border-[var(--gold-primary)]/50 bg-[var(--gold-light)]/5 cursor-pointer hover:bg-[var(--gold-light)]/10 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file) {
                                const input = document.getElementById('report-input');
                                const dataTransfer = new DataTransfer();
                                dataTransfer.items.add(file);
                                input.files = dataTransfer.files;
                                handleReportUpload({ target: { files: [file] } });
                            }
                        }}
                        onClick={() => document.getElementById('report-input').click()}
                    >
                        <input
                            id="report-input"
                            type="file"
                            accept="image/*"
                            onChange={handleReportUpload}
                            className="hidden"
                        />

                        {uploading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                className="w-16 h-16 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-[var(--gold-dark)]"
                            >
                                <Loader2 size={32} />
                            </motion.div>
                        ) : (
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-16 h-16 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center mb-4 text-[var(--gold-dark)]"
                            >
                                <TestTube size={32} />
                            </motion.div>
                        )}

                        <h2 className="text-xl font-bold mb-2">
                            {uploading ? 'Processing Image...' : 'Scan Blood Report'}
                        </h2>
                        <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                            Upload a photo of your blood report. Our system uses advanced OCR to extract test results and values automatically.
                        </p>
                        <div className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--gold-dark)] bg-white px-4 py-2 rounded-lg shadow-sm">
                            <Upload size={16} /> Click to Upload or Drag File
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-4 flex items-center gap-3 bg-red-50 border-red-200"
                        >
                            <AlertCircle size={20} className="text-red-600" />
                            <span className="text-red-800">{error}</span>
                        </motion.div>
                    )}

                    {/* Success Message */}
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-panel p-4 flex items-center gap-3 bg-green-50 border-green-200"
                        >
                            <CheckCircle size={20} className="text-green-600" />
                            <span className="text-green-800">Blood report scanned successfully!</span>
                        </motion.div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                        {/* Display Extracted Reports */}
                        {extractedReports.length > 0 ? (
                            extractedReports.map((data, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-panel p-6 hover:shadow-lg transition-all"
                                >
                                    <h3 className="font-bold flex items-center gap-2 mb-4">
                                        <TestTube size={18} />
                                        Report #{extractedReports.length - index}
                                        <span className="ml-auto text-xs text-[var(--text-secondary)]">
                                            {new Date(data.timestamp).toLocaleString()}
                                        </span>
                                    </h3>

                                    {data.data.tests && data.data.tests.length > 0 ? (
                                        <div className="space-y-4">
                                            {data.data.tests.map((test, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="bg-gradient-to-r from-blue-50/50 to-transparent p-4 rounded-lg border border-blue-200/50"
                                                >
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className="p-2 bg-blue-100 rounded-full">
                                                            <TestTube size={16} className="text-blue-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-semibold text-lg text-[var(--text-primary)] mb-1">
                                                                {test.name || 'Unknown Test'}
                                                            </h4>
                                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1 bg-green-100 rounded">
                                                                        <Info size={12} className="text-green-600" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[var(--text-secondary)] text-xs">Value</span>
                                                                        <p className="font-medium text-[var(--text-primary)]">{test.value || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1 bg-purple-100 rounded">
                                                                        <Clock size={12} className="text-purple-600" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[var(--text-secondary)] text-xs">Unit</span>
                                                                        <p className="font-medium text-[var(--text-primary)]">{test.unit || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <div className="p-1 bg-orange-100 rounded">
                                                                        <Calendar size={12} className="text-orange-600" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-[var(--text-secondary)] text-xs">Reference Range</span>
                                                                        <p className="font-medium text-[var(--text-primary)]">{test.reference_range || 'N/A'}</p>
                                                                    </div>
                                                                </div>
                                                                {test.status && (
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`p-1 rounded ${test.status === 'Normal' ? 'bg-green-100' : test.status === 'High' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                                                                            <CheckCircle size={12} className={test.status === 'Normal' ? 'text-green-600' : test.status === 'High' ? 'text-red-600' : 'text-yellow-600'} />
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-[var(--text-secondary)] text-xs">Status</span>
                                                                            <p className={`font-medium ${test.status === 'Normal' ? 'text-green-700' : test.status === 'High' ? 'text-red-700' : 'text-yellow-700'}`}>{test.status}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                                <TestTube size={24} className="text-gray-400" />
                                            </div>
                                            <p className="text-[var(--text-secondary)] text-sm">No test results found in the blood report</p>
                                        </div>
                                    )}

                                    {data.data.patient_name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-full">
                                                    <User size={16} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <span className="text-blue-800 text-xs font-medium">Patient Name</span>
                                                    <p className="text-blue-900 font-semibold text-lg">{data.data.patient_name}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}


                                </motion.div>
                            ))
                        ) : (
                            /* Mock Extracted Data - shown only when no real data */
                            <div className="glass-panel p-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                                <h3 className="font-bold flex items-center gap-2 mb-4">
                                    <TestTube size={18} /> Recent Report (Demo)
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between border-b pb-2">
                                        <span>Hemoglobin</span>
                                        <span className="font-medium">14.2 g/dL</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span>Blood Sugar</span>
                                        <span className="font-medium">95 mg/dL</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span>Cholesterol</span>
                                        <span className="font-medium">180 mg/dL</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
