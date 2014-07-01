var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function(){
    this.on('saving', function(model, attrs, options){
      var pass = model.get('hash');
      var salt = bcrypt.genSaltSync(8);
      var hashified = bcrypt.hashSync(pass, salt);
      this.set({hash: hashified});
    });
  }
});

module.exports = User;
