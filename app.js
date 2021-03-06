var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var mongoose = require('mongoose');
var flash = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/users');
var chat = require('./routes/chat');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//mongodb database connection setup
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/chatroom');
require('./models/modelSetup')
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', console.log.bind(console, 'connected to database'));

// setting
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// middleware
app.use(bodyParser.urlencoded({ extended: true }));
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(session({
    name: 'session',
    keys: ['key1', 'key2' ],
    cookie: {
      secure: true,
      httpOnly: true,
      expires: expiryDate
    }
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', index);
app.use('/chat', chat);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;