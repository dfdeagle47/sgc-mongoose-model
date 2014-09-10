define(function (require) {
	'use strict';

	var Collection = require('./Collection/Collection');
	var Model = require('./Model/Model');

	return {
		Collection: Collection,
		Model: Model
	};
});
