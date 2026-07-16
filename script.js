/**
 * Undangan Haflah Takharruj
 * Main JavaScript Logic
 */
document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       ENVELOPE ANIMATION
       ========================================= */
    const envelopeContainer = document.getElementById('envelope-container');
    const transitionScreen = document.getElementById('transition-screen');
    const envelopeOverlay = document.getElementById('envelope-overlay');
    const mainContent = document.getElementById('main-content');
    const envelopeHint = document.querySelector('.envelope-hint');
    const backsound = document.getElementById('backsound');
    const musicToggle = document.getElementById('music-toggle');
    envelopeContainer.addEventListener('click', () => {
        // Step 1: Stop floating, slight zoom, flap opens
        envelopeContainer.classList.add('open-animation');
        if (envelopeHint) envelopeHint.style.opacity = '0';

        // Play audio immediately on envelope click (user interaction trigger)
        if (backsound) {
            backsound.play().catch(err => console.log('Audio playback failed:', err));
        }
        if (musicToggle) {
            musicToggle.classList.add('visible');
            musicToggle.classList.add('playing');
        }

        // Wait for flap to open (600ms)
        setTimeout(() => {
            // Step 2: Pull out paper
            envelopeContainer.classList.add('pull-out');

            // Wait for paper to come out (1000ms)
            setTimeout(() => {
                // Step 3: Expand transition screen
                transitionScreen.classList.add('expand');

                // Wait for expansion to cover screen (1000ms)
                setTimeout(() => {
                    // Step 4: Hide overlay, show main site
                    envelopeOverlay.classList.add('hidden');
                    mainContent.classList.remove('hidden');

                    // Trigger fade in for main content
                    setTimeout(() => {
                        mainContent.classList.add('visible');
                        // Trigger celebratory confetti effect from bottom corners
                        triggerConfetti();
                    }, 50);
                    // Ensure window is scrolled to top
                    window.scrollTo(0, 0);
                }, 900); // slightly before transition finishes
            }, 1000);
        }, 600);
    });

    // Confetti Cannon from Left and Right bottom corners
    function triggerConfetti() {
        if (typeof confetti !== 'function') {
            console.error('Confetti library not loaded!');
            return;
        }

        const duration = 1000;
        const end = Date.now() + duration;
        const colors = ['#d4af37', '#fef3c7', '#042f2e', '#064e3b', '#ffffff'];

        // Big initial burst
        confetti({
            particleCount: 100,
            angle: 60,
            spread: 80,
            origin: { x: 0, y: 1 },
            colors: colors,
            startVelocity: 70,
            gravity: 0.9,
            scalar: 1.2,
            zIndex: 9999
        });
        confetti({
            particleCount: 100,
            angle: 120,
            spread: 80,
            origin: { x: 1, y: 1 },
            colors: colors,
            startVelocity: 70,
            gravity: 0.9,
            scalar: 1.2,
            zIndex: 9999
        });

        // Continuous stream
        const frame = setInterval(() => {
            if (Date.now() > end) {
                return clearInterval(frame);
            }
            confetti({
                particleCount: 15,
                angle: 60,
                spread: 60,
                origin: { x: 0, y: 1 },
                colors: colors,
                startVelocity: 60,
                gravity: 0.9,
                scalar: 1.2,
                zIndex: 9999
            });
            confetti({
                particleCount: 15,
                angle: 120,
                spread: 60,
                origin: { x: 1, y: 1 },
                colors: colors,
                startVelocity: 60,
                gravity: 0.9,
                scalar: 1.2,
                zIndex: 9999
            });
        }, 200);
    }
    // Control music playback via the floating button
    if (musicToggle && backsound) {
        musicToggle.addEventListener('click', () => {
            if (backsound.paused) {
                backsound.play().catch(err => console.log('Audio playback failed:', err));
                musicToggle.classList.add('playing');
            } else {
                backsound.pause();
                musicToggle.classList.remove('playing');
            }
        });
    }
    /* =========================================
       COUNTDOWN TIMER
       ========================================= */
    // Target date: June 15, 2026 08:00:00
    const targetDate = new Date('June 15, 2026 08:00:00').getTime();
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        if (distance < 0) {
            // Event has started or passed
            daysEl.innerText = '00';
            hoursEl.innerText = '00';
            minutesEl.innerText = '00';
            secondsEl.innerText = '00';
            return;
        }
        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        // Display formatting (add leading zero)
        daysEl.innerText = days < 10 ? '0' + days : days;
        hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }
    // Initial call
    updateCountdown();
    // Update every second
    setInterval(updateCountdown, 1000);
});
// --- GALLERY POP-UP LIGHTBOX ---
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("gallery-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".modal-close");
    const galleryImages = document.querySelectorAll(".gallery-item img");

    galleryImages.forEach(img => {
        img.addEventListener("click", function () {
            modal.style.display = "block";
            modalImg.src = this.src;
        });
    });

    closeBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    modal.addEventListener("click", function (e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});

// =========================================
// ABSENSI & ADMIN DASHBOARD SYSTEM
// =========================================
document.addEventListener("DOMContentLoaded", function () {
    // 1. Inisialisasi Database Lokal & Konfigurasi Default
    const DEFAULT_PASS = "angkatan36nihbos";
    // Taruh URL Google Apps Script Web App Anda di bawah ini agar sinkronisasi berfungsi secara global di HP dan laptop tamu
    const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx2iMgNtNQOYGiql7ipyQk2CbE6IO_EACghWUjtKteLv7VUn8kL__mXkE2qzHaDg0aE/exec";
    const MOCK_WISHES = [
        {
            id: "mock-1",
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
            nama: "H. Ahmad Fauzi",
            alamat: "-",
            kategori: "Wali Santri",
            jumlah: 1,
            ucapan: "Selamat atas kelulusan Angkatan 36 Peismataris. Semoga menjadi ilmu yang barokah dan bermanfaat bagi agama, nusa, dan bangsa. Aamiin."
        },
        {
            id: "mock-2",
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
            nama: "Muhammad Ilham, S.Kom",
            alamat: "-",
            kategori: "Alumni",
            jumlah: 1,
            ucapan: "Mabruk untuk adik-adik kelas! Terus berjuang di jenjang berikutnya. Jangan lupakan almamater Pesantren Al-Hamidiyah."
        },
        {
            id: "mock-3",
            timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
            nama: "Ahmad Rayhan",
            alamat: "-",
            kategori: "Santri",
            jumlah: 1,
            ucapan: "Selamat dan sukses Haflatut Takharruj Angkatan 36 MTS-MA Al-Hamidiyah. Peismataris Keren!"
        }
    ];

    // Cek dan set password default
    localStorage.setItem("haflah_admin_password", DEFAULT_PASS);

    // Ambil data absensi dari localStorage, jika kosong isi dengan Mock Data
    let attendanceData = [];
    try {
        const stored = localStorage.getItem("haflah_attendance");
        const hasDatabase = localStorage.getItem("haflah_script_url") || DEFAULT_SCRIPT_URL;
        if (stored) {
            attendanceData = JSON.parse(stored);
            // Hapus mock data lama jika sudah ada integrasi database asli
            if (hasDatabase && attendanceData.some(item => item.id && item.id.startsWith("mock-"))) {
                attendanceData = [];
                localStorage.setItem("haflah_attendance", JSON.stringify(attendanceData));
            }
        } else {
            attendanceData = hasDatabase ? [] : [...MOCK_WISHES];
            localStorage.setItem("haflah_attendance", JSON.stringify(attendanceData));
        }
    } catch (e) {
        console.error("Gagal membaca localStorage", e);
        const hasDatabase = localStorage.getItem("haflah_script_url") || DEFAULT_SCRIPT_URL;
        attendanceData = hasDatabase ? [] : [...MOCK_WISHES];
    }

    // 2. Element Selectors
    const attendanceForm = document.getElementById("attendance-form");
    const wishesContainer = document.getElementById("wishes-container");
    const adminTrigger = document.getElementById("admin-login-trigger");
    const adminModal = document.getElementById("admin-modal");
    const adminClose = document.getElementById("admin-close");
    const authContainer = document.getElementById("admin-auth-container");
    const dashboardContainer = document.getElementById("admin-dashboard-container");
    const authForm = document.getElementById("admin-auth-form");
    const adminPasswordInput = document.getElementById("admin-password");
    const authError = document.getElementById("auth-error");
    const btnLogout = document.getElementById("btn-admin-logout");
    const btnExportCsv = document.getElementById("btn-export-csv");
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const searchInput = document.getElementById("search-guest");
    const filterSelect = document.getElementById("filter-category");
    const tableBody = document.getElementById("admin-table-body");
    const settingsForm = document.getElementById("admin-settings-form");
    const settingsScriptUrl = document.getElementById("settings-script-url");
    const settingsOldPass = document.getElementById("settings-old-pass");
    const settingsNewPass = document.getElementById("settings-new-pass");
    const settingsSuccessMsg = document.getElementById("settings-success-msg");

    // 3. Render Wishes Wall (Halaman Depan)
    function renderWishes() {
        if (!wishesContainer) return;
        wishesContainer.innerHTML = "";

        // Filter tamu yang memiliki ucapan saja
        const itemsWithWishes = attendanceData.filter(item => item.ucapan && item.ucapan.trim() !== "");

        if (itemsWithWishes.length === 0) {
            wishesContainer.innerHTML = '<div class="wishes-empty"><i class="fa-regular fa-comment-dots"></i> Belum ada ucapan. Jadilah yang pertama!</div>';
            return;
        }

        // Urutkan berdasarkan yang terbaru
        const sortedWishes = [...itemsWithWishes].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        sortedWishes.forEach(item => {
            const card = document.createElement("div");
            card.className = "wish-card";

            const relativeTime = getRelativeTime(item.timestamp);

            card.innerHTML = `
                <div class="wish-meta">
                    <span class="wish-name">${escapeHTML(item.nama)}</span>
                    <span class="wish-badge">${escapeHTML(item.kategori)}</span>
                </div>
                <div class="wish-text">"${escapeHTML(item.ucapan)}"</div>
                <div style="font-size:0.75rem; text-align:right; opacity:0.6; margin-top:5px;">
                    <i class="fa-regular fa-clock"></i> ${relativeTime}
                </div>
            `;
            wishesContainer.appendChild(card);
        });
    }

    // 4. Form Submission Handling (Check-in)
    if (attendanceForm) {
        attendanceForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const btnSubmit = document.getElementById("btn-submit-attendance");
            const btnText = btnSubmit.querySelector(".btn-text");
            const spinner = btnSubmit.querySelector(".spinner");

            const name = document.getElementById("guest-name").value.trim();
            const category = document.getElementById("guest-category").value;
            const wishes = document.getElementById("guest-wishes").value.trim();

            if (!name) return;

            // Loading state
            btnSubmit.disabled = true;
            btnText.style.opacity = "0.5";
            spinner.classList.remove("hidden");

            const timestamp = new Date().toISOString();
            const newEntry = {
                id: "guest-" + Date.now(),
                timestamp: timestamp,
                nama: name,
                alamat: "-",
                kategori: category,
                jumlah: 1,
                ucapan: wishes
            };

            // 1. Simpan Lokal
            attendanceData.unshift(newEntry);
            localStorage.setItem("haflah_attendance", JSON.stringify(attendanceData));

            // Render ulang ucapan di frontend
            renderWishes();

            // 2. Sinkronisasi Google Sheets
            const scriptUrl = localStorage.getItem("haflah_script_url") || DEFAULT_SCRIPT_URL;
            if (scriptUrl) {
                try {
                    // Kirim ke Google Apps Script (menggunakan text/plain untuk bypass CORS preflight)
                    await fetch(scriptUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "text/plain"
                        },
                        body: JSON.stringify(newEntry)
                    });
                } catch (err) {
                    console.error("Gagal sinkronisasi ke Google Sheets:", err);
                }
            }

            // Sukses - Confetti & Alert
            setTimeout(() => {
                // Trigger confetti dari library yang sudah ada
                if (typeof confetti === "function") {
                    confetti({
                        particleCount: 80,
                        spread: 60,
                        origin: { y: 0.8 }
                    });
                }

                alert(`Terima kasih ${name}, absensi Anda berhasil dikirim!`);

                // Reset form
                attendanceForm.reset();

                // Reset Loading State
                btnSubmit.disabled = false;
                btnText.style.opacity = "1";
                spinner.classList.add("hidden");
            }, 800);
        });
    }

    // 5. Admin Portal Control
    if (adminTrigger) {
        adminTrigger.addEventListener("click", function (e) {
            e.preventDefault();
            adminModal.style.display = "flex";
            adminPasswordInput.focus();

            // Muat URL script di tab settings
            const scriptUrl = localStorage.getItem("haflah_script_url") || DEFAULT_SCRIPT_URL;
            if (scriptUrl && settingsScriptUrl) {
                settingsScriptUrl.value = scriptUrl;
            }
        });
    }

    if (adminClose) {
        adminClose.addEventListener("click", function () {
            closeAdminModal();
        });
    }

    // Tutup modal jika klik di luar
    window.addEventListener("click", function (e) {
        if (e.target === adminModal) {
            closeAdminModal();
        }
    });

    function closeAdminModal() {
        adminModal.style.display = "none";
        // Reset state
        authForm.reset();
        authError.classList.add("hidden");
    }

    // 6. Admin Authentication
    if (authForm) {
        authForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const inputPass = adminPasswordInput.value;
            const savedPass = localStorage.getItem("haflah_admin_password") || DEFAULT_PASS;

            if (inputPass === savedPass) {
                // Success
                authError.classList.add("hidden");
                authContainer.classList.add("hidden");
                dashboardContainer.classList.remove("hidden");

                // Sinkronisasi data dari Google Sheets (jika URL terpasang) sebelum render
                syncDataFromGoogleSheets().then(() => {
                    updateDashboard();
                });
            } else {
                // Failed
                authError.classList.remove("hidden");
                adminPasswordInput.value = "";
                adminPasswordInput.focus();
            }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener("click", function () {
            authContainer.classList.remove("hidden");
            dashboardContainer.classList.add("hidden");
            authForm.reset();
        });
    }

    // 7. Google Sheets Data Fetch (Sync)
    async function syncDataFromGoogleSheets() {
        const scriptUrl = localStorage.getItem("haflah_script_url") || DEFAULT_SCRIPT_URL;
        if (!scriptUrl) return;

        try {
            const response = await fetch(scriptUrl);
            if (!response.ok) throw new Error("Network response was not ok");
            const cloudData = await response.json();

            if (Array.isArray(cloudData)) {
                // Format data dari Google Sheets (sesuaikan huruf kecil kolom)
                const formattedData = cloudData.map((row, index) => ({
                    id: row.id || "cloud-" + index + "-" + Date.now(),
                    timestamp: row.timestamp || row.timestamp || row["time stamp"] || new Date().toISOString(),
                    nama: row.nama || "",
                    alamat: row.alamat || row.asal || "",
                    kategori: row.kategori || "Tamu Undangan",
                    jumlah: parseInt(row.jumlah || row.pax, 10) || 1,
                    ucapan: row.ucapan || ""
                }));

                // Urutkan data berdasarkan waktu terbaru di local memory
                attendanceData = formattedData.reverse();
                localStorage.setItem("haflah_attendance", JSON.stringify(attendanceData));
                renderWishes();
                
                // Update dashboard UI jika sedang terbuka
                if (dashboardContainer && !dashboardContainer.classList.contains("hidden")) {
                    updateDashboard();
                }
            }
        } catch (err) {
            console.error("Gagal sinkronisasi data dari Google Sheets:", err);
        }
    }

    // 8. Admin Dashboard Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const targetTab = this.getAttribute("data-tab");

            tabBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));

            this.classList.add("active");
            const contentEl = document.getElementById(targetTab);
            if (contentEl) contentEl.classList.add("active");
        });
    });

    // 9. Update Dashboard Stats & Table Data
    function updateDashboard() {
        // Ambil filter dan keyword pencarian
        const keyword = searchInput ? searchInput.value.toLowerCase() : "";
        const categoryFilter = filterSelect ? filterSelect.value : "all";

        // Filter data tamu
        const filteredData = attendanceData.filter(item => {
            const matchKeyword = item.nama.toLowerCase().includes(keyword) ||
                (item.ucapan && item.ucapan.toLowerCase().includes(keyword));
            const matchCategory = categoryFilter === "all" || item.kategori === categoryFilter;
            return matchKeyword && matchCategory;
        });

        // 1. Hitung Statistik Utama
        const totalSubmissions = attendanceData.length;
        const totalSantri = attendanceData.filter(item => item.kategori === "Santri").length;
        const totalAlumni = attendanceData.filter(item => item.kategori === "Alumni").length;
        const totalWaliSantri = attendanceData.filter(item => item.kategori === "Wali Santri").length;

        document.getElementById("stat-total-submissions").innerText = totalSubmissions;
        document.getElementById("stat-santri").innerText = totalSantri;
        document.getElementById("stat-alumni").innerText = totalAlumni;
        document.getElementById("stat-wali-santri").innerText = totalWaliSantri;

        // 2. Render Tabel Tamu (Desktop) dan Mobile Cards (Mobile)
        renderTableRows(filteredData);
        renderMobileCards(filteredData);
    }

    function renderTableRows(data) {
        if (!tableBody) return;
        tableBody.innerHTML = "";

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Data absensi tidak ditemukan</td></tr>';
            return;
        }

        data.forEach((item, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="text-center">${index + 1}</td>
                <td><strong>${escapeHTML(item.nama)}</strong></td>
                <td><span class="wish-badge">${escapeHTML(item.kategori)}</span></td>
                <td>${escapeHTML(item.ucapan || "-")}</td>
                <td>${formatDateTime(item.timestamp)}</td>
                <td class="text-center">
                    <button class="btn-delete-row" data-id="${item.id}" title="Hapus Data"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Event listener untuk tombol hapus
        tableBody.querySelectorAll(".btn-delete-row").forEach(btn => {
            btn.addEventListener("click", function () {
                const entryId = this.getAttribute("data-id");
                if (confirm("Apakah Anda yakin ingin menghapus data absensi ini secara lokal? (Perubahan tidak otomatis menghapus baris di Google Sheets online)")) {
                    attendanceData = attendanceData.filter(item => item.id !== entryId);
                    localStorage.setItem("haflah_attendance", JSON.stringify(attendanceData));
                    renderWishes();
                    updateDashboard();
                }
            });
        });
    }

    function renderMobileCards(data) {
        const cardsContainer = document.getElementById("admin-mobile-cards");
        if (!cardsContainer) return;
        cardsContainer.innerHTML = "";

        if (data.length === 0) {
            cardsContainer.innerHTML = '<div class="text-center" style="padding: 20px 0; opacity: 0.8;">Data absensi tidak ditemukan</div>';
            return;
        }

        data.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "admin-mobile-card";
            card.innerHTML = `
                <div class="admin-mobile-card-header">
                    <span class="admin-mobile-card-no">#${index + 1}</span>
                    <span class="admin-mobile-card-title">${escapeHTML(item.nama)}</span>
                    <span class="wish-badge">${escapeHTML(item.kategori)}</span>
                </div>
                <div class="admin-mobile-card-body">
                    <strong>Ucapan:</strong>
                    <p>"${escapeHTML(item.ucapan || "-")}"</p>
                </div>
                <div class="admin-mobile-card-footer">
                    <span><i class="fa-regular fa-clock"></i> ${formatDateTime(item.timestamp)}</span>
                    <div class="admin-mobile-card-actions">
                        <button class="btn-delete-row" data-id="${item.id}" title="Hapus Data" style="background:none; border:none; color:#f87171; cursor:pointer;"><i class="fa-solid fa-trash-can"></i> Hapus</button>
                    </div>
                </div>
            `;
            cardsContainer.appendChild(card);
        });

        // Event listener untuk tombol hapus di mobile cards
        cardsContainer.querySelectorAll(".btn-delete-row").forEach(btn => {
            btn.addEventListener("click", function () {
                const entryId = this.getAttribute("data-id");
                if (confirm("Apakah Anda yakin ingin menghapus data absensi ini secara lokal? (Perubahan tidak otomatis menghapus baris di Google Sheets online)")) {
                    attendanceData = attendanceData.filter(item => item.id !== entryId);
                    localStorage.setItem("haflah_attendance", JSON.stringify(attendanceData));
                    renderWishes();
                    updateDashboard();
                }
            });
        });
    }

    // Event listener untuk Filter & Search
    if (searchInput) {
        searchInput.addEventListener("input", updateDashboard);
    }
    if (filterSelect) {
        filterSelect.addEventListener("change", updateDashboard);
    }

    // 10. Settings Management
    if (settingsForm) {
        settingsForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // 1. Simpan URL Apps Script
            const urlInput = settingsScriptUrl.value.trim();
            if (urlInput) {
                localStorage.setItem("haflah_script_url", urlInput);
            } else {
                localStorage.removeItem("haflah_script_url");
            }

            // Tampilkan toast sukses
            if (settingsSuccessMsg) {
                settingsSuccessMsg.classList.remove("hidden");
                setTimeout(() => {
                    settingsSuccessMsg.classList.add("hidden");
                }, 3000);
            }

            // Pemicu pembaruan data
            syncDataFromGoogleSheets().then(() => {
                updateDashboard();
            });
        });
    }

    // 11. Export CSV
    if (btnExportCsv) {
        btnExportCsv.addEventListener("click", function () {
            if (attendanceData.length === 0) {
                alert("Tidak ada data untuk diekspor!");
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,";

            // Headers
            csvContent += "No,Nama,Kategori,Ucapan,Waktu Kehadiran\r\n";

            attendanceData.forEach((item, index) => {
                const row = [
                    index + 1,
                    `"${item.nama.replace(/"/g, '""')}"`,
                    `"${item.kategori.replace(/"/g, '""')}"`,
                    `"${(item.ucapan || '').replace(/"/g, '""')}"`,
                    `"${formatDateTime(item.timestamp)}"`
                ].join(",");
                csvContent += row + "\r\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Data_Absensi_Haflah_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // 11b. Reset Data
    const btnResetData = document.getElementById("btn-reset-data");
    if (btnResetData) {
        btnResetData.addEventListener("click", function () {
            const inputPass = prompt("Masukkan kata sandi konfirmasi untuk mereset seluruh data:");
            if (inputPass === null) return; // User cancelled the prompt

            if (inputPass === "peismatariskeren") {
                if (confirm("PERINGATAN: Apakah Anda yakin ingin menghapus SEMUA data absensi tamu? Tindakan ini akan mengosongkan data lokal.")) {
                    const confirmSecond = confirm("TINDAKAN INI TIDAK BISA DIBATALKAN. Anda yakin ingin melanjutkan?");
                    if (confirmSecond) {
                        attendanceData = [];
                        localStorage.setItem("haflah_attendance", JSON.stringify(attendanceData));
                        
                        // Hapus juga di Google Sheets jika terintegrasi
                        const scriptUrl = localStorage.getItem("haflah_script_url") || DEFAULT_SCRIPT_URL;
                        if (scriptUrl) {
                            fetch(scriptUrl, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "text/plain"
                                },
                                body: JSON.stringify({ action: "clear" })
                            }).then(response => {
                                console.log("Google Sheets database cleared");
                            }).catch(err => {
                                console.error("Gagal mereset Google Sheets:", err);
                            });
                        }
                        
                        renderWishes();
                        updateDashboard();
                        alert("Semua data absensi berhasil dihapus.");
                    }
                }
            } else {
                alert("Kata sandi salah! Reset data dibatalkan.");
            }
        });
    }

    // 12. Helper Functions
    function escapeHTML(str) {
        if (!str) return "";
        return str.replace(/[&<>'"]/g,
            tag => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;"
            }[tag] || tag)
        );
    }

    function formatDateTime(isoString) {
        if (!isoString) return "-";
        const date = new Date(isoString);
        if (isNaN(date.getTime())) return isoString;
        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }) + " WIB";
    }

    function getRelativeTime(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMins / 60);

        if (diffMins < 1) return "Baru saja";
        if (diffMins < 60) return `${diffMins} menit yang lalu`;
        if (diffHrs < 24) return `${diffHrs} jam yang lalu`;

        return date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short"
        });
    }

    // Render ucapan pertama kali saat halaman dimuat
    renderWishes();

    // Jalankan sync Google Sheets di latar belakang jika ada URL
    if (localStorage.getItem("haflah_script_url") || DEFAULT_SCRIPT_URL) {
        syncDataFromGoogleSheets();
    }
});
