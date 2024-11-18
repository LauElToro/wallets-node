const { ethers } = require('ethers');
const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');
const crypto = require('crypto-js');
require('dotenv').config();
const provider = require('../config/infura');

// Realizar un retiro desde la wallet de un usuario
exports.withdrawFunds = async (req, res) => {
  try {
    const { userId, toAddress, amount } = req.body;

    // Verificar si la wallet del usuario existe
    const wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet no encontrada' });
    }

    // Descifrar la clave privada de la wallet
    const decryptedPrivateKey = crypto.AES.decrypt(wallet.privateKey, process.env.ENCRYPTION_SECRET).toString(crypto.enc.Utf8);
    const signer = new ethers.Wallet(decryptedPrivateKey, provider);

    // Verificar si el saldo es suficiente
    const balance = await provider.getBalance(wallet.address);
    const balanceInEther = ethers.utils.formatEther(balance);
    if (parseFloat(balanceInEther) < parseFloat(amount)) {
      return res.status(400).json({ error: 'Saldo insuficiente' });
    }

    // Crear la transacción de retiro
    const tx = {
      to: toAddress,
      value: ethers.utils.parseEther(amount.toString()),
    };

    // Enviar la transacción
    const txResponse = await signer.sendTransaction(tx);
    await txResponse.wait(3); // Esperar 3 confirmaciones

    // Registrar la transacción en la base de datos
    const transaction = await Transaction.create({
      user_id: userId,
      fromAddress: wallet.address,
      toAddress,
      amount,
      tokenAddress: 'ETH',
      status: 'completed',
      hash: txResponse.hash,
    });

    res.status(201).json({ message: 'Retiro realizado con éxito', transaction });
  } catch (error) {
    console.error('Error realizando el retiro:', error);
    res.status(500).json({ error: 'No se pudo realizar el retiro' });
  }
};
