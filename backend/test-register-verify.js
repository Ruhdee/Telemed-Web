// Native fetch in Node 18+

async function testRegister() {
    const user = {
        name: "Test User_" + Date.now(),
        email: "test_" + Date.now() + "@example.com",
        password: "password123",
        role: "patient"
    };

    console.log("Registering:", user);

    try {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        const data = await response.json(); // or text if error

        console.log("Status:", response.status);
        console.log("Response:", data);

        if (response.ok && data.token && data.role === 'patient') {
            console.log("SUCCESS: Registration passed!");
        } else {
            console.log("FAILURE: Registration failed.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

testRegister();
