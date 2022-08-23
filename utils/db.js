const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'edubar',
    password: 'Maxximus2013'
});

module.exports = db.promise();