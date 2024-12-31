const express = require('express');
const { authenticateUser } = require('../middlewares/authMiddleware');
const { verifyTransactionStatus, transactionController, transferToken }  = require('../controllers/transactionController');

const router = express.Router();

// Rutas relacionadas a transacciones
// Transferir tokens
router.post("/transferToken", transferToken);

// Verificar el estado de la transaccion 
router.get("/status/:hash", verifyTransactionStatus);

// Crear una nueva transacción
router.post('/create', authenticateUser, transactionController.createTransaction);

// Obtener las transacciones de un usuario
router.get('/user/:userId', authenticateUser, transactionController.getTransactionsByUser);

// Obtener el estado de una transacción específica
router.get('/status/:hash', authenticateUser, transactionController.getTransactionStatus);

module.exports = router;
