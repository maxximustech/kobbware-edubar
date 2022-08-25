const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'edubar',
    password: 'Maxximus2013'
});
// URI - dialet://user:pass@example.com:5432/dbname
module.exports = db.promise();