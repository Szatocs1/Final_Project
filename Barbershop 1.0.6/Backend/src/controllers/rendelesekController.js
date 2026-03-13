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

// Route handlers

async function rendelesCreateRoute(req, res) {
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
        
        const { sequelize } = require("../../config/db.js");
        const User = require("../models/userModel.js")(sequelize);
        
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

        const { sendEmail } = require('../../config/mail.js')
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
}

async function rendelesDeleteRoute(req, res) {
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

        const { sendEmail } = require('../../config/mail.js')
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
}

async function getRendelesByIdRoute(req, res) {
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
}

async function adminModifyRendelesRoute(req, res) {
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
}

async function adminDeleteRendelesRoute(req, res) {
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
}

async function adminGetRendelesByNameRoute(req, res) {
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
}

async function adminGetRendelesByEmailRoute(req, res) {
    const { email } = req.body;
    
    try{
        const rendeles = await getRendelesByEmail(email);

        return res.status(200).json({ message: "Sikeres rendelés lekérés email által!", rendeles });
    }catch(error){
        return res.status(500).json({ error: "Szerver hiba, nem sikerült lekérni a rendeléseket" })
    }
}

module.exports = {
    createRendeles,
    deleteRendeles,
    getRendelesByName,
    getRendelesByEmail,
    findRendelesById,
    modifyRendeles,
    rendelesCreateRoute,
    rendelesDeleteRoute,
    getRendelesByIdRoute,
    adminModifyRendelesRoute,
    adminDeleteRendelesRoute,
    adminGetRendelesByNameRoute,
    adminGetRendelesByEmailRoute
};
