const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for User
let User = new Schema({
  id: {
    type: Number
  },
  name: {
    type: String
  },
  cpf: {
    type: String
  },
  phone: {
    type: String
  },
  limit: {
    type: Number,
    default: 500
  }
},{
    collection: 'user'
});

module.exports = mongoose.model('User', User);
