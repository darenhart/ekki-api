// user.route.js

const express = require('express');
const moment = require('moment');
const transactionRoutes = express.Router();

// Require User model in our routes module
let Transaction = require('./transaction.model');
let User = require('./user.model');

// TODO: add this validation to a middleware "pre" in mongo Schema 
// Check duplicate transaction in 2 minutes period
let checkDuplicated = (transaction) => {
  return new Promise((resolve, reject) => {
    let now = new Date();
    let twoMinutes = moment(now).subtract(2, "minutes").toDate();
    let findT = {
      user: transaction.user,
      user_favoured: transaction.user_favoured,
      amount: transaction.amount,
      timestamp: {
        $gte: twoMinutes
      },
    };

    Transaction.find(findT, (err, transactions) => {
      if (err) {
        console.log(err);
        reject();
      } else if (transactions.length) {
        reject();
      } else {
        resolve();
      }
    });
  });
};

let checkLimit = (transaction) => {
  return new Promise((resolve, reject) => {
    User.findById(transaction.user, (err, user) => {
      Transaction.userBalance(transaction.user, (err, balance) => {
        if (balance - transaction.amount + user.limit > 0) {
          resolve();
        } else {
          reject(user.limit);
        }
      });
    });
  });
}

// Defined store route
transactionRoutes.route('/').post((req, res) => {
  let transaction = new Transaction(req.body);
  
  checkDuplicated(transaction)
    .then(() => {
    checkLimit(transaction)
      .then(() => {
        transaction.save()
          .then(transaction => {
            res.status(200).json(transaction);
          })
          .catch(err => {
            res.status(400).send("unable to save to database");
          });
      }, (limit) => {
        res.status(400).send("Not enought credit. Limit: " + limit);
      });
  }, () => {
    res.status(400).send("transaction duplicated. Wait 2 min");
  });
});

// Defined get data(index or listing) route
transactionRoutes.route('/').get((req, res) => {
  Transaction.find((err, transactions) => {
    if(err){
      console.log(err);
    } else {
      res.json(transactions);
    }
  });
});

module.exports = transactionRoutes;
