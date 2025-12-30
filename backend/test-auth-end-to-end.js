const API_URL = 'http://localhost:5000/api';

const updatedEmail = (email) => {
    const timestamp = new Date().getTime();
    return email.replace('@', `+${timestamp}@`);
}

async function post(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // Attempt to parse JSON, fall back to text if failed (e.g., for simple error messages)
    let responseData;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        responseData = await response.json();
    } else {
        responseData = await response.text();
    }

    return {
        status: response.status,
        data: responseData,
        ok: response.ok
    };
}

async function testAuth() {
    try {
        console.log('--- Testing Patient Registration ---');
        const patientData = {
            name: 'Test Patient',
            email: updatedEmail('patient@test.com'),
            password: 'password123',
            role: 'patient',
            phone: '1234567890'
        };
        const patientRes = await post(`${API_URL}/register`, patientData);
        console.log('Patient Registration Success:', patientRes.status === 201);
        console.log('Role:', patientRes.data.role);

        console.log('\n--- Testing Doctor Registration (with Specialization/Experience) ---');
        const doctorData = {
            name: 'Dr. Test',
            email: updatedEmail('doctor@test.com'),
            password: 'password123',
            role: 'doctor',
            specialization: 'Neurology',
            experience: 10,
            phone: '0987654321'
        };
        const doctorRes = await post(`${API_URL}/register`, doctorData);
        console.log('Doctor Registration Success:', doctorRes.status === 201);
        // Verify specialization data is returned or saved (if the API echoed it back)
        console.log('Specialization Saved:', doctorRes.data.specialization === 'Neurology');
        console.log('Experience Saved:', parseInt(doctorRes.data.experience) === 10);

        console.log('\n--- Testing Nurse Registration (with Shift) ---');
        const nurseData = {
            name: 'Nurse Test',
            email: updatedEmail('nurse@test.com'),
            password: 'password123',
            role: 'nurse',
            shift: 'Night',
            phone: '1122334455'
        };
        const nurseRes = await post(`${API_URL}/register`, nurseData);
        console.log('Nurse Registration Success:', nurseRes.status === 201);
        console.log('Shift Saved:', nurseRes.data.shift === 'Night');

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

testAuth();
