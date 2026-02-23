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

    if(!process.env.JWT_SECRET){
        console.error('Nincs secret key a tokenhez');
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next()
    }catch(err) {
        return res.status(401).json({ error: 'Érvénytelen token!' })
    }
}

const isAdmin = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(401).json({ error: "Nincs token!" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded.role)

        if (decoded && decoded.role && String(decoded.role).toLowerCase() === 'admin') {
            req.user = decoded;
            next();
        } else {
            return res.status(403).json({ 
                error: "Forbidden: Nem vagy Admin!",
                debugRole: decoded.role
            });
        }
    } catch (err) {
        return res.status(401).json({ error: "Lejárt vagy hibás token!" });
    }
};

module.exports = {
    authMiddleware,
    isAdmin
}