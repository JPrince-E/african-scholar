require('dotenv').config();
const sequelize = require('./src/config/db');
const { User, ScholarProfile, Award, AwardApplication, Sponsor, Advertisement, Notification, JuryReview, RefereeEndorsement } = require('./src/models');

async function inspect() {
  try {
    await sequelize.authenticate();
    console.log(' Connected to Database:', sequelize.config.database, 'on', sequelize.config.host);
    console.log('Dialect:', sequelize.getDialect());
    console.log('----------------------------------------------------');

    // Find actual table name and columns in postgres
    try {
      const [tables] = await sequelize.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public';
      `);
      console.log(' Public Tables:', tables.map(t => t.table_name).join(', '));

      // Check award table name (might be 'awards' lowercase or 'Awards')
      const awardTable = tables.find(t => t.table_name.toLowerCase() === 'awards')?.table_name || 'awards';
      await sequelize.query(`ALTER TABLE "${awardTable}" ADD COLUMN IF NOT EXISTS "category" VARCHAR(50) DEFAULT 'PROFESSORIAL';`);
      console.log(` Verified "${awardTable}" schema contains "category" column.`);
    } catch (e) {
      console.warn('Schema check warning:', e.message);
    }

    const [userCount, profileCount, awardCount, appCount, sponsorCount, adCount, notifCount, reviewCount, refCount] = await Promise.all([
      User.count(),
      ScholarProfile.count(),
      Award.count(),
      AwardApplication.count(),
      Sponsor.count(),
      Advertisement.count(),
      Notification.count(),
      JuryReview.count(),
      RefereeEndorsement.count()
    ]);

    console.log('TABLE ROW COUNTS:');
    console.log(` • Users:              ${userCount}`);
    console.log(` • ScholarProfiles:    ${profileCount}`);
    console.log(` • Awards:             ${awardCount}`);
    console.log(` • AwardApplications:  ${appCount}`);
    console.log(` • Sponsors:           ${sponsorCount}`);
    console.log(` • Advertisements:     ${adCount}`);
    console.log(` • Notifications:      ${notifCount}`);
    console.log(` • JuryReviews:        ${reviewCount}`);
    console.log(` • RefereeEndorsements:${refCount}`);
    console.log('----------------------------------------------------');

    console.log('\n SAMPLE AWARDS:');
    const awards = await Award.findAll({ limit: 6, attributes: ['id', 'title', 'category', 'tier', 'is_active'] });
    awards.forEach(a => {
      console.log(` [ID ${a.id}] ${a.title} | Category: ${a.category} | Tier: ${a.tier} | Active: ${a.is_active}`);
    });

    console.log('\n SAMPLE USERS:');
    const users = await User.findAll({ limit: 5, attributes: ['id', 'email', 'role', 'is_verified'] });
    users.forEach(u => {
      console.log(` [ID ${u.id}] ${u.email} (${u.role}) | Verified: ${u.is_verified}`);
    });

  } catch (err) {
    console.error(' Database inspection error:', err.message);
  } finally {
    await sequelize.close();
  }
}

inspect();
