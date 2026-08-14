const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  razorpayPaymentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  razorpaySignature: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'INR',
  },
  status: {
    type: DataTypes.ENUM('success', 'failed'),
    defaultValue: 'success',
  },
}, {
  tableName: 'payments',
  timestamps: true,
});

module.exports = Payment;
