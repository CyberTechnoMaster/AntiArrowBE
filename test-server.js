const baseUrl = 'http://localhost:3000';
let token = '';

async function test() {
    // 1. Register
    console.log('--- Registering ---');
    const uniqueUser = 'testuser_' + Date.now();
    const regRes = await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uniqueUser, password: 'password123' })
    });
    console.log('Register Res:', regRes.status, await regRes.text());

    // 2. Login
    console.log('\n--- Logging in ---');
    const loginRes = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: uniqueUser, password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log('Login Res:', loginRes.status, loginData);
    token = loginData.token;

    if (!token) {
        console.error('No token received, stopping.');
        return;
    }

    // 3. Profile
    console.log('\n--- Fetching Profile ---');
    const profileRes = await fetch(`${baseUrl}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Profile Res:', profileRes.status, await profileRes.json());

    // 4. Update Progress
    console.log('\n--- Updating Progress ---');
    const progRes = await fetch(`${baseUrl}/progress`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ level: 5, experience: 2000 })
    });
    console.log('Progress Res:', progRes.status, await progRes.json());

    // 5. Verify Update
    console.log('\n--- Use Profile to Verify ---');
    const profileRes2 = await fetch(`${baseUrl}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Profile Res 2:', profileRes2.status, await profileRes2.json());
}

test().catch(console.error);
