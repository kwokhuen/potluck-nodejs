var User = require('../models/user');
var bodyParser = require('body-parser');
var passport = require('passport');

module.exports = function(app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.get('/users/new', function(req,res) {
    res.render('users/new');
  })

  app.post('/users', function(req,res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err,user) {
      if (err) {
        throw err;
        return res.render('users/new');
      }
      passport.authenticate("local")(req,res,function(){
        res.redirect('/');
      })
    })
  })
}

// Bcrypt way:
// var bcrypt = require('bcryptjs');
// bcrypt.hash(req.body.password, 8, function(err, hash) {
//   if (err) throw err;
//   var user = new User({
//     username: req.body.username,
//     email: req.body.email,
//     password: hash
//   });
//   user.save(function(err,user) {
//     if (err) throw err;
//     res.end(`${user}`);
//   })
// });
