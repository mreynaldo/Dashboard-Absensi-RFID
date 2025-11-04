const db = require('../config/db');

exports.createKegiatan = async (req, res) => {
    try {
        const { nama_kegiatan, deskripsi } = req.body;
        if (!nama_kegiatan) {
            return res.status(400).json({ message: 'Nama kegiatan tidak boleh kosong.' });
        }

        const query = "INSERT INTO kegiatan (nama_kegiatan, deskripsi, status) VALUES (?, ?, 'selesai')";
        const [results] = await db.query(query, [nama_kegiatan, deskripsi]);

        res.status(201).json({ message: 'Kegiatan berhasil dibuat', id: results.insertId });
    } catch (err) {
        res.status(500).json({ message: 'Error membuat kegiatan', error: err });
    }
};

exports.setKegiatanAktif = async (req, res) => {
    try {
        const { id } = req.params;

        await db.query("UPDATE kegiatan SET status = 'selesai'");
        const [results] = await db.query("UPDATE kegiatan SET status = 'aktif' WHERE id = ?", [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Kegiatan tidak ditemukan' });
        }
        res.status(200).json({ message: `Kegiatan ${id} sekarang aktif.` });
    } catch (err) {
        res.status(500).json({ message: 'Error set aktif', error: err });
    }
};

exports.getStatusKehadiran = async (req, res) => {
    try {
        const { id: kegiatan_id } = req.params;
        const query = `
            SELECT m.id AS mahasiswa_id, m.nama, m.nim, a.waktu_absen
            FROM peserta_kegiatan pk
            JOIN mahasiswa m ON pk.mahasiswa_id = m.id
            LEFT JOIN absensi a ON a.mahasiswa_id = m.id AND a.kegiatan_id = pk.kegiatan_id
            WHERE pk.kegiatan_id = ? ORDER BY m.nama ASC`;

        const [results] = await db.query(query, [kegiatan_id]);

        const laporan = results.map(item => ({
            mahasiswa_id: item.mahasiswa_id,
            nama: item.nama,
            nim: item.nim,
            status: item.waktu_absen ? 'Hadir' : 'Belum Hadir',
            waktu_absen: item.waktu_absen
        }));

        res.status(200).json(laporan);
    } catch (err) {
        res.status(500).json({ message: 'Error mengambil data', error: err });
    }
};

exports.getAllKegiatan = async (req, res) => {
    try {
        const query = "SELECT * FROM kegiatan ORDER BY created_at DESC";
        const [results] = await db.query(query);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error mengambil semua kegiatan', error: err });
    }
};

exports.getKegiatanById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "SELECT * FROM kegiatan WHERE id = ?";
        const [results] = await db.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Kegiatan tidak ditemukan.' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error mengambil detail kegiatan', error: err });
    }
};

exports.addPesertaToKegiatan = async (req, res) => {
    try {
        const { id: kegiatan_id } = req.params;
        const { mahasiswa_id } = req.body;

        if (!mahasiswa_id) {
            return res.status(400).json({ message: 'mahasiswa_id tidak boleh kosong.' });
        }

        const query = "INSERT INTO peserta_kegiatan (kegiatan_id, mahasiswa_id) VALUES (?, ?)";
        await db.query(query, [kegiatan_id, mahasiswa_id]);

        res.status(201).json({ message: 'Peserta berhasil ditambahkan.' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Mahasiswa sudah terdaftar di kegiatan ini.' });
        }
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(404).json({ message: 'Mahasiswa ID atau Kegiatan ID tidak ditemukan.' });
        }
        res.status(500).json({ message: 'Error menambah peserta', error: err });
    }
};

exports.removePesertaFromKegiatan = async (req, res) => {
    try {
        const { kegiatan_id, mahasiswa_id } = req.params;

        const query = "DELETE FROM peserta_kegiatan WHERE kegiatan_id = ? AND mahasiswa_id = ?";
        const [results] = await db.query(query, [kegiatan_id, mahasiswa_id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Data peserta tidak ditemukan untuk dihapus.' });
        }

        res.status(200).json({ message: 'Peserta berhasil dihapus dari kegiatan.' });
    } catch (err) {
        res.status(500).json({ message: 'Error menghapus peserta', error: err });
    }
};

exports.getPesertaByKegiatanId = async (req, res) => {
    try {
        const { id: kegiatan_id } = req.params;
        const query = `
            SELECT m.id, m.nama, m.nim 
            FROM peserta_kegiatan pk
            JOIN mahasiswa m ON pk.mahasiswa_id = m.id
            WHERE pk.kegiatan_id = ?
            ORDER BY m.nama ASC`;

        const [results] = await db.query(query, [kegiatan_id]);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error mengambil daftar peserta', error: err });
    }
};