# Telemedicine Backend

Node.js Backend for the Telemedicine Platform, handling Authentication, Pharmacy, and Appointments.

## Prerequisites
- Node.js (v16+)
- MySQL Server

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

2.  **Database Setup**:
    - Create a MySQL database (default name: `telemed_db`).
    - Configure `.env` file (copy from `.env.example`):
    ```ini
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=yourpassword
    DB_NAME=telemed_db
    JWT_SECRET=supersecretkey123
    ```

3.  **Run Server**:
    ```bash
    npm start
    # or for development
    npm run dev
    ```
    The server will start on port 5000 and automatically create the required database tables (`Users`, `Doctors`, `Appointments`, `Inventories`, `Orders`) on the first run.

## API Usage & Frontend Integration

### Authentication
- **Register**: `POST /api/register`
  - Body: `{ "name": "John", "email": "john@test.com", "password": "123", "role": "patient" }`
  - Roles: `patient`, `doctor`, `pharmacist`
- **Login**: `POST /api/login`
  - Body: `{ "email": "john@test.com", "password": "123" }`
  - Response: `{ "token": "jwt_token_here", "role": "patient", ... }`
  - **frontend**: Store `token` in localStorage. Send in headers: `Authorization: Bearer <token>`.

### Appointments (Doctor Profile)
- **Get Queue (Doctor)**: `GET /api/appointments/doctor`
  - Headers: `Authorization: Bearer <token>`
- **Book (Patient)**: `POST /api/appointments`
  - Body: `{ "doctorId": 1, "date": "2024-01-01 10:00", "symptoms": "Fever" }`
  - **Note**: The backend automatically sets `aiRiskScore` and `priorityFlag` for demo purposes.

### Pharma
- **Get Inventory**: `GET /api/pharma/inventory`
- **Order Medicine**: `POST /api/pharma/orders`
  - Body: `{ "medicineId": 1, "quantity": 2 }`

## Testing Flow
1. Start Backend.
2. Use Postman or Frontend to **Register** a Doctor (`role: "doctor"`).
3. **Register** a Patient (`role: "patient"`).
4. **Login** as Patient.
5. **Book Appointment** with Doctor ID 1.
6. **Login** as Doctor.
7. **Get Queue** to see the patient's request.
