var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  _hostedPotlucks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Potluck'
  }]
});

userSchema.plugin(passportLocalMongoose);

var User = mongoose.model('User', userSchema);

module.exports = User;
