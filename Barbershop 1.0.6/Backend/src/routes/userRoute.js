/*
Teendők: 
  Megtervezni az összes HTTP lekérést, illetve mindenhol máshol.
*/

const express = require('express');
const bcrypt = require('bcrypt');
const { findUserByEmail, createUser, findUserById, findUserRole, findUserByRole } = require('../controllers/userController');

const router = express.Router();

// Move routes here, e.g.:
router.post('/auth/register', async (req, res) => {
  try {
      const { name, email, password } = req.body || {};
      const role = "";
  
      if (!name || !password || !email) {
        return res.status(400).json({ error: 'Név, jelszó és email mező kitöltése kötelező!' });
      }
  
      const existingEmail = await findUserByEmail(email); // <-- ADD await!
  
      if (existingEmail) {
        return res.status(409).json({ error: 'Ezzel az email címmel már létezik fiók!' });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const userId = await createUser(name, email, passwordHash, role); // <-- ADD await!
  
      req.session.userId = userId;
  
      const safeUser = await findUserById(userId); // <-- ADD await!
      return res.status(201).json({ message: 'Sikeres regisztráció!', user: safeUser });
    } catch (err) {
      console.error('REG ERROR', err);
      return res.status(500).json({ error: 'Szerver hiba.' });
    }
});

router.post('/auth/login', async (req, res) => {
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

              //Ellenőrzi, hogy admin-e, ha igen dobja be az admin felületre
              const role = findUserByRole();
              if(role = "admin"){
                req.session.userId = user.id;
                const safeUser = await findUserById(user.id);
                return res.json({message : 'Sikeres admin bejelntkezés.', user : safeUser});
              }
  
              req.session.userId = user.id;
              const safeUser = await findUserById(user.id);
              return res.json({message : 'Sikeres bejelentkezés.', user : safeUser});
          }catch(err){
              console.error('LOGIN ERROR: ', err)
              return res.status(500).json({error : 'Szerver hiba.'})
          }
});

router.post('/auth/logout', (req, res) => {
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

router.get('/auth/me', async (req, res) => {
  console.log('SESSION:', req.session);
    if(!req.session || !req.session.userId){
        return res.status(401).json({error : 'Nincs bejelentkezve.'});
    }
    const user = await findUserById(req.session.userId);
    console.log('USER:', user);
    return res.json({ user });
});

module.exports = router;
