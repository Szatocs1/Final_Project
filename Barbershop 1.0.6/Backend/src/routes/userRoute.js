/*
Teendők: 
  Megtervezni az összes HTTP lekérést, illetve mindenhol máshol.
*/

const express = require('express');
const bcrypt = require('bcrypt');
const { createAccesToken } = require('../utils/jwtoken');
const { findUserByEmail, createUser, findUserById } = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware')

const router = express.Router();

const ADMIN_PASS = process.env.SERVER_ADMIN_PASSWORD;

router.post('/register', async (req, res) => {
  try {
      //itt lesz még egy password, amelyet össze kell hasonlítani a óz eredetivel, hogy sokkal jobban User friendly legyen.
      const { name, email, password } = req.body || {};
  
      if (!name || !password || !email) {
        return res.status(400).json({ error: 'Név, jelszó és email mező kitöltése kötelező!' });
      }
  
      const existingEmail = await findUserByEmail(email); // <-- ADD await!
  
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

router.post('/login', async (req, res) => {
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

router.post('/logout', (req, res) => {
  if (!req.session){
        return res.json({message : "Már ki van jelentkezve."})
    }
    req.session.destroy(err => {
        if(err){
            console.error('LOGOUT ERROR', err)
            return res.status(500).json({error : 'Nem sikerült kijelentkezni.'})
        }

        res.clearCookie('connect.sid');
        return res.json({message : 'Sikeres kijelentkezés.'});
    })
});

router.get('/me', authMiddleware, async (req, res) => {
    const user = await findUserById(req.user.id);
    console.log('USER:', user);
    return res.json({ user });
});

router.post('/refreshToken', authMiddleware, async (req, res) => {
  //Itt fogom frissíteni a tokent.
});

module.exports = router;
