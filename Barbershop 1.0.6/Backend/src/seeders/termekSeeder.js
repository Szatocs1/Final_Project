const { sequelize } = require("../../config/db.js");
const Termek = require("../models/termekModel.js")(sequelize);

async function termekSeeder() {
    const termekek = [
        { id: 2, termekNev: 'Signature Póló, Fekete', kategoria: 'Ruházat', ar: 12990, kepNeve: 'uploads/termekek/Polo_Fekete_E.png', megjegyzes: 'Prémium pamut póló, kényelmes viselet a mindennapokra.'},
        { id: 3, termekNev: 'DIVISUM PréMIUM Sampon', kategoria: 'Hajápolás', ar: 9990, kepNeve: 'uploads/termekek/Sampon.png', megjegyzes: 'Mélytisztító formula, amely felfrissíti a fejbőrt és fényessé teszi a hajat.' },
        { id: 4, termekNev: 'Professzionális Hajvágó Olló', kategoria: 'Eszközök', ar: 34990, kepNeve: 'uploads/termekek/Ollo.png', megjegyzes: 'Japán acélból készült, precíziós olló professzionális borbélyoknak.' },
        { id: 5, termekNev: 'Professzionális Leválasztó Fésű', kategoria: 'Eszközök', ar: 7990, kepNeve: 'uploads/termekek/Fesu.png', megjegyzes: 'Hőálló, antisztatikus fésű a tökéletes választékokért.' },
        { id: 6, termekNev: 'DIVISUM Prémium Kondicionáló', kategoria: 'Hajápolás', ar: 9990, kepNeve: 'uploads/termekek/Kondicionalo.png', megjegyzes: 'Hidratáló kondicionáló, amely puhává és könnyen kezelhetővé teszi a hajat.' },
        { id: 7, termekNev: 'Signature Póló, Fehér', kategoria: 'Ruházat', ar: 12990, kepNeve: 'uploads/termekek/Polo_Feher_E.png', megjegyzes: 'Klasszikus fehér póló, prémium anyaghasználattal.' },
        { id: 8, termekNev: 'Signature Póló, Szürke', kategoria: 'Ruházat', ar: 12990, kepNeve: 'uploads/termekek/Polo_Szurke_E.png', megjegyzes: 'Modern szürke póló, amely minden stílushoz passzol.' },
        { id: 9, termekNev: 'DIVISUM Prémium Hajformázó Pomádé', kategoria: 'Hajápolás', ar: 9990, kepNeve: 'uploads/termekek/Pomade.png', megjegyzes: 'Erős tartás és elegáns fény a klasszikus frizurákhoz.' },
        { id: 10, termekNev: 'DIVISUM Prémium Hajformázó Wax', kategoria: 'Hajápolás', ar: 9990, kepNeve: 'uploads/termekek/Wax.png', megjegyzes: 'Természetes hatású tartás, matt finissel a modern stílus kedvelőinek.' },
        { id: 11, termekNev: 'Signature Kapucnis Pulóver, Fekete', kategoria: 'Ruházat', ar: 18900, kepNeve: 'uploads/termekek/Pulover_Fekete_E.png', megjegyzes: 'Vastag, meleg kapucnis pulóver hímzett logóval.' },
        { id: 12, termekNev: 'Signature Kapucnis Pulóver, Fehér', kategoria: 'Ruházat', ar: 18900, kepNeve: 'uploads/termekek/Pulover_Feher_E.png', megjegyzes: 'Letisztult fehér pulóver a DIVISUM kollekciójából.' },
        { id: 13, termekNev: 'Signature Kapucnis Pulóver, Szürke', kategoria: 'Ruházat', ar: 18900, kepNeve: 'uploads/termekek/Pulover_Szurke_E.png', megjegyzes: 'Kényelmes viselet hűvösebb napokra.' },
        { id: 14, termekNev: 'Signature Póló, Kék', kategoria: 'Ruházat', ar: 12990, kepNeve: 'uploads/termekek/Polo_Kek_E.png', megjegyzes: 'Az ikonikus sötétkék színű prémium pólónk.' },
        { id: 15, termekNev: 'Titánium Nyeles Borotva', kategoria: 'Eszközök', ar: 24990, kepNeve: 'uploads/termekek/Nyeles_Borotva.png', megjegyzes: 'Cserélhető pengés borotva a legsimább eredményért.' },
    ]

    for (const termek of termekek){ 
        const létezik = await Termek.findOne({ where: { termekNev: termek.termekNev } });
        
        if (!létezik) {
            await Termek.create({
                termekNev: termek.termekNev,
                kategoria: termek.kategoria,
                ar: Number(termek.ar),
                megjegyzes: termek.megjegyzes,
                kepNeve: Array.isArray(termek.kepNeve) ? termek.kepNeve[0] : termek.kepNeve
            });
        }
    }
}

module.exports = {
    termekSeeder
}