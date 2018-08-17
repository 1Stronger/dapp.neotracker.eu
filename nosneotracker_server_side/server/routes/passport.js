module.exports = function(app, passport) {

app.post('/login', passport.authenticate('local-login', { failWithError: true }),     
    function (req, res) {
		res.send({"isauthenticated":req.isAuthenticated()});
    }, function(err, req, res, next) {
        if(req.autherror) {
			res.send({"isauthenticated":false});
        } else {
			res.send({"isauthenticated":req.isAuthenticated()});
        }
    }
);

  app.get('/isauthenticated', (req, res, next) => {
	res.send(req.isAuthenticated());
  });
  
  app.get('/logout', function (req, res){
	  req.session.destroy(function (err) {
		  console.log("logout");
		res.send('OK');
	  });
  });
};
