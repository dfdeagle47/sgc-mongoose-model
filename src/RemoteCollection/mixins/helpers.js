define([], function () {
	'use strict';

	return function(Collection){
		return {

			__wrapIdInsideAttrs: function(id){
				var attrs = {};
				attrs[this.model.prototype.idAttribute] = id;
				return attrs;
			},

			set: function(models, options){

				if (_.isArray(models)) {
					for (var i = models.length - 1; i >= 0; i--) {
						if (_.isString(models[i])) {
							models[i] = this.__wrapIdInsideAttrs(models[i]);
						}
					}
				}

				if (_.isString(models)) {
					models = this.__wrapIdInsideAttrs(models);
				}


				return Collection.prototype.set.apply(this, [models, options]);
			}
			
		};
	};
});




