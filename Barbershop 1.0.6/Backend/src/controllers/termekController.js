/*
termék keresése név, kategória alapján
termék létrehozása, módosítása, törlése
kép hozzá fűzése

*/

const { sequelize } = require("../../config/db.js");
const Termek = require("../models/termekModel.js")(sequelize);

async function searchName(name) {
    try{
        const termekNeve = await Termek.findOne({ where: { name } });
        return termekNeve ? termekNeve.toJson() : null;
    }
    catch(error){
        console.error("Nem találta meg a terméket", error)
        throw error;
    }
};

async function searchCategory(category){
    try{
        const category = await Termek.findOne({ where: { category } });
        return category ? category.toJson() : null;
    }
    catch(error){
        console.error("Nem találta meg a kategóriát! ", error)
        throw error;
    }
};

async function createItem(name, category, price, comment){
    try {
        const termek = Termek.create({
            termekNev: name,
            kategoria: category,
            ar: price,
            megjegyzes: comment
        });
        return termek ? termek.toJson() : null;
    }
    catch(error){
        console.error("Nem sikerült létre hozni a terméket!", error)
        throw error;
    }
}


module.exports = {
    searchName,
    searchCategory,
    createItem
};