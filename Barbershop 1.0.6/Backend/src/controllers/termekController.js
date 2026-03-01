const { where } = require("sequelize");
const { sequelize } = require("../../config/db.js");
const { Op } = require("../../config/db.js");
const Termek = require("../models/termekModel.js")(sequelize);

async function searchName(name) {
    try {
        const termekNeve = await Termek.findOne({ where: { termekNev: name } });
        return termekNeve ? termekNeve.toJSON() : null;
    }
    catch (error) {
        console.error("Nem találta meg a terméket", error)
        throw error;
    }
};

async function searchCategory(category) {
    try {
        const Category = await Termek.findAll({ where: { kategoria: category } });
        return Category.map(p => p.toJSON());
    }
    catch (error) {
        console.error("Nem találta meg a kategóriát! ", error)
        throw error;
    }
};

async function searchProduct(filters = {}) {
    try {
        const where = {};

        if (filters.name) {
            where.termekNev = { [Op.like]: `%${filters.name}%` }
        }
        if (filters.category) {
            where.kategoria = filters.category;
        }

        const products = await Termek.findAll({ where });
        return products.map(p => p.toJSON());
    } catch (error) {
        console.error("Nem találta a terméket vagy kategóriát!", error);
        throw error;
    }
}

async function createItem(name, category, price, comment, file) {
    try {
        const termek = await Termek.create({
            termekNev: name,
            kategoria: category,
            ar: Number(price),
            megjegyzes: comment,
            kepNeve: file ? `uploads/termekek/${file.filename}` : null
        });
        return termek ? termek.get({ plain: true }) : null;    
    }
    catch (error) {
        console.error("Nem sikerült létre hozni a terméket!", error)
        throw error;
    }
}

async function modifyItem(id, termekNev, kategoria, ar, megjegyzes, file) {
    try {
        const product = await Termek.findByPk(id);
        if (!product) throw new Error('Termék nem található!');

        const updates = {};
        
        if (termekNev !== null && termekNev !== undefined && termekNev.trim() !== '') {
            updates.termekNev = termekNev;
        }
        
        if (kategoria !== null && kategoria !== undefined && kategoria.trim() !== '') {
            updates.kategoria = kategoria;
        }
        
        if (ar !== null && ar !== undefined && ar !== '' && !isNaN(Number(ar)) && Number(ar) !== 0) {
            updates.ar = Number(ar);
        }
        
        if (megjegyzes !== null && megjegyzes !== undefined && megjegyzes.trim() !== '') {
            updates.megjegyzes = megjegyzes;
        }
        
        if (file) {
            updates.kepNeve = `uploads/termekek/${file.filename}`;
        }

        await product.update(updates);

        return product ? product.toJSON() : null;
    }
    catch (error) {
        console.error("Nem sikerült módosítani a terméket!", error);
        throw error;
    }
}

async function deleteItem(id) {
    try {
        const deletedCount = await Termek.destroy({
            where: { id }
        });

        if (deletedCount === 0) {
            throw new Error("Termék nem található!");
        }

        return { message: 'Termék sikeresen eltávolítva!' }
    } catch (error) {
        console.error("Nem találja a terméket!", error);
        throw error;
    }
}

async function getEveryItem() {
    try {
        const items = await Termek.findAll({ limit: 20 });
        return items.map(item => item.toJSON());
    } catch (error) {
        console.error("Nem található termék!", error)
        throw error;
    }
}

async function getProductByName(name) {
    try {
        const Sequelize = require('sequelize');
        const operator = Sequelize.Op;

        const product = await Termek.findOne({ 
            where: { 
                termekNev: { 
                    [operator.like]: `%${name}%` 
                } 
            } 
        });

        return product ? product.toJSON() : null;
    } catch (error) {
        console.error("Hiba a lekérdezés során:", error);
        throw error;
    }
}

async function getProductById(id) {
    try{
        const termek = await Termek.findByPk(id);

        return termek ? termek.toJSON() : null;
    }catch(error){
        console.error("Terméket nem találta id által: ", error);
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
    getProductByName,
    getProductById
};