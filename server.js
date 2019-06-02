var express = require("express");
var bodyParser = require("body-parser");
//var mongodb = require("mongodb");
var express = require('express');

//var cors = require('cors');
var mongoose = require('mongoose');
var config = require('./DB.js');
var userRoute = require('./user.route');
var transactionRoute = require('./transaction.route');




var app = express();
//app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/user', userRoute);
app.use('/transaction', transactionRoute);



mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || config.DB, { useNewUrlParser: true })
  .then(() => {
    console.log('Database is connected')
  },
  err => {
    console.log('Can not connect to the database'+ err)
  }
);

var server = app.listen(process.env.PORT || 8080, () => {
  var port = server.address().port;
  console.log("App now running on port", port);
});
