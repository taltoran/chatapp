var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
var user = require('../models/modelSetup')

/* GET users login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res) {
  user.findOne({ email: req.body.email }, 'firstName lastName email password data', function(err, user) {
    if (!user) {
      //res.render('login.jade', { error: "Incorrect email / password.", csrfToken: req.csrfToken() });
      res.redirect('register');
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        //utils.createUserSession(req, res, user);
        res.redirect('/chat');
      } else {
        //res.render('login.jade', { error: "Incorrect email / password.", csrfToken: req.csrfToken() });
        res.redirect('login');
      }
    }
  });
});

/* GET users register page. */
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Registration Page.' });
});

/**
 * Create a new user account.
 *
 * Once a user is logged in, they will be sent to the dashboard page.
 */
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
      res.redirect('/login');
    }
  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;