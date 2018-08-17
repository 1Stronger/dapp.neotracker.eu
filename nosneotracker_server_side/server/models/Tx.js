const mongoose = require('mongoose');

const TxSchema = new mongoose.Schema({
  wallet_address: {
    type: String,
    default: ""
  },
  tx_id: {
    type: String,
    default: ""  
  }
});

module.exports = mongoose.model('Tx', TxSchema);
