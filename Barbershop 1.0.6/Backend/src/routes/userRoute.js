/*
Teendők: 
  Megtervezni az összes HTTP lekérést, illetve mindenhol máshol.
*/

const express = require('express');
const bcrypt = require('bcrypt');
const { createAccesToken } = require('../utils/jwtoken');
const { findUserByEmail, createUser, findUserById, deleteUser, modifyUser, getEveryUser, getUserByName } = require('../controllers/userController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

const route = express.Router();

const ADMIN_PASS = process.env.SERVER_ADMIN_PASSWORD;

route.post('/register', async (req, res) => {
  try {
      const { name, email, password, password_again } = req.body || {};
  
      if (!name || !password || !email || !password_again) {
        return res.status(400).json({ error: 'Név, jelszó és email mező kitöltése kötelező!' });
      }

      if(password !== password_again){
        return res.status(400).json({ error: 'A jelszó nem egyezik!' });
      }
  
      const existingEmail = await findUserByEmail(email);
  
      if (existingEmail) {
        return res.status(409).json({ error: 'Ezzel az email címmel már létezik fiók!' });
      }

      let role = "Fogyasztó";
      if (password === ADMIN_PASS) {
        role = "Admin";
      }
      
      const passwordHash = await bcrypt.hash(password, 12);
      const userId = await createUser(name, email, passwordHash, role); // <-- ADD await!

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
  
              const safeUser = { id: user.id, email: user.email, role: user.foglaltsag }
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

route.post('/logout', (req, res) => {
   return res.json({ message: "Logged out successfully. Please delete token on client." });
});

route.get('/profile', authMiddleware, async (req, res) => {
    const user = await findUserById(req.user.id);
    console.log('USER:', user);
    return res.json({ user, message: "You are authanticated!" });
});

/*
admin
*/

route.post('/admin/createUser', authMiddleware, isAdmin, async (req, res) => {
    const admin = await findUserById(req.user.id);

    if(!admin){
      return res.status(400).json({ message: "A felhasználó nem admin!" })
    }

    const { name, email, password, role } = req.body || {};

    if(!name || !email || !password || !role){
      return res.status(400).json({ message: "Nincs megadva az egyik mező!" })
    }

    try{
      const user = createUser(name, email, password, role)

      return res.status(200).json({ message: "Felhasználó sikeresen létrehozva", user });
    }catch(error){
      return res.status(500).json({error: "Szerver hiba, nem sikerült felhasználót létre hozni!"});
    }
});

route.put("/admin/modifyUser/:id", authMiddleware, isAdmin, async (req, res) => {
    try{
      const id = await findUserById(req.user.id);
      const { name, email, password, phone, role } = req.body;

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

route.delete("/admin/deleteUser/:id", authMiddleware, isAdmin, async (req, res) => {
    const { id } = req.params || {};

    if(!id){
        return res.status(400).json({ message: "A felhasználó nem található meg!" });
    }

    try{
        const deleteUser = await deleteUser(id);

        return res.status(200).json({ message: "Felhasználó sikeresen törölve!", deleteUser })
    }catch(error){
        console.error("Hiba a felhasználó törlésekor!", error);
        throw error;
    }
});

route.get("/admin/getUserById", authMiddleware, isAdmin, async (req, res) =>{
    const { id } = req.query;

    if(!id){
      return res.status(400).json({ message: "Nincs kitötlve a mező!" })
    }

    try {
      const user = await findUserById(id);

      return res.status(200).json({ message: "Felhasználó sikeresen megtalálva!", user })
    }catch(error){
      res.status(500).json({ error: "Szerver hiba, nem található a felhasználó!", error })
    }
});

route.get("/admin/getEveryUser", authMiddleware, isAdmin, async (req, res) => {
    try{
      const users = await getEveryUser();
 
    if(!users){
      return res.status(400).json({ message: "Nincs kitötlve a mező!" })
    }

      return res.status(200).json({ message: "Felhasználók sikeres lekérése!", users });
    }catch(error){
      return res.status(500).json({ error: "Szerver hiba, felhasználók nem találhatóak!", error });
    }
});

route.get("/admin/getUserByName", authMiddleware, isAdmin, async (req, res) =>{
    const { name } = req.query;

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

route.get("/admin/getUserByEmail", authMiddleware, isAdmin, async (req, res) =>{
    const { email } = req.query;

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
