// src/controllers/userController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: 'Usuario registrado exitosamente', user });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).json({ error: 'No se pudo registrar el usuario' });
  }
};

// Iniciar sesión
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error iniciando sesión:', error);
    res.status(500).json({ error: 'No se pudo iniciar sesión' });
  }
};

// Obtener la información del usuario
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    // Buscar el usuario por ID
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error obteniendo perfil del usuario:', error);
    res.status(500).json({ error: 'No se pudo obtener el perfil del usuario' });
  }
};