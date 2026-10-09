const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const JuryReview = sequelize.define('JuryReview', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  application_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  juror_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  juror_region: {
    type: DataTypes.STRING,
    allowNull: true
  },
  juror_role: {
    type: DataTypes.STRING,
    defaultValue: 'Jury Member'
  },
  scores: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Individual component scores'
  },
  composite_score: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  recommendation: {
    type: DataTypes.ENUM('RECOMMENDED', 'NEEDS_REVISION', 'DECLINED'),
    defaultValue: 'RECOMMENDED'
  },
  confidential_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'jury_reviews'
});

module.exports = JuryReview;
