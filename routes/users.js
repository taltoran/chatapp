var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
var user = require('../models/modelSetup');
var token = require('token');

token.defaults.secret = 'SECRET_NSA_DATABASE';
// tokens are invalidated after this long
token.defaults.timeStep = 24 * 60 * 60; // 24h in seconds


router.get('/login', function(req, res, next) {
  if(req.session.authEmail && req.session.authToken) {
    if(token.verify(req.session.authEmail, req.session.authToken)) {
      console.log(req.session.authEmail);
      console.log('already logged in! redirecting to chat page...');
      return res.redirect('/chat');
    }
  }
  res.render('login');
});

router.post('/login', function(req, res) {
  user.findOne({ email: req.body.email }, 'firstName lastName userName email password data', function(err, user) {
    if (!user) {
      // this user doesn't exist!
      res.render('login', { error: "Incorrect email / password.", csrfToken: req.csrfToken() });
    }
    else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // our password is correct, obtain a token and redirect to the chat page
        req.session.authToken = token.generate(req.body.email);
        req.session.authEmail = req.body.email;
        req.session.authName = user.name;
        console.log(req.body.email);
        console.log(req.session.authToken);
        console.log(req.session.authName);
        res.redirect('/chat');
      }
      else {
        // incorrect password, try again
        //res.render('login.jade', { error: "Incorrect email / password.", csrfToken: req.csrfToken() });
        res.redirect('login');
      }
    }
  });
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registration Page.' });
});

// create a new user account.
router.post('/register', function(req, res) {
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
      res.render('register.jade', { error: error });
    } else {
      req.session.users = newUser;
      req.users = newUser;
      res.locals.user = newUser;
      //user.User.save(function (err) {if (err) console.log ('Error on save!')});
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