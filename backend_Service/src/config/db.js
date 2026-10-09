const { Sequelize } = require('sequelize');
require('dotenv').config();

// Support Supabase / Postgres (SUPABASE_DB_URL, DATABASE_URL), DB_URI, or MySQL vars
let dbUri = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || process.env.DB_URI || process.env.MYSQL_URL;

if (!dbUri && process.env.MYSQLHOST) {
  const user = encodeURIComponent(process.env.MYSQLUSER || 'root');
  const pass = encodeURIComponent(process.env.MYSQLPASSWORD || '');
  const host = process.env.MYSQLHOST;
  const port = process.env.MYSQLPORT || 3306;
  const db = process.env.MYSQLDATABASE || 'railway';
  dbUri = `mysql://${user}:${pass}@${host}:${port}/${db}`;
}

if (!dbUri) {
  dbUri = 'mysql://root:@localhost:3306/africanscholar';
}

const isPostgres = dbUri.startsWith('postgres://') || dbUri.startsWith('postgresql://') || process.env.DB_DIALECT === 'postgres';
const dialect = isPostgres ? 'postgres' : 'mysql';

const dialectOptions = {};
// Cloud Postgres (Supabase, Neon, Render) and cloud MySQL require SSL
if (isPostgres || process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true') {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false
  };
}

const sequelize = new Sequelize(dbUri, {
  dialect,
  dialectOptions,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

module.exports = sequelize;
