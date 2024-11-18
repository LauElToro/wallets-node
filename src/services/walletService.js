const { ethers } = require('ethers');
const Wallet = require('../models/Wallet');
const crypto = require('crypto-js');
require('dotenv').config();

// Crear una nueva wallet para un usuario
exports.createWallet = async (userId) => {
  try {
    // Generar una nueva wallet con ethers.js
    const wallet = ethers.Wallet.createRandom();

    // Cifrar la clave privada antes de almacenarla
    const encryptedPrivateKey = crypto.AES.encrypt(wallet.privateKey, process.env.ENCRYPTION_SECRET).toString();

    // Guardar la wallet en la base de datos
    const newWallet = await Wallet.create({
      user_id: userId, 
      address: wallet.address,
      privateKey: encryptedPrivateKey,
      balance: 0,
    });

    return newWallet;
  } catch (error) {
    console.error('Error creando la wallet:', error);
    throw new Error('No se pudo crear la wallet');
  }
};

// Obtener la wallet de un usuario por su ID
exports.getWalletByUserId = async (userId) => {
  try {
    const wallet = await Wallet.findOne({ where: { userId } });
    if (!wallet) {
      throw new Error('Wallet no encontrada');
    }
    return wallet;
  } catch (error) {
    console.error('Error obteniendo la wallet del usuario:', error);
    throw new Error('No se pudo obtener la wallet del usuario');
  }
};

// Obtener el saldo de la wallet
exports.getWalletBalance = async (walletAddress) => {
  try {
    const provider = require('../config/infura');
    const balance = await provider.getBalance(walletAddress);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error obteniendo el saldo de la wallet:', error);
    throw new Error('No se pudo obtener el saldo de la wallet');
  }
};
