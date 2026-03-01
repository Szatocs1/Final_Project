const express = require("express");
const route = express.Router();
const { upload } = require('../middlewares/uploads');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { searchProduct, searchName, searchCategory, deleteItem, createItem, modifyItem, getEveryItem, getProductByName, getProductById } = require("../controllers/termekController");

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

route.get("/products", async (req, res) => {
    const { name, category } = req.query;

    const filters = {};
    if(name) filters.name = name;
    if(category) filters.category = category;

    try{
        const products = await searchProduct(filters);

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
});

/*
admin
*/

//pipa, kis debug
route.post("/admin/getProductByName", authMiddleware, isAdmin, async (req, res) => {
    const { name } = req.body;

    if(!name) return res.status(401).json({ message: "Nincs kitöltve mező!" });

    try {
        const product = await getProductByName(name);

        if (!product) {
            return res.status(404).json({ message: "Termék nem található!" });
        }

        const productWithFullImageUrl = {
            ...product,
            kepNeve: product.kepNeve ? `${BASE_URL}/${product.kepNeve}` : null
        }

        return res.status(200).json({ message: "Termék sikeres lekérve!", productWithFullImageUrl })
    }catch(error){
        console.error("Szerver hiba: ", error)
        throw error;
    }
});
//pipa
route.post("/admin/productsCreate", upload.single('file'), async (req, res) => {
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
});
//pipa
route.put("/admin/productsModify", upload.single('file'), authMiddleware, isAdmin, async (req, res) => {
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
});
//pipa
route.post("/admin/productDelete", authMiddleware, isAdmin, async (req, res) => {
    const { id } = req.body;

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
//pipa
route.post("/admin/getProductsByCategory", authMiddleware, isAdmin, async (req, res) => {
    const { category } = req.body;
    const BASE_URL = "http://localhost:3000";

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
});
//pipa
route.get("/admin/getProductByName", authMiddleware, isAdmin, async (req, res) =>{
    const name = req.body;

    if(!name){
      return res.status(400).json({ message: "Nincs kitötlve a mező!" })
    }

    try{
      const product = await searchName(name);
      
      if (!product) {
        return res.status(404).json({ message: "Termék nem található!" });
      }

      return res.status(200).json({ message: "Termék sikeresen lekérve!", product });
    }catch(error){
      return res.status(500).json({ error: "Szerver hiba, termék nem található!", error });
    }
});


module.exports = route;
