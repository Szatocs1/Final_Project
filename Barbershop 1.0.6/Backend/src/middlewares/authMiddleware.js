const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({ error: 'Nincs jelenleg token!' })
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer'){
        return res.status(401).json({ error: 'Nem megfelelő formátumú a token!' })
    }

    const token = parts[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next()
    }catch(err) {
        return res.status(401).json({ error: 'Érvénytelen token!' })
    }
}

const isAdmin = (req, res, next) =>{
    const authHeader = req.headers.authorization;

    if (!authHeader){
        return res.status(401).json({ error: "Nincs jelenleg token!"});
    }

    const parts = authHeader.split(' ');
    if(parts.length !== 2 || parts[0] !== 'Bearer'){
        return res.status(401).json({ error: "Nem megfelelő formátumú a token!"});
    }

    const token = parts[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.foglaltsag === "Admin"){
            req.user = decoded;
            next();
        }
    }catch(error){
        return res.status(401).json({error: "Érvénytelen token!"});
    }
}

module.exports = {
    authMiddleware,
    isAdmin
}