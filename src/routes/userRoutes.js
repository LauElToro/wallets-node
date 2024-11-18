const express = require('express');
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas relacionadas a usuarios

// Registrar un nuevo usuario
router.post('/register', userController.registerUser);

// Iniciar sesión
router.post('/login', userController.loginUser);

// Obtener el perfil del usuario
router.get('/profile', authenticateUser, userController.getUserProfile);

module.exports = router;
