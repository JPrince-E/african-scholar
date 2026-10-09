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
