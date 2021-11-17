const express = require('express');
const mongoose = require('mongoose');
const bodyPaser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash'); 
const session = require('express-session');
const passport = require('./config/passport');
const app = express();

//DB
mongoose.connect("mongodb://localhost:27017/board");
const db = mongoose.connection;
db.once('open', function(){
    console.log('DB Connected');
});
db.on('error', function(err){
    console.log('DB ERROR : ', err);
});

//Othes settings(미들웨어)
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({extended:true}));
app.use(flash()); 
app.use(session({secret:'MySecret', resave:true, saveUninitialized:true})); 
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());

// Custom Middlewares 
app.use(function(req,res,next){
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.currentUser = req.user;
    next();
  });
//Routes
app.use('/', require('./routes/home'));
app.use('/posts', require('./routes/posts'));
app.use('/users', require('./routes/users'))
//Port
const port = 3000;
app.listen(port, function(){
    console.log('server on');
});
