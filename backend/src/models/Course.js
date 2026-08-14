const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner',
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'English',
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  totalDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalLessons: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  totalEnrollments: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'courses',
  timestamps: true,
});

module.exports = Course;
