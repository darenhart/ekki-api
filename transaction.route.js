// user.route.js

const express = require('express');
const moment = require('moment');
const transactionRoutes = express.Router();

// Require User model in our routes module
let Transaction = require('./transaction.model');
let User = require('./user.model');

// TODO: add this validation to a middleware "pre" in mongo Schema 
// TODO: Se for transferido em menos de 2 minutos, o mesmo valor, para o mesmo usuário, cancelar a transação anterior e manter a última.
// Check duplicate transaction in 2 minutes period
let checkDuplicated = (transaction) => {
  return new Promise((resolve, reject) => {
    let now = new Date();
    let twoMinutes = moment(now).subtract(2, "seconds").toDate();
    let findT = {
      "user.id": transaction.user,
      "user_favoured.id": transaction.user_favoured,
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
    User.findById(transaction.user.id, (err, user) => {
      Transaction.userBalance(transaction.user.id, (err, balance) => {
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
            res.status(400).send("Não foi possível salvar: " + err);
          });
      }, (limit) => {
        res.status(400).send("Saldo insuficiente. Limit: " + limit);
      });
  }, () => {
    res.status(400).send("Transação duplicada. Aguarde 2 minutos");
  });
});

module.exports = transactionRoutes;
