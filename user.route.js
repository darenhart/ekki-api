const express = require('express');
const userRoutes = express.Router();

let User = require('./user.model');
let Transaction = require('./transaction.model');

// Defined store route
userRoutes.route('/').post((req, res) => {
  let user = new User(req.body);
  user.save()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
userRoutes.route('/').get((req, res) => {
  User.find((err, users) => {
    if(err){
      console.log(err);
    }
    else {
      res.json(users);
    }
  });
});

// Defined find by id
userRoutes.route('/:id').get((req, res) => {
  let id = req.params.id;
  User.findById(id, (err, user) => {
    res.json(user);
  });
});

//  Defined update route
userRoutes.route('/:id').put((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (!user) {
      res.status(404).send("data is not found");
    } else {
      user.id = req.body.id;
      user.name = req.body.name;
      user.cpf = req.body.cpf;
      user.phone = req.body.phone;

      user.save().then(user => {
        res.json(user);
      })
      .catch(err => {
        res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
userRoutes.route('/delete/:id').get((req, res) => {
  User.findByIdAndRemove({_id: req.params.id}, (err, user) => {
    if(err) res.json(err);
    else res.json('Successfully removed');
  });
});

userRoutes.route('/:id/balance').get((req, res) => {
  Transaction.userBalance(req.params.id, (err, balance) => {
    if (err) {
      res.status(400).send("unable to find balance");
    } else {
      res.json(balance);
    }
  });
});

module.exports = userRoutes;
