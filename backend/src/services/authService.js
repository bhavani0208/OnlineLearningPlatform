const bcrypt = require('bcryptjs');
const { User } = require('../models/index');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

const register = async ({ firstName, lastName, email, password, role }) => {
  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: role || 'student',
  });

  // Generate tokens
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Save refresh token in DB
  await user.update({ refreshToken });

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

const login = async ({ email, password }) => {
  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new Error('Account is deactivated. Contact support.');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate tokens
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Save refresh token in DB
  await user.update({ refreshToken });

  return {
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
    accessToken,
    refreshToken,
  };
};

const refresh = async ({ refreshToken }) => {
  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Find user and check if refresh token matches
  const user = await User.findOne({ where: { id: decoded.id, refreshToken } });
  if (!user) {
    throw new Error('Invalid refresh token');
  }

  // Generate new tokens
  const payload = { id: user.id, email: user.email, role: user.role };
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  // Update refresh token in DB
  await user.update({ refreshToken: newRefreshToken });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

const logout = async (userId) => {
  await User.update({ refreshToken: null }, { where: { id: userId } });
};

module.exports = { register, login, refresh, logout };
