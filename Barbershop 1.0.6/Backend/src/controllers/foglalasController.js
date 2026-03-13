const { where } = require("sequelize");
const { sequelize } = require("../../config/db");
const { getEveryUser } = require("./userController");

const Foglalasok = require("../models/foglalasModel")(sequelize);

async function findFoglalasById(id) {
    try {
        const numericId = Number(id); 
        
        console.log("Keresés folyamatban ID alapján:", numericId);

        const foglalas = await Foglalasok.findByPk(numericId);
        
        if (!foglalas) {
            console.warn(`Nem található foglalás ezzel az ID-val: ${numericId}`);
            return null;
        }

        return foglalas ? foglalas.toJSON() : null;
    }catch(error){
        console.error("Foglalás nem található id által: ", error)
        throw error;
    }
}

async function createFoglalas(nev, email, telefonszam, idopont, borbely, szolgaltatas, ar, userId, borbelyId) {
    
    try{
        const createdFoglalas = await Foglalasok.create({
            vasarloNeve: nev,
            vasarloEmail: email,
            vasarloTelefonszam: telefonszam,
            idopont,
            borbely,
            szolgaltatas,
            ar,
            userId: userId || null,
            borbelyId: borbelyId || null,
        });

        return createdFoglalas ? createdFoglalas.toJSON() : null;
    }catch(error){
        console.error("Nem sikerült létre hozni a foglalást: ", error);
        throw error;
    }
}

async function foglalasModify(id, data) {
    const foglalas = await Foglalasok.findByPk(id);
    if (!foglalas) {
        throw new Error("Foglalás nem található!");
    }

    try {
        const updates = {};
        
        if (data.nev !== null && data.nev !== undefined && data.nev.trim() !== '') {
            updates.vasarloNeve = data.nev;
        }
        
        if (data.email !== null && data.email !== undefined && data.email.trim() !== '') {
            updates.vasarloEmail = data.email;
        }
        
        if (data.telefonszam !== null && data.telefonszam !== undefined && data.telefonszam.trim() !== '') {
            updates.vasarloTelefonszam = data.telefonszam;
        }
        
        if (data.idopont !== null && data.idopont !== undefined) {
            updates.idopont = data.idopont;
        }
        
        if (data.borbely !== null && data.borbely !== undefined && data.borbely.trim() !== '') {
            updates.borbely = data.borbely;
        }
        
        if (data.szolgaltatas !== null && data.szolgaltatas !== undefined && data.szolgaltatas.trim() !== '') {
            updates.szolgaltatas = data.szolgaltatas;
        }
        
        if (data.ar !== null && data.ar !== undefined && !isNaN(Number(data.ar))) {
            updates.ar = Number(data.ar);
        }

        console.log("Módosítandó adatok:", updates);

        const [updatedCount] = await Foglalasok.update(updates, { where: { id: id } });

        const updatedfoglalas = await Foglalasok.findByPk(id);
        return updatedfoglalas ? updatedfoglalas.toJSON() : null;
    }
    catch (error) {
        console.error("Hiba történt a foglalás módosításánál: ", error);
        throw error;
    }
}

async function foglalasDelete(id) {
    try {
        const deletedRowsCount = await Foglalasok.destroy({ 
            where: { id: id } 
        });

        if (deletedRowsCount === 0) {
            return { success: false, message: "Nem található ilyen azonosítóju foglalás." };
        }

        return { success: true, deletedCount: deletedRowsCount };
    }
    catch (error) {
        console.error("Nem sikerült törölni a foglalást: ", error);
        throw error;
    }
}
async function getFoglalasByName(name) {
    try{
        const foglalasok = await Foglalasok.findAll({ where: { vasarloNeve: name}, limit: 20 });

        return foglalasok.map(foglalas => foglalas.toJSON());
    }catch(error){
        console.error("Nem sikerült lekérni a foglalást név által!", error)
    }
}


async function getFoglalasByEmail(email) {
    try{
        const foglalasok = await Foglalasok.findAll({ where: {vasarloEmail: email}, limit: 20 });

        return foglalasok.map(foglalas => foglalas.toJSON());
    }catch(error){
        console.error("Nem talál foglalást email áltl!", error)
        throw error;
    }
}
async function getEveryFoglalas() {
    try{
        const foglalasok = await Foglalasok.findAll();

        return foglalasok.map(foglalas => foglalas.toJSON());
    }catch(error){
        console.error("Nem sikerült lekérni minden foglalást: ", error);
        throw error;
    }
}

// Route handlers

async function getEveryFoglalasRoute(req, res) {
    try{
        const foglalasok = await getEveryFoglalas();

        return res.status(200).json({ message: "Minden foglalás sikeresen lekérve!", foglalasok });
    }catch(error){
        return res.status(500).json({ message: "Szerver hiba, nem sikerült lekérn minden foglalást! ", error });
    }
}

