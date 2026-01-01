import { useState, useEffect, useRef, useCallback } from 'react';
import {
    saveConsultation,
    getPendingConsultations,
    updateConsultationStatus,
    deleteConsultation,
    getPendingCount,
    type OfflineConsultationData
} from '@/utils/indexedDB';

export interface UseOfflineConsultationReturn {
    // Recording states
    isRecording: boolean;
    recordingDuration: number;
    recordedVideoBlob: Blob | null;
    capturedPhotoBlob: Blob | null;

    // Media stream
    mediaStream: MediaStream | null;

    // Actions
    startRecording: () => Promise<void>;
    stopRecording: () => void;
    capturePhoto: () => Promise<void>;
    clearRecording: () => void;
    clearPhoto: () => void;

    // Submission
    submitOfflineConsultation: (complaint: string, symptoms: string) => Promise<void>;

    // Sync management
    isOnline: boolean;
    pendingUploadsCount: number;
    isSyncing: boolean;
    syncNow: () => Promise<void>;

    // Errors
    error: string | null;
}

const MAX_RECORDING_DURATION = 10; // seconds
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';

export const useOfflineConsultation = (): UseOfflineConsultationReturn => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [recordedVideoBlob, setRecordedVideoBlob] = useState<Blob | null>(null);
    const [capturedPhotoBlob, setCapturedPhotoBlob] = useState<Blob | null>(null);
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [isOnline, setIsOnline] = useState(true);
    const [pendingUploadsCount, setPendingUploadsCount] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
    const videoChunksRef = useRef<Blob[]>([]);

    // Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => {
            console.log('🟢 Browser is ONLINE - attempting sync...');
            setIsOnline(true);
            // Only auto-sync if user is logged in
            const token = localStorage.getItem('token');
            if (token) {
                console.log('✅ Token found - triggering sync');
                setTimeout(() => syncNow(), 500); // Small delay to ensure state is updated
            } else {
                console.log('⚠️ No token - skipping sync');
            }
        };

        const handleOffline = () => {
            console.log('🔴 Browser is OFFLINE');
            setIsOnline(false);
        };

        setIsOnline(navigator.onLine);
        console.log('Initial online status:', navigator.onLine);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Update pending uploads count
    const updatePendingCount = useCallback(async () => {
        try {
            const count = await getPendingCount();
            setPendingUploadsCount(count);
        } catch (err) {
            console.error('Failed to get pending count:', err);
        }
    }, []);

    useEffect(() => {
        updatePendingCount();
    }, [updatePendingCount]);

    // Start video recording
    const startRecording = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            setMediaStream(stream);

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp8,opus'
            });

            videoChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    videoChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(videoChunksRef.current, { type: 'video/webm' });
                setRecordedVideoBlob(blob);

                // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
                setMediaStream(null);
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
            setRecordingDuration(0);

            // Auto-stop after 10 seconds
            recordingTimerRef.current = setInterval(() => {
                setRecordingDuration((prev) => {
                    if (prev >= MAX_RECORDING_DURATION - 1) {
                        stopRecording();
                        return MAX_RECORDING_DURATION;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (err) {
            setError('Failed to access camera/microphone. Please grant permissions.');
            console.error('Recording error:', err);
        }
    };

    // Stop video recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
                recordingTimerRef.current = null;
            }
        }
    };

    // Capture a photo
    const capturePhoto = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });

            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();

            // Wait for video to load
            await new Promise((resolve) => {
                video.onloadedmetadata = resolve;
            });

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                ctx.drawImage(video, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        setCapturedPhotoBlob(blob);
                    }
                }, 'image/jpeg', 0.95);
            }

            // Stop stream
            stream.getTracks().forEach(track => track.stop());
        } catch (err) {
            setError('Failed to capture photo. Please grant camera permissions.');
            console.error('Photo capture error:', err);
        }
    };

    // Clear recorded video
    const clearRecording = () => {
        setRecordedVideoBlob(null);
        setRecordingDuration(0);
        videoChunksRef.current = [];

        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
            setMediaStream(null);
        }
    };

    // Clear captured photo
    const clearPhoto = () => {
        setCapturedPhotoBlob(null);
    };

    // Submit consultation (save to IndexedDB)
    const submitOfflineConsultation = async (chiefComplaint: string, symptomsDescription: string) => {
        try {
            setError(null);

            if (!chiefComplaint || !symptomsDescription) {
                throw new Error('Please fill in all required fields');
            }

            if (!recordedVideoBlob && !capturedPhotoBlob) {
                throw new Error('Please record a video or capture a photo');
            }

            // Get patient ID from localStorage or token
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                throw new Error('Please log in to submit consultation');
            }

            const user = JSON.parse(userStr);
            const patientId = user.id;

            // Save to IndexedDB
            await saveConsultation({
                chiefComplaint,
                symptomsDescription,
                videoBlob: recordedVideoBlob,
                photoBlob: capturedPhotoBlob,
                patientId
            });

            // Clear form
            clearRecording();
            clearPhoto();

            // Update pending count
            await updatePendingCount();

            // Try to sync immediately if online
            if (isOnline) {
                syncNow();
            }

        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to submit consultation';
            setError(errorMsg);
            throw err;
        }
    };

    // Sync pending consultations to backend
    const syncNow = async () => {
        console.log('📤 syncNow called - isSyncing:', isSyncing, 'isOnline:', isOnline);

        if (isSyncing || !isOnline) {
            console.log('⏸️ Sync skipped - already syncing or offline');
            return;
        }

        try {
            setIsSyncing(true);
            setError(null);

            // Check if user is logged in
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('❌ Cannot sync: User not logged in');
                setIsSyncing(false);
                return;
            }

            const pending = await getPendingConsultations();
            console.log('📋 Found pending consultations:', pending.length);

            if (pending.length === 0) {
                console.log('✅ No pending consultations to sync');
                setIsSyncing(false);
                return;
            }

            for (const consultation of pending) {
                try {
                    console.log('🔄 Syncing consultation:', consultation.id);

                    // Mark as syncing
                    await updateConsultationStatus(consultation.id, 'syncing');

                    // Prepare form data
                    const formData = new FormData();
                    formData.append('chiefComplaint', consultation.chiefComplaint);
                    formData.append('symptomsDescription', consultation.symptomsDescription);

                    if (consultation.videoBlob) {
                        console.log('📹 Adding video blob:', consultation.videoBlob.size, 'bytes');
                        formData.append('video', consultation.videoBlob, 'consultation-video.webm');
                    }

                    if (consultation.photoBlob) {
                        console.log('📸 Adding photo blob:', consultation.photoBlob.size, 'bytes');
                        formData.append('photo', consultation.photoBlob, 'consultation-photo.jpg');
                    }

                    // Upload to backend
                    console.log('⬆️ Uploading to:', `${BACKEND_URL}/api/offline-consultation/submit`);
                    const response = await fetch(`${BACKEND_URL}/api/offline-consultation/submit`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        },
                        body: formData
                    });

                    console.log('📡 Response status:', response.status);

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Upload failed');
                    }

                    const result = await response.json();
                    console.log('✅ Upload successful:', result);

                    // Mark as synced and delete from IndexedDB
                    await updateConsultationStatus(consultation.id, 'synced');

                    // Delete after 1 second (for user feedback)
                    setTimeout(async () => {
                        await deleteConsultation(consultation.id);
                        await updatePendingCount();
                        console.log('🗑️ Deleted synced consultation:', consultation.id);
                    }, 1000);

                } catch (err) {
                    console.error('❌ Failed to sync consultation:', err);
                    const errorMsg = err instanceof Error ? err.message : 'Upload failed';
                    await updateConsultationStatus(consultation.id, 'error', errorMsg);
                }
            }

            await updatePendingCount();
            console.log('✅ Sync complete');

        } catch (err) {
            console.error('❌ Sync error:', err);
            setError('Failed to sync consultations');
        } finally {
            setIsSyncing(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
            }
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [mediaStream]);

    return {
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
        error
    };
};
