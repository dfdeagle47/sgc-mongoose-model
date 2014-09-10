define([
	'saga/validation/ValidateFormat',
	'saga/model/MongooseModel/Collection/Collection',
	'saga/types/validateType',
	'saga/ajax/SGAjax',
	'saga/model/ModelError'
], function (
	ValidateFormat,
	SagaCollection,
	is,
	SGAjax,
	ModelError
) {
	'use strict';

	return function (/*SagaModel*/) {

		return {

			generateError: function (verbose, id) {
				return new ModelError({
					verbose: verbose,
					identifier: id,
					model: this
				});
			},

			validate: function (attrs, options) {
				options = _.defaults(options || {}, {
					attrsToValidate: null
				});

				attrs = attrs || this.mongooseSchema.getAttributes();

				if (options.attrsToValidate) {
					attrs = options.attrsToValidate;
				}

				var attributes = _.keys(attrs);
				var error;
				for (var i = 0; i < attributes.length; i++) {
					error = this.checkAttrIsValid(attributes[i], attrs, options);
					if (error) {
						return error;
					}
				}

				return;
			},

			checkAttrIsValid: function (val, attrs, options) {
				val = this.get(val, {
					lazyCreation: false
				});
				if (val && val.validate) {
					return val.validate(attrs, options);
				}

				return;
			}
		};
	};
});