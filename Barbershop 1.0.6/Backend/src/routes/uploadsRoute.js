const express = require("express");
const route = express.Router();
const { sequelize } = require("../../config/db");
const Termek = require('../models/termekModel')(sequelize);

route.get('/termekek/:id', async (req, res) =>{
    const { id } = req.params;

    if(!id){
        return res.status(401).json({ message: 'Id nem található!' });
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