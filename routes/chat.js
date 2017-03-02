var express = require('express');
var token = require('token');
var auth = require('../auth');
var router = express.Router();

router.all(function(req, res, next) {
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
  var params = { title: '90s chatapp.', user: req.session.authName};
  auth.getLoginType(req, params);
  res.render('chat', params);
});

module.exports = router;