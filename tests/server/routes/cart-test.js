// Instantiate all models
var expect = require('chai').expect;

var Sequelize = require('sequelize');

var db = require('../../../server/db');

var supertest = require('supertest');

describe('Cart Route', function () {

    var app, User;

    beforeEach('Sync DB', function () {
        return db.sync({ force: true });
    });

    beforeEach('Create app', function () {
        app = require('../../../server/app')(db);
        User = db.model('user');
    });

	describe('Unauthenticated request', function () {

		var guestAgent;

		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		});

		it('should get a 401 response', function (done) {
			guestAgent.post('/api/orders')
        .send({ status: 'CART'})
				.expect(401)
				.end(done);
		});

	});

	describe('Authenticated request', function () {

		var loggedInAgent;

		var userInfo = {
			email: 'joe@gmail.com',
			password: 'shoopdawoop'
		};


    var user;

		beforeEach('Create a user', function () {
			return User.create(userInfo)
        .then(function(_user){
          user = _user;
        });
		});

		beforeEach('Create loggedIn user agent and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(userInfo).end(done);
		});
    var cart;

		it('should get with 200 response with the cart', function (done) {
			loggedInAgent.post('/api/orders')
        .expect(200).end(function (err, response) {
				if (err) return done(err);
        cart = response.body;
				expect(cart.id).to.be.ok;
				expect(cart.userId).to.equal(user.id);
        loggedInAgent.post('/api/orders')
          .expect(200).end(function (err, response) {
            expect(response.body.id).to.equal(cart.id);
            done();
          });
			});
		});

	});

});
