var express = require('express');
var token = require('token');
var auth = require('../auth');
var router = express.Router();

router.get(function(req, res, next) {
  if( ! req.mySessionKey.userId ){
    res.redirect('/users/login');
    //res.redirect('/login');
  } else {
    next();
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!token.verify(req.session.authEmail, req.session.authToken)) {
    console.log('not logged in, redirecting to login page');
    return res.redirect('login');
  }
  console.log('entering chat as user \"'+req.session.authName+'\"')
  var params = { title: 'This is a test chat page.', user: req.session.authName, email: req.session.authEmail};
  auth.getLoginType(req, params);
  res.render('chat', params);
});

module.exports = router;