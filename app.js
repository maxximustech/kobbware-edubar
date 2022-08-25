const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const db = require('./utils/db');
const User = require('./models/user');

const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');


app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json())

app.use(express.static('public'));

app.use(authRoutes);
app.use(userRoutes);

app.get('/', (req,res)=>{
    User.findAll()
        .then(result=>{
        res.render('index',{
            title: 'Welcome to Edubar',
            message: 'Hello World',
            users: result
        });
    }).catch(err=>{
        res.status(500).render('500',{
            title: 'Internal Server Error',
            message: err.message
        });
    });

});

const server = http.createServer(app);

db.sync().then(response => {
    console.log(response);
    server.listen(3000);
}).catch(err => {
    console.log(err);
});
