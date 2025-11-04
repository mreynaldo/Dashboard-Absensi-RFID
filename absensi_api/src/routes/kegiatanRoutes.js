const express = require('express');
const router = express.Router();
const kegiatanController = require('../controllers/kegiatanController');

router.post('/', kegiatanController.createKegiatan);

router.get('/', kegiatanController.getAllKegiatan);

router.get('/:id', kegiatanController.getKegiatanById);

router.put('/set-aktif/:id', kegiatanController.setKegiatanAktif);

router.get('/:id/status-kehadiran', kegiatanController.getStatusKehadiran);

router.post('/:id/peserta', kegiatanController.addPesertaToKegiatan);

router.get('/:id/peserta', kegiatanController.getPesertaByKegiatanId);

router.delete('/:kegiatan_id/peserta/:mahasiswa_id', kegiatanController.removePesertaFromKegiatan);


module.exports = router;