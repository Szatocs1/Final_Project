require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');

const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_SESSION = process.env.SECRET_SESSION || 'dev-secret';

//Táblák generálását megcsinálni.
const userModel = require("./src/models/userModel");
const kepekModel = require("./src/models/kepekModel");
const foglalasModel = require("./src/models/foglalasModel");
const rendelesekModel = require("./src/models/rendelesekModel");
const termekModel = require("./src/models/termekModel");

const userRoutes = require('./src/routes/userRoute');

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
            secure: false,
            maxAge: 1000 * 60 * 60* 2
        }
    })
);

//jwttoken ...

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', userRoutes);

db.syncDatabase().then(()=>{
    console.log("Adatbázis szinkronizálva!")
    app.listen(PORT, () => {
    console.log(`Szerver fut: http://localhost:${PORT}`);   
});
})

