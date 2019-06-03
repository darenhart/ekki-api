// user.route.js

const express = require('express');
const moment = require('moment');
const transactionRoutes = express.Router();

// Require User model in our routes module
let Transaction = require('./transaction.model');
let User = require('./user.model');

// TODO: move this validation to a middleware "pre" in mongo Schema 
// TODO: "Se for transferido em menos de 2 minutos, o mesmo valor, para o mesmo usuário, cancelar a transação anterior e manter a última."
// Check duplicate transaction in 2 minutes period
let checkDuplicated = (transaction) => {
  return new Promise((resolve, reject) => {
    let now = new Date();
    let twoMinutes = moment(now).subtract(2, "minutes").toDate();
    let findT = {
      "user.id": transaction.user.id,
      "user_favoured.id": transaction.user_favoured.id,
      amount: transaction.amount,
      timestamp: {
        $gte: twoMinutes
      },
    };

    Transaction.find(findT, (err, transactions) => {
      if (err || transactions.length) {
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
      if (!user) {
        reject('Usuário não encontrado');
      } else {
        Transaction.userBalance(transaction.user.id, (err, balance) => {
          if (balance - transaction.amount + user.limit > 0) {
            resolve(balance - transaction.amount);
          } else {
            reject("Saldo insuficiente. Limite: " + user.limit);
          }
        });
      }
    });
  });
}

// Defined store route
transactionRoutes.route('/').post((req, res) => {
  let transaction = new Transaction(req.body);
  
  // TODO: refactor this validation
  checkDuplicated(transaction)
    .then(() => {
    checkLimit(transaction)
      .then((balance) => {
        transaction.save()
          .then(transaction => {
            res.status(200).json({
              transaction: transaction,
              balance: balance
            });
          })
          .catch(err => {
            res.status(500).json("Não foi possível salvar: " + err);
          });
      }, (err) => {
        res.status(500).json(err);
      });
  }, () => {
    res.status(500).json("Transação duplicada. Aguarde 2 minutos");
  });
});

module.exports = transactionRoutes;
