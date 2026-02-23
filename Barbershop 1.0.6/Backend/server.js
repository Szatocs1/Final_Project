require('dotenv').config();

const express = require('express');
const path = require('path');
const db = require('./config/db');
const { adminSeeder } = require('./src/seeders/adminSeeder');
const { termekSeeder } = require('./src/seeders/termekSeeder')
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/uploads/termekek', express.static(path.join(__dirname, 'uploads/termekek')));


const whitelist = [
  "http://localhost:4200",
  "https://staging.yourbarbershop.com",
  "https://yourbarbershop.com"
];

//Táblák generálása és meghívása
const userModel = require("./src/models/userModel")(db.sequelize);
const foglalasModel = require("./src/models/foglalasModel")(db.sequelize);
const rendelesekModel = require("./src/models/rendelesekModel")(db.sequelize);
const termekModel = require("./src/models/termekModel")(db.sequelize);
const rendelesTermekek = require("./src/models/rendelesTermekekModel")(db.sequelize);

//Mount-ok
const userRoutes = require('./src/routes/userRoute');
const termekRoutes = require('./src/routes/termekRoute');
const rendelesekRoutes = require('./src/routes/rendelesekRoute');
const foglalasRoutes = require('./src/routes/foglalasRoute');
const uploadRoutes = require('./src/routes/uploadsRoute')

//Route-ok alkalmazása
app.use('/api/auth', userRoutes);
app.use('/api/termek', termekRoutes);
app.use('/api/foglalas', foglalasRoutes);
app.use('/api/rendelesek', rendelesekRoutes);
// Note: /uploads route removed - static file serving at /uploads/termekek handles image requests

db.syncDatabase().then(async ()=>{
    console.log("Adatbázis szinkronizálva!")
    await adminSeeder();
    await termekSeeder();
    console.log('Admin feltöltve!');
    app.listen(PORT, () => {
    console.log(`Szerver fut: http://localhost:${PORT}`);   
});
})

