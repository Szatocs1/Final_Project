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

// Define User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nev: {
    type: DataTypes.STRING(75),
    allowNull: false,
  },
  jelszo: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  foglaltsag: {
    type: DataTypes.ENUM('Fogyasztó', 'Borbély', 'Admin'),
    allowNull: false,
    defaultValue: 'Fogyasztó',
  },
}, {
  tableName: 'users',
  timestamps: false,
});

// Function to find user by email
async function findUserByEmail(email) {
  try {
    const user = await User.findOne({ where: { email } });
    return user ? user.toJSON() : null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

// Function to create a new user
async function createUser(name, email, passwordHash) {
  try {
    const user = await User.create({
      nev: name,
      email,
      jelszo: passwordHash,
    });
    return user.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Function to find user by ID
async function findUserById(id) {
  try {
    const user = await User.findByPk(id);
    return user ? user.toJSON() : null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}

// Sync database
async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await sequelize.sync(); // Create tables if they do not exist
    console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

module.exports = {
  sequelize,
  User,
  findUserByEmail,
  createUser,
  findUserById,
  syncDatabase,
};


