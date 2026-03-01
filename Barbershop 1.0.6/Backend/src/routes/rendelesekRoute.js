const express = require("express");
const route = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const { createRendeles, findRendelesById, deleteRendeles, getRendelesByName, getRendelesByEmail, modifyRendeles } = require("../controllers/rendelesekController");
const { sendEmail } = require('../../config/mail.js')

const { sequelize } = require("../../config/db.js");
const User = require("../models/userModel.js")(sequelize);

route.post("/rendelesCreate", authMiddleware, async (req, res) => {
    try {
        const { termekek, iranyitoszam, telepules, szallitasiCim } = req.body;

        if (!termekek || !Array.isArray(termekek) || termekek.length === 0) {
            return res.status(400).json({ message: "A kosár üres vagy hibás!" });
        }

        if (!iranyitoszam || !telepules || !szallitasiCim) {
            return res.status(400).json({ message: "Kérlek töltsd ki a hiányzó adatokat (irányítószám, település, szállítási cím)!" });
        }

        const { ar } = req.body;
        
        const userId = req.user.id;
        
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ message: "Felhasználó nem található!" });
        }

        const rendeles = await createRendeles({
            vasarloNeve: user.nev,
            vasarloEmail: user.email,
            telefonszam: user.telefonszam,
            iranyitoszam,
            telepules,
            szallitasiCim,
            ar,
            termekek,
            userId: user.id,
        });

        const rendelesId = rendeles.id;
        const link = 'http://localhost:4200/delete-rendeles'

        const email = rendeles.vasarloEmail;
        const targy = "Sikeres rendelés!"
        const message = `Köszönjük rendelését! Ha törölni szeretné rendelését, akkor ezt a kódot: ${rendelesId} másolja ki, nyomjon a linkre és illesze be a mezőbe!`;

        const emailKuldes = await sendEmail({ 
            userData: email,
            subject: targy,
            message, 
            link 
        });

        return res.status(201).json({
            message: "Rendelés sikeresen létrehozva!",
            rendeles,
            emailKuldes
        });

    } catch (error) {
        console.error("Hiba a rendelés létrehozásakor:", error);
        return res.status(500).json({ message: "Szerver hiba történt!" });
    }
});

route.delete("/rendelesDelete", async (req, res) => {
    try {
        const { id } = req.body;

        if(!id){
            return res.status(400).json({ message: "A rendelés nem található!" })
        }
        
        const rendeles = await findRendelesById(id);
        const rendelesId = rendeles.id;
        const link = 'http://localhost:4200/termekek';

        const email = rendeles.vasarloEmail;
        const targy = "Sikeres rendelés törlés!"
        const message = `${rendelesId} kódú rendelését töröltük, ha másik rendelést szeretne tenni, nyomjon a linkre!`;

        const deletedRendeles = await deleteRendeles(id);

        const emailKuldes = await sendEmail({ 
            userData: email,
            subject: targy,
            message, 
            link 
        });

        return res.status(200).json({ message: "Rendelés sikeresen törölve!", deletedRendeles, emailKuldes });
    }catch(error){
        console.error("Szerver hiba: ", error);
        throw error;
    }
});

route.post("/getRendelesById", async(req, res) => {
    const { id } = req.body;

    if(!id) return res.status(401).json({ message: "Nem adta meg a kódot!" });

    try{
        const rendeles = await findRendelesById(id);

        if(!rendeles) return res.status(400).json({ message: "Nincs ilyen rendelés!" })

        return res.status(200).json({ message: "Rendelés sikeresen lekérve!", rendeles });
    }catch(error){
        console.error("Szerver hiba: ", error);
        throw error;
    }
})

/*
admin
*/

route.post('/admin/modifyRendeles', authMiddleware, isAdmin, async (req, res) => {
    const { id, vasarloNeve, vasarloEmail, telefonszam, iranyitoszam, telepules, szallitasiCim, rendelesIdeje, termekek } = req.body;

    let final_ar = 0;

    for(const item of termekek){
        final_ar += item.ar;
    }

    try{
        const rendeles = await modifyRendeles(id, vasarloNeve, vasarloEmail, telefonszam, iranyitoszam, telepules, szallitasiCim, rendelesIdeje, termekek, final_ar);

        return res.status(200).json({ message: "Rendelés sikeresen módosítva!", rendeles });
    }catch(error){
        return res.status(500).json({ error: "Szerver hiba, nem sikerült módosítani a rendelésen!", error })
    }
});

route.delete('/admin/deleteRendeles', authMiddleware, isAdmin, async (req, res) =>{
    const { id } = req.body;

    if(!id){
        return res.status(400).json({ message: "A termék nem található!" });
    }

    try{
        const deletedRendeles = await deleteRendeles(id);

        return res.status(200).json({ message: "Termék sikeresen törölve!", deletedRendeles });
    }catch(error){
        return res.status(500).json({ error: "Szerver hiba, a termék nem került törlésre!", error })
    }
});
//pipa
route.post('/admin/getRendelesByName', authMiddleware, isAdmin, async (req, res) =>{
    const { name } = req.body;

    if(!name){
        return res.status(400).json({ message: "A mező nincs kitöltve!" });
    }

    try{
        const rendeles = await getRendelesByName(name);

        if(!rendeles){
            return res.status(400).json({ message: "Rendelés nem található!" });
        }

        return res.status(200).json({ message: "Rendelés sikeresen megtalálva név által!", rendeles });
    }catch(error){
        return res.status(500).json({ error: "Szerver hiba, a rendelés nem került lekérésre!", error });
    }
});
//pipa
route.post('/admin/getRendelesByEmail', authMiddleware, isAdmin, async (req, res) => {
    const { email } = req.body;
    
    try{
        const rendeles = await getRendelesByEmail(email);

        return res.status(200).json({ message: "Sikeres rendelés lekérés email által!", rendeles });
    }catch(error){
        return res.status(500).json({ error: "Szerver hiba, nem sikerült lekérni a rendeléseket" })
    }
});

module.exports = route;
