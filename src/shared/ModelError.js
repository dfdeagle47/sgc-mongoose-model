define([], function () {
	'use strict';
	
	var ModelError = function (options) {
		options = _.defaults(options || {}, {
			verbose: 'Unknow',
			identifier: 0,
			model: null
		});

		this.verbose = options.verbose;
		this.identifier = options.identifier;
		this.model = options.model;
	};

	_.extend(ModelError.prototype, {
		clear: function(){
			this.model= null;
			this.identifier = null;
			this.verbose = null;
		}
	});
	
	return ModelError;
});