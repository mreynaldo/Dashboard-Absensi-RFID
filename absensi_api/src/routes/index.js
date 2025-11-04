const express = require('express');
const router = express.Router();
const kegiatanRoutes = require('./kegiatanRoutes');
const absensiRoutes = require('./absensiRoutes');
const mahasiswaRoutes = require('./mahasiswaRoutes');

router.use('/mahasiswa', mahasiswaRoutes);

router.use('/kegiatan', kegiatanRoutes);

router.use('/absensi', absensiRoutes);

module.exports = router;