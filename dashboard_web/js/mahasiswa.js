// URL API Backend Anda
const API_URL = 'http://localhost:3000/api';

// Ambil elemen dari HTML
const formBuatMahasiswa = document.getElementById('form-buat-mahasiswa');
const inputNama = document.getElementById('nama');
const inputNim = document.getElementById('nim');
const inputRfidUid = document.getElementById('rfid_uid');
const tbodyMahasiswa = document.getElementById('body-tabel-mahasiswa');

/**
 * Fungsi untuk memuat semua mahasiswa dari API
 * dan menampilkannya di tabel
 */
async function loadMahasiswa() {
    try {
        const response = await fetch(`${API_URL}/mahasiswa`);
        if (!response.ok) throw new Error('Gagal mengambil data mahasiswa');
        
        const mahasiswaList = await response.json();
        tbodyMahasiswa.innerHTML = ''; // Kosongkan tabel

        mahasiswaList.forEach(mhs => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${mhs.nama}</td>
                <td>${mhs.nim}</td>
                <td>${mhs.rfid_uid}</td>
                <td class="aksi">
                    <button class="btn-delete" onclick="deleteMahasiswa(${mhs.id})">Hapus</button>
                </td>
            `;
            tbodyMahasiswa.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

/**
 * Event listener untuk form "Daftarkan Mahasiswa Baru"
 */
formBuatMahasiswa.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah form refresh halaman

    const data = {
        nama: inputNama.value,
        nim: inputNim.value,
        rfid_uid: inputRfidUid.value
    };

    try {
        const response = await fetch(`${API_URL}/mahasiswa`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            // Coba baca pesan error dari API
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal mendaftarkan mahasiswa');
        }

        alert('Mahasiswa baru berhasil didaftarkan!');
        formBuatMahasiswa.reset(); // Kosongkan form
        loadMahasiswa(); // Muat ulang daftar mahasiswa

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

/**
 * Fungsi yang dipanggil saat tombol "Hapus" diklik
 */
async function deleteMahasiswa(mahasiswa_id) {
    if (!confirm('Anda yakin ingin menghapus mahasiswa ini?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/mahasiswa/${mahasiswa_id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal menghapus mahasiswa');
        }

        alert('Mahasiswa berhasil dihapus.');
        loadMahasiswa(); // Muat ulang daftar

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// Panggil fungsi loadMahasiswa() saat halaman pertama kali dibuka
document.addEventListener('DOMContentLoaded', loadMahasiswa);