const express = require('express');
const http = require('http');
const createError = require('http-errors');
const fs = require('fs');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

const authRoutes = require('./routes/auth');
//const userRoutes = require('./routes/user');

app.use(authRoutes);
//app.use(userRoutes);

app.use(function (err, req, res, next){
    res.status(err.statusCode);
    res.statusMessage = err.message;
    const errTitles = {
        '404': 'Page Not Found',
        '500': 'Internal Server Error',
        '401': 'Not Unathourized'
    }
    res.render('error',{
        title: errTitles[err.statusCode] || errTitles['500'] ,
        message: err.message
    });
})

const server = http.createServer(app);
server.listen(4000);