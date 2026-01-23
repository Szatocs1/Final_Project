require('dotenv').config();
const jwt = require('jsonwebtoken');

function createAccesToken(user){
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.foglaltsag },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES || '2h' }
      );
    return token;
}

module.exports = {
    createAccesToken
}
