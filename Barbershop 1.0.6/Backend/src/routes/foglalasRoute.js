
const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware")
const foglalasController = require("../controllers/foglalasController");

const route = express.Router();

route.get('/getEveryFoglalas', foglalasController.getEveryFoglalasRoute)

route.post("/foglalasCreate", authMiddleware, foglalasController.foglalasCreateRoute)

route.post("/getFoglalasById", foglalasController.getFoglalasByIdRoute)

route.put("/foglalasModify", foglalasController.foglalasModifyRoute)

route.delete("/foglalasDelete", foglalasController.foglalasDeleteRoute)

/*
admin
*/

route.put('/admin/modifyFoglalas', authMiddleware, isAdmin, foglalasController.adminModifyFoglalasRoute)

route.delete("/admin/foglalasDelete/", authMiddleware, isAdmin, foglalasController.adminFoglalasDeleteRoute)

route.post('/admin/getFoglalasByName', authMiddleware, isAdmin, foglalasController.adminGetFoglalasByNameRoute)

route.post('/admin/getFoglalasByEmail', authMiddleware, isAdmin, foglalasController.adminGetFoglalasByEmailRoute)

module.exports = route;

