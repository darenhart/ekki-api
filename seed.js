var seeder = require('mongoose-seed');
var config = require('./DB.js');

// Connect to MongoDB via Mongoose
seeder.connect(config.DB, function() {
 
  // Load Mongoose models
  seeder.loadModels([
    './user.model.js',
    './transaction.model.js'
  ]);
 
  // Clear specified collections
  seeder.clearModels(['User', 'Transaction'], function() {
 
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });
 
  });
});
 
// Data array containing seed data - documents organized by Model
var data = [
  {
    'model': 'User',
    'documents': [
      {
        '_id': '5cf3e3ca3cedbf58e3627c96',
        'id': '1',
        'name':'João da Silva',
        'cpf': '51789378052',
        'phone': '36826323'
      },
      {
        '_id': '5cf1e2b5bfbb3d2778bc22e7',
        'id': '2',
        'name':'Ekki user',
        'cpf': '24991000017',
        'phone': '2328283'
      },
    ]
  },
  {
    'model': 'Transaction',
    'documents': [
      {
        "user": {
          "id": "5cf1e2b5bfbb3d2778bc22e7",
          "name": "Ekki user"
        },
        "user_favoured": {
          "id": "5cf3e3ca3cedbf58e3627c96",
          "name": "João da Silva"
        },
        "amount": 1000,
      },
    ]
  }
];