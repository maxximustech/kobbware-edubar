const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sequelizeStore = require('connect-session-sequelize')(session.Store);
const fs = require('fs');

const db = require('./utils/db');
const User = require('./models/user');

const app = express();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const { userRoles } = require('./utils/constant');


app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.json())
app.use(cookieParser());

const myStore = new sequelizeStore({
    db: db
});

app.use(session({
    secret: 'Anthony',
    cookie: {
        maxAge: 48 * 3600 * 1000
    },
    store: myStore,
    resave: false,
    saveUninitialized: true
}));

app.use(express.static('public'));

app.use((req, res, next)=>{
    if(typeof req.session.username === 'undefined' ||  typeof req.session.password === 'undefined'){
        next();
        return;
    }
    User.findOne({
        where: {
            name: req.session.username,
            pass: req.session.password
        }
    }).then(user => {
        if(user == null){
            req.session.destroy();
            return;
        }
        req.session.user = user;
        next();
    });
});

app.use(authRoutes);
app.use(userRoutes);

app.get('/', (req,res)=>{
    if(typeof req.session.user === 'undefined'){
        res.redirect('/login');
        return;
    }
    return User.findAll()
        .then(result=>{
            res.render('index',{
                title: 'Welcome to Edubar',
                message: 'Hello World',
                users: result,
                isLoggedIn: true,
                user: req.session.user,
                userRole: userRoles.find(role => {
                    return req.session.user.user_role === role.name;
                })
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
    //console.log(response);
    myStore.sync();
    server.listen(3000);
}).catch(err => {
    console.log(err);
});
