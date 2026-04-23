const { registerUser, loginUser } = require('../services/authService');

const registerController = async (req, res) => {
  try {
    const { email, password, organizationName } = req.body;
    if (!email || !password || !organizationName) {
      return res.status(400).json({
        error: 'Email, contraseña y organizationName son requeridos',
      });
    }

    const authResult = await registerUser(email, password, organizationName);
    res.status(201).json({
      message: 'Usuario y organización registrados exitosamente',
      ...authResult,
    });
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

    const authResult = await loginUser(email, password);
    res.status(200).json({
      message: 'Login exitoso',
      ...authResult,
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = { registerController, loginController };
