const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AwardApplication = sequelize.define('AwardApplication', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  award_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  supporting_evidence: {
    type: DataTypes.JSON,
    allowNull: false,
    comment: 'Specific proofs: conferences attended, regional citations, Q1/Q2 journal links, grants, collaborations'
  },
  status: {
    type: DataTypes.ENUM('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'AWARDED'),
    defaultValue: 'SUBMITTED'
  },
  admin_comments: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  score_details: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Checklist scores mapped to benchmark index criteria'
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'award_applications'
});

module.exports = AwardApplication;
