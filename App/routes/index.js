var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  sess = req.session;
  sess.error = null;
  console.log(sess.user);
  res.render('index', { title: 'Express', data: sess.user });
});

module.exports = router;
