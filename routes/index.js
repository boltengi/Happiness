var express = require('express');
var router = express.Router();
var session = require('express-session');
var xutil = require('../xutil/xutil');
require('dotenv').config();

router.get('/', async function(req, res, next) {
  // var session = req.session;
  // var seeionCheck = await xutil.sessionCheck(session, res);
  // if(seeionCheck == null){
  //   return 0;
  // }

  // res.redirect('./routes/index');

    res.render('index', {
      title: "MY HOMEPAGE",
      length: 5
  })
});

module.exports = router;
