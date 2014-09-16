define([
	'sgc-mongoose-model',
	'chai',
	'../test/collection/collection_test',
	'../test/model/model_test',
	'../test/shared/shared_test',
	'sinon',
	'mocha'

], function (SGCMongooseModel, chai, collection, model, sharedTest) {
	'use strict';

	// var expect = chai.expect;
	var mocha = window.mocha;

	mocha.setup('bdd');
	
	model();
	sharedTest();
	collection();
	

	if (window.mochaPhantomJS) {
		window.mochaPhantomJS.run();
	}
	else {
		mocha.run();
	}
});
