const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensiController');

router.post('/', absensiController.catatAbsensi);

module.exports = router;