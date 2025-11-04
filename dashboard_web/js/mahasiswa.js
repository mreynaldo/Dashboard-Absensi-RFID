const API_URL = 'http://localhost:3000/api';

const formBuatMahasiswa = document.getElementById('form-buat-mahasiswa');
const inputNama = document.getElementById('nama');
const inputNim = document.getElementById('nim');
const inputRfidUid = document.getElementById('rfid_uid');
const tbodyMahasiswa = document.getElementById('body-tabel-mahasiswa');
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById('form-edit-mahasiswa');
const editModalCloseBtn = document.getElementById('modal-close-btn');
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
                    <button class="btn-edit" onclick="openEditModal(${mhs.id})">Edit</button>
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
        formBuatMahasiswa.reset(); // Kosongkan form
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
        loadMahasiswa(); // Muat ulang daftar

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

        editModal.style.display = 'flex';

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

function closeEditModal() {
    editModal.style.display = 'none';
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
        closeEditModal();
        loadMahasiswa();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}

document.addEventListener('DOMContentLoaded', loadMahasiswa);

editModalCloseBtn.addEventListener('click', closeEditModal);

editForm.addEventListener('submit', handleEditSubmit);

window.addEventListener('click', (e) => {
    if (e.target == editModal) {
        closeEditModal();
    }
});