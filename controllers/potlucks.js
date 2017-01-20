var Potluck = require('../models/potluck');
var User = require('../models/user');
var isLoggedIn = require('../middlewires/isLoggedIn');
var bodyParser = require('body-parser');

module.exports = function(app) {

  app.get('/potlucks/new', isLoggedIn, function(req,res) {
    res.render('potlucks/new', {obj: req.flash()});
  });

  app.get('/potlucks/:id/edit', isLoggedIn, function(req,res) {
    User.findById(req.user._id).populate('_hostedPotlucks').exec(function(err, currentUser) {
      if (err) throw err;
      if (currentUser._hostedPotlucks.some(function(potluck) {
        return potluck._id.equals(req.params.id)
      })) return;
      else return res.redirect('/');
    })
    Potluck.findById(req.params.id, function(err, potluck) {
      if (err) {
        throw err;
      }
      res.render('potlucks/edit.ejs', {obj: req.flash(), potluck: potluck});
    });
  })

  app.put('/potlucks/:id', isLoggedIn, function(req,res) {
    req.check('name', 'Name cannot be empty.').notEmpty();
    req.check('location', 'Location cannot be empty.').notEmpty();
    req.check('date', 'Date is invalid.').isDate().isAfter();
    var errors = req.validationErrors();
    if (errors) {
      req.flash('errors', errors);
      return res.redirect(`/potlucks/${req.params.id}/edit`);
    }
    Potluck.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      location: req.body.location,
      date: req.body.date
    }, function(err, potluck) {
      if (err) {
        throw err;
      }
      return res.redirect(`/potlucks/${potluck._id}`);
    })
  })

  app.get('/potlucks/:id', isLoggedIn, function(req,res) {
    Potluck.findById(req.params.id).populate('_host').exec(function(err,potluck) {
      if (err) {
        req.flash('msg', 'The event you are looking for does not exist.');
        return res.redirect(`/potlucks/${req.params.id}`);
      }
      var parseDate = potluck.date.toString().split(' ');
      var date = `${parseDate[1]} ${parseDate[2]}, ${parseDate[3]}`;
      var time = parseDate[4].slice(0,5);
      var data = {
        error: req.flash(),
        potluck: potluck,
        date: date,
        time: time,
        currentUser: req.user
      };
      res.render('potlucks/show', data);
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
      date: new Date(req.body.date),
      _host: req.user._id
    });

    potluck.save(function(err, potluck) {
      if (err) {
        return res.redirect('/potlucks/new');
      };
      req.user._hostedPotlucks.push(potluck._id);
      req.user.save(function(err,user) {
        if (err) {
          throw err;
        }
      })
      res.redirect('/');
    });
  });

  app.delete('/potlucks/:id', isLoggedIn, function(req,res) {
    // User.findById(req.user._id).populate('_hostedPotlucks').exec(function(err, currentUser) {
    //   if (err) throw err;
    //   if (currentUser._hostedPotlucks.some(function(potluck) {
    //     return potluck._id.equals(req.params.id)
    //   })) return;
    //   else return res.redirect('/');
    // })
    Potluck.findByIdAndRemove(req.params.id, function(err) {
      if (err) {
        throw err;
      }
    })
    res.redirect('/');
  })
}