async function foglalasCreateRoute(req, res) {
    const { nev, email, telefonszam, borbely, idopont, szolgaltatas, ar, userId, borbelyId } = req.body;

    if (!nev || !email || !telefonszam || !borbely || !idopont || !szolgaltatas || !ar || !borbelyId){
        return res.status(400).json({ message: "Valamelyik mező nincs kitöltve vagy megadva!" })
    }

    try{
        const foglalas = await createFoglalas(nev, email, telefonszam, idopont, borbely, szolgaltatas, ar, userId, borbelyId);

        const foglalasId = foglalas.id;
        const link = 'http://localhost:4200/modify-delete-foglalas'

        const userData = {nev, email};
        const targy = "Sikeres foglalás!"
        const message = `Köszönjük foglalását! ${borbely} a választott borbély, ${idopont} a választott időpont!
        Ha módosítani vagy törölni szeretné foglalását, akkor kattintson a linkre, írja be utána ezt a kódot: ${foglalasId} és válassza ki melyiket szeretné elvégezni!`;

        const { sendEmail } = require("../../config/mail");
        const emailKuldes = await sendEmail({ 
        userData: email,
        subject: targy,
        message, 
        link 
    });

        return res.status(200).json({ message: "Sikeres foglalás és email küldés!", foglalas, emailKuldes })
    }catch(error){
        console.error("Nem sikerült létre hozni a foglalást, vagy az email nem került elküldésre!")
        return res.status(500).json({ message: "Nem sikerült a foglalás vagy az email küldés!", error })
    }
}

async function getFoglalasByIdRoute(req, res) {
    const { id } = req.body;

    if(!id) return res.status(401).json({ message: "Nem adta meg a kódot!" });

    try{
        const foglalas = await findFoglalasById(id);

        if(!foglalas) return res.status(400).json({ message: "Nincs ilyen foglalás!" })

        return res.status(200).json({ message: "Foglalás sikeresen lekérve!", foglalas });
    }catch(error){
        console.error("Szerver hiba: ", error);
        throw error;
    }
}

async function foglalasModifyRoute(req, res) {
    const { id } = req.body;
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
        const email = foglalas.vasarloEmail;
        const foglalasId = foglalas.id;
        const { borbely, idopont } = foglalas;

        const targy = "Foglalás modosítása sikeresen megtörtént!"
        const message = `Köszönjük foglalásának módosítását! ${borbely} a választott borbély, ${idopont} a választott időpont!
        Ha módosítani vagy törölni szeretné foglalását, akkor kattintson a linkre, írja be utána ezt a kódot: ${foglalasId} és válassza ki melyiket szeretné elvégezni!`;
        const link = 'http://localhost:4200/modify-delete-foglalas'
        const { sendEmail } = require("../../config/mail");
        const emailKuldes = await sendEmail({ 
            userData: email,
            subject: targy,
            message, 
            link 
        });

        return res.status(200).json("Foglalás módosítva, egy új email lett elküldve a módosított adatokkal.", updatedFoglalas, emailKuldes)
    }catch(error){
        console.error("Szerver hiba, nem módosult a foglalás vagy nem küldte el az email-t, esetleg mindkettő!", error);
        throw error;
    }
}

async function foglalasDeleteRoute(req, res) {
    const rawId = req.body.id;

    const id = parseInt(rawId);

    if(!id){
        return res.status(400).json({ message: "A foglalás nem található!" });
    }
    
    try{
        const foglalas = await findFoglalasById(id);
        if(!foglalas) return res.status(400).json({ message: "Nincs ilyen kódú foglalás!" });
        const email = foglalas.vasarloEmail;
        const foglalasId = foglalas.id;

        const targy = "Foglalás modosítása sikeresen megtörtént!"
        const message = `${foglalasId} kódú foglalását sikeresen törölte! Ha másik foglalást szeretne tenni, kövesse ezt a linket: `;
        const link = 'http://localhost:4200/foglalas'
        const { sendEmail } = require("../../config/mail");
        const emailKuldes = await sendEmail({ 
            userData: email,
            subject: targy,
            message, 
            link 
        });

        const deletedFoglalas = await foglalasDelete(id);

        return res.status(200).json({ message: "A foglalás sikeresen törölve és email sikeresen elküldve!", deletedFoglalas, emailKuldes });
    }catch(error){
        console.error("Szerver hiba, a foglalás nem került törlésre!", error);
        throw error;
    }
}

async function adminModifyFoglalasRoute(req, res) {
    const { id } = req.body;
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
        Ha módosítani vagy törölni szeretné foglalását, akkor kattintson !`
        const { sendEmail } = require("../../config/mail");
        const emailKuldes = await sendEmail(userData, targy, message);

        return res.status(200).json("Foglalás módosítva, egy új email lett elküldve a módosított adatokkal.", updatedFoglalas, emailKuldes)
    }catch(error){
        console.error("Szerver hiba, nem módosult a foglalás vagy nem küldte el az email-t, esetleg mindkettő!", error);
        throw error;
    }
}

async function adminFoglalasDeleteRoute(req, res) {
    const { id } = req.body;

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
}

async function adminGetFoglalasByNameRoute(req, res) {
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
}

async function adminGetFoglalasByEmailRoute(req, res) {
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
}

module.exports = {
    findFoglalasById,
    foglalasModify,
    foglalasDelete,
    createFoglalas,
    getFoglalasByName,
    getFoglalasByEmail,
    getEveryFoglalas,
    getEveryFoglalasRoute,
    foglalasCreateRoute,
    getFoglalasByIdRoute,
    foglalasModifyRoute,
    foglalasDeleteRoute,
    adminModifyFoglalasRoute,
    adminFoglalasDeleteRoute,
    adminGetFoglalasByNameRoute,
    adminGetFoglalasByEmailRoute
}
