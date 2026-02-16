/*
termék keresése név, kategória alapján
termék létrehozása, módosítása, törlése
kép hozzá fűzése

*/

const { where } = require("sequelize");
const { sequelize, Op } = require("../../config/db.js");
const path = require('path');
const multer = require('multer');
const Termek = require("../models/termekModel.js")(sequelize);

async function searchName(name) {
    try{
        const termekNeve = await Termek.findOne({ where: { termekNev: name } });
        return termekNeve ? termekNeve.toJSON() : null;
    }
    catch(error){
        console.error("Nem találta meg a terméket", error)
        throw error;
    }
};

async function searchCategory(category){
    try{
        const Category = await Termek.findAll({ where: { kategoria: category } });
        return Category.map(p => p.toJSON());
    }
    catch(error){
        console.error("Nem találta meg a kategóriát! ", error)
        throw error;
    }
};

async function searchProduct(filters = {}) {
    try{
        const where = {};

        if (filters.name){
            where.termekNev = { [Op.like]: `%${filters.name}%` }
        }
        if (filters.category){
            where.kategoria = filters.category;
        }

        const products = await Termek.findAll({ where });
        return products.map(p => p.toJSON());
    }catch(error){
        console.error("Nem találta a terméket vagy kategóriát!", error);
        throw error;
    }   
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Csak képfájlok engedélyezettek!'), false);
};

const upload = multer({ storage, fileFilter });

async function createItem(name, category, price, comment, file){
    try {
        const termek = await Termek.create({
            termekNev: name,
            kategoria: category,
            ar: price,
            megjegyzes: comment,
            kepNeve: file ? file.filename : null
        });
        return termek ? termek.toJSON() : null;
    }
    catch(error){
        console.error("Nem sikerült létre hozni a terméket!", error)
        throw error;
    }
}

async function modifyItem(id, termekNev, kategoria, ar, megjegyzes, file){
    try {
        const product = await Termek.findByPk(id);
        if (!product) throw new Error('Termék nem található!');

        const updates = {};
        if (termekNev) updates.termekNev = termekNev;
        if (kategoria) updates.kategoria = kategoria;
        if (ar !== 0) updates.ar = ar;
        if (megjegyzes) updates.megjegyzes = megjegyzes;
        if (file) updates.kepNeve = file.filename;

        await product.update(updates);

        return product ? product.toJSON() : null;
    }
    catch(error){
        console.error("Nem sikerült módosítani a terméket!", error);
        throw error;
    }
}

async function deleteItem(id) {
    try{
        const deletedCount = await Termek.destroy({
            where: { id }
        });

        if (deletedCount === 0){
            throw new Error("Termék nem található!");
        }

        return { message: 'Termék sikeresen eltávolítva!' }
    }catch(error){
        console.error("Nem találja a terméket!", error);
        throw error;
    }
}
async function getEveryItem() {
    try{
          const items = await Termek.findAll({ limit: 20 });

          return items.map(item => item.toJSON());

      }catch(error){
        console.error("Nem található termék!", error)
        throw error;
      }
}


module.exports = {
    searchProduct,
    searchName,
    searchCategory,
    createItem,
    modifyItem,
    deleteItem,
    getEveryItem,
    upload
};