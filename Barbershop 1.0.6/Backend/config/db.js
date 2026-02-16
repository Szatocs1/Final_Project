const { Sequelize, DataTypes } = require('sequelize');

// Initialize Sequelize with MariaDB
const sequelize = new Sequelize({
  dialect: 'mariadb',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'barbershopdb',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  logging: console.log, // Enable logging for debugging
});

// Sync database
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await sequelize.sync({ alter: true }); // Create tables if they do not exist
    console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = {
  sequelize,
  syncDatabase
};


