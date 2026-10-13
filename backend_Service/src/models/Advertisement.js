const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Advertisement = sequelize.define('Advertisement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  business_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contact_email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact_phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  headline: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  banner_image_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  target_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  placement: {
    type: DataTypes.STRING,
    defaultValue: 'HERO_BANNER' // 'HERO_BANNER', 'SIDEBAR', 'DIRECTORY_FEED', 'FOOTER'
  },
  pricing_tier: {
    type: DataTypes.STRING,
    defaultValue: 'MONTHLY' // 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'
  },
  amount_usd: {
    type: DataTypes.FLOAT,
    defaultValue: 250.0
  },
  payment_status: {
    type: DataTypes.STRING,
    defaultValue: 'PENDING' // 'PENDING', 'PAID', 'FAILED', 'WAIVED'
  },
  payment_reference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payment_provider: {
    type: DataTypes.STRING,
    defaultValue: 'PAYSTACK'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'PENDING_REVIEW' // 'PENDING_REVIEW', 'APPROVED', 'REJECTED'
  },
  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false // Only true after Admin approval!
  },
  clicks_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  impressions_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'advertisements'
});

module.exports = Advertisement;
