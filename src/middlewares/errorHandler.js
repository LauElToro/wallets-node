// Middleware para manejar errores globales
exports.errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
  
    if (res.headersSent) {
      return next(err);
    }
  
    // Responder con un mensaje de error genérico o con el mensaje específico
    res.status(err.status || 500).json({
      error: err.message || 'Error interno del servidor'
    });
  };
  