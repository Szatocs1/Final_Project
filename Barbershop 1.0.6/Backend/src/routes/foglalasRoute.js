//HOLD UNTIL FRONT MAKES THEIR PART

const express = require("express");
const nodemailer = require("nodemailer");
const { authMiddleware } = require("../middlewares/authMiddleware")
const { getUnavaliableFoglalasok, } = require("../controllers/foglalasController");
const foglalasok = require("../models/foglalasModel");
const { sendEmail } = require("../../config/mail");

const route = express.Router();

route.post("/foglalasCreate", async (req, res) =>{
    const { nev, email, telefonszam, borbely, idopont, szolgaltatas } = req.body;

    if (!nev || !email || !telefonszam || !borbely || !idopont || !szolgaltatas){
        return res.status(400).json({ message: "Valamelyik mező nincs kitöltve vagy megadva!" })
    }

    try{
        const foglalas = await createFoglalas(nev, email, telefonszam, idopont, borbely, szolgaltatas);

        const userData = `${nev} <${email}>`
        const targy = "Sikeres foglalás!"
        const message = `Köszönjük foglalását! ${borbely} a választott borbély, ${idopont} a választott időpont!
        Ha módosítani vagy törölni szeretné foglalását, akkor kattintson {ide}!`

        const emailKuldes = await sendEmail({ userData, targy, message });

        return res.status(200).json({ message: "Sikeres foglalás és email küldés!", foglalas, emailKuldes })
    }catch(error){
        console.error("Nem sikerült létre hozni a foglalást, vagy az email nem került elküldésre!")
        return res.status(500).json({ message: "Nem sikerült a foglalás vagy az email küldés!", error })
    }
});

route.put("/foglalasModify/:id", async (req, res) =>{
    
});

route.delete("/foglalasDelete/:id", async (req, res) =>{

});

module.exports = route;