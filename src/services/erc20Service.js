const { ethers } = require("ethers");
const provider = require("../config/infura");

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

// Obtener el saldo de un token ERC-20
exports.getTokenBalance = async (walletAddress, tokenAddress) => {
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const balance = await tokenContract.balanceOf(walletAddress);
  return ethers.utils.formatUnits(balance, 18); // Supone 18 decimales, ajusta según el token
};

// Transferir tokens ERC-20
exports.transferToken = async (privateKey, toAddress, tokenAddress, amount) => {
  const wallet = new ethers.Wallet(privateKey, provider);
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

  const decimals = 18; // Supone 18 decimales, ajusta según el token
  const amountInUnits = ethers.utils.parseUnits(amount.toString(), decimals);

  const tx = await tokenContract.transfer(toAddress, amountInUnits);
  await tx.wait(); // Espera la confirmación de la transacción
  return tx;
};
