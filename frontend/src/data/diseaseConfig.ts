import { Activity, Brain, Eye, FileText, Heart, Image as ImageIcon, Syringe, Thermometer } from "lucide-react";

export type InputType = 'number' | 'text' | 'select' | 'image';

export interface DiseaseInput {
    key: string;
    label: string;
    type: InputType;
    options?: { label: string; value: string | number }[]; // For select inputs
    placeholder?: string;
    min?: number;
    max?: number;
    step?: number;
}

export interface DiseaseConfig {
    id: string;
    name: string;
    description: string;
    icon: any; // Lucide icon component
    type: 'tabular' | 'image';
    endpoint: string;
    inputs?: DiseaseInput[];
}

export const diseaseModels: DiseaseConfig[] = [
    // --- Tabular Models ---
    {
        id: 'heart-disease',
        name: 'Heart Disease',
        description: 'Predict heart disease risk based on cardiovascular metrics.',
        icon: Heart,
        type: 'tabular',
        endpoint: '/api/predict/heart',
        inputs: [
            { key: 'age', label: 'Age', type: 'number', min: 1, max: 120 },
            { key: 'sex', label: 'Sex', type: 'select', options: [{ label: 'Male', value: 1 }, { label: 'Female', value: 0 }] },
            { key: 'cp', label: 'Chest Pain Type', type: 'select', options: [{ label: 'Typical Angina', value: 0 }, { label: 'Atypical Angina', value: 1 }, { label: 'Non-anginal Pain', value: 2 }, { label: 'Asymptomatic', value: 3 }] },
            { key: 'trestbps', label: 'Resting Blood Pressure (mm Hg)', type: 'number', min: 80, max: 200 },
            { key: 'chol', label: 'Serum Cholestoral (mg/dl)', type: 'number', min: 100, max: 600 },
            { key: 'fbs', label: 'Fasting Blood Sugar > 120 mg/dl', type: 'select', options: [{ label: 'True', value: 1 }, { label: 'False', value: 0 }] },
            { key: 'restecg', label: 'Resting ECG Results', type: 'select', options: [{ label: 'Normal', value: 0 }, { label: 'ST-T Wave Abnormality', value: 1 }, { label: 'Left Ventricular Hypertrophy', value: 2 }] },
            { key: 'thalach', label: 'Max Heart Rate Achieved', type: 'number', min: 60, max: 220 },
            { key: 'exang', label: 'Exercise Induced Angina', type: 'select', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
            { key: 'oldpeak', label: 'ST Depression Induced by Exercise', type: 'number', step: 0.1 },
            { key: 'slope', label: 'Slope of Peak Exercise ST Segment', type: 'select', options: [{ label: 'Upsloping', value: 0 }, { label: 'Flat', value: 1 }, { label: 'Downsloping', value: 2 }] },
            { key: 'ca', label: 'Number of Major Vessels', type: 'number', min: 0, max: 3 },
            { key: 'thal', label: 'Thalassemia', type: 'select', options: [{ label: 'Normal', value: 1 }, { label: 'Fixed Defect', value: 2 }, { label: 'Reversable Defect', value: 3 }] },
        ]
    },
    {
        id: 'diabetes',
        name: 'Diabetes',
        description: 'Assess the likelihood of diabetes based on health indicators.',
        icon: Syringe,
        type: 'tabular',
        endpoint: '/api/predict/diabetes',
        inputs: [
            { key: 'Pregnancies', label: 'Number of Pregnancies', type: 'number', min: 0, max: 20 },
            { key: 'Glucose', label: 'Glucose Level', type: 'number', min: 0, max: 300 },
            { key: 'BloodPressure', label: 'Blood Pressure', type: 'number', min: 0, max: 200 },
            { key: 'SkinThickness', label: 'Skin Thickness', type: 'number', min: 0, max: 100 },
            { key: 'Insulin', label: 'Insulin Level', type: 'number', min: 0, max: 900 },
            { key: 'BMI', label: 'BMI', type: 'number', step: 0.1, min: 10, max: 60 },
            { key: 'DiabetesPedigreeFunction', label: 'Diabetes Pedigree Function', type: 'number', step: 0.001 },
            { key: 'Age', label: 'Age', type: 'number', min: 1, max: 120 },
        ]
    },
    {
        id: 'liver-disease',
        name: 'Liver Disease',
        description: 'Screen for liver disease using blood markers.',
        icon: Activity,
        type: 'tabular',
        endpoint: '/api/predict/liver',
        inputs: [
            { key: 'age', label: 'Age', type: 'number', min: 1, max: 120 },
            { key: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 1 }, { label: 'Female', value: 0 }] },
            { key: 'total_bilirubin', label: 'Total Bilirubin', type: 'number', step: 0.1 },
            { key: 'direct_bilirubin', label: 'Direct Bilirubin', type: 'number', step: 0.1 },
            { key: 'alkphos', label: 'Alkaline Phosphotase', type: 'number' },
            { key: 'sgpt', label: 'Alamine Aminotransferase', type: 'number' },
            { key: 'sgot', label: 'Aspartate Aminotransferase', type: 'number' },
            { key: 'total_proteins', label: 'Total Proteins', type: 'number', step: 0.1 },
            { key: 'albumin', label: 'Albumin', type: 'number', step: 0.1 },
            { key: 'ag_ratio', label: 'Albumin and Globulin Ratio', type: 'number', step: 0.1 },
        ]
    },
    {
        id: 'kidney-disease',
        name: 'Kidney Disease (CKD)',
        description: 'Chronic Kidney Disease prediction.',
        icon: Activity,
        type: 'tabular',
        endpoint: '/api/predict/ckd',
        inputs: [
            { key: 'age', label: 'Age', type: 'number' },
            { key: 'bp', label: 'Blood Pressure', type: 'number' },
            { key: 'sg', label: 'Specific Gravity', type: 'number', step: 0.005 },
            { key: 'al', label: 'Albumin', type: 'number' },
            { key: 'su', label: 'Sugar', type: 'number' },
            { key: 'rbc', label: 'Red Blood Cells', type: 'select', options: [{ label: 'Normal', value: 1 }, { label: 'Abnormal', value: 0 }] },
            { key: 'pc', label: 'Pus Cell', type: 'select', options: [{ label: 'Normal', value: 1 }, { label: 'Abnormal', value: 0 }] },
            { key: 'pcc', label: 'Pus Cell Clumps', type: 'select', options: [{ label: 'Present', value: 1 }, { label: 'Not Present', value: 0 }] },
            { key: 'ba', label: 'Bacteria', type: 'select', options: [{ label: 'Present', value: 1 }, { label: 'Not Present', value: 0 }] },
            { key: 'bgr', label: 'Blood Glucose Random', type: 'number' },
            { key: 'bu', label: 'Blood Urea', type: 'number' },
            { key: 'sc', label: 'Serum Creatinine', type: 'number', step: 0.1 },
            { key: 'sod', label: 'Sodium', type: 'number' },
            { key: 'pot', label: 'Potassium', type: 'number', step: 0.1 },
            { key: 'hemo', label: 'Hemoglobin', type: 'number', step: 0.1 },
            { key: 'pcv', label: 'Packed Cell Volume', type: 'number' },
            { key: 'wc', label: 'White Blood Cell Count', type: 'number' },
            { key: 'rc', label: 'Red Blood Cell Count', type: 'number', step: 0.1 },
            { key: 'htn', label: 'Hypertension', type: 'select', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
            { key: 'dm', label: 'Diabetes Mellitus', type: 'select', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
            { key: 'cad', label: 'Coronary Artery Disease', type: 'select', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
            { key: 'appet', label: 'Appetite', type: 'select', options: [{ label: 'Good', value: 1 }, { label: 'Poor', value: 0 }] },
            { key: 'pe', label: 'Pedal Edema', type: 'select', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
            { key: 'ane', label: 'Anemia', type: 'select', options: [{ label: 'Yes', value: 1 }, { label: 'No', value: 0 }] },
        ]
    },

    // --- Image Models ---
    {
        id: 'pneumonia',
        name: 'Pneumonia Detection',
        description: 'Upload a Chest X-ray to detect pneumonia.',
        icon: ImageIcon,
        type: 'image',
        endpoint: '/api/predict/pneumonia'
    },
    {
        id: 'tuberculosis',
        name: 'Tuberculosis (TB)',
        description: 'Upload a Chest X-ray to screen for TB.',
        icon: ImageIcon,
        type: 'image',
        endpoint: '/api/predict/tb'
    },
    {
        id: 'brain-tumor',
        name: 'Brain Tumor',
        description: 'Upload an MRI scan to detect brain tumors.',
        icon: Brain,
        type: 'image',
        endpoint: '/api/predict/brain-tumor'
    },
    {
        id: 'retinopathy',
        name: 'Diabetic Retinopathy',
        description: 'Upload a retinal scan image.',
        icon: Eye,
        type: 'image',
        endpoint: '/api/predict/retinopathy'
    },
    {
        id: 'skin-disease',
        name: 'Skin Disease',
        description: 'Upload an image of the skin condition.',
        icon: Thermometer,
        type: 'image',
        endpoint: '/api/predict/skin'
    },
];
