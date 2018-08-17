const express = require('express');
const fs = require('fs');
const historyApiFallback = require('connect-history-api-fallback');
const mongoose = require('mongoose');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
var cookieParser = require('cookie-parser');

var telegramBot = require('./telegramBot');
var neoBlockchain = require('./neoBlockchain');

var https = require('https');
var http = require('http');

const config = require('../config/config');
const webpackConfig = require('../webpack.config');

const isDev = process.env.NODE_ENV !== 'production';
const port  = process.env.PORT || 8080;

var session = require('express-session');
var passport = require('passport');
var flash    = require('connect-flash');

//var privateKey = fs.readFileSync('./server/Key').toString();
//var certificate = fs.readFileSync('./server/Cert').toString()

// Configuration
// ================================================================================================

require('../config/passport')(passport); // pass passport for configuration

// Set up Mongoose
mongoose.connect(isDev ? config.db_dev : config.db);
mongoose.Promise = global.Promise;

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  

  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser()); // read cookies (needed for auth)
//app.use(express.bodyParser()); // get information from html forms



// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// API routes
require('./routes')(app);
require('./routes/wallets')(app);
// Passport routes ======================================================================
require('./routes/passport.js')(app, passport); // load our routes and pass in our app and fully configured passport

if (isDev) {
  const compiler = webpack(webpackConfig);

  app.use(historyApiFallback({
    verbose: false
  }));

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: path.resolve(__dirname, '../client/public'),
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  }));

  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.resolve(__dirname, '../dist')));
} else {
  app.use(express.static(path.resolve(__dirname, '../dist')));
  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    res.end();
  });
}

telegramBot.start();
neoBlockchain.start(telegramBot);

var https = require('https');
var http = require('http');

var options = {
  key: fs.readFileSync('./server/Key'),
  cert: fs.readFileSync('./server/Cert')
};

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);

/*
app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }

  console.info('>>> 🌎 Open http://0.0.0.0:%s/ in your browser.', port);
});*/

module.exports = app;
