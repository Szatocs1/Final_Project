const { sequelize } = require("../../config/db.js");
const Rendelesek = require("../models/rendelesekModel.js")(sequelize);
const Termek = require("../models/termekModel.js")(sequelize);

async function createRendeles({ vasarloNeve, vasarloEmail, telefonszam, iranyitoszam, telepules, szallitasiCim, termekek, ar }) {
    const productsWithInfo = [];

    for (const item of termekek) {
        const product = await Termek.findByPk(item.termekId);
        if (!product) throw new Error(`Termék ${item.termekId} nem található!`);

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
        ar
    });

    return newRendeles.toJSON();
}

async function modifyRendeles(id, data) {
    const rendeles = await Rendelesek.findByPk(id);
    if (!rendeles) {
        throw new Error("Rendelés nem található!");
    }

    try{
        const updates = {};
        if (data.vasarloNeve) updates.vasarloNeve = data.vasarloNeve;
        if (data.vasarloEmail) updates.vasarloEmail = data.vasarloEmail;
        if (data.telefonszam) updates.telefonszam = data.telefonszam;
        if (data.iranyitoszam) updates.iranyitoszam = data.iranyitoszam;
        if (data.telepules) updates.telepules = data.telepules;
        if (data.szallitasiCim) updates.szallitasiCim = data.szallitasiCim;
        if (data.termekek) updates.termekek = data.termekek;
        if (data.ar !== undefined) updates.ar = data.ar;

        const [updatedCount] = await Rendelesek.update(updates, { where: { id } });
        if (updatedCount === 0) {
            throw new Error("A rendelés módosítása sikertelen volt!");
        }

        const updatedRendeles = await Rendelesek.findByPk(id);
        return updatedRendeles ? updatedRendeles.toJSON() : null;
    }
    catch(error){
        console.error("Hiba történt a rendelés módosításánál: ", error);
        throw error;
    }
}

async function deleteRendeles(id) {
    const rendeles = await Rendelesek.findByPk(id);
    if (!rendeles) {
        throw new Error("Rendelés nem található!");
    }

    const rendelesDeleted = await rendeles.destroy();

    return rendelesDeleted ? rendelesDeleted.toJSON() : null;
}

async function getRendelesByName(nev) {
    const rendeles = await Rendelesek.findOne({ where: { vasarloNeve: nev } });

    return rendeles ? rendeles.toJSON() : null;
}

async function getEveryRendeles() {
      try{
          const rendelesek = await Rendelesek.findAll({ limit: 20 });

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

module.exports = {
    createRendeles,
    modifyRendeles,
    deleteRendeles,
    getRendelesByName,
    getEveryRendeles,
    getRendelesByEmail
};

