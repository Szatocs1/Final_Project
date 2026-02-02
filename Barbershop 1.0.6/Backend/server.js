require('dotenv').config();

const express = require('express');
const path = require('path');
const db = require('./config/db');
const app = express();
const PORT = process.env.PORT || 3000;

//Táblák generálása és meghívása
const userModel = require("./src/models/userModel")(db.sequelize);
const foglalasModel = require("./src/models/foglalasModel")(db.sequelize);
const rendelesekModel = require("./src/models/rendelesekModel")(db.sequelize);
const termekModel = require("./src/models/termekModel")(db.sequelize);

//Mount-ok
const userRoutes = require('./src/routes/userRoute');
const termekRoutes = require('./src/routes/termekRoute');
const rendelesekRoutes = require('./src/routes/rendelesekRoute');
const foglalasRoutes = require('./src/routes/foglalasRoute');
const adminRoutes = require("./src/routes/adminRoute");

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//Route-ok alkalmazása
app.use('/api/auth', userRoutes);
app.use('/api/auth', termekRoutes);
app.use('/api/auth', foglalasRoutes);
app.use('/api/auth', rendelesekRoutes);
app.use('/api/auth', adminRoutes);

db.syncDatabase().then(()=>{
    console.log("Adatbázis szinkronizálva!")
    app.listen(PORT, () => {
    console.log(`Szerver fut: http://localhost:${PORT}`);   
});
})

