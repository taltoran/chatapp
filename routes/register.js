var express = require('express');
var router = express.Router();

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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register.jade', { title: 'Registration Page.' });
});


module.exports = router;