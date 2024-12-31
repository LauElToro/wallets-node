const { ethers } = require('ethers');
const provider = require('../config/infura');
const Wallet = require("../models/Wallet"); 
const Transaction = require("../models/Transaction"); 
const provider = new ethers.providers.InfuraProvider("homestead", process.env.INFURA_API_KEY);
// Monitoriza bloques para buscar transacciones entrantes
exports.monitorIncomingTransactions = async () => {
  console.log("Iniciando monitorización de la blockchain...");
  
  provider.on("block", async (blockNumber) => {
    console.log(`Nuevo bloque detectado: ${blockNumber}`);

    try {
      const block = await provider.getBlockWithTransactions(blockNumber);
      for (const transaction of block.transactions) {
        const wallet = await Wallet.findOne({ where: { address: transaction.to } });
        if (wallet) {
          console.log("Transacción detectada hacia una de nuestras wallets:", transaction);

          // Guarda la transacción en la base de datos
          await Transaction.create({
            user_id: wallet.user_id,
            from_address: transaction.from,
            to_address: transaction.to,
            amount: ethers.utils.formatEther(transaction.value),
            hash: transaction.hash,
            status: "PENDING",
          });
        }
      }
    } catch (error) {
      console.error("Error procesando el bloque:", error);
    }
  });
};
// Función para obtener el saldo de una dirección
exports.getBalance = async (address) => {
  try {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Error obteniendo el saldo de la dirección:', error);
    throw new Error('No se pudo obtener el saldo de la dirección');
  }
};

// Función para enviar una transacción
exports.sendTransaction = async (privateKey, toAddress, amount) => {
  try {
    const wallet = new ethers.Wallet(privateKey, provider);
    const tx = {
      to: toAddress,
      value: ethers.utils.parseEther(amount.toString()),
    };
    const txResponse = await wallet.sendTransaction(tx);
    await txResponse.wait(3); // Esperar 3 confirmaciones
    return txResponse;
  } catch (error) {
    console.error('Error enviando la transacción:', error);
    throw new Error('No se pudo enviar la transacción');
  }
};

// Función para verificar el estado de una transacción
exports.getTransactionStatus = async (hash) => {
  try {
    const txReceipt = await provider.getTransactionReceipt(hash);
    if (!txReceipt) {
      return 'pending';
    }
    return txReceipt.status === 1 ? 'success' : 'failed';
  } catch (error) {
    console.error('Error obteniendo el estado de la transacción:', error);
    throw new Error('No se pudo obtener el estado de la transacción');
  }
};
