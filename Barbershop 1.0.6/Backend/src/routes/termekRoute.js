
const express = require("express");
const route = express.Router();
const { upload } = require('../middlewares/uploads');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const termekController = require("../controllers/termekController");

route.get("/products", termekController.productsRoute)

/*
admin
*/

route.post("/admin/getProductByName", authMiddleware, isAdmin, termekController.adminGetProductByNameRoute)

route.post("/admin/productsCreate", upload.single('file'), termekController.adminProductsCreateRoute)

route.put("/admin/productsModify", upload.single('file'), authMiddleware, isAdmin, termekController.adminProductsModifyRoute)

route.post("/admin/productDelete", authMiddleware, isAdmin, termekController.adminProductDeleteRoute)

route.post("/admin/getProductsByCategory", authMiddleware, isAdmin, termekController.adminGetProductsByCategoryRoute)

module.exports = route;

