define([], function () {
	'use strict';

	return function(Collection){
		return {


			get: function(idOrObj, options){
				options = _.defaults(options||{}, {
					getOrCreate:false
				});
				var obj = Collection.prototype.get.apply(this, arguments);
				if (!obj && options.getOrCreate) {
					this.add(idOrObj);
					return this.get(idOrObj);
				}
				return obj;
			},

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




