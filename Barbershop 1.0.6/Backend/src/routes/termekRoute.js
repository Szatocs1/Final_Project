const app = require("express");
const { searchName } = require("../controllers/termekController");

app.get("/productSearch:name", (req, res) => {
    const { name } = req.body || {};
    
    return searchName(name);
});

app.get("/productSearch:price", (req, res) => {

});

app.get("/productSearch:category", (req, res) => {

});

app.post("/productCreate", (req, res) => {

});

app.put("/productModify", (req, res) => {

});

app.delete("/productDelete", (req, res) => {

});