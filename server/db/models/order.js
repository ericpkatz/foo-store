'use strict';
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('order', {
    status: {
        type: Sequelize.STRING
    }
}, {
    instanceMethods: {
    },
    classMethods: {
      getCart: function(user){
        var that = this;
        return this.findOne({ where: { status: 'CART', userId: user.id } })
          .then(function(cart){
            if(cart){
              return cart;
            }
            return that.create({ status: 'CART', userId: user.id });
          });
      }
    },
    hooks: {
    }
});
