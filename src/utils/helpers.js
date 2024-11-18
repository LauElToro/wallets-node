const { ethers } = require('ethers');

exports.isValidAddress = (address) => {
  try {
    return ethers.utils.isAddress(address);
  } catch (error) {
    console.error('Error verificando la dirección:', error);
    return false;
  }
};

// Convertir una cantidad a formato de Ether
exports.formatEther = (amount) => {
  try {
    return ethers.utils.formatEther(amount);
  } catch (error) {
    console.error('Error formateando la cantidad a Ether:', error);
    throw new Error('No se pudo formatear la cantidad a Ether');
  }
};

// Convertir una cantidad desde Ether a Wei
exports.parseEther = (amount) => {
  try {
    return ethers.utils.parseEther(amount.toString());
  } catch (error) {
    console.error('Error convirtiendo la cantidad desde Ether a Wei:', error);
    throw new Error('No se pudo convertir la cantidad desde Ether a Wei');
  }
};