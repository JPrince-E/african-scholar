const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Sponsor = sequelize.define('Sponsor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  sponsor_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  banner_image_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  redirect_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  placement: {
    type: DataTypes.STRING,
    defaultValue: 'HERO_BANNER'
  },
  pricing_tier: {
    type: DataTypes.STRING,
    defaultValue: 'MONTHLY' // 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'
  },
  pricing_rate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duration_details: {
    type: DataTypes.STRING,
    allowNull: true
  },
  business_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'Corporate & Academic Service'
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'sponsors'
});

module.exports = Sponsor;
