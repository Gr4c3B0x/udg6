// Ambil Parameter nama tamu dari URL (?to=Nama+Tamu)
const urlParams = new URLSearchParams(window.location.search);
const guestParam = urlParams.get('to') || urlParams.get('n');
const guestNameElement = document.getElementById('guest-name');

if (guestParam && guestNameElement) {
    guestNameElement.innerText = guestParam;
}

// =========================================
// TRANSISI: COVER -> MAIN CONTENT
// =========================================
const openBtn = document.getElementById('open-invitation-btn');
const coverOverlay = document.getElementById('envelope-overlay');
const transitionScreen = document.getElementById('transition-screen');
const mainContent = document.getElementById('main-content');
const musicToggle = document.getElementById('music-toggle');
const backsound = document.getElementById('backsound');

// Durasi ini HARUS sama dengan durasi transition CSS pada .transition-screen (0.8s)
const TRANSITION_DURATION = 800;

if (openBtn) {
    openBtn.addEventListener('click', () => {
        // Supaya tombol tidak bisa diklik berkali-kali saat animasi berjalan
        openBtn.disabled = true;

        // 1. Layar transisi (hitam) mulai fade-in menutupi layar
        transitionScreen.classList.add('expand');

        // 2. Coba mainkan musik latar (dipicu oleh interaksi user agar tidak diblokir browser)
        if (backsound) {
            backsound.play()
                .then(() => musicToggle && musicToggle.classList.add('playing'))
                .catch(() => { /* Autoplay diblokir, user bisa klik tombol musik manual */ });
        }
        if (musicToggle) musicToggle.classList.add('visible');

        // 3. Setelah layar transisi menutup penuh, ganti dari cover ke konten utama
        setTimeout(() => {
            coverOverlay.classList.add('hidden');
            document.body.style.overflow = 'auto';

            mainContent.classList.remove('hidden');
            // Trigger reflow supaya transisi opacity main-content berjalan mulus
            void mainContent.offsetWidth;
            mainContent.classList.add('visible');

            // Efek confetti saat undangan terbuka
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 130,
                    spread: 90,
                    origin: { y: 0.6 },
                    colors: ['#fef08a', '#d4af37', '#b38728']
                });
            }

            // 4. Fade-out layar transisi agar konten utama terlihat
            setTimeout(() => {
                transitionScreen.classList.remove('expand');
            }, 150);
        }, TRANSITION_DURATION);
    });
}

// Cegah scroll saat cover masih tampil
document.body.style.overflow = 'hidden';

// Toggle musik manual lewat tombol floating
if (musicToggle && backsound) {
    musicToggle.addEventListener('click', () => {
        if (backsound.paused) {
            backsound.play();
            musicToggle.classList.add('playing');
        } else {
            backsound.pause();
            musicToggle.classList.remove('playing');
        }
    });
}

// =========================================
// COUNTDOWN TIMER
// =========================================
// PENTING: sesuaikan tanggal target di bawah ini dengan tanggal acara Anda.
// Format: 'YYYY-MM-DDTHH:mm:ss+07:00' (WIB)
const TARGET_DATE = new Date('2026-10-31T08:00:00+07:00');

function updateCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    const now = new Date();
    let diff = TARGET_DATE - now;

    if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
    }

    const pad = (n) => String(n).padStart(2, '0');
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    daysEl.textContent = pad(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// =========================================
// GALLERY LIGHTBOX
// =========================================
const galleryModal = document.getElementById('gallery-modal');
const modalImg = document.getElementById('modal-img');
const modalClose = galleryModal ? galleryModal.querySelector('.modal-close') : null;

document.querySelectorAll('.gallery-item img').forEach((img) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
        if (!galleryModal || !modalImg) return;
        modalImg.src = img.src;
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeGalleryModal() {
    if (!galleryModal) return;
    galleryModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (modalClose) modalClose.addEventListener('click', closeGalleryModal);
if (galleryModal) {
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) closeGalleryModal();
    });
}

// =========================================
// ABSENSI & UCAPAN (localStorage + optional Google Sheets sync)
// =========================================
const ATTENDANCE_KEY = 'haflah_attendance_data';
const SETTINGS_KEY = 'haflah_admin_settings';

function getAttendanceData() {
    try {
        return JSON.parse(localStorage.getItem(ATTENDANCE_KEY)) || [];
    } catch (e) {
        return [];
    }
}

function saveAttendanceData(data) {
    localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data));
}

function getSettings() {
    try {
        return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    } catch (e) {
        return {};
    }
}

function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// Kirim juga ke Google Sheets kalau URL Apps Script sudah dikonfigurasi (best-effort, tidak memblokir UI)
function syncToGoogleSheets(entry) {
    const settings = getSettings();
    if (!settings.scriptUrl) return;
    fetch(settings.scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
    }).catch(() => { /* Sinkronisasi gagal, data tetap aman di localStorage */ });
}

