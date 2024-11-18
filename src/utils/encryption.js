const crypto = require('crypto-js');
require('dotenv').config();

// Cifrar un texto utilizando AES
exports.encrypt = (text) => {
  try {
    return crypto.AES.encrypt(text, process.env.ENCRYPTION_SECRET).toString();
  } catch (error) {
    console.error('Error cifrando el texto:', error);
    throw new Error('No se pudo cifrar el texto');
  }
};

// Descifrar un texto utilizando AES
exports.decrypt = (cipherText) => {
  try {
    const bytes = crypto.AES.decrypt(cipherText, process.env.ENCRYPTION_SECRET);
    return bytes.toString(crypto.enc.Utf8);
  } catch (error) {
    console.error('Error descifrando el texto:', error);
    throw new Error('No se pudo descifrar el texto');
  }
};