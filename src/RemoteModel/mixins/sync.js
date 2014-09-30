define([], function () {
	'use strict';

	return function(/*SagaModel*/){
		return {

			urlRoot: function(){
				if (this._customUrl) {
					return this._customUrl;
				}

				if (this._parent) {
					return  _.result(this._parent, 'url')+'/'+this._path||'';
				}

				if (this.collection) {
					return _.result(this.collection, 'url');
				}

				return '/api/'+this.constructor.getCollectionName();
			},


			toJSON: function(options){
				var options = _.defaults(options||{}, {
					attributesToKeep: _.keys(this.attributes),
				});

				if (_.isString(options.attributesToKeep)) {
					return this.toJSONAnAttribute(options.attributesToKeep);
				}

				var res = {};
				for (var i = 0; i < options.attributesToKeep.length; i++) {
					var val = this.toJSONAnAttribute(options.attributesToKeep[i]);
					if (val != undefined) {
						res[options.attributesToKeep[i]] = val;	
					}
				}

				return res;
			},

			toJSONAnAttribute: function(path, options){
				var descriptor = this._getSchemaDescription(path);
				if (!descriptor) {
					return this.get(path);
				}
				var currentValue = this.get(path, {lazyCreation:false});
				if (currentValue === undefined) {
					return;
				}

				if (descriptor.isModelDescriptor()) {
					return currentValue.toJSON({attributesToKeep:descriptor.jsonFormat});
				}
				if (descriptor.isCollectionDescriptor()) {
					return currentValue.toJSON({attributesToKeep:descriptor.jsonFormat});
				}
				if (descriptor.isPrimitiveDescriptor()) {
					return currentValue
				}
			}

		};
	};
});