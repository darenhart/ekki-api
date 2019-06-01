const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// Define collection and schema for Transaction
let Transaction = new Schema({
  user: {
    type: ObjectId
  },
  user_favoured: {
    type: ObjectId
  },
  amount: {
    type: Number
  },
  timestamp: {
    type : Date,
    default: Date.now
  }
},{
    collection: 'transaction'
});

Transaction.statics.userBalance = function (userId, callback) {
  let transactionFind = {
    "$or": [{
      "user": userId
    }, {
      "user_favoured": userId
    }]
  };
  this.model('Transaction').find(transactionFind, (err, transations) => {
    if (err) {
      callback(err);
    } else {
      let balance = 0;
      transations.map(t => {
        balance += t.amount * (t.user.equals(userId) ? -1 : 1);
      });
      callback(null, balance);
    }
  });
};

  /*
Transaction.pre('save', true, function (next, done) {
  var err = 'salvou'
  next();
  
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
    let duplicated = false;
    if (err) {
      console.log(err);
    } else if (transactions.length) {
      duplicated = true;
      console.log(transactions);
    }

    callback(duplicated);
  });
});
  */

module.exports = mongoose.model('Transaction', Transaction);
