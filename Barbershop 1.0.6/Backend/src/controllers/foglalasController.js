/*
ha a foglalás felhasználva, vagy nem jelenik meg a vevő: törölje a foglalást
foglalások módosítása, foglalások létrehozása, foglalások törlése
foglalás keresés név és gmail által
minden foglalás mutatása a borbélynak
*/
const { where } = require("sequelize");
const Foglalasok = require("../models/foglalasModel");

async function findFoglalasById(id) {
    try{
        const foglalas = await Foglalasok.findByPk(id);
        return foglalas ? foglalas.toJSON() : null;
    }catch(error){
        console.error("Foglalás nem található id által: ", error)
        throw error;
    }
}

async function createFoglalas(nev, email, telefonszam, idopont, borbely, szolgaltatas, ar) {
    try{
        const createdFoglalas = await Foglalasok.create({
            vasarloNeve: nev,
            vasarloEmail: email,
            vasarloTelefonszam: telefonszam,
            idopont,
            borbely,
            szolgaltatas,
            ar
        });

        return createdFoglalas ? createdFoglalas.toJSON : null;
    }catch(error){
        console.error("Nem sikerült létre hozni a foglalást: ", error);
        throw error;
    }
}

async function foglalasModify(id, data) {
    const foglalas = await Foglalasok.findFoglalasById(id);
    if (!foglalas) {
        throw new Error("Foglalás nem található!");
    }

    try{
        const updates = {};
        if (data.vasarloNeve) updates.vasarloNeve = data.vasarloNeve;
        if (data.vasarloEmail) updates.vasarloEmail = data.vasarloEmail;
        if (data.vasarloTelefonszam) updates.vasarloTelefonszam = data.vasarloTelefonszam;
        if (data.idopont) updates.idopont = data.idopont;
        if (data.borbely) updates.borbely = data.borbely;
        if (data.szolgaltatas) updates.szolgaltatas = data.szolgaltatas;
        if (data.ar !== undefined) updates.ar = data.ar;

        const [updatedCount] = await Foglalasok.update(updates, { where: { id } });
        if (updatedCount === 0) {
            throw new Error("A foglalás módosítása sikertelen volt!");
        }

        const updatedfoglalas = await Foglalasok.findFoglalasById(id);
        return updatedfoglalas ? updatedfoglalas.toJSON() : null;
    }
    catch(error){
        console.error("Hiba történt a foglalás módosításánál: ", error);
        throw error;
    }
}

async function foglalasDelete(id) {
    try{
        const foglalas = await Foglalasok.findFoglalasById(id);

        const deletedFoglalas = await foglalas.destroy();

        return deletedFoglalas.toJSON();
    }
    catch(error){
        console.error("Nem sikerült törölni a foglalást: ", error);
        throw error;
    }
}

async function getFoglalasByName(nev) {
    try{
        const foglalas = await Foglalasok.findOne({ where: nev });

        return foglalas ? foglalas.toJSON() : null;
    }catch(error){
        console.error("Nem sikerült lekérni a foglalást név által!", error)
    }
}

async function getEveryFoglalas() {
    try{
          const foglalasok = await Foglalasok.findAll({ limit: 20 });

          return foglalasok.map(foglalas => foglalas.toJSON());

      }catch(error){
        console.error("Nem talál foglalást!", error)
        throw error;
      }
}

async function getFoglalasByEmail(email) {
    try{
        const foglalas = await Foglalasok.findOne({ where: email });

        return foglalas ? foglalas.toJSON() : null;
    }catch(error){
        console.error("Nem talál foglalást email áltl!", error)
        throw error;
    }
}

module.exports = {
    findFoglalasById,
    foglalasModify,
    foglalasDelete,
    createFoglalas,
    getFoglalasByName,
    getEveryFoglalas,
    getFoglalasByEmail
}