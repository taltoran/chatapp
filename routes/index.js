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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;