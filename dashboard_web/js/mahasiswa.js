const API_URL = 'http://localhost:3000/api';

// Form elements
const formBuatMahasiswa = document.getElementById('form-buat-mahasiswa');
const inputNama = document.getElementById('nama');
const inputNim = document.getElementById('nim');
const inputRfidUid = document.getElementById('rfid_uid');
const tbodyMahasiswa = document.getElementById('body-tabel-mahasiswa');

// Modal elements
const editModalEl = document.getElementById('edit-modal');
const editModal = new bootstrap.Modal(editModalEl);
const editForm = document.getElementById('form-edit-mahasiswa');
const editId = document.getElementById('edit-mhs-id');
const editNama = document.getElementById('edit-nama');
const editNim = document.getElementById('edit-nim');
const editRfidUid = document.getElementById('edit-rfid_uid');


async function loadMahasiswa() {
    try {
        const response = await fetch(`${API_URL}/mahasiswa`);
        if (!response.ok) throw new Error('Gagal mengambil data mahasiswa');

        const mahasiswaList = await response.json();
        tbodyMahasiswa.innerHTML = '';

        mahasiswaList.forEach(mhs => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${mhs.nama}</td>
                <td>${mhs.nim}</td>
                <td>${mhs.rfid_uid}</td>
                <td class="aksi">
                    <button class="btn btn-warning btn-icon" title="Edit" onclick="openEditModal(${mhs.id})"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-danger btn-icon" title="Hapus" onclick="deleteMahasiswa(${mhs.id})"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tbodyMahasiswa.appendChild(tr);
        });

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

formBuatMahasiswa.addEventListener('submit', async (e) => {
    e.preventDefault(); 

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
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal mendaftarkan mahasiswa');
        }

        alert('Mahasiswa baru berhasil didaftarkan!');
        formBuatMahasiswa.reset();
        loadMahasiswa(); 

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
});

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
        loadMahasiswa();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function openEditModal(mahasiswa_id) {
    try {
        const response = await fetch(`${API_URL}/mahasiswa/${mahasiswa_id}`);
        if (!response.ok) throw new Error('Gagal mengambil data mahasiswa');

        const mhs = await response.json();

        editId.value = mhs.id;
        editNama.value = mhs.nama;
        editNim.value = mhs.nim;
        editRfidUid.value = mhs.rfid_uid;

        editModal.show();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

async function handleEditSubmit(e) {
    e.preventDefault();

    const id = editId.value;
    const data = {
        nama: editNama.value,
        nim: editNim.value,
        rfid_uid: editRfidUid.value
    };

    try {
        const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal mengupdate data');
        }

        alert('Data mahasiswa berhasil diupdate!');
        editModal.hide();
        loadMahasiswa();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

// Initial load and event listeners
document.addEventListener('DOMContentLoaded', loadMahasiswa);
editForm.addEventListener('submit', handleEditSubmit);