function renderWishesFeed() {
    const container = document.getElementById('wishes-container');
    if (!container) return;
    const data = getAttendanceData().filter(item => item.wishes && item.wishes.trim() !== '');

    if (data.length === 0) {
        container.innerHTML = '<div class="wishes-empty" style="text-align:center; opacity:0.7; padding: 20px 0;">Belum ada ucapan. Jadilah yang pertama!</div>';
        return;
    }

    const sorted = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    container.innerHTML = sorted.map(item => `
        <div class="wish-item">
            <div class="wish-header">
                <strong class="wish-name">${escapeHtml(item.name)}</strong>
                <span class="wish-category">${escapeHtml(item.category)}</span>
            </div>
            <p class="wish-text">${escapeHtml(item.wishes)}</p>
        </div>
    `).join('');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
}

const attendanceForm = document.getElementById('attendance-form');
if (attendanceForm) {
    attendanceForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('attendee-name');
        const categoryInput = document.getElementById('guest-category');
        const wishesInput = document.getElementById('guest-wishes');
        const submitBtn = document.getElementById('btn-submit-attendance');
        const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
        const spinner = submitBtn ? submitBtn.querySelector('.spinner') : null;

        const name = nameInput.value.trim();
        if (!name) return;

        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.classList.add('hidden');
        if (spinner) spinner.classList.remove('hidden');

        const entry = {
            id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
            name: name,
            category: categoryInput ? categoryInput.value : 'Lainnya',
            wishes: wishesInput ? wishesInput.value.trim() : '',
            timestamp: new Date().toISOString()
        };

        const data = getAttendanceData();
        data.push(entry);
        saveAttendanceData(data);
        syncToGoogleSheets(entry);

        // Simulasi jeda singkat supaya spinner terlihat, lalu reset form
        setTimeout(() => {
            attendanceForm.reset();
            renderWishesFeed();
            if (submitBtn) submitBtn.disabled = false;
            if (btnText) btnText.classList.remove('hidden');
            if (spinner) spinner.classList.add('hidden');
            if (typeof confetti === 'function') {
                confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
            }
        }, 500);
    });

    renderWishesFeed();
}

// =========================================
// ADMIN DASHBOARD
// =========================================
// CATATAN KEAMANAN: Kata sandi ini tersimpan di kode sisi klien (dapat dilihat
// siapa saja lewat "View Source"). Cocok untuk melindungi dari tamu biasa,
// TAPI BUKAN keamanan sesungguhnya. Jangan pakai untuk data sensitif.
const ADMIN_PASSWORD = 'admin123';

const adminModal = document.getElementById('admin-modal');
const adminLoginTrigger = document.getElementById('admin-login-trigger');
const adminClose = document.getElementById('admin-close');
const adminAuthContainer = document.getElementById('admin-auth-container');
const adminDashboardContainer = document.getElementById('admin-dashboard-container');
const adminAuthForm = document.getElementById('admin-auth-form');
const adminPasswordInput = document.getElementById('admin-password');
const authError = document.getElementById('auth-error');
const btnAdminLogout = document.getElementById('btn-admin-logout');

function openAdminModal() {
    if (!adminModal) return;
    adminModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAdminModal() {
    if (!adminModal) return;
    adminModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (adminLoginTrigger) {
    adminLoginTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        openAdminModal();
    });
}
if (adminClose) adminClose.addEventListener('click', closeAdminModal);
if (adminModal) {
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) closeAdminModal();
    });
}

if (adminAuthForm) {
    adminAuthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (adminPasswordInput.value === ADMIN_PASSWORD) {
            if (authError) authError.classList.add('hidden');
            adminAuthForm.reset();
            adminAuthContainer.classList.add('hidden');
            adminDashboardContainer.classList.remove('hidden');
            renderAdminDashboard();
        } else {
            if (authError) authError.classList.remove('hidden');
        }
    });
}

if (btnAdminLogout) {
    btnAdminLogout.addEventListener('click', () => {
        adminDashboardContainer.classList.add('hidden');
        adminAuthContainer.classList.remove('hidden');
    });
}

// Tab switching di dalam dashboard
document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const target = document.getElementById(btn.dataset.tab);
        if (target) target.classList.add('active');
    });
});

function renderAdminDashboard() {
    const data = getAttendanceData();
    renderAdminStats(data);
    renderAdminTable(data);
}

function renderAdminStats(data) {
    const total = document.getElementById('stat-total-submissions');
    const santri = document.getElementById('stat-santri');
    const alumni = document.getElementById('stat-alumni');
    const wali = document.getElementById('stat-wali-santri');

    if (total) total.textContent = data.length;
    if (santri) santri.textContent = data.filter(d => d.category === 'Santri').length;
    if (alumni) alumni.textContent = data.filter(d => d.category === 'Alumni').length;
    if (wali) wali.textContent = data.filter(d => d.category === 'Wali Santri').length;
}

