const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 5000;

// Iniciar el servidor y conectarse a la base de datos
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('No se pudo conectar a la base de datos:', err);
});