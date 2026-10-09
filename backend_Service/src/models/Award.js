const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Award = sequelize.define('Award', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  tier: {
    type: DataTypes.ENUM('NATIONAL', 'CONTINENTAL', 'GLOBAL'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'e.g. Nigeria, Kenya, Ghana for National awards, null for continental/global'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  award_value: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '{ prize_amount: "$5,000", plaque: true, icon_items: true, podcast_interview: true }'
  },
  evaluation_index: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'List of specific index rules and benchmark targets'
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2026
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'awards'
});

module.exports = Award;
