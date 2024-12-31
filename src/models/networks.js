module.exports = {
    networks: {
      mainnet: {
        name: "Ethereum Mainnet",
        infura: "homestead",
        tokens: {
          USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          USDC: "0xA0b86991C6218b36c1d19D4a2e9EB0cE3606EB48",
        },
      },
      sepolia: {
        name: "Sepolia Testnet",
        infura: "sepolia",
        tokens: {
          USDT: "0xTestnetUSDTAddress",
          USDC: "0xTestnetUSDCAddress",
        },
      },
    },
  };
  