const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userid: {
    type: String,
    default: ""
  },
  username: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    default: ""  
  }
});

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return password == this.password;
};
module.exports = mongoose.model('User', UserSchema);
