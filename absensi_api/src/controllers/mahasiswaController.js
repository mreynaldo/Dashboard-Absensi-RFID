const db = require('../config/db');

exports.createMahasiswa = async (req, res) => {
    try {
        const { nama, nim, rfid_uid } = req.body;

        if (!nama || !nim || !rfid_uid) {
            return res.status(400).json({ message: 'Semua field (nama, nim, rfid_uid) wajib diisi.' });
        }

        const query = "INSERT INTO mahasiswa (nama, nim, rfid_uid) VALUES (?, ?, ?)";
        const [results] = await db.query(query, [nama, nim, rfid_uid]);

        res.status(201).json({ message: 'Mahasiswa berhasil didaftarkan', id: results.insertId });

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Error: NIM atau UID RFID sudah terdaftar.' });
        }
        res.status(500).json({ message: 'Error mendaftarkan mahasiswa', error: err });
    }
};

exports.getAllMahasiswa = async (req, res) => {
    try {
        const query = "SELECT id, nama, nim, rfid_uid FROM mahasiswa ORDER BY nama ASC";
        const [results] = await db.query(query);
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ message: 'Error mengambil data mahasiswa', error: err });
    }
};


exports.getMahasiswaById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "SELECT * FROM mahasiswa WHERE id = ?";
        const [results] = await db.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Mahasiswa tidak ditemukan.' });
        }
        res.status(200).json(results[0]);
    } catch (err) {
        res.status(500).json({ message: 'Error mengambil detail mahasiswa', error: err });
    }
};

exports.updateMahasiswa = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama, nim, rfid_uid } = req.body;

        if (!nama || !nim || !rfid_uid) {
            return res.status(400).json({ message: 'Semua field (nama, nim, rfid_uid) wajib diisi.' });
        }

        const query = "UPDATE mahasiswa SET nama = ?, nim = ?, rfid_uid = ? WHERE id = ?";
        const [results] = await db.query(query, [nama, nim, rfid_uid, id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Mahasiswa tidak ditemukan untuk diupdate.' });
        }

        res.status(200).json({ message: 'Data mahasiswa berhasil diupdate.' });

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Error: NIM atau UID RFID sudah digunakan oleh data lain.' });
        }
        res.status(500).json({ message: 'Error mengupdate mahasiswa', error: err });
    }
};

exports.deleteMahasiswa = async (req, res) => {
    try {
        const { id } = req.params;
        const query = "DELETE FROM mahasiswa WHERE id = ?";
        const [results] = await db.query(query, [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Mahasiswa tidak ditemukan untuk dihapus.' });
        }

        res.status(200).json({ message: 'Mahasiswa berhasil dihapus.' });
    } catch (err) {
        if (err.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'Gagal menghapus: Mahasiswa ini sudah memiliki data absensi atau terdaftar di kegiatan.' });
        }
        res.status(500).json({ message: 'Error menghapus mahasiswa', error: err });
    }
};