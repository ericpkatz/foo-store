'use strict';
var router = require('express').Router(); // eslint-disable-line new-cap
module.exports = router;
var _ = require('lodash');
var Order = require('../../../db/models/order');

var ensureAuthenticated = function (req, res, next) {
    var err;
    if (req.isAuthenticated()) {
        next();
    } else {
        err = new Error('You must be logged in.');
        err.status = 401;
        next(err);
    }
};

router.post('/', ensureAuthenticated, function (req, res) {
  Order.findOne({ where: { status: 'CART', userId: req.user.id } })
    .then(function(cart){
      if(cart){
        return cart;
      }
      return Order.create({ status: 'CART', userId: req.user.id });
    })
    .then(function(cart){
      res.send(cart);
    });
});
