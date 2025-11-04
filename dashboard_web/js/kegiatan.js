// URL API Backend Anda
const API_URL = 'http://localhost:3000/api';

// Ambil elemen dari HTML
const formBuatKegiatan = document.getElementById('form-buat-kegiatan');
const inputNamaKegiatan = document.getElementById('nama_kegiatan');
const inputDeskripsi = document.getElementById('deskripsi');
const tbodyKegiatan = document.getElementById('body-tabel-kegiatan');

/**
 * Fungsi untuk memuat semua kegiatan dari API
 * dan menampilkannya di tabel
 */
async function loadKegiatan() {
    try {
        const response = await fetch(`${API_URL}/kegiatan`);
        if (!response.ok) throw new Error('Gagal mengambil data kegiatan');
        
        const kegiatanList = await response.json();

        // Kosongkan tabel sebelum diisi
        tbodyKegiatan.innerHTML = '';

        // Loop setiap data kegiatan dan buat baris tabel
        kegiatanList.forEach(kegiatan => {
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${kegiatan.nama_kegiatan}</td>
                <td>
                    <span class="status ${kegiatan.status === 'aktif' ? 'status-aktif' : ''}">
                        ${kegiatan.status}
                    </span>
                </td>
                <td class="aksi">
                    <button onclick="setAktif(${kegiatan.id})">Set Aktif</button>
                    <a href="index.html?kegiatan_id=${kegiatan.id}" class="button">Lihat Laporan</a>
                </td>
            `;
            tbodyKegiatan.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

/**
 * Event listener untuk form "Buat Kegiatan Baru"
 */
formBuatKegiatan.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah form refresh halaman

    const nama = inputNamaKegiatan.value;
    const deskripsi = inputDeskripsi.value;

    try {
        const response = await fetch(`${API_URL}/kegiatan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nama_kegiatan: nama,
                deskripsi: deskripsi
            })
        });

        if (!response.ok) throw new Error('Gagal membuat kegiatan baru');

        alert('Kegiatan baru berhasil dibuat!');
        formBuatKegiatan.reset(); // Kosongkan form
        loadKegiatan(); // Muat ulang daftar kegiatan

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

/**
 * Fungsi yang dipanggil saat tombol "Set Aktif" diklik
 */
async function setAktif(kegiatan_id) {
    if (!confirm('Anda yakin ingin mengaktifkan kegiatan ini? (Kegiatan lain akan non-aktif)')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/kegiatan/set-aktif/${kegiatan_id}`, {
            method: 'PUT'
        });

        if (!response.ok) throw new Error('Gagal mengaktifkan kegiatan');

        alert('Kegiatan berhasil diaktifkan!');
        loadKegiatan(); // Muat ulang daftar kegiatan untuk update status

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// Panggil fungsi loadKegiatan() saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', loadKegiatan);