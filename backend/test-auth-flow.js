// Native fetch in Node 18+

async function testAuth() {
    const email = "test_login_" + Date.now() + "@example.com";
    const password = "password123";
    const user = {
        name: "Login Tester",
        email: email,
        password: password,
        role: "patient"
    };

    console.log("1. Registering:", email);
    try {
        const regRes = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const regData = await regRes.json();

        if (!regRes.ok) {
            console.error("Registration Failed:", regData);
            return;
        }
        console.log("   Registration OK. ID:", regData.id);

        console.log("2. Logging in...");
        const loginRes = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role: 'patient' })
        });

        const loginData = await loginRes.json();
        console.log("   Login Status:", loginRes.status);

        if (loginRes.ok && loginData.token && loginData.role === 'patient') {
            console.log("SUCCESS: Login passed! Token received.");
        } else {
            console.log("FAILURE: Login failed.", loginData);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

testAuth();
