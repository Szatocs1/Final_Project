const express = require("express");
const route = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const { createRendeles, modifyRendeles, deleteRendeles, getEveryRendeles, getRendelesByName, getRendelesByEmail } = require("../controllers/rendelesekController");

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

        //Email küldés

        return res.status(201).json({
            message: "Rendelés sikeresen létrehozva!",
            rendeles
        });

    } catch (error) {
        console.error("Hiba a rendelés létrehozásakor:", error);
        return res.status(500).json({ message: "Szerver hiba történt!" });
    }
});

route.put("/rendelesModify/:id", async (req, res) =>{
    try {
        const { id } = req.params;

        const { updates } = req.body;

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Nincs módosítandó adat!" });
        }

        const updatedRendeles = await modifyRendeles(id, updates);

        //email

        return res.status(200).json({
            message: "Rendelés sikeresen módosítva!",
            updatedRendeles
        });
    } catch (error) {
        console.error("Hiba a rendelés módosításakor:", error);
        return res.status(500).json({ message: error.message || "Szerver hiba történt!" });
    }
});

route.delete("/rendelesDelete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if(!id){
            return res.status(400).json({ message: "A rendelés nem található!" })
        }

        const deletedRendeles = await deleteRendeles(id);

        //email

        return res.status(200).json({ message: "Rendelés sikeresen törölve!", deletedRendeles });
    }catch(error){
        console.error("Szerver hiba.");
        throw error;
    }
});

/*
admin
*/

route.post('/admin/modifyRendeles', authMiddleware, isAdmin, async (req, res) => {
    const { vasarloNeve, vasarloEmail, telefonszam, iranyitoszam, telepules, szallitasiCim, rendelesIdeje, termekek } = req.body;

    const final_ar = 0;

    for(const item of termekek){
        final_ar += item.ar;
    }

    try{
        const rendeles = await modifyRendeles(vasarloNeve, vasarloEmail, telefonszam, iranyitoszam, telepules, szallitasiCim, rendelesIdeje, termekek, final_ar);

        //email

        return res.status(200).json({ message: "Rendelés sikeresen módosítva!", rendeles });
    }catch(error){
        return res.status(500).json({ error: "Szerver hiba, nem sikerült módosítani a rendelésen!", error })
    }
});

route.delete('/admin/deleteRendeles', authMiddleware, isAdmin, async (req, res) =>{
    const { id } = req.params;

    if(!id){
        return res.status(400).json({ message: "A termék nem található!" });
    }

    try{
        const deletedRendeles = await deleteRendeles(id);

        //email

        return res.status(200).json({ message: "Termék sikeresen törölve!", deletedRendeles });
    }catch(error){
        return res.status(500).json({ error: "Szerver hiba, a termék nem került törlésre!", error })
    }
});

route.get('/admin/getRendelesByName', authMiddleware, isAdmin, async (req, res) =>{
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

route.get('/admin/getEveryRendeles', authMiddleware, isAdmin, async (req, res) =>{
    try{
        const rendelesek = await getEveryRendeles();

        return res.status(200).json({ message: "Minden rendelés sikeresen lekérve!", rendelesek })
    }catch(error){
        return res.status(500).json({ error: "Szerver hiba, nem sikerült lekérni a rendeléseket!", error });
    }
});

route.get('/admin/getRendelesByEmail', authMiddleware, isAdmin, async (req, res) => {
    const { email } = req.body;
    
    try{
        const rendeles = await getRendelesByEmail(email);

        return res.status(200).json({ message: "Sikeres rendelés lekérés email által!", rendeles });
    }catch(error){
        return res.status(500).json({ error: "Szerver hiba, nem sikerült lekérni a rendeléseket" })
    }
});

module.exports = route;
