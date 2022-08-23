const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const db = require('./utils/db');

const app = express();

const User = require('./models/user');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');


app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json())

app.use(express.static('public'));

app.use(authRoutes);
app.use(userRoutes);

app.get('/', (req,res)=>{
    User.fetchAll().then(result=>{
        res.render('index',{
            title: 'Welcome to Edubar',
            message: 'Hello World',
            users: result
        });
    }).catch(err=>{
        console.log(err);
    });
});

const server = http.createServer(app);
server.listen(3000);