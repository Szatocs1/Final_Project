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


// Function to create a new user
async function createUser(name, email, passwordHash, role, phone_number) {
  try {
    const user = await User.create({
      nev: name,
      email,
      jelszo: passwordHash,
      foglaltsag: role,
      telefonszam: phone_number
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

async function modifyUser(userId, nev, email, jelszo, telefonszam, foglaltsag){
    try {
        const product = await User.findByPk(userId);
        if (!product) throw new Error('Felhasználó nem található!');

        const updates = {};
        if (nev) updates.nev = nev;
        if (email) updates.email = email;
        if (jelszo) updates.jelszo = jelszo;
        if (telefonszam) updates.telefonszam = telefonszam;
        if (foglaltsag) updates.foglaltsag = foglaltsag;

        await product.update(updates);

        return product ? product.toJSON() : null;
    }
    catch(error){
        console.error("Nem sikerült módosítani a felhasználót!", error);
        throw error;
    }
}

async function deleteUser(id) {
    try{
        const deletedCount = await User.destroy({
            where: { id }
        });

        if (deletedCount === 0){
            throw new Error("Felhasználó nem található!");
        }

        return { message: 'Felhasználó sikeresen eltávolítva!' }
    }catch(error){
        console.error("Felhasználó nem található!", error);
        throw error;
    }
}

async function getEveryUser() {
      try{
          const users = await User.findAll({ limit: 20 });
          return users.map(user => user.toJSON());

      }catch(error){
        console.error("Nem talál felhasználót!", error)
        throw error;
      }
}

async function getUserByName(nev) {
      try{
        const user = await User.findOne({ where: { nev } })

        return user ? user : null;
      }catch(error){
        console.error("Felhasználó nem található!", error);
        throw error;
      }
}

async function findAllBorbely() {
  try{
    const borbelyok = await User.findAll({ where: { foglaltsag: "Borbély"} , attributes: ['id', 'nev', 'foglaltsag'] } );

    return borbelyok.map(borbely => borbely.toJSON());
  }catch(error){
    console.error("Borbélyok nem találhatóak!", error);
    throw error;
  }
}

module.exports = {
    findUserByEmail,
    createUser,
    findUserById,
    modifyUser,
    deleteUser,
    getEveryUser,
    getUserByName,
    findAllBorbely
}
