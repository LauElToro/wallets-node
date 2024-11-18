const Joi = require('joi');

// Validación para el registro de usuario
exports.validateUserRegistration = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

// Validación para el inicio de sesión
exports.validateUserLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

// Validación para transacciones
exports.validateTransaction = (data) => {
  const schema = Joi.object({
    userId: Joi.number().integer().required(),
    toAddress: Joi.string().required(),
    amount: Joi.number().positive().required(),
    tokenAddress: Joi.string().optional(),
  });

  return schema.validate(data);
};