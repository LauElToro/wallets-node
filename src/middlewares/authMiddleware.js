const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware para autenticar al usuario
exports.authenticateUser = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
      }
  
      const token = authHeader.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token inválido.' });
      }
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: 'Token inválido o expirado.' });
        }
  
        // Asegúrate de que el objeto `req.user` contenga `userId`
        req.user = { userId: decoded.userId };
        next();
      });
    } catch (error) {
      console.error('Error en autenticación:', error);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  };
  