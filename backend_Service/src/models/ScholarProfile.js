const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ScholarProfile = sequelize.define('ScholarProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  // Personal Info
  title: {
    type: DataTypes.ENUM('Dr', 'Assistant Prof', 'Associate Prof', 'Full Prof'),
    allowNull: false,
    defaultValue: 'Dr'
  },
  highest_degree: {
    type: DataTypes.ENUM('PhD', 'DSc'),
    allowNull: false,
    defaultValue: 'PhD'
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  initials: {
    type: DataTypes.STRING,
    allowNull: true
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female'),
    allowNull: false
  },
  marital_status: {
    type: DataTypes.ENUM('Single', 'Married'),
    allowNull: false,
    defaultValue: 'Married'
  },
  official_email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  },
  secondary_email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  nationality: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Nigeria'
  },
  hobbies: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Max 500 words'
  },

  // University & Affiliation
  university_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  campus: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Nigeria'
  },
  discipline: {
    type: DataTypes.STRING,
    allowNull: false
  },
  research_focus: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  // Positions Held (JSON)
  past_positions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  present_positions: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },

  // Academic / Research Achievements
  mentees_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  postdocs_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  phd_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  msc_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  honours_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  conferences_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  publications_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  citations_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  google_h_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  google_i10_index: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  // General achievements & milestones
  awards_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  grants_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  patents_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },

  // Social & Community impact (JSON array of max 10 activities)
  community_impact_activities: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },

  // Billing
  fee_paid: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Default true for first year promo'
  },
  paystack_reference: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'scholar_profiles'
});

module.exports = ScholarProfile;
