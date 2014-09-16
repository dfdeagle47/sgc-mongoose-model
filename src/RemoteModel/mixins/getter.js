define([], function () {
	'use strict';

	return function(SagaModel){
		return {

			get: function(attr, options){
				options = _.defaults(options||{}, {
					lazyCreation: true
				});

				if (this._hasSchemaAttribute(attr)) {
					if (options.lazyCreation && !this.has(attr)) {
						var value = this.tryGenerateDefaultValue(this._getSchemaDescription(attr));
						this.set(attr, value, {force:true});
						return value;
					}
				}
				return SagaModel.prototype.get.apply(this, arguments);
			},

			has: function(attr){
				return !!this.get(attr, {lazyCreation:false});
			}
		};
	};
});