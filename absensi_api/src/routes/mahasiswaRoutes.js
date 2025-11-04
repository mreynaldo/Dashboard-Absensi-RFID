const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');

router.post('/', mahasiswaController.createMahasiswa);

router.get('/', mahasiswaController.getAllMahasiswa);

router.get('/:id', mahasiswaController.getMahasiswaById);

router.put('/:id', mahasiswaController.updateMahasiswa);

router.delete('/:id', mahasiswaController.deleteMahasiswa);

module.exports = router;