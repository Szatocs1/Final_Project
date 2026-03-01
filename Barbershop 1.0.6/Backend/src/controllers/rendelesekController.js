const { sequelize } = require("../../config/db.js");
const Rendelesek = require("../models/rendelesekModel.js")(sequelize);
const Termek = require("../models/termekModel.js")(sequelize);
const RendelesTermekek = require("../models/rendelesTermekekModel.js")(sequelize);

async function createRendeles({ vasarloNeve, vasarloEmail, telefonszam, iranyitoszam, telepules, szallitasiCim, termekek, ar, userId }) {
    const productsWithInfo = [];

    for (const item of termekek) {
        const product = await Termek.findByPk(item.id);
        if (!product) throw new Error(`Termék ${item.name} nem található!`);

        const snapshot = {
            termekId: product.id,
            nev: product.termekNev,
            mennyiseg: item.mennyiseg,
            ar: product.ar
        };

        productsWithInfo.push(snapshot);
    }

    const newRendeles = await Rendelesek.create({
        vasarloNeve,
        vasarloEmail,
        telefonszam,
        iranyitoszam,
        telepules,
        szallitasiCim,
        rendelesIdeje: new Date(),
        termekek: productsWithInfo,
        ar,
        userId
    });

    const rendelesId = newRendeles.id;

    for (const item of termekek){
        const product = await Termek.findByPk(item.id);
        if (!product) throw new Error(`Termék ${item.name} nem található!`);
            
        const newRendelesTermekekHelper = await RendelesTermekek.create({
            rendelesId,
            termekId: item.id,
            mennyiseg: item.mennyiseg,
            ar: (item.ar || product.ar) * item.mennyiseg,
        })
    }

    return newRendeles.toJSON();
}

async function deleteRendeles(id) {
    const rendeles = await Rendelesek.findByPk(id);
    if (!rendeles) {
        throw new Error("Rendelés nem található!");
    }

    const rendelesDeleted = await rendeles.destroy();

    return rendelesDeleted ? rendelesDeleted.toJSON() : null;
}

async function getRendelesByName(name) {
      try{
          const rendelesek = await Rendelesek.findAll({where: { vasarloNeve: name }, limit: 20 , });

          return rendelesek.map(rendeles => rendeles.toJSON());
      }catch(error){
        console.error("Nem talál rendelést!", error)
        throw error;
      }
}

async function getRendelesByEmail(email) {
    const rendeles = await Rendelesek.findAll({ where: { vasarloEmail: email } });

    if(rendeles.length > 1){
        return rendeles.map(rend => rend.toJSON());
    }

    return rendeles.map(rend => rend.toJSON());
}

async function findRendelesById(id) {
    try {
        const numericId = Number(id); 
        
        console.log("Keresés folyamatban ID alapján:", numericId);

        const rendeles = await Rendelesek.findByPk(numericId);
        
        if (!rendeles) {
            console.warn(`Nem található rendeles ezzel az ID-val: ${numericId}`);
            return null;
        }

        return rendeles ? rendeles.toJSON() : null;
    }catch(error){
        console.error("Rendelés nem található id által: ", error)
        throw error;
    }
}

async function modifyRendeles(id, vasarloNeve, vasarloEmail, telefonszam, iranyitoszam, telepules, szallitasiCim, rendelesIdeje, termekek, final_ar) {
    const numericId = Number(id);
    
    const rendeles = await Rendelesek.findByPk(numericId);
    
    if (!rendeles) {
        throw new Error("Rendelés nem található!");
    }
    
    const updates = {};
    
    if (vasarloNeve !== null && vasarloNeve !== undefined && vasarloNeve.trim() !== '') {
        updates.vasarloNeve = vasarloNeve;
    }
    
    if (vasarloEmail !== null && vasarloEmail !== undefined && vasarloEmail.trim() !== '') {
        updates.vasarloEmail = vasarloEmail;
    }
    
    if (telefonszam !== null && telefonszam !== undefined && telefonszam.trim() !== '') {
        updates.telefonszam = telefonszam;
    }
    
    if (iranyitoszam !== null && iranyitoszam !== undefined && iranyitoszam.trim() !== '') {
        updates.iranyitoszam = iranyitoszam;
    }
    
    if (telepules !== null && telepules !== undefined && telepules.trim() !== '') {
        updates.telepules = telepules;
    }
    
    if (szallitasiCim !== null && szallitasiCim !== undefined && szallitasiCim.trim() !== '') {
        updates.szallitasiCim = szallitasiCim;
    }
    
    if (rendelesIdeje !== null && rendelesIdeje !== undefined) {
        updates.rendelesIdeje = rendelesIdeje;
    }
    
    if (termekek !== null && termekek !== undefined && Array.isArray(termekek) && termekek.length > 0) {
        updates.termekek = termekek;
    }
    
    if (final_ar !== null && final_ar !== undefined && !isNaN(Number(final_ar))) {
        updates.ar = Number(final_ar);
    }
    
    await rendeles.update(updates);
    
    return rendeles.toJSON();
}

module.exports = {
    createRendeles,
    deleteRendeles,
    getRendelesByName,
    getRendelesByEmail,
    findRendelesById,
    modifyRendeles,
};
