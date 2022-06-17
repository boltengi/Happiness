var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
//추가-------------------------------------------------------------------
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
var moment = require('moment');
var offset = moment().utcOffset();
var cors = require('cors');
var jwt = require('jsonwebtoken');
const fs = require('fs')
const envfile = require('envfile');
//-------------------------------------------------------------------

const env = process.env.NODE_ENV || 'development';
require('dotenv').config();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// // express ejs layout setting
// app.set("layout", "include/layout");
// app.set("layout extractScripts", true);
// app.use(expressLayouts);

//session
app.use(session({
  key: 'sid',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//다국어 모듈
app.use(cors());

app.use('/', require('./routes/index'));
//app.use('/admin/sensor', require('./routes/admin/sensor'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

console.log('\nServer Start : 3000\n');
module.exports = app;
