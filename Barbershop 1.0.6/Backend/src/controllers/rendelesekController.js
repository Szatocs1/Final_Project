/*
rendelés készítés, módosítás, törlés
rendelés időpontjának rögzítése
*/


const { where } = require("sequelize");
const { sequelize } = require("../../config/db.js");
const rendeles = require("../models/rendelesekModel.js");
const termekek = require("../models/termekModel.js")

async function itemAvaliableByName(termekNeve) {
    try{
        const termek = await termekek.findOne({ where: termekNeve })
        return termek ? termek.toJSON() : null;
    }catch(error){
        console.error("Nem találjató ilyen névvel termék!", error);
        throw error;
    }
}

async function itemAvaliableByName(params) {
    
}

module.exports = {
    itemAvaliableByName
}