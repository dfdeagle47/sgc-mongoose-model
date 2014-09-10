define([
	'sgc-mongoose-model',
	'chai',
	'mocha'
], function (SGCMongooseModel, chai) {
	'use strict';

	var expect = chai.expect;
	var mocha = window.mocha;

	mocha.setup('bdd');

	var Collection = SGCMongooseModel.Collection;
	var Model = SGCMongooseModel.Model;

	describe('Testing the SGCMongooseModel module.', function () {

		it('Creating a Model instance', function () {
			var model = new Model();
			expect(model).to.be.an.instanceof(Model);
		});

		it('Creating a Collection instance', function () {
			var collection = new Collection();
			expect(collection).to.be.an.instanceof(Collection);
		});

	});

	if (window.mochaPhantomJS) {
		window.mochaPhantomJS.run();
	}
	else {
		mocha.run();
	}
});
