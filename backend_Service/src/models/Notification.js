const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Target scholar user ID, or null for general broadcast'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('SUBMISSION', 'REFEREE', 'REVIEW', 'AWARD', 'SPONSOR', 'INFO'),
    defaultValue: 'INFO'
  },
  link: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  read_by: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of user IDs who have marked this notification as read'
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'notifications'
});

module.exports = Notification;
