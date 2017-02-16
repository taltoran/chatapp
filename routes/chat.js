var express = require('express');
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
  res.render('chat', { title: 'This is a test chat page.' })
});



module.exports = router;