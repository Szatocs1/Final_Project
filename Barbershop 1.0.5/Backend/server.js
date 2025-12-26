require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const { findUserByEmail, createUser, findUserById } = require('./src/controllers/userController');

const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_SESSION = process.env.SECRET_SESSION || 'dev-secret';

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(
    session({
        secret: SECRET_SESSION,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60* 2
        }
    })
);// ->mit csinál pontosan a session.

//jwttoken ...

app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !password || !email) {
      return res.status(400).json({ error: 'Név, jelszó és email mező kitöltése kötelező!' });
    }

    const existing = await findUserByEmail(email); // <-- ADD await!

    if (existing) {
      return res.status(409).json({ error: 'Ezzel az email címmel már létezik fiók!' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userId = await createUser(name, email, passwordHash); // <-- ADD await!

    req.session.userId = userId;

    const safeUser = await findUserById(userId); // <-- ADD await!
    return res.status(201).json({ message: 'Sikeres regisztráció!', user: safeUser });
  } catch (err) {
    console.error('REG ERROR', err);
    return res.status(500).json({ error: 'Szerver hiba.' });
  }
});


app.post('/api/auth/login', async (req, res) => {
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

            req.session.userId = user.id;
            const safeUser = await findUserById(user.id);
            return res.json({message : 'Sikeres bejelentkezés.', user : safeUser})
        }catch(err){
            console.error('LOGIN ERROR: ', err)
            return res.status(500).json({error : 'Szerver hiba.'})
        }
    });

app.post('/api/auth/logout', (req, res) => {
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

app.get('/api/auth/me', async (req, res) => {
    console.log('SESSION:', req.session);
    if(!req.session || !req.session.userId){
        return res.status(401).json({error : 'Nincs bejelentkezve.'});
    }
    const user = await findUserById(req.session.userId);
    console.log('USER:', user);
    return res.json({ user });
});

db.syncDatabase().then(()=>{
    console.log("Adatbázis szinkronizálva!")
    app.listen(PORT, () => {
    console.log(`Szerver fut: http://localhost:${PORT}`);   
});
})