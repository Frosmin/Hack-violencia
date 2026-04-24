const {
  registerUser,
  loginUser,
  joinOrganization,
  getCurrentSession,
} = require('../services/authService');

const registerController = async (req, res) => {
  try {
    const { email, password, organizationName } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son requeridos',
      });
    }

    const authResult = await registerUser(email, password, organizationName);
    res.status(201).json({
      message: organizationName
        ? 'Usuario y organización registrados exitosamente'
        : 'Cuenta creada exitosamente',
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

const joinOrganizationController = async (req, res) => {
  try {
    const { userId } = req.user;
    const { joinCode } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'El usuario no está autenticado.' });
    }

    const authResult = await joinOrganization(userId, joinCode);
    res.status(200).json({
      message: 'Te uniste a la organización exitosamente',
      ...authResult,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const currentSessionController = async (req, res) => {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).json({ error: 'El usuario no está autenticado.' });
    }

    const authResult = await getCurrentSession(userId);
    res.status(200).json(authResult);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  registerController,
  loginController,
  joinOrganizationController,
  currentSessionController,
};
