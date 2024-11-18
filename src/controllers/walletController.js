const { ethers } = require('ethers');
const Wallet = require('../models/Wallet');
const User = require('../models/User');
const crypto = require('crypto-js');
require('dotenv').config();

// Crear una nueva wallet para un usuario
exports.createWallet = async (req, res) => {
    try {
      // Verificar si el req.user contiene el userId
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un userId válido.' });
      }
      
      const { userId } = req.user;
  
      // Verificar si el usuario existe en la base de datos
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      // Crear una nueva wallet utilizando ethers.js
      const wallet = ethers.Wallet.createRandom();
      const encryptedPrivateKey = crypto.AES.encrypt(wallet.privateKey, process.env.ENCRYPTION_SECRET).toString();
  
      // Guardar la wallet en la base de datos
      const newWallet = await Wallet.create({
        user_id: userId,
        address: wallet.address,
        privateKey: encryptedPrivateKey,
        balance: 0,
      });
  
      res.status(201).json({ message: 'Wallet creada exitosamente', wallet: newWallet });
    } catch (error) {
      console.error('Error creando la wallet:', error);
      res.status(500).json({ error: 'No se pudo crear la wallet' });
    }
  };
  

// Obtener la wallet de un usuario
exports.getWalletByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar la wallet por el ID del usuario
    const wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet no encontrada' });
    }

    res.status(200).json(wallet);
  } catch (error) {
    console.error('Error obteniendo la wallet:', error);
    res.status(500).json({ error: 'No se pudo obtener la wallet' });
  }
};

// Obtener el saldo de la wallet de un usuario
exports.getWalletBalance = async (req, res) => {
  try {
    const { userId } = req.params;

    // Buscar la wallet por el ID del usuario
    const wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet no encontrada' });
    }

    // Obtener el saldo de la blockchain
    const provider = require('../config/infura');
    const balance = await provider.getBalance(wallet.address);
    const balanceInEther = ethers.utils.formatEther(balance);

    res.status(200).json({ address: wallet.address, balance: balanceInEther });
  } catch (error) {
    console.error('Error obteniendo el saldo de la wallet:', error);
    res.status(500).json({ error: 'No se pudo obtener el saldo de la wallet' });
  }
};
