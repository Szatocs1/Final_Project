const { sequelize } = require("../../config/db.js");
const User = require("../models/userModel.js")(sequelize);

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

async function findUserByRole() {
  try{
    const admin = await User.findOne({
      where: { role: "admin" }
    });
    const foglaltsag = admin.get("foglaltsag");
    return foglaltsag;
  }catch (error){
    console.error('Error in finding user by role: ', error);
    throw error;
  }
};

// Function to create a new user
async function createUser(name, email, passwordHash) {
  try {
    const user = await User.create({
      nev: name,
      email,
      jelszo: passwordHash,
      foglaltsag: role,
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

module.exports = {
    findUserByEmail,
    createUser,
    findUserById,
    findUserByRole
}
