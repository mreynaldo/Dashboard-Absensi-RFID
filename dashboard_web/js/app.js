const API_URL = 'http://localhost:3000/api';

const selectKegiatan = document.getElementById('pilih-kegiatan');
const tbodyLaporan = document.getElementById('body-tabel-laporan');
const btnRefresh = document.getElementById('btn-refresh');
const formTambahPeserta = document.getElementById('form-tambah-peserta');
const selectMahasiswa = document.getElementById('pilih-mahasiswa');
const btnTambahPeserta = document.getElementById('btn-tambah-peserta');

async function loadKegiatanDropdown() {
    try {
        const response = await fetch(`${API_URL}/kegiatan`);
        if (!response.ok) throw new Error('Gagal mengambil daftar kegiatan');
        
        const kegiatanList = await response.json();

        selectKegiatan.innerHTML = '<option value="">-- Pilih Kegiatan --</option>'; 

        kegiatanList.forEach(kegiatan => {
            const option = document.createElement('option');
            option.value = kegiatan.id;
            option.textContent = kegiatan.nama_kegiatan;
            if (kegiatan.status === 'aktif') {
                option.textContent += ' (AKTIF)';
            }
            selectKegiatan.appendChild(option);
        });

        const urlParams = new URLSearchParams(window.location.search);
        const kegiatanIdFromUrl = urlParams.get('kegiatan_id');
        
        if (kegiatanIdFromUrl) {
            selectKegiatan.value = kegiatanIdFromUrl; 
            loadLaporanKehadiran(kegiatanIdFromUrl); 
        }

    } catch (error) {
        console.error(error);
        selectKegiatan.innerHTML = '<option value="">Gagal memuat kegiatan</option>';
    }
}

async function loadLaporanKehadiran(kegiatan_id) {
    if (!kegiatan_id) {
        tbodyLaporan.innerHTML = '<tr><td colspan="5" style="text-align: center;">Pilih kegiatan untuk melihat laporan.</td></tr>';
        formTambahPeserta.style.display = 'none'; 
        return;
    }

    formTambahPeserta.style.display = 'flex';
    tbodyLaporan.innerHTML = '<tr><td colspan="5" style="text-align: center;">Memuat data...</td></tr>';

    try {
        const response = await fetch(`${API_URL}/kegiatan/${kegiatan_id}/status-kehadiran`);
        if (!response.ok) throw new Error('Gagal mengambil laporan kehadiran');

        const laporanList = await response.json();
        tbodyLaporan.innerHTML = ''; 

        if (laporanList.length === 0) {
            tbodyLaporan.innerHTML = '<tr><td colspan="5" style="text-align: center;">Belum ada peserta terdaftar di kegiatan ini.</td></tr>';
            return;
        }

        laporanList.forEach(laporan => {
            const tr = document.createElement('tr');
            const statusClass = laporan.status === 'Hadir' ? 'status-hadir' : 'status-belum';

            tr.innerHTML = `
                <td>${laporan.nama}</td>
                <td>${laporan.nim}</td>
                <td>
                    <span class="status ${statusClass}">
                        ${laporan.status}
                    </span>
                </td>
                <td>${laporan.waktu_absen ? new Date(laporan.waktu_absen).toLocaleString('id-ID') : '-'}</td>
                <td class="aksi">
                    <button class="btn-delete" onclick="removePeserta(${kegiatan_id}, ${laporan.mahasiswa_id})">Hapus</button>
                </td>
            `;
            tbodyLaporan.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
        tbodyLaporan.innerHTML = `<tr><td colspan="5" style="text-align: center;">${error.message}</td></tr>`;
    }
}

async function loadMahasiswaDropdown() {
    try {
        const response = await fetch(`${API_URL}/mahasiswa`);
        if (!response.ok) throw new Error('Gagal mengambil daftar mahasiswa');

        const mahasiswaList = await response.json();

        selectMahasiswa.innerHTML = '<option value="">-- Pilih Mahasiswa --</option>'; 

        mahasiswaList.forEach(mhs => {
            const option = document.createElement('option');
            option.value = mhs.id;
            option.textContent = `${mhs.nama} (${mhs.nim})`;
            selectMahasiswa.appendChild(option);
        });

    } catch (error) {
        console.error(error);
        selectMahasiswa.innerHTML = '<option value="">Gagal memuat</option>';
    }
}

async function removePeserta(kegiatan_id, mahasiswa_id) {
    if (!confirm('Anda yakin ingin menghapus peserta ini dari kegiatan?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/kegiatan/${kegiatan_id}/peserta/${mahasiswa_id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal menghapus peserta');
        }

        alert('Peserta berhasil dihapus.');
        loadLaporanKehadiran(kegiatan_id); 

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

document.addEventListener('DOMContentLoaded', loadKegiatanDropdown);

selectKegiatan.addEventListener('change', () => {
    const selectedKegiatanId = selectKegiatan.value;
    loadLaporanKehadiran(selectedKegiatanId);
});

btnRefresh.addEventListener('click', () => {
    const selectedKegiatanId = selectKegiatan.value;
    loadLaporanKehadiran(selectedKegiatanId);
});

document.addEventListener('DOMContentLoaded', loadMahasiswaDropdown);

btnTambahPeserta.addEventListener('click', async () => {
    const kegiatan_id = selectKegiatan.value;
    const mahasiswa_id = selectMahasiswa.value;

    if (!kegiatan_id || !mahasiswa_id) {
        alert('Pilih kegiatan dan mahasiswa terlebih dahulu.');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/kegiatan/${kegiatan_id}/peserta`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mahasiswa_id: mahasiswa_id })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal menambah peserta');
        }

        alert('Peserta berhasil ditambahkan ke kegiatan!');
        selectMahasiswa.value = ''; 
        loadLaporanKehadiran(kegiatan_id); 

    } catch (error) {
        console.error(error);
        alert(error.message); 
    }
});