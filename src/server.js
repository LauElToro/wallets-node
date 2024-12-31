const app = require('./app');
const sequelize = require('./config/db');
const { monitorIncomingTransactions } = require("./services/blockchainService");
const PORT = process.env.PORT || 5000;

// Iniciar el servidor y conectarse a la base de datos
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    monitorIncomingTransactions();
  });
}).catch((err) => {
  console.error('No se pudo conectar a la base de datos:', err);
});