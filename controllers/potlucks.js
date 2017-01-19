var Potluck = require('../models/potluck');
var isLoggedIn = require('../middlewires/isLoggedIn');
var bodyParser = require('body-parser');

module.exports = function(app) {
  app.get('/potlucks/new', isLoggedIn, function(req,res) {
    res.render('potlucks/new', {obj: req.flash()});
  });

  app.get('/potlucks/:id', isLoggedIn, function(req,res) {
    Potluck.findById(req.params.id, function(err,potluck) {
      if (err) {
        req.flash('msg', 'The event you are looking for does not exist.');
        return res.redirect(`/potlucks/${req.params.id}`);
      }
      var parseDate = potluck.date.toString().split(' ');
      var date = `${parseDate[1]} ${parseDate[2]}, ${parseDate[3]}`;
      var time = parseDate[4].slice(0,5);
      res.render('potlucks/show', { error: req.flash(), potluck: potluck, host: req.user.username, date: date, time: time });
    })
  })

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
