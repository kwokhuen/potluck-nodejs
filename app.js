var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var usersController = require('./controllers/users');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('./models/user');
var sessionsController = require('./controllers/sessions');
var flash = require('connect-flash');

// setup database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/potluck');

// initial setup
var port = process.env.PORT || 3000;
app.set('view engine', 'ejs');

// middleware
app.use(flash());
app.use(require('express-session')({
  secret: "diu nei lou mou",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) {
  res.locals.currentUser = req.user;
  next();
})

// routes
app.get('/', function(req,res) {
  res.render('index', {currentUser: req.user});
  console.log(req.user);
})
usersController(app);
sessionsController(app);

// start server
app.listen(port);
