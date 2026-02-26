const express = require("express");
const route = express.Router();
const { upload } = require('../middlewares/uploads');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { searchProduct, searchName, searchCategory, deleteItem, createItem, modifyItem, getEveryItem } = require("../controllers/termekController");

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

route.post("/admin/productsCreate", upload.single('file'), async (req, res) => {
    const { name, category, price, comment } = req.body;
    const file = req.file

    console.log(file);
    console.log(name);
    console.log(price);
    console.log(comment);
    console.log(category);

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

route.put("/admin/productsModify/:id", authMiddleware, isAdmin, async (req, res) => {
    const { id } = req.params || {};
    const { name, category, price, comment } = req.body || {};
    const { file } = req.file || {};
    
    if(!id){
        return res.status(400).json({ message: "A termék nem található!" })
    }

    try{
        const updateProduct = await modifyItem(id ,name, category, price, comment, file);

        return res.status(200).json({ message: "Sikeresen módosítottuk a terméket!", updateProduct})
    }catch(error){
        console.error("Hiba történt a termék módosításakor!")
        throw error;
    }
});

route.delete("/admin/productsDelete/:id", authMiddleware, isAdmin, async (req, res) => {
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

route.get("/admin/getItemByCategory", authMiddleware, isAdmin, async (req, res) =>{
    const category = req.body;

    if(!category){
      return res.status(400).json({ message: "Nincs kitötlve a mező!" })
    }

    try {
      const items = await searchCategory(category);

      return res.status(200).json({ message: "Termék sikeresen megtalálva kategória által!", items })
    }catch(error){
      res.status(500).json({ error: "Szerver hiba, nem találhatók a termékek!", error })
    }
});

route.get("/admin/getEveryItem", authMiddleware, isAdmin, async (req, res) => {
    try{
      const items = await getEveryItem();
 
    if(!items){
      return res.status(400).json({ message: "Nincs kitötlve a mező!" })
    }

      return res.status(200).json({ message: "Termékek sikeres lekérése!", items });
    }catch(error){
      return res.status(500).json({ error: "Szerver hiba, termékek nem találhatóak!", error });
    }
});

route.get("/admin/getItemByName", authMiddleware, isAdmin, async (req, res) =>{
    const name = req.body;

    if(!name){
      return res.status(400).json({ message: "Nincs kitötlve a mező!" })
    }

    try{
      const item = await searchName(name);

      return res.status(200).json({ message: "Termék sikeresen lekérve!", item });
    }catch(error){
      return res.status(500).json({ error: "Szerver hiba, termék nem található!", error });
    }
});


module.exports = route;