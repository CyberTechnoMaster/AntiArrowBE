const recordsTbody = document.getElementById('records-tbody');
const noDataMsg = document.getElementById('no-data-msg');

async function loadLeaderboard() {
    try {
        const res = await fetch('/leaderboard');
        const records = await res.json();

        if (records.length === 0) {
            noDataMsg.style.display = 'block';
            recordsTbody.innerHTML = '';
            return;
        }

        noDataMsg.style.display = 'none';
        renderRecords(records);
    } catch (err) {
        console.error('Error loading leaderboard:', err);
        recordsTbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--accent);">Error loading records</td></tr>';
    }
}

function renderRecords(records) {
    recordsTbody.innerHTML = '';

    records.forEach(record => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="rank-badge">${record.level}</span></td>
            <td><span class="username-val">${record.username}</span></td>
            <td><span class="time-val">${record.timeInSec}s</span></td>
            <td>${new Date(record.updatedAt).toLocaleDateString()}</td>
        `;
        recordsTbody.appendChild(tr);
    });
}

// Initial load
loadLeaderboard();

// Auto refresh every minute
setInterval(loadLeaderboard, 60000);
