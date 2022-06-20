var express = require('express');
var router = express.Router();
var session = require('express-session');
var xutil = require('../xutil/xutil');
var log = require('../xutil/logger');
var poolConnection = require('../schema/postgresql/connection_pg');
var mybatisMapper = require('mybatis-mapper');
mybatisMapper.createMapper([ './schema/query/SQLmapper.xml' ]);

router.get('/', async function(req, res, next) {
    res.render('index', {
      title: "index",
      length: 5
  })
});

router.get('/db_search_list', async function(req, res, next) {
  var list = new Array();
  list.push({list_a:"abc1", list_b:"abc2", list_c:"abc3", list_d:"abc4", list_e:"abc5"})
  list.push({list_a:"def1", list_b:"def2", list_c:"def3", list_d:"def4", list_e:"def5"})
  list.push({list_a:"ghi1", list_b:"ghi2", list_c:"ghi3", list_d:"ghi4", list_e:"ghi5"})

  console.log(list) 

    res.render('db_search_list', {
      list: list
  })
});

router.post('/groupList', async function(req, res, next) {
  res.render('groupList', {
    title: "groupList",
    length: 5
})
});

router.post('/allocation', async function(req, res, next) {
    res.render('allocation', {
      title: "allocation",
      length: 5
  })
});

module.exports = router;
