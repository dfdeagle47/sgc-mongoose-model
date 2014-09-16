define([], function () {
	'use strict';

	return function(SagaModel){
		return {
			set: function(attr, raw, options){
				options = _.defaults(options||{}, {
					force:false
				});

				if (_.isObject(attr)) {
					for(var attrKey in attr){
						this.set(attrKey, attr[attrKey], options);
					}
					return this;
				}

				if (this._hasSchemaAttribute(attr) && !options.force) {
					var clonedOptions = _.clone(options);
					return this.setSchemaAttribute(attr, raw, clonedOptions);
				}

				return SagaModel.prototype.set.apply(this, arguments);
			},

			setSchemaAttribute: function(attr, raw, options){
				var descriptor = this._getSchemaDescription(attr);
				if (!descriptor) {
					return;
				}

				switch(descriptor.type){
					case 'PRIMITIVE':
						return this.setPrimitiveAttribute(attr, raw, options);
					case 'MODEL':
						return this.setModelAttribute(attr, raw, options);
					case 'COLLECTION':
						return this.setCollectionAttribute(attr, raw, options);
					default:
						return;
				}
			}, 

			setPrimitiveAttribute: function(attr, raw){
				return this.set(attr, raw, {force:true});
			},

			setModelAttribute: function(attr, raw, options){
				if (raw instanceof SagaModel) {
					if (this.get(attr, {lazyCreation:false})) {
						//Memory management (submodel._parent)
						this.get(attr).clear();
					}
					return this.set(attr, raw, {force:true});
				}

				if (_.isString(raw)) {
					var identifier = raw;
					raw = {};
					raw[this._getSchemaDescription(attr).generetor.prototype.idAttribute] = identifier;
				}

				var res = this.get(attr).set(raw);
				this.trigger('change:'+attr, this, raw, options);
				return res;
			},

			setCollectionAttribute: function(attr, raw, options){

				if (raw instanceof Backbone.Collection) {
					if (this.get(attr, {lazyCreation:false})) {
						this.get(attr).clear();
					}
					this.set(attr, raw, {force:true});
					return;
				}

				if (!_.isArray(raw)) {
					throw new Error('Strange raw data for collection expect an array');
				}

				var res = this.get(attr).set(raw);
				this.trigger('change:'+attr, this, raw, options);
				return res;
			}

		};
	};
});