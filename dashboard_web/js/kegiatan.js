const API_URL = 'http://localhost:3000/api';

const formBuatKegiatan = document.getElementById('form-buat-kegiatan');
const inputNamaKegiatan = document.getElementById('nama_kegiatan');
const inputDeskripsi = document.getElementById('deskripsi');
const tbodyKegiatan = document.getElementById('body-tabel-kegiatan');

async function loadKegiatan() {
    try {
        const response = await fetch(`${API_URL}/kegiatan`);
        if (!response.ok) throw new Error('Gagal mengambil data kegiatan');
        
        const kegiatanList = await response.json();

        tbodyKegiatan.innerHTML = '';

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

formBuatKegiatan.addEventListener('submit', async (e) => {
    e.preventDefault(); 

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
        formBuatKegiatan.reset(); 
        loadKegiatan(); 

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

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
        loadKegiatan(); 

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

document.addEventListener('DOMContentLoaded', loadKegiatan);