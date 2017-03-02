var bcrypt = require('bcryptjs');
var express = require('express');
var user = require('../models/modelSetup');
var auth = require('../auth');
var router = express.Router();


router.get('/logout', function(req, res) {
  res.redirect('/users/logout');
});

router.get('/login', function(req, res) {
  res.redirect('/users/login');
});

router.get('/register', function(req, res) {
  res.redirect('/users/register');
});

router.get('/', function(req, res, next) {
  var params = { title: 'Express' };
  auth.getLoginType(req, params);
  res.render('index', params);
});

module.exports = router;