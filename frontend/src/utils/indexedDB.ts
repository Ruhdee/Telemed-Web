// IndexedDB utility for storing offline consultation data

const DB_NAME = 'TelemedOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'consultations';

export interface OfflineConsultationData {
    id: string;
    timestamp: number;
    chiefComplaint: string;
    symptomsDescription: string;
    videoBlob: Blob | null;
    photoBlob: Blob | null;
    patientId: number;
    status: 'pending' | 'syncing' | 'synced' | 'error';
    retryCount: number;
    errorMessage?: string;
}

// Initialize IndexedDB
export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            reject(new Error('Failed to open IndexedDB'));
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;

            // Create object store if it doesn't exist
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                objectStore.createIndex('status', 'status', { unique: false });
                objectStore.createIndex('timestamp', 'timestamp', { unique: false });
                objectStore.createIndex('patientId', 'patientId', { unique: false });
            }
        };
    });
};

// Save a new consultation to IndexedDB
export const saveConsultation = async (
    data: Omit<OfflineConsultationData, 'id' | 'timestamp' | 'status' | 'retryCount'>
): Promise<string> => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const consultationData: OfflineConsultationData = {
            ...data,
            id: generateUUID(),
            timestamp: Date.now(),
            status: 'pending',
            retryCount: 0,
        };

        const request = store.add(consultationData);

        request.onsuccess = () => {
            resolve(consultationData.id);
        };

        request.onerror = () => {
            reject(new Error('Failed to save consultation'));
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
};

// Get all pending consultations
export const getPendingConsultations = async (): Promise<OfflineConsultationData[]> => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('status');
        const request = index.getAll('pending');

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(new Error('Failed to get pending consultations'));
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
};

// Get all consultations (for display purposes)
export const getAllConsultations = async (): Promise<OfflineConsultationData[]> => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(new Error('Failed to get all consultations'));
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
};

// Update consultation status
export const updateConsultationStatus = async (
    id: string,
    status: OfflineConsultationData['status'],
    errorMessage?: string
): Promise<void> => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const getRequest = store.get(id);

        getRequest.onsuccess = () => {
            const data = getRequest.result;
            if (!data) {
                reject(new Error('Consultation not found'));
                return;
            }

            data.status = status;
            if (errorMessage) {
                data.errorMessage = errorMessage;
            }
            if (status === 'error') {
                data.retryCount += 1;
            }

            const updateRequest = store.put(data);

            updateRequest.onsuccess = () => {
                resolve();
            };

            updateRequest.onerror = () => {
                reject(new Error('Failed to update consultation status'));
            };
        };

        getRequest.onerror = () => {
            reject(new Error('Failed to get consultation'));
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
};

// Delete a consultation after successful sync
export const deleteConsultation = async (id: string): Promise<void> => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
            resolve();
        };

        request.onerror = () => {
            reject(new Error('Failed to delete consultation'));
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
};

// Get consultation by ID
export const getConsultationById = async (id: string): Promise<OfflineConsultationData | null> => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
            resolve(request.result || null);
        };

        request.onerror = () => {
            reject(new Error('Failed to get consultation'));
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
};

// Clear all synced consultations (cleanup)
export const clearSyncedConsultations = async (): Promise<void> => {
    const db = await initDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const index = store.index('status');
        const request = index.openCursor('synced');

        request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest).result;
            if (cursor) {
                cursor.delete();
                cursor.continue();
            }
        };

        request.onerror = () => {
            reject(new Error('Failed to clear synced consultations'));
        };

        transaction.oncomplete = () => {
            db.close();
            resolve();
        };
    });
};

// Helper function to generate UUID
const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

// Get count of pending consultations
export const getPendingCount = async (): Promise<number> => {
    const pending = await getPendingConsultations();
    return pending.length;
};