function renderAdminTable(data) {
    const tbody = document.getElementById('admin-table-body');
    const mobileCards = document.getElementById('admin-mobile-cards');
    if (!tbody && !mobileCards) return;

    const searchInput = document.getElementById('search-guest');
    const filterSelect = document.getElementById('filter-category');
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const category = filterSelect ? filterSelect.value : 'all';

    let filtered = [...data].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (category !== 'all') {
        filtered = filtered.filter(d => d.category === category);
    }
    if (keyword) {
        filtered = filtered.filter(d =>
            d.name.toLowerCase().includes(keyword) ||
            (d.wishes && d.wishes.toLowerCase().includes(keyword))
        );
    }

    if (filtered.length === 0) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center">Belum ada data.</td></tr>';
        if (mobileCards) mobileCards.innerHTML = '<div class="text-center" style="padding:20px 0; opacity:0.8;">Belum ada data.</div>';
        return;
    }

    if (tbody) {
        tbody.innerHTML = filtered.map((item, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>${escapeHtml(item.name)}</td>
                <td>${escapeHtml(item.category)}</td>
                <td>${escapeHtml(item.wishes) || '-'}</td>
                <td>${new Date(item.timestamp).toLocaleString('id-ID')}</td>
                <td><button class="btn-outline-gold btn-sm btn-danger-outline btn-delete-entry" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button></td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.btn-delete-entry').forEach(btn => {
            btn.addEventListener('click', () => deleteEntry(btn.dataset.id));
        });
    }

    if (mobileCards) {
        mobileCards.innerHTML = filtered.map(item => `
            <div class="glass-card" style="padding:14px; margin-bottom:10px;">
                <strong>${escapeHtml(item.name)}</strong> <span style="opacity:0.7;">(${escapeHtml(item.category)})</span>
                <p style="margin:6px 0; font-size:0.85rem;">${escapeHtml(item.wishes) || '-'}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <small style="opacity:0.6;">${new Date(item.timestamp).toLocaleString('id-ID')}</small>
                    <button class="btn-outline-gold btn-sm btn-danger-outline btn-delete-entry" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `).join('');

        mobileCards.querySelectorAll('.btn-delete-entry').forEach(btn => {
            btn.addEventListener('click', () => deleteEntry(btn.dataset.id));
        });
    }
}

function deleteEntry(id) {
    if (!confirm('Hapus data tamu ini?')) return;
    const data = getAttendanceData().filter(d => d.id !== id);
    saveAttendanceData(data);
    renderAdminDashboard();
    renderWishesFeed();
}

const searchGuestInput = document.getElementById('search-guest');
const filterCategorySelect = document.getElementById('filter-category');
if (searchGuestInput) searchGuestInput.addEventListener('input', () => renderAdminTable(getAttendanceData()));
if (filterCategorySelect) filterCategorySelect.addEventListener('change', () => renderAdminTable(getAttendanceData()));

// Ekspor CSV
const btnExportCsv = document.getElementById('btn-export-csv');
if (btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
        const data = getAttendanceData();
        if (data.length === 0) {
            alert('Belum ada data untuk diekspor.');
            return;
        }
        const header = ['Nama', 'Kategori', 'Ucapan', 'Waktu'];
        const rows = data.map(d => [
            d.name,
            d.category,
            (d.wishes || '').replace(/"/g, '""'),
            new Date(d.timestamp).toLocaleString('id-ID')
        ]);
        const csvContent = [header, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data-absensi-haflah.csv';
        a.click();
        URL.revokeObjectURL(url);
    });
}

// Reset data
const btnResetData = document.getElementById('btn-reset-data');
if (btnResetData) {
    btnResetData.addEventListener('click', () => {
        if (!confirm('Yakin ingin menghapus SEMUA data absensi? Tindakan ini tidak bisa dibatalkan.')) return;
        saveAttendanceData([]);
        renderAdminDashboard();
        renderWishesFeed();
    });
}

// Pengaturan: simpan URL Google Apps Script
const adminSettingsForm = document.getElementById('admin-settings-form');
const settingsScriptUrlInput = document.getElementById('settings-script-url');
const settingsSuccessMsg = document.getElementById('settings-success-msg');

if (adminSettingsForm) {
    // Muat pengaturan tersimpan saat dashboard dibuka
    const existingSettings = getSettings();
    if (settingsScriptUrlInput && existingSettings.scriptUrl) {
        settingsScriptUrlInput.value = existingSettings.scriptUrl;
    }

    adminSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveSettings({ scriptUrl: settingsScriptUrlInput.value.trim() });
        if (settingsSuccessMsg) {
            settingsSuccessMsg.classList.remove('hidden');
            setTimeout(() => settingsSuccessMsg.classList.add('hidden'), 2500);
        }
    });
}