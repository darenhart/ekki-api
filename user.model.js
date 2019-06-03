const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let validateCPF = (cpf) => {
  var i = 0; // index de iteracao
  var somatoria = 0;
  var cpf = cpf.toString().split("");
  var dv11 = cpf[cpf.length - 2]; // mais significativo
  var dv12 = cpf[cpf.length - 1]; // menos significativo
  cpf.splice(cpf.length - 2, 2); // remove os digitos verificadores originais
  for(i = 0; i < cpf.length; i++) {
    somatoria += cpf[i] * (10 - i);
  }
  var dv21 = (somatoria % 11 < 2) ? 0 : (11 - (somatoria % 11));
  cpf.push(dv21);
  somatoria = 0;
  for(i = 0; i < cpf.length; i++) {
    somatoria += cpf[i] * (11 - i);
  }
  var dv22 = (somatoria % 11 < 2) ? 0 : (11 - (somatoria % 11));

  if (dv11 == dv21 && dv12 == dv22) {
    return true
  } else {
    return false
  }
};

// Define collection and schema for User
let User = new Schema({
  id: {
    type: Number,
    required: [true, 'Campo ID é obrigatório'],
    // TODO: make unique
    default: Math.floor(Math.random() * 100000) + 1
  },
  name: {
    type: String,
    required: [true, 'Campo Nome é obrigatório']
  },
  // TODO: add unique validation
  cpf: {
    type: String,
    required: [true, 'Campo CPF é obrigatório'],
    validate: {
      validator: validateCPF,
      message: 'CPF é inválido'
    }
  },
  phone: {
    type: String,
  },
  limit: {
    type: Number,
    default: 500
  },
  status: {
    type: String,
    default: 'active'
  }
},{
    collection: 'user'
});

module.exports = mongoose.model('User', User);
