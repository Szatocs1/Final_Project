const express = require("express");
const route = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { createRendeles, modifyRendeles, deleteRendeles } = require("../controllers/rendelesekController");

route.post("/rendeles/create", authMiddleware, async (req, res) =>{
    try {
        const { termekek } = req.body;

        if (!termekek || !Array.isArray(termekek) || termekek.length === 0) {
            return res.status(400).json({ message: "A kosár üres vagy hibás!" });
        }

        let userData = {};

        if (req.headers.authorization) {
            await authMiddleware(req, res, () => {});
            const user = req.user;

            if (!user) return res.status(401).json({ message: "Nem érvényes token!" });

            const { nev, email } = user;
            const { telefonszam, iranyitoszam, telepules, szallitasiCim, ar } = req.body;

            if (!telefonszam || !iranyitoszam || !telepules || !szallitasiCim) {
                return res.status(400).json({ message: "Kérlek töltsd ki a hiányzó adatokat!" });
            }

            userData = {vasarloNeve: nev, vasarloEmail: email, telefonszam, iranyitoszam, telepules, szallitasiCim, ar};
        } else {
            const { vasarloNeve, vasarloEmail, telefonszam, iranyitoszam, telepules, szallitasiCim, ar } = req.body;

            if (!vasarloNeve || !vasarloEmail || !telefonszam || !iranyitoszam || !telepules || !szallitasiCim) {
                return res.status(400).json({ message: "Kérlek tölts ki minden mezőt!" });
            }

            userData = { vasarloNeve, vasarloEmail, telefonszam, iranyitoszam, telepules, szallitasiCim };
        }

        const rendeles = await createRendeles({
            ...userData,
            termekek
        });

        return res.status(201).json({
            message: "Rendelés sikeresen létrehozva!",
            rendeles
        });

    } catch (error) {
        console.error("Hiba a rendelés létrehozásakor:", error);
        return res.status(500).json({ message: "Szerver hiba történt!" });
    }
});

route.put("/rendeles/modify/:id", async (req, res) =>{
    try {
        const { id } = req.params;

        const updates = req.body;

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Nincs módosítandó adat!" });
        }

        const updatedRendeles = await modifyRendeles(id, updates);

        return res.status(200).json({
            message: "Rendelés sikeresen módosítva!",
            updatedRendeles
        });
    } catch (error) {
        console.error("Hiba a rendelés módosításakor:", error);
        return res.status(500).json({ message: error.message || "Szerver hiba történt!" });
    }
});

route.delete("/rendeles/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if(!id){
            return res.status(400).json({ message: "A rendelés nem található!" })
        }

        const deletedRendeles = await deleteRendeles(id);

        return res.status(200).json({ message: "Rendelés sikeresen törölve!", deleteRendeles });
    }catch(error){
        console.error("Szerver hiba.");
        throw error;
    }
});