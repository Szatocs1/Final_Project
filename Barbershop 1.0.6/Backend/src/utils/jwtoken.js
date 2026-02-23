require('dotenv').config();
const jwt = require('jsonwebtoken');

function createAccesToken(user){
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES || '45m' }
      );
      console.log(token);

    return token;
}

module.exports = {
    createAccesToken
}
