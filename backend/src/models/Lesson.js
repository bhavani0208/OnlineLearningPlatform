const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  isFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'lessons',
  timestamps: true,
});

module.exports = Lesson;
