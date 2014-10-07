define([	
], function (
) {
	'use strict';

	var Backbone = require('backbone');
	var DefaultBackboneSync = Backbone.sync;
	Backbone.sync = function (method, model, options) {
		options = _.defaults(options || {}, {
			contentType: 'application/json; charset=utf-8',
			auth: true
		});

		return DefaultBackboneSync.apply(this, [method, model, options]);
	};
	
});