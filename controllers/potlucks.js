var Potluck = require('../models/potluck');
var isLoggedIn = require('../middlewires/isLoggedIn');
var bodyParser = require('body-parser');

module.exports = function(app) {
  app.get('/potlucks/new', isLoggedIn, function(req,res) {
    res.render('potlucks/new', {obj: req.flash()});
  });
  app.post('/potlucks', isLoggedIn, function(req,res) {
    req.check('name', 'Name cannot be empty.').notEmpty();
    req.check('location', 'Location cannot be empty.').notEmpty();
    req.check('date', 'Date is invalid.').isDate().isAfter();

    var errors = req.validationErrors();
    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/potlucks/new');
    }

    var potluck = new Potluck({
      name: req.body.name,
      location: req.body.location,
      date: new Date(req.body.date)
    });

    potluck.save(function(err, potluck) {
      if (err) {
        return res.redirect('/potlucks/new');
      };
      res.redirect('/');
    });
  });
}
