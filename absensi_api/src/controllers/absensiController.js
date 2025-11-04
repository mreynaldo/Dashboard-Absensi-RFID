const db = require('../config/db');

exports.catatAbsensi = async (req, res) => {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ message: 'Error: UID kartu tidak boleh kosong.' });

    try {
        const [mhsResults] = await db.query("SELECT id FROM mahasiswa WHERE rfid_uid = ?", [uid]);
        if (mhsResults.length === 0) {
            return res.status(404).json({ message: 'Kartu tidak terdaftar!' });
        }
        const mahasiswa_id = mhsResults[0].id;

        const [kegiatanResults] = await db.query("SELECT id FROM kegiatan WHERE status = 'aktif' LIMIT 1");
        if (kegiatanResults.length === 0) {
            return res.status(404).json({ message: 'Tidak ada kegiatan yang sedang aktif!' });
        }
        const kegiatan_id = kegiatanResults[0].id;
        
        const [pesertaResults] = await db.query("SELECT id FROM peserta_kegiatan WHERE mahasiswa_id = ? AND kegiatan_id = ?", [mahasiswa_id, kegiatan_id]);
        if (pesertaResults.length === 0) {
            return res.status(403).json({ message: 'Anda tidak terdaftar di kegiatan ini!' });
        }

        const [duplikatResults] = await db.query("SELECT id FROM absensi WHERE mahasiswa_id = ? AND kegiatan_id = ?", [mahasiswa_id, kegiatan_id]);
        if (duplikatResults.length > 0) {
            return res.status(409).json({ message: 'Anda sudah melakukan absensi untuk kegiatan ini.' });
        }

        await db.query("INSERT INTO absensi (mahasiswa_id, kegiatan_id) VALUES (?, ?)", [mahasiswa_id, kegiatan_id]);
        res.status(201).json({ message: 'Absensi berhasil dicatat!' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error server database', error: err });
    }
};