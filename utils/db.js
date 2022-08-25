//const mysql = require('mysql2');
const { Sequelize } = require('sequelize');
const seq = new Sequelize('edubar','root','Maxximus2013', {
    host: 'localhost',
    dialect: 'mysql'
});
