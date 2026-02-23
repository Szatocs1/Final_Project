const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const { createFoglalas, findFoglalasById, foglalasDelete, foglalasModify, getFoglalasByName, getEveryFoglalas, getFoglalasByEmail } = require("../controllers/foglalasController");
const { sendEmail } = require("../../config/mail");

const route = express.Router();

route.post("/foglalasCreate", async (req, res) =>{
    const { nev, email, telefonszam, borbely, idopont, szolgaltatas, ar } = req.body;

    if (!nev || !email || !telefonszam || !borbely || !idopont || !szolgaltatas || !ar){
        return res.status(400).json({ message: "Valamelyik mező nincs kitöltve vagy megadva!" })
    }

    try{
        const foglalas = await createFoglalas(nev, email, telefonszam, idopont, borbely, szolgaltatas, ar);

        const userData = {nev, email};
        const targy = "Sikeres foglalás!"
        const message = `Köszönjük foglalását! ${borbely} a választott borbély, ${idopont} a választott időpont!
        Ha módosítani vagy törölni szeretné foglalását, akkor kattintson a linkre!` //a kattintson után egy link van, melyet a sendEmail-en belül adok meg.

        const emailKuldes = await sendEmail({ userData, targy, message });

        return res.status(200).json({ message: "Sikeres foglalás és email küldés!", foglalas, emailKuldes })
    }catch(error){
        console.error("Nem sikerült létre hozni a foglalást, vagy az email nem került elküldésre!")
        return res.status(500).json({ message: "Nem sikerült a foglalás vagy az email küldés!", error })
    }
});

route.put("/foglalasModify/:id", async (req, res) =>{
    const { id } = req.params;
    const updates = req.body;

    if(!id){
        return res.status(400).json({ message: "A foglalás nem található!" });
    }

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "Nincs módosítandó adat!" });
    }

    try{
        const updatedFoglalas = await foglalasModify(id, updates)

        const foglalas = await findFoglalasById(id);
        const userData = {
            nev: foglalas.vasarloNeve,
            email: foglalas.vasarloEmail
        };
        const { borbely, idopont } = foglalas;

        const targy = "Foglalás modosítása sikeresen megtörtént!"
        const message = `Köszönjük foglalásának módosítását! ${borbely} a választott borbély, ${idopont} a választott időpont!
        Ha módosítani vagy törölni szeretné foglalását, akkor kattintson a linkre!!` //a kattintson után egy link van, melyet a sendEmail-en belül adok meg.
        const emailKuldes = await sendEmail(userData, targy, message);

        return res.status(200).json("Foglalás módosítva, egy új email lett elküldve a módosított adatokkal.", updatedFoglalas, emailKuldes)
    }catch(error){
        console.error("Szerver hiba, nem módosult a foglalás vagy nem küldte el az email-t, esetleg mindkettő!", error);
        throw error;
    }
});

route.delete("/foglalasDelete/:id", async (req, res) =>{
    const { id } = req.params;

    if(!id){
        return res.status(400).json({ message: "A foglalás nem található!" });
    }
    
    try{
        const deletedFoglalas = await foglalasDelete(id);

        return res.status(200).json({ message: "A foglalás sikeresen törölve!", deletedFoglalas });
    }catch(error){
        console.error("Szerver hiba, a foglalás nem került törlésre!", error);
        throw error;
    }
});

/*
admin
*/

route.put('/admin/modifyFoglalas', authMiddleware, isAdmin, async (req, res) =>{
    const { id } = req.params;
    const updates = req.body;

    if(!id){
        return res.status(400).json({ message: "A foglalás nem található!" });
    }

    if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "Nincs módosítandó adat!" });
    }

    try{
        const updatedFoglalas = await foglalasModify(id, updates)

        const foglalas = await findFoglalasById(id);
        const userData = {
            nev: foglalas.vasarloNeve,
            email: foglalas.vasarloEmail
        };
        const { borbely, idopont } = foglalas;

        const targy = "Foglalás modosítása sikeresen megtörtént!"
        const message = `Köszönjük foglalásának módosítását! ${borbely} a választott borbély, ${idopont} a választott időpont!
        Ha módosítani vagy törölni szeretné foglalását, akkor kattintson !` //a kattintson után egy link van, melyet a sendEmail-en belül adok meg.
        const emailKuldes = await sendEmail(userData, targy, message);

        return res.status(200).json("Foglalás módosítva, egy új email lett elküldve a módosított adatokkal.", updatedFoglalas, emailKuldes)
    }catch(error){
        console.error("Szerver hiba, nem módosult a foglalás vagy nem küldte el az email-t, esetleg mindkettő!", error);
        throw error;
    }
});

route.delete("/admin/foglalasDelete/:id", authMiddleware, isAdmin, async (req, res) =>{
    const { id } = req.params;

    if(!id){
        return res.status(400).json({ message: "A foglalás nem található!" });
    }
    
    try{
        const deletedFoglalas = await foglalasDelete(id);

        return res.status(200).json({ message: "A foglalás sikeresen törölve!", deletedFoglalas });
    }catch(error){
        console.error("Szerver hiba, a foglalás nem került törlésre!", error);
        throw error;
    }
});

route.get('/admin/getFoglalasByName', authMiddleware, isAdmin, async (req, res) =>{
    const { name } = req.body;

    if (!name){
        return res.status(400).json({ message: "Nincs kitöltve a mező!" });
    }

    try{
        const foglalas = await getFoglalasByName(name);

        return res.status(200).json({ message: "Sikeres foglalás lekérés név által!", foglalas});
    }catch(error){
        return res.status(500).json({ error: "Szerver hiba, nem sikerült lekérni a foglalást!", error });
    }
});

route.get('/admin/getEveryFoglalas', authMiddleware, isAdmin, async (req, res) =>{
    try{
        const foglalasok = await getEveryFoglalas();

        return res.status(200).json({ message: "Minden foglalás sikeresen lekérve!", foglalasok });
    }catch(error){
        return res.status(500).json({ message: "Szerver hiba, nem sikerült lekérn minden foglalást! ", error });
    }
});

route.get('/admin/getFoglalasByEmail', authMiddleware, isAdmin, async (req, res) =>{
    const { email } = req.body;

    if (!email){
        return res.status(400).json({ message: "Nincs kitöltve a mező!" });
    }

    try{
        const foglalas = await getFoglalasByEmail(email);

        return res.status(200).json({ message: "Sikeres foglalás lekérés email által!", foglalas});
    }catch(error){
        return res.status(500).json({ error: "Szerver hiba, nem sikerült lekérni a foglalást!", error });
    }
});

module.exports = route;