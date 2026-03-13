
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

// Route handlers

async function productsRoute(req, res) {
    const { name, category } = req.query;

    const filters = {};
    if(name) filters.name = name;
    if(category) filters.category = category;

    try{
        const products = await searchProduct(filters);

        const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
        const productsWithFullImageUrl = products.map(product => ({
            ...product,
            kepNeve: product.kepNeve ? `${BASE_URL}/${product.kepNeve}` : null
        }));

        if (products.length === 0){
            return res.status(200).json({ message: "Nincs megszabott feltétel!", products: [] })
        }

        return res.status(200).json({ message: "Sikeresen lekért szűrt termékek!", products: productsWithFullImageUrl });
    }catch(error){
        console.error("Nem talált ilyen teméket vagy kategóriát!", error);
        throw error;
    }
}

async function adminGetProductByNameRoute(req, res) {
    const { name } = req.body;

    if(!name) return res.status(401).json({ message: "Nincs kitöltve mező!" });

    try {
        const product = await getProductByName(name);

        if (!product) {
            return res.status(404).json({ message: "Termék nem található!" });
        }

        const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
        const productWithFullImageUrl = {
            ...product,
            kepNeve: product.kepNeve ? `${BASE_URL}/${product.kepNeve}` : null
        }

        return res.status(200).json({ message: "Termék sikeres lekérve!", productWithFullImageUrl })
    }catch(error){
        console.error("Szerver hiba: ", error)
        throw error;
    }
}

async function adminProductsCreateRoute(req, res) {
    const { name, category, price, comment } = req.body;
    const file = req.file

    if(!file){
        return res.status(401).json({ message: "Nem küldte el a képet!" })
    }

    if (!name || !category || !price){
        return res.status(401).json({ message: "Hiányzik valamelyik mező!" });
    }

    try{
        const createdProduct = await createItem(name, category, price, comment, file);

        return res.status(200).json({ message: "Sikeresen létrejött a termék!", createdProduct })
    }catch(error){
        console.error("Nem sikerült létre hozni a terméket!", error);
        throw error;
    } 
}

async function adminProductsModifyRoute(req, res) {
    const { name, price, comment, id } = req.body;
    const file = req.file;
    
    if(!id){
        return res.status(400).json({ message: "A termék nem található!" })
    }

    const productId = parseInt(id);
    const termek = await getProductById(productId);

    if(!termek){
        return res.status(404).json({ message: "A termék nem található az adatbázisban!" })
    }

    const termekNev = (name && name.trim() !== "") ? name : termek.termekNev;
    
    const megjegyzes = (comment !== undefined && comment !== null && comment.trim() !== "") ? comment : termek.megjegyzes;
    
    const termekAr = (price !== undefined && price !== "" && !isNaN(parseInt(price))) ? parseInt(price) : termek.ar;

    const kategoria = termek.kategoria;

    try{
        const updateProduct = await modifyItem(
            productId,
            termekNev,
            kategoria,
            termekAr,
            megjegyzes,
            file
        );

        return res.status(200).json({ message: "Sikeresen módosítottuk a terméket!", updateProduct})
    }catch(error){
        console.error("Hiba történt a termék módosításakor:", error)
        return res.status(500).json({ message: "Hiba a termék módosításakor!" });
    }
}

async function adminProductDeleteRoute(req, res) {
    const { id } = req.body;

    if(!id){
        return res.status(400).json({ message: "Termék nem található meg!" });
    }

    try{
        const deleteProduct = await deleteItem(id);

        return res.status(200).json({ message: "Termék sikeresen törölve!", deleteProduct })
    }catch(error){
        console.error("Hiba a termék törlésekor!", error);
        throw error;
    }
}

async function adminGetProductsByCategoryRoute(req, res) {
    const { category } = req.body;
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

    if(!category){
        return res.status(400).json({ message: "Nincs kitöltve a mező!" });
    }

    try {
        const products = await searchCategory(category);

        const productsWithImages = products.map(product => ({
            ...product,
            kepNeve: product.kepNeve ? `${BASE_URL}/${product.kepNeve}` : null
        }));

        return res.status(200).json({ 
            message: "Termék sikeresen megtalálva kategória által!", 
            products: productsWithImages
        });

    } catch(error) {
        console.error("Szerver hiba:", error);
        return res.status(500).json({ error: "Szerver hiba, nem találhatók a termékek!" });
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
    getProductById,
    productsRoute,
    adminGetProductByNameRoute,
    adminProductsCreateRoute,
    adminProductsModifyRoute,
    adminProductDeleteRoute,
    adminGetProductsByCategoryRoute
};

