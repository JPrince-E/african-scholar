const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RefereeEndorsement = sequelize.define('RefereeEndorsement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  application_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  scholar_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  referee_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  referee_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  referee_institution: {
    type: DataTypes.STRING,
    allowNull: true
  },
  referee_title: {
    type: DataTypes.STRING,
    allowNull: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('INVITED', 'SUBMITTED'),
    defaultValue: 'INVITED'
  },
  ratings: {
    type: DataTypes.JSON,
    allowNull: true
  },
  confidential_comments: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  recommendation_letter_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  submitted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'referee_endorsements'
});

module.exports = RefereeEndorsement;
