const express = require("express");
const route = express.Router();
const { sequelize } = require("../../config/db");
const Termek = require('../models/termekModel')(sequelize);

route.get('/termekek/:id', async (req, res) =>{
    const { id } = req.params;

    // Only accept numeric IDs to avoid matching file names like "Polo_Fekete_E.png"
    // This allows static file serving to work for image files
    if(!id || isNaN(id)){
        return res.status(400).json({ message: 'Érvénytelen termék ID!' });
    }

    try{
        const termek = await Termek.findByPk(id)

        return res.status(200).json({ termek });
    }catch(error){
        console.error('Képet nem találta: ', error);
        throw error;
    }
});

module.exports = route;
