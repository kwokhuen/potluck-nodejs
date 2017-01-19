var mongoose = require('mongoose');
var potluckSchema = mongoose.Schema({
  name: String,
  location: String,
  date: Date
});

var Potluck = mongoose.model('Potluck', potluckSchema);

module.exports = Potluck;
