
const { registerUser, loginUser } = require('../services/authService');

const registerController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const newUser = await registerUser(email, password);
    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: newUser.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const { user, token } = await loginUser(email, password);
    res.status(200).json({ message: 'Login exitoso', user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { registerController, loginController };