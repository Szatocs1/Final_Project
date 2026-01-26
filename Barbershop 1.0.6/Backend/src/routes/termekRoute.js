const express = require("express");
const route = express.Router();
const { searchProducts, searchName, searchCategory, deleteItem, createItem, modifyItem } = require("../controllers/termekController");

route.get("/products", async (req, res) => {
    const { name, category } = req.query;

    const filters = {};
    if(name) filters.name = name;
    if(category) filters.category = category;

    try{
        const products = await searchProducts(filters);

        if (products.length === 0){
            return res.status(200).json({ message: "Nincs megszabott feltétel!", products: [] })
        }

        return res.status(200).json({ message: "Sikeresen lekért szűrt termékek!", products });
    }catch(error){
        console.error("Nem talált ilyen teméket vagy kategóriát!", error);
        throw error;
    }
});

route.post("/productsCreate", async (req, res) => {
    const { name, category, price, comment } = req.body || {};
    const { filename } = req.file || {};

    if (!name || !filename || !category || !price || !comment){
        res.status(401).json({ message: "Hiányzik valamelyik mező!" });
    }

    try{
        const createdProduct = await createItem(name, category, price, comment, filename);

        return res.status(200).json({ message: "Sikeresen létrejött a termék!", createdProduct })
    }catch(error){
        console.error("Nem sikerült létre hozni a terméket!", error);
        throw error;
    } 
});

route.put("/productsModify/:id", async (req, res) => {
    const { id } = req.params || {};
    const { name, category, price, comment } = req.body || {};
    const { filename } = req.file || {};
    
    if(!id){
        return res.status(400).json({ message: "A termék nem található!" })
    }

    try{
        const updateProduct = await modifyItem(id ,name, category, price, comment, filename);

        return res.status(200).json({ message: "Sikeresen módosítottuk a terméket!", updateProduct})
    }catch(error){
        console.error("Hiba történt a termék módosításakor!")
        throw error;
    }
});

route.delete("/productsDelete/:id", async (req, res) => {
    const { id } = req.params || {};

    if(!id){
        return res.status(400).json({ message: "Termék nem található meg!" });
    }

    try{
        const deleteProduct = await  deleteItem(id);

        return res.status(200).json({ message: "Termék sikeresen törölve!", deleteProduct })
    }catch(error){
        console.error("Hiba a termék törlésekor!", error);
        throw error;
    }
});