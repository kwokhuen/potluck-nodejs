var passport = require('passport');

module.exports = function(app) {
  app.get('/login', function(req,res) {
    res.render('sessions/login', { error: req.flash('error')});
  })
  app.get('/logout', function(req,res) {
    req.logout();
    res.redirect('/');
  })
  app.post('/', passport.authenticate('local', {
    successFlash: 'Login in successful.',
    failureFlash: 'Invalid username or password.',
    successRedirect: '/',
    failureRedirect: '/login'
  }), function(req,res) {
  });
}
