//HOLD UNTIL FRONT MAKES THEIR PART

const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware")
const { getUnavaliableFoglalasok, } = require("../controllers/foglalasController");
const foglalasok = require("../models/foglalasModel");

const route = express.Router();

route.post("/foglalasLetrehozas", async (req, res) =>{

});

route.put("/foglalasValtoztatas/:id", async (req, res) =>{

});

route.delete("/foglalasTorles/:id", async (req, res) =>{

});