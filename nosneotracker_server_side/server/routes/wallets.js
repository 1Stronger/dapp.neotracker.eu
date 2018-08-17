const Wallet = require('../models/Wallet');

module.exports = (app) => {
  app.get('/api/wallets', (req, res, next) => {
	if (!req.isAuthenticated()) { res.json([]); return};
    Wallet.find({ user_id: req.user.userid })
      .exec()
      .then((wallet) => res.json(wallet))
      .catch((err) => next(err));
  });

   app.post('/api/wallets/create', (req, res, next) => {
	console.log("req.isAuthenticated():" + req.isAuthenticated());
	if (!req.isAuthenticated()) { res.send("Invalid User"); return};
	console.log(req.user);
    const wallet = new Wallet();
    wallet.address = req.body.address;
    wallet.label = req.body.label != null ? req.body.label : "";
    wallet.user_id = req.user.userid;// get it from logged in user//req.params.address;
	Wallet.findOne({ address: req.body.address })
      .exec()
      .then((foundwallet) => {
		  if (!foundwallet){
			  wallet.save()
			  .then(() => res.json(wallet))
			  .catch((err) => next(err));
		  }
		  else res.json({})
		}).catch((err) => next(err));
		
    
  });

  app.delete('/api/wallets/:address', function (req, res, next) {
	if (!req.isAuthenticated()) { res.send("Invalid User"); return};
    Wallet.findOneAndRemove({ address: req.params.address })
      .exec()
      .then((wallet) => res.json())
      .catch((err) => next(err));
  });

  app.put('/api/wallets/:address/:label/update', (req, res, next) => {
	if (!req.isAuthenticated()) { res.send("Invalid User"); return};
    Wallet.findOne({ address: req.params.address })
      .exec()
      .then((wallet) => {
        wallet.label = req.params.label;
        wallet.save()
          .then(() => res.json(wallet))
          .catch((err) => next(err));
      })
      .catch((err) => next(err));
  });
};
