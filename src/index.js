define([
	'./MongooseModel/Collection/Collection',
	'./MongooseModel/Model/Model'
	], function (Collection, Model) {
		'use strict';
	return {
		Model:Model,
		Collection:Collection
	};
});