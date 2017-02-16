var bcrypt = require('bcryptjs');
var express = require('express');
var user = require('../models/modelSetup')
var router = express.Router();


/**
 * Render the registration page.
 */
router.get('/register', function(req, res) {
  res.redirect('/users/register');
});

router.get('/login', function(req, res) {
  res.redirect('/users/login');
});
////        //res.render('login.jade', { error: "Incorrect email / password.", csrfToken: req.csrfToken() });
////        res.redirect('/login');
////      }
////    }
////  });
////});
////
/////**
//// * Log a user out of their account, then redirect them to the home page.
//// */
////router.get('/logout', function(req, res) {
////  if (req.session) {
////    req.session.reset();
////  }
////  res.redirect('/');
////});
////
////router.get('/chat', function(req, res) {
////  if (req.session) {
////    res.render('chat', { title: 'This is a test chat page.' });
////  }
////})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;