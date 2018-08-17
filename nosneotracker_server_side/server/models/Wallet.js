const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  address: {
    type: String,
    default: ""
  },
  user_id: {
    type: String,
    default: ""  
  },
  label: {
    type: String,
    default: ""  
  }
});

module.exports = mongoose.model('Wallet', WalletSchema);
