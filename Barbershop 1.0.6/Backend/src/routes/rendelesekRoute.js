
const express = require("express");
const route = express.Router();
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const rendelesekController = require("../controllers/rendelesekController");

route.post("/rendelesCreate", authMiddleware, rendelesekController.rendelesCreateRoute)

route.delete("/rendelesDelete", rendelesekController.rendelesDeleteRoute)

route.post("/getRendelesById", rendelesekController.getRendelesByIdRoute)

/*
admin
*/

route.post('/admin/modifyRendeles', authMiddleware, isAdmin, rendelesekController.adminModifyRendelesRoute)

route.delete('/admin/deleteRendeles', authMiddleware, isAdmin, rendelesekController.adminDeleteRendelesRoute)

route.post('/admin/getRendelesByName', authMiddleware, isAdmin, rendelesekController.adminGetRendelesByNameRoute)

route.post('/admin/getRendelesByEmail', authMiddleware, isAdmin, rendelesekController.adminGetRendelesByEmailRoute)

module.exports = route;

