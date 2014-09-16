define([], function () {
	'use strict';

	return function(/*SagaModel*/){
		return {

			validate: function(attrs, options){
				attrs = attrs||_.keys(this._getSchemaAttributes());

				//Check attr exist
				for (var i = attrs.length - 1; i >= 0; i--) {
					if (!(attrs[i] in this.attributes) && !(attrs[i] in this._getSchemaAttributes())) {
						throw new Error('unknow attributes to validate ('+attrs[i]+')');
					}
				}

				var validables = _.intersection(_.keys(this._getSchemaAttributes()), attrs);

				var error = null;
				for (i = validables.length - 1; i >= 0; i--) {
					var suboptions = _.clone(options);
					error = this.validateAttribute(validables[i], suboptions);
					if (error) {
						return error;
					}
				}
			},

			validateAttribute: function(attribute, options){
				options = _.defaults(options||{}, {
					lazyCreation:true
				});
				var descriptor = this._getSchemaDescription(attribute);
				if (descriptor.isValidable()) {
					options = _.clone(options);
					var attriVal = this.get(attribute, {lazyCreation:options.lazyCreation});

					var subOptions = _.clone(options);
					subOptions.lazyCreation = false;
					var error = (attriVal && (attriVal.validate(undefined, subOptions)));
					if (error) {
						return error;
					}
				}
			}
		};
	};
});