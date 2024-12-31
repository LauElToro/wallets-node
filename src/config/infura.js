const { ethers } = require("ethers");
const networks = require("../models/networks");
require('dotenv').config();
// Leer la red seleccionada desde `.env`
const selectedNetwork = process.env.NETWORK || "mainnet";

// Configurar el proveedor de Infura según la red seleccionada
const provider = new ethers.providers.InfuraProvider(
  networks.networks[selectedNetwork].infura, // homestead o sepolia
  process.env.INFURA_API_KEY
);

module.exports = provider;
