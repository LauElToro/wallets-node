const express = require('express');
const walletController = require('../controllers/walletController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas relacionadas a wallets

// Crear una nueva wallet para un usuario
router.post('/create', authenticateUser, walletController.createWallet);

// Obtener la wallet de un usuario
router.get('/:userId', authenticateUser, walletController.getWalletByUser);

// Obtener el saldo de la wallet de un usuario
router.get('/balance/:userId', authenticateUser, walletController.getWalletBalance);

module.exports = router;
