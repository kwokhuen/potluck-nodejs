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
var Potluck = require('./models/potluck');
var potlucksController = require('./controllers/potlucks');
var isLoggedIn = require('./middlewires/isLoggedIn');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var methodOverride = require('method-override')


// setup database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/potluck');

// initial setup
var port = process.env.PORT || 3000;
app.set('view engine', 'ejs');


// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // override html method e.g put delete request
app.use(expressValidator());
app.use(expressSession({
  secret: "diu nei lou mou",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next) {
  res.locals.currentUser = req.user;
  res.locals.message = req.flash('error');
  next();
})


// routes
app.get('/', function(req,res) {
  Potluck.find({}, function(err, potlucks) {
    res.render('index', {currentUser: req.user, potlucks: potlucks});
  })
})
usersController(app);
sessionsController(app);
potlucksController(app);

// start server
app.listen(port);
