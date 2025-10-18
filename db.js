const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // your MySQL password
    database: 'barbershopdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function findUserByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
}

async function findUserById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] || null;
}

async function createUser(nev, email, passwordHash) {
    const [result] = await pool.query(
        'INSERT INTO users (nev, email, jelszo) VALUES (?, ?, ?)',
        [nev, email, passwordHash]
    );
    return result.insertId;
}

module.exports = { findUserByEmail, findUserById, createUser };
