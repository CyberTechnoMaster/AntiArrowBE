const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const userTbody = document.getElementById('user-tbody');
const totalUsersEl = document.getElementById('total-users');
const onlineUsersEl = document.getElementById('online-users');
const refreshBtn = document.getElementById('refresh-btn');
const logoutBtn = document.getElementById('logout-btn');

let token = localStorage.getItem('admin_token');

if (token) {
    loginOverlay.classList.remove('active');
    loadDashboard();
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (res.ok) {
            token = data.token;
            localStorage.setItem('admin_token', token);
            loginOverlay.classList.remove('active');
            loadDashboard();
        } else {
            loginError.textContent = data.error || 'Login failed';
        }
    } catch (err) {
        loginError.textContent = 'Server connection error';
    }
});

async function loadDashboard() {
    try {
        const res = await fetch('/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 403 || res.status === 401) {
            logout();
            return;
        }

        const users = await res.json();
        renderUsers(users);
    } catch (err) {
        console.error('Error loading dashboard:', err);
    }
}

function renderUsers(users) {
    userTbody.innerHTML = '';
    let onlineCount = 0;
    const now = new Date();

    users.forEach(user => {
        const lastActivity = new Date(user.lastActivity);
        const diffMinutes = (now - lastActivity) / 1000 / 60;
        const isOnline = diffMinutes < 5;

        if (isOnline) onlineCount++;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <span class="status-indicator ${isOnline ? 'status-online' : 'status-offline'}"></span>
                ${isOnline ? 'Online' : 'Offline'}
            </td>
            <td>${user.username}</td>
            <td>${user.level}</td>
            <td>${user.experience}</td>
            <td>${formatDate(user.lastActivity)}</td>
            <td><span class="role-badge ${user.role === 'admin' ? 'role-admin' : ''}">${user.role}</span></td>
        `;
        userTbody.appendChild(tr);
    });

    totalUsersEl.textContent = users.length;
    onlineUsersEl.textContent = onlineCount;
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString();
}

function logout() {
    localStorage.removeItem('admin_token');
    location.reload();
}

refreshBtn.addEventListener('click', loadDashboard);
logoutBtn.addEventListener('click', logout);

// Auto refresh every 30 seconds
setInterval(loadDashboard, 30000);
