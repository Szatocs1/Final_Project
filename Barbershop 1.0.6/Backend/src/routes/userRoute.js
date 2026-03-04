const express = require('express');
const bcrypt = require('bcrypt');
const { createAccesToken } = require('../utils/jwtoken');
const { findUserByEmail, createUser, findUserById, deleteUser, modifyUser, getEveryUser, getUserByName, findAllBorbely } = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { uploadPfp } = require('../middlewares/uploads');

const route = express.Router();

const ADMIN_PASS = process.env.SERVER_ADMIN_PASSWORD;

route.post('/register', async (req, res) => {
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
});

route.post('/login', async (req, res) => {
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
});

route.post('/logout', authMiddleware, (req, res) => {
  return res.status(200).json({ message: "Logged out successfully. Please delete token on client." });
});

route.get(`/profile`, authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const user = await findUserById(userId);
    console.log('USER:', user);
    return res.status(200).json({ message: "You are authanticated!", user });
});

route.put("/modifyUser", uploadPfp.single('profileImage'), authMiddleware, async (req, res) => {
    try{
      const userId = req.user.id;
      const { nev, telefonszam, currentPassword, newPassword, confirmPassword } = req.body;
      const file = req.file;

      if(newPassword !== confirmPassword) return res.status(400).json({ message: "Nem egyeznek a jelszavak!" });

      if(newPassword.length < 6) return res.status(400).json({ message: "A jelszónak legalább 6 karakter hosszúnak kell lennie!" });

      const user = await findUserById(userId);
      const ok = await bcrypt.compare(currentPassword, user.jelszo);
  
      if(!ok){
        return res.status(401).json({error : 'Hibás jelszó!'});
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      const updateUser = await modifyUser(userId, nev, null, newPasswordHash, telefonszam, null, file);

      return res.status(200).json({ message: "Sikeresen módosítottuk a profilodat!", updateUser})
    }catch(error){
        console.error("Hiba történt a felhasználó módosításakor!")
        return res.status(500).json({ message: "Hiba történt a módosításkor!" });
    }
});

route.get("/borbelyok", async (req, res) =>{
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
});

route.get("/borbelyokNeve", async (req, res) => {
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
});

route.delete("/deleteUser", authMiddleware, async (req, res) => {
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
});

/*
admin
*/

//pipa
route.post('/admin/login', async (req, res) =>{
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
});

//pipa
route.post('/admin/createUser', authMiddleware, isAdmin, async (req, res) => {
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
});
// pipa
route.put("/admin/modifyUser", authMiddleware, isAdmin, async (req, res) => {
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
});
// pipa
route.delete("/admin/deleteUser", authMiddleware, isAdmin, async (req, res) => {
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
});
//pipa
route.post("/admin/getUserByName", authMiddleware, isAdmin, async (req, res) =>{
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
});
//pipa
route.post("/admin/getUserByEmail", authMiddleware, isAdmin, async (req, res) =>{
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
});

module.exports = route;
