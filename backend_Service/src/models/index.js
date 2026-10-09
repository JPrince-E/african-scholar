const sequelize = require('../config/db');
const User = require('./User');
const ScholarProfile = require('./ScholarProfile');
const Award = require('./Award');
const AwardApplication = require('./AwardApplication');
const Sponsor = require('./Sponsor');
const RefereeEndorsement = require('./RefereeEndorsement');
const JuryReview = require('./JuryReview');
const Notification = require('./Notification');

// Relationships
User.hasOne(ScholarProfile, { foreignKey: 'user_id', as: 'profile', onDelete: 'CASCADE' });
ScholarProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(AwardApplication, { foreignKey: 'user_id', as: 'applications', onDelete: 'CASCADE' });
AwardApplication.belongsTo(User, { foreignKey: 'user_id', as: 'applicant' });

Award.hasMany(AwardApplication, { foreignKey: 'award_id', as: 'applications', onDelete: 'CASCADE' });
AwardApplication.belongsTo(Award, { foreignKey: 'award_id', as: 'award' });

AwardApplication.hasMany(RefereeEndorsement, { foreignKey: 'application_id', as: 'referees', onDelete: 'CASCADE' });
RefereeEndorsement.belongsTo(AwardApplication, { foreignKey: 'application_id', as: 'application' });

AwardApplication.hasMany(JuryReview, { foreignKey: 'application_id', as: 'juryReviews', onDelete: 'CASCADE' });
JuryReview.belongsTo(AwardApplication, { foreignKey: 'application_id', as: 'application' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  User,
  ScholarProfile,
  Award,
  AwardApplication,
  Sponsor,
  RefereeEndorsement,
  JuryReview,
  Notification
};

