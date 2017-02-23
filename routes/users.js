var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
var user = require('../models/modelSetup');
var token = require('token');
var auth = require('../auth');


router.get('/logout', function(req, res, next) {
  token.invalidate(req.session.authEmail, req.session.authToken);
  req.session.authToken = undefined;
  req.session.authEmail = undefined;
  req.session.authName = undefined;
  console.log('successfully logged out');
  return res.redirect('/');
});

router.get('/login', function(req, res, next) {
  if(req.session.authEmail && req.session.authToken) {
    if(token.verify(req.session.authEmail, req.session.authToken)) {
      console.log(req.session.authEmail);
      console.log('already logged in! redirecting to chat page...');
      return res.redirect('/chat');
    }
  }
  var params = {};
  auth.getLoginType(req, params);
  res.render('login', params);
});

router.post('/login', function(req, res, next) {
  //before accessing these check the type
  user.findOne({ email: req.body.email }, 'firstName lastName userName email password data', function(err, user, err) {
//  user.findOne({ email: req.body.email }, 'firstName lastName userName email password data', function(err, user) {
    if (!user) {
      // this user doesn't exist!
      var params = { error: "Incorrect email / password.", csrfToken: req.csrfToken() };
      auth.getLoginType(req, params);
      res.render('login', params);
    }
    else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // our password is correct, obtain a token and redirect to the chat page
        req.session.authToken = token.generate(req.body.email);
        req.session.authEmail = req.body.email;
        req.session.authName = user.userName;
        console.log(req.body.email);
        console.log(req.session.authToken);
        console.log(req.session.authName);
        res.redirect('/chat');
      }
      else {
        // incorrect password, try again
        //res.render('login.jade', { error: "Incorrect email / password.", csrfToken: req.csrfToken() });
        res.render('login.jade', { error: 'Invalid email or password.' });
      }
    }
  });
});

router.get('/register', function(req, res, next) {
  var params = { title: 'Registration Page.' };
  auth.getLoginType(req, params);
  res.render('register', params);
});

// create a new user account.
router.post('/register', function(req, res) {
  let verifyError = auth.verifyInfo(
    req.body.userName,
    req.body.email,
    req.body.password,
    req.body.password,
    req.body.firstName,
    req.body.lastName
  );
  var params = {
    title: 'Registration Page.',
    error: verifyError,
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };
  if(verifyError !== undefined) {
    auth.getLoginType(req, params);
    return res.render('register', params);
  }

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);

  var newUser = new user({
    userName:   req.body.userName,
    firstName:  req.body.firstName,
    lastName:   req.body.lastName,
    email:      req.body.email,
    password:   hash,
  }, console.log.bind(console, 'set up new user schema'));
  newUser.save(function(err) {
    if (err) {
      var error = 'Something bad happened! Please try again.';
      if (err.code === 11000) {
        error = 'That email is already taken, please try another.';
      }
      auth.getLoginType(req, params);
      res.render('register', params);
    }
    else {
      req.session.users = newUser;
      req.users = newUser;
      res.locals.user = newUser;
      console.log('user added');
      res.redirect('/login');
    }
  });
});

// GET users listing?
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;