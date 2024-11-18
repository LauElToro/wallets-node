const io = require('socket.io')();

// Inicializar el servicio de notificaciones
exports.initNotificationService = (server) => {
  io.attach(server);

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });
};

// Enviar una notificación a un cliente específico
exports.sendNotification = (userId, message) => {
  io.to(userId).emit('notification', message);
};

// Enviar una notificación a todos los clientes
exports.broadcastNotification = (message) => {
  io.emit('notification', message);
};