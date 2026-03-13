const { sequelize } = require("../../config/db.js");
const User = require("../models/userModel.js")(sequelize);

const bcrypt = require('bcrypt');
const { createAccesToken } = require('../utils/jwtoken');

const ADMIN_PASS = process.env.SERVER_ADMIN_PASSWORD;

async function findUserByEmail(email) {
  try {
    const user = await User.findOne({ where: { email } });
    return user ? user.toJSON() : null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

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

async function findUserById(id) {
  try {
    const user = await User.findByPk(id);
    return user ? user.toJSON() : null;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    throw error;
  }
}
async function modifyUser(userId, nev, email, jelszo, telefonszam, foglaltsag, file){
    try {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('Felhasználó nem található!');

        const updates = {};
        
        if (nev !== null && nev !== undefined && nev.trim() !== '') {
            updates.nev = nev;
        }
        
        if (email !== null && email !== undefined && email.trim() !== '') {
            updates.email = email;
        }
        
        if (jelszo !== null && jelszo !== undefined && jelszo.trim() !== '') {
            updates.jelszo = jelszo;
        }
        
        if (telefonszam !== null && telefonszam !== undefined && telefonszam.trim() !== '') {
            updates.telefonszam = telefonszam;
        }
        
        if (foglaltsag !== null && foglaltsag !== undefined && foglaltsag.trim() !== '') {
            updates.foglaltsag = foglaltsag;
        }
        
        if (file) {
            updates.pfPicture = file.filename;
        }

        await user.update(updates);

        return user ? user.toJSON() : null;
    }
    catch(error){
        console.error("Nem sikerült módosítani a felhasználót!", error);
        throw error;
    }
}

async function deleteUser(userId) {
    try{
      const deletedCount = await User.destroy({
        where: { id: userId }
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
    const borbelyok = await User.findAll({ where: { foglaltsag: "Borbély"} , attributes: ['id', 'nev', 'foglaltsag', 'pfPicture'] } );

    return borbelyok.map(borbely => borbely.toJSON());
  }catch(error){
    console.error("Borbélyok nem találhatóak!", error);
    throw error;
  }
}

// Fent találhatók a segéd funkciók, lent a végpontokhoz írt funkciók.

async function register(req, res) {
  try {
        const { name, email, password, password_again, phone_number} = req.body;
        let role = "";
    
        if (!name || !password || !email || !password_again || !phone_number) {
          return res.status(400).json({ error: 'Név, jelszó és email mező kitöltése kötelező!' });
        }
  
        if(password !== password_again){
          return res.status(400).json({ error: 'A jelszó nem egyezik!' });
        }
    
        const existingEmail = await findUserByEmail(email);
    
        if (existingEmail) {
          return res.status(409).json({ error: 'Ezzel az email címmel már létezik fiók!' });
        }
        
        if(password === ADMIN_PASS){
          role = 'Admin'
        } else {
          role = 'Fogyasztó'
        }
  
        const passwordHash = await bcrypt.hash(password, 12);
  
        const userId = await createUser(name, email, passwordHash, role, phone_number);
  
        const createdUser = await findUserById(userId);
  
        const safeUser = { id: createdUser.id, name: createdUser.nev, email: createdUser.email, role: createdUser.foglaltsag };
    
        const token = createAccesToken(safeUser);
    
        return res.status(201).json(
          { message: 'Sikeres regisztráció!',
            user: safeUser,
            token
          });
      } catch (err) {
        console.error('REG ERROR', err);
        return res.status(500).json({ error: 'Szerver hiba.' });
      }
}

async function login(req, res) {
  try {
      const {email, password} = req.body;
    
      if(!email || !password){
          return res.status(400).json({error: 'Email és jelszó kötelező!'})
      }
    
      const user = await findUserByEmail(email);
    
      if(!user){
          return res.status(401).json({error : 'Hibás email vagy jelszó'});
      }
    
      const ok = await bcrypt.compare(password, user.jelszo);
    
      if(!ok){
          return res.status(401).json({error : 'Hibás email vagy jelszó'});
      }
    
      const safeUser = { id: user.id, name: user.nev, email: user.email, role: user.foglaltsag }
      const token = createAccesToken(safeUser);
  
      return res.status(200).json(
        {message : 'Sikeres bejelentkezés.',
         user : safeUser,
         token
        });
      }catch(err){
          console.error('LOGIN ERROR: ', err)
          return res.status(500).json({error : 'Szerver hiba.'})
      }
}

async function logout(req,res) {
  return res.status(200).json({ message: "Logged out successfully. Please delete token on client." });
}

async function profile(req, res) {
  const userId = req.user.id;
  const user = await findUserById(userId);
  console.log('USER:', user);
  return res.status(200).json({ message: "You are authanticated!", user });
}

async function modifyUserRoute(req, res) {
  try{
        const userId = req.user.id;
        const { nev, telefonszam, currentPassword, newPassword, confirmPassword } = req.body;
        const file = req.file;
        let ok;
        let newPasswordHash = null;
  
        if(currentPassword || newPassword || confirmPassword){
          if(newPassword !== confirmPassword) return res.status(400).json({ message: "Nem egyeznek a jelszavak!" });
  
          if(newPassword.length < 6) return res.status(400).json({ message: "A jelszónak legalább 6 karakter hosszúnak kell lennie!" });
  
          const user = await findUserById(userId);
          ok = await bcrypt.compare(currentPassword, user.jelszo);
  
          if(!ok){
            return res.status(401).json({error : 'Hibás jelszó!'});
          }
  
          newPasswordHash = await bcrypt.hash(newPassword, 12);
        }
  
        const updateUser = await modifyUser(userId, nev, null, newPasswordHash, telefonszam, null, file);
  
        return res.status(200).json({ message: "Sikeresen módosítottuk a profilodat!", updateUser})
      }catch(error){
          console.error("Hiba történt a felhasználó módosításakor!")
          return res.status(500).json({ message: "Hiba történt a módosításkor!" });
      }
}

async function borbelyok(req, res) {
  try{
    const borbelyok = await findAllBorbely();

    if(!borbelyok || borbelyok.length === 0){
      return res.status(400).json({ message: "Jelenleg nincsenek borbélyok." });
    }

    return res.status(200).json({ message: "Borbélyok sikeresen lekérve!", borbelyok });
  }catch(error){
    console.error("Szerver hiba: ", error);
    throw error;
  }
}

async function borbelyokNeve(req, res) {
  try{
    const borbelyok = await findAllBorbely();

    if(!borbelyok || borbelyok.length === 0){
      return res.status(400).json({ message: "Jelenleg nincsenek borbélyok." });
    }

    const borbelyokNevei = borbelyok.map(b => b.nev);

    return res.status(200).json({ message: "Borbély nevek sikeresen lekérve!", borbelyokNevei })
  }catch (error) {
    console.error("Hiba a borbélyok lekérésekor:", error);
    return res.status(500).json({ message: "Szerver hiba!" });
  }
}

async function deleteUserRoute(req, res) {
  const userId = req.user.id || {};

  if(!userId){
      return res.status(400).json({ message: "A felhasználó nem található meg!" });
  }

  try{
      const deletedUser = await deleteUser(userId);

      return res.status(200).json({ message: "Felhasználó sikeresen törölve!", deletedUser })
  }catch(error){
      console.error("Hiba a felhasználó törlésekor!", error);
      throw error;
  }
}

// Admin route handlers

async function adminLogin(req, res) {
  try {
    const {email, password} = req.body;
    
    if(!email || !password){
      return res.status(400).json({error: 'Email és jelszó kötelező!'})
    }
    
    const user = await findUserByEmail(email);
    
    if(!user){
      return res.status(401).json({error : 'Hibás email vagy jelszó'});
    }

    const ok = await bcrypt.compare(password, user.jelszo);
    
    if(!ok){
      return res.status(401).json({error : 'Hibás email vagy jelszó', user});
    }
    
    const safeUser = { id: user.id, name: user.nev, email: user.email, role: user.foglaltsag };
    const token = createAccesToken(safeUser);

    return res.status(200).json(
      {message : 'Sikeres admin bejelentkezés!',
        user : safeUser,
        token
      });
    }catch(err){
        console.error('ADMIN LOGIN ERROR: ', err)
        return res.status(500).json({error : 'Szerver hiba.'})
    }
}

async function adminCreateUser(req, res) {
  const { name, email, password, password_again, role, phone_number  } = req.body || {};

  if(!name || !email || !password || !role || !password_again || !phone_number){
    return res.status(400).json({ message: "Nincs megadva az egyik mező!" })
  }

  if(password !== password_again){
    return res.status(400).json({ message: "Nem egyeznek a jelszavak!" })
  }

  try{
    const passwordHash = await bcrypt.hash(password, 12);

    const user = createUser(name, email, passwordHash, role, phone_number)

    return res.status(200).json({ message: "Felhasználó sikeresen létrehozva", user });
  }catch(error){
    return res.status(500).json({error: "Szerver hiba, nem sikerült felhasználót létre hozni!"});
  }
}

async function adminModifyUserRoute(req, res) {
  const { id, name, email, password, phone, role } = req.body;

  try{
    if(role !== "Admin" && role !== "Fogyasztó" && role !== "Borbély"){
      return res.status(401).json({ message: "Nem létező foglaltságot adott meg!" })
    }

    const updateUser = await modifyUser(id, name, email, password, phone, role );

    return res.status(200).json({ message: "Sikeresen módosítottuk a terméket!", updateUser})
  }catch(error){
      console.error("Hiba történt a felhasználó módosításakor!")
      throw error;
  }
}

async function adminDeleteUserRoute(req, res) {
  const id = req.body.id;

  if(!id){
      return res.status(400).json({ message: "A felhasználó nem található meg!" });
  }

  try{
      const deletedUser = await deleteUser(id);

      return res.status(200).json({ message: "Felhasználó sikeresen törölve!", deletedUser })
  }catch(error){
      console.error("Hiba a felhasználó törlésekor:", error);
      throw error;
  }
}

async function adminGetUserByName(req, res) {
  const { name } = req.body;

  if(!name){
    return res.status(400).json({ message: "Nincs kitötlve a mező!" })
  }

  try{
    const user = await getUserByName(name);

    return res.status(200).json({ message: "Felhasználó sikeresen lekérve!", user });
  }catch(error){
    return res.status(500).json({ error: "Szerver hiba, felhasználó nem található!", error });
  }
}

async function adminGetUserByEmail(req, res) {
  const { email } = req.body;

  if(!email){
    return res.status(400).json({ message: "Nincs kitötlve a mező!" })
  }

  try{
    const user = await findUserByEmail(email);

    return res.status(200).json({ message: "Felhasználó sikeresen lekérve!", user });
  }catch(error){
    return res.status(500).json({ error: "Szerver hiba, felhasználó nem található!", error });
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
    findAllBorbely,
    register,
    login,
    logout,
    profile,
    modifyUserRoute,
    borbelyok,
    borbelyokNeve,
    deleteUserRoute,
    adminLogin,
    adminCreateUser,
    adminModifyUserRoute,
    adminDeleteUserRoute,
    adminGetUserByName,
    adminGetUserByEmail
}
