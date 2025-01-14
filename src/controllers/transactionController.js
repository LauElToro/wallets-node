const { ethers } = require('ethers');
const provider = require('../config/infura');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const { transferToken } = require("../services/erc20Service");
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

exports.verifyTransactionStatus = async (req, res) => {
  try {
    const { hash } = req.params;

    const transaction = await Transaction.findOne({ where: { hash } });
    if (!transaction) {
      return res.status(404).json({ error: "Transacción no encontrada" });
    }

    const tx = await provider.getTransaction(hash);
    if (tx && tx.confirmations >= 3) {
      transaction.status = "CONFIRMED";
      await transaction.save();
      return res.status(200).json({ message: "Transacción confirmada", transaction });
    }

    res.status(200).json({ message: "Transacción pendiente de confirmación", transaction });
  } catch (error) {
    console.error("Error verificando el estado de la transacción:", error);
    res.status(500).json({ error: "Error verificando la transacción" });
  }
};

exports.transferToken = async (req, res) => {
  try {
    const { privateKey, toAddress, tokenAddress, amount } = req.body;

    if (!privateKey || !toAddress || !tokenAddress || !amount) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const tx = await transferToken(privateKey, toAddress, tokenAddress, amount);
    res.status(200).json({ message: "Transacción enviada", transactionHash: tx.hash });
  } catch (error) {
    console.error("Error transfiriendo tokens:", error);
    res.status(500).json({ error: "No se pudo realizar la transferencia" });
  }
};