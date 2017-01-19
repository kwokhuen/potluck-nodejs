var mongoose = require('mongoose');
var potluckSchema = mongoose.Schema({
  name: String,
  location: String,
  date: Date,
  _host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

var Potluck = mongoose.model('Potluck', potluckSchema);

module.exports = Potluck;
