-- Telemedicine Database Schema

CREATE DATABASE IF NOT EXISTS telemed_db;
USE telemed_db;

-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor', 'pharmacist', 'admin') DEFAULT 'patient',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Doctors Table
CREATE TABLE IF NOT EXISTS Doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(255) NOT NULL,
    experience INT DEFAULT 0,
    availability JSON,
    isOnline BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Inventory Table (Pharma)
CREATE TABLE IF NOT EXISTS Inventories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    stock INT DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    requiresPrescription BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Orders Table (Pharma)
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    medicineId INT NOT NULL,
    quantity INT DEFAULT 1,
    status ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    totalPrice DECIMAL(10, 2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Users(id),
    FOREIGN KEY (medicineId) REFERENCES Inventories(id)
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS Appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    doctorId INT NOT NULL,
    date DATETIME NOT NULL,
    type VARCHAR(255) DEFAULT 'Video Consult',
    symptoms TEXT NOT NULL,
    aiRiskScore ENUM('Low', 'Medium', 'High') DEFAULT 'Low',
    priorityFlag BOOLEAN DEFAULT FALSE,
    status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
    summary TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Users(id),
    FOREIGN KEY (doctorId) REFERENCES Doctors(id)
);

-- ==========================================
-- DUMMY DATA SEEDING (Indian Names)
-- ==========================================

-- 1. Insert Users (Passwords are placeholders, use Bcrypt in real app)
-- Users: 1=Patient (Rahul), 2=Patient (Priya), 3=Doctor (Arvind), 4=Pharmacist (Suresh)
INSERT INTO Users (name, email, password, role, createdAt, updatedAt) VALUES
('Rahul Sharma', 'rahul@example.com', '$2a$10$YourHashedPasswordHere', 'patient', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Priya Patel', 'priya@example.com', '$2a$10$YourHashedPasswordHere', 'patient', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dr. Arvind Kumar', 'arvind@hospital.com', '$2a$10$YourHashedPasswordHere', 'doctor', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- 2. Insert Doctor Profile (Linked to User ID 3)
INSERT INTO Doctors (userId, name, email, phone, specialization, experience, availability, isOnline, createdAt, updatedAt) VALUES
(3, 'Dr. Arvind Kumar', 'arvind@hospital.com', '+91-9876543210', 'Cardiology', 15, '["10:00 AM", "11:00 AM", "04:00 PM"]', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Insert Inventory (Medicines)
INSERT INTO Inventories (name, description, stock, price, requiresPrescription, createdAt, updatedAt) VALUES
('Dolo 650', 'Paracetamol 650mg for fever and pain', 100, 30.00, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Azithral 500', 'Antibiotic Azithromycin 500mg', 50, 120.00, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Chetston Cold', 'For cold and flu relief', 200, 45.50, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Shelcal 500', 'Calcium and Vitamin D3 supplement', 80, 85.00, FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 4. Insert Appointments
-- Rahul (ID 1) booking with Dr. Arvind (DoctorID 1)
INSERT INTO Appointments (patientId, doctorId, date, type, symptoms, aiRiskScore, priorityFlag, status, summary) VALUES 
(1, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), 'Video Consult', 'Severe chest pain and sweating', 'High', TRUE, 'Pending', 'AI Alert: Symptoms indicate potential cardiac event.'),
(2, 1, DATE_ADD(NOW(), INTERVAL 2 DAY), 'Offline Review', 'Regular BP checkup', 'Low', FALSE, 'Confirmed', 'Routine checkup scheduled.');

-- 5. Insert Orders
-- Priya (ID 2) buying Dolo 650 (MedicineID 1)
INSERT INTO Orders (patientId, medicineId, quantity, status, totalPrice, createdAt, updatedAt) VALUES
(2, 1, 2, 'Shipped', 60.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

