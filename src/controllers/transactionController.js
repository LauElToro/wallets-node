const { ethers } = require('ethers');
const provider = require('../config/infura');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');

// Registrar una nueva transacción en la base de datos
exports.createTransaction = async (req, res) => {
    try {
      const { user_id, to_address, amount, token_address } = req.body;
  
      // Verificar si el usuario tiene una wallet
      const wallet = await Wallet.findOne({ where: { user_id } });
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet no encontrada' });
      }
  
      // Crear una nueva transacción
      const transaction = await Transaction.create({
        user_id,
        from_address: wallet.address,
        to_address,
        amount,
        token_address,
        status: 'PENDING',
      });
  
      res.status(201).json({ message: 'Transacción creada exitosamente', transaction });
    } catch (error) {
      console.error('Error creando la transacción:', error);
      res.status(500).json({ error: 'No se pudo crear la transacción' });
    }
  };

// Obtener transacciones de un usuario
exports.getTransactionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.findAll({ where: { userId } });
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error obteniendo transacciones:', error);
    res.status(500).json({ error: 'No se pudieron obtener las transacciones' });
  }
};

// Verificar el estado de una transacción
exports.getTransactionStatus = async (req, res) => {
  try {
    const { hash } = req.params;
    const txReceipt = await provider.getTransactionReceipt(hash);
    if (!txReceipt) {
      return res.status(404).json({ status: 'pending' });
    }
    res.status(200).json({ status: txReceipt.status === 1 ? 'success' : 'failed' });
  } catch (error) {
    console.error('Error obteniendo estado de la transacción:', error);
    res.status(500).json({ error: 'No se pudo obtener el estado de la transacción' });
  }
};