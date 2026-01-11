require('dotenv').config();

const express = require('express');
const path = require('path');

const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

//Táblák generálása
const userModel = require("./src/models/userModel")(db.sequelize);
const kepekModel = require("./src/models/kepekModel")(db.sequelize);
const foglalasModel = require("./src/models/foglalasModel")(db.sequelize);
const rendelesekModel = require("./src/models/rendelesekModel")(db.sequelize);
const termekModel = require("./src/models/termekModel")(db.sequelize);

//Mount-ok
const userRoutes = require('./src/routes/userRoute');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', userRoutes);

db.syncDatabase().then(()=>{
    console.log("Adatbázis szinkronizálva!")
    app.listen(PORT, () => {
    console.log(`Szerver fut: http://localhost:${PORT}`);   
});
})

