var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var responseTime = require('response-time');
let api = require('./routes/restapi');
let session = require('express-session');
let RedisStore = require('connect-redis')(session);

var index = require('./routes/index');
var user = require('./routes/user');

var app = express();

// set up the response-time middleware
app.use(responseTime());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.jpg')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("our private key 12345"));
app.use(session({
    rolling: true,
    cookie: { maxAge: 3600000 }, // hour
    resave: false,
    saveUninitialized: false,
    secret: "our private key 12345",
    store: new RedisStore({
        host: '127.0.0.1',
        port: 6379,
        prefix: 'session:',
        ttl: 3600 // remove session after 1h
    })
}));
app.use(express.static(path.join(__dirname, 'public')));

// check if user is logged in and visiting authenticated url's
app.use(function (req, res, next) {
    if (req.originalUrl.startsWith('/api')) {
        return next();
    }
    if (!req.session.user && req.originalUrl !== "/" && req.originalUrl !== "/login" && req.originalUrl !== "/register") {
        req.session.unauthorised = true;
        return res.redirect("login");
    }
    next();
});

app.use('/', index);
app.use('/user', user);
app.use('/api', api);

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

  console.error(err);

  // render the error page
  res.status(err.status || 500);
  if (req.session && req.session.user) return res.render('error', { user: req.session.user });
  return res.render('error');
});

module.exports = app;
