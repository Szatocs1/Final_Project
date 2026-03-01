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


module.exports = {
    findFoglalasById,
    foglalasModify,
    foglalasDelete,
    createFoglalas,
    getFoglalasByName,
    getFoglalasByEmail,
    getEveryFoglalas
}
