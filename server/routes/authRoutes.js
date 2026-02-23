const express = require('express');
const router = express.Router();
const { register, login, getAllDoctors } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/doctors', getAllDoctors);

module.exports = router;
