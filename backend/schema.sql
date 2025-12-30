-- Telemedicine Database Schema

CREATE DATABASE IF NOT EXISTS telemed_db;
USE telemed_db;

-- Patients Table (Previously mapped to Users)
CREATE TABLE IF NOT EXISTS Patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Doctors Table (Independent now)
CREATE TABLE IF NOT EXISTS Doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(255) NOT NULL,
    experience INT DEFAULT 0,
    availability JSON,
    isOnline BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Nurses Table (New)
CREATE TABLE IF NOT EXISTS Nurses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    shift VARCHAR(50), -- e.g., 'Morning', 'Night'
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inventory Table (Pharma) - Kept as is
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

-- Orders Table (Pharma) - Linked to Patients
CREATE TABLE IF NOT EXISTS Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    medicineId INT NOT NULL,
    quantity INT DEFAULT 1,
    status ENUM('Pending', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    totalPrice DECIMAL(10, 2) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Patients(id) ON DELETE CASCADE,
    FOREIGN KEY (medicineId) REFERENCES Inventories(id)
);

-- Appointments Table - Linked to Patients and Doctors
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
    FOREIGN KEY (patientId) REFERENCES Patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctorId) REFERENCES Doctors(id) ON DELETE CASCADE
);


INSERT INTO Patients (name, email, password, createdAt, updatedAt) VALUES
('Rahul Sharma', 'rahul@example.com', '$2a$10$hash1', NOW(), NOW()),
('Priya Patel', 'priya@example.com', '$2a$10$hash2', NOW(), NOW()),
('Amit Verma', 'amit@example.com', '$2a$10$hash3', NOW(), NOW()),
('Neha Singh', 'neha@example.com', '$2a$10$hash4', NOW(), NOW()),
('Karan Mehta', 'karan@example.com', '$2a$10$hash5', NOW(), NOW());



INSERT INTO Doctors (name, email, password, phone, specialization, experience, availability, isOnline, createdAt, updatedAt) VALUES
('Dr. Arvind Kumar', 'arvind@hospital.com', '$2a$10$hash1', '+91-9876543210', 'Cardiology', 15, '["10:00 AM","04:00 PM"]', TRUE, NOW(), NOW()),
('Dr. Sangeeta Rao', 'sangeeta@hospital.com', '$2a$10$hash2', '+91-9876543211', 'Pediatrics', 10, '["09:00 AM","01:00 PM"]', TRUE, NOW(), NOW()),
('Dr. Rohit Malhotra', 'rohit@hospital.com', '$2a$10$hash3', '+91-9876543212', 'Orthopedics', 12, '["11:00 AM","05:00 PM"]', FALSE, NOW(), NOW()),
('Dr. Anjali Iyer', 'anjali@hospital.com', '$2a$10$hash4', '+91-9876543213', 'Dermatology', 8, '["02:00 PM","06:00 PM"]', TRUE, NOW(), NOW()),
('Dr. Vikram Sen', 'vikram@hospital.com', '$2a$10$hash5', '+91-9876543214', 'Neurology', 18, '["10:00 AM","03:00 PM"]', FALSE, NOW(), NOW());


INSERT INTO Nurses (name, email, password, phone, shift, createdAt, updatedAt) VALUES
('Pooja Nair', 'pooja@nurse.com', '$2a$10$hashed1', '+91-8111111111', 'Morning', NOW(), NOW()),
('Ravi Deshmukh', 'ravi@nurse.com', '$2a$10$hashed2', '+91-8222222222', 'Night', NOW(), NOW()),
('Sneha Kulkarni', 'sneha@nurse.com', '$2a$10$hashed3', '+91-8333333333', 'Evening', NOW(), NOW()),
('Manoj Patil', 'manoj@nurse.com', '$2a$10$hashed4', '+91-8444444444', 'Morning', NOW(), NOW()),
('Anita Roy', 'anita@nurse.com', '$2a$10$hashed5', '+91-8555555555', 'Night', NOW(), NOW());


INSERT INTO Inventories (name, description, stock, price, requiresPrescription, createdAt, updatedAt) VALUES
('Dolo 650', 'Paracetamol 650mg', 200, 30.00, FALSE, NOW(), NOW()),
('Azithral 500', 'Azithromycin 500mg', 80, 120.00, TRUE, NOW(), NOW()),
('Crocin', 'Paracetamol 500mg', 150, 25.00, FALSE, NOW(), NOW()),
('Pantocid', 'Pantoprazole 40mg', 90, 95.00, TRUE, NOW(), NOW()),
('Cetirizine', 'Antihistamine 10mg', 120, 18.00, FALSE, NOW(), NOW());

INSERT INTO Appointments (patientId, doctorId, date, type, symptoms, aiRiskScore, priorityFlag, status, summary, createdAt, updatedAt) VALUES
(1, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), 'Video Consult', 'Chest pain and shortness of breath', 'High', TRUE, 'Pending', NULL, NOW(), NOW()),
(2, 2, DATE_ADD(NOW(), INTERVAL 2 DAY), 'Video Consult', 'Child fever and cough', 'Medium', FALSE, 'Confirmed', NULL, NOW(), NOW()),
(3, 3, DATE_ADD(NOW(), INTERVAL 3 DAY), 'In-Person', 'Knee pain after injury', 'Low', FALSE, 'Completed', 'Advised physiotherapy', NOW(), NOW()),
(4, 4, DATE_ADD(NOW(), INTERVAL 1 DAY), 'Video Consult', 'Skin rashes and itching', 'Low', FALSE, 'Confirmed', NULL, NOW(), NOW()),
(5, 5, DATE_ADD(NOW(), INTERVAL 4 DAY), 'Video Consult', 'Frequent headaches', 'Medium', TRUE, 'Pending', NULL, NOW(), NOW());



