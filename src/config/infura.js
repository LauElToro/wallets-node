const { ethers } = require('ethers');
require('dotenv').config();

// Crear un proveedor utilizando Infura
const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);

module.exports = provider;