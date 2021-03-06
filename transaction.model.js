const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// Define collection and schema for Transaction
let Transaction = new Schema({
  user: {
    id: {
      type: ObjectId,
      required: true
    },
    name: {
      type: String,
    }
  },
  user_favoured: {
    id: {
      type: ObjectId,
      required: [true, 'Campo Favorecido é obrigatório']
    },
    name: {
      type: String,
    }
  },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Valor mínimo é 1 real']
  },
  timestamp: {
    type : Date,
    default: Date.now
  }
},{
    collection: 'transaction'
});

let getFilterByUser = (userId) => {
  return {
    "$or": [{
      "user.id": userId
    }, {
      "user_favoured.id": userId
    }]
  };  
};

Transaction.statics.userBalance = function (userId, callback) {
  this.model('Transaction').find(getFilterByUser(userId), (err, transations) => {
    if (err) {
      callback(err);
    } else {
      let balance = 0;
      transations.map(t => {
        balance += t.amount * (t.user.id.equals(userId) ? -1 : 1);
      });
      callback(null, balance);
    }
  });
};

Transaction.statics.userTransactions = function (userId, callback) {
  this.model('Transaction').find(getFilterByUser(userId), (err, transations) => {
    if (err) {
      callback(err);
    } else {
      callback(null, transations);
    }
  });
};

module.exports = mongoose.model('Transaction', Transaction);
