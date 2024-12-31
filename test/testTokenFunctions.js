const { getTokenBalance, transferToken } = require("../src/services/erc20Service");

// Cambia a "true" para probar cada función
const TEST_GET_BALANCE = true;
const TEST_TRANSFER_TOKEN = false;

(async () => {
  if (TEST_GET_BALANCE) {
    const walletAddress = "0xYourWalletAddress";
    const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT en Mainnet
    const balance = await getTokenBalance(walletAddress, tokenAddress);
    console.log(`Saldo de USDT: ${balance}`);
  }

  if (TEST_TRANSFER_TOKEN) {
    const privateKey = "0xYourPrivateKey";
    const toAddress = "0xRecipientAddress";
    const tokenAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // USDT en Mainnet
    const amount = 10; // 10 USDT

    const tx = await transferToken(privateKey, toAddress, tokenAddress, amount);
    console.log("Transacción enviada:", tx.hash);
  }
})();
