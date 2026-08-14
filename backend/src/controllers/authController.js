const authService = require('../services/authService');
const { registerSchema, loginSchema, refreshSchema } = require('../validators/authValidator');

const register = async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const result = await authService.register(value);
    res.status(201).json({ success: true, message: 'Registration successful', data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const result = await authService.login(value);
    res.status(200).json({ success: true, message: 'Login successful', data: result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

const refresh = async (req, res) => {
  const { error, value } = refreshSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  try {
    const result = await authService.refresh(value);
    res.status(200).json({ success: true, message: 'Token refreshed', data: result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    await authService.logout(req.user.id);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMe = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

module.exports = { register, login, refresh, logout, getMe };
