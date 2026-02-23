const bcrypt = require('bcrypt');
const { sequelize } = require("../../config/db.js");
const User = require("../models/userModel.js")(sequelize);

async function adminSeeder() {
  try {
    const adminExists = await User.findOne({ where: { foglaltsag : "Admin" } })

    if(adminExists){
        console.log('Admin already exists!')
        return null;
    }
    
    const emailExists = await User.findOne({ where: { email: "tobias.szabolcs@gmail.com" } })
    
    if(emailExists){
        console.log('User with this email already exists!')
        return null;
    }

    const password = await bcrypt.hash("Szatocsvok1", 12);

    const user = await User.create({
        nev: "Tóbiás Szabolcs",
        email: "tobias.szabolcs@gmail.com",
        jelszo: password,
        telefonszam: "+36308760110",
        foglaltsag: "Admin"
    });
    return user;
  } catch (error) {
    console.error('Error creating admin: ', error);
    throw error;
  }
}

module.exports = {
    adminSeeder
}