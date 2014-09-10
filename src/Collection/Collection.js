define([
	'./mixins/collectionPropertiesDefinitions',
	'./mixins/collectionValidation',
	'./mixins/collectionHelpers',
	'./mixins/collectionSync'
], function (
	collectionPropertiesDefinitions,
	collectionValidation,
	collectionHelpers,
	collectionSync
) {
	'use strict';

	var SagaCollection = require('sgc-model').Collection;

	var MongooseCollection = SagaCollection.extend({

		constructor: function (models, options) {

			if (models && !(models instanceof Array)) {
				options = models;
			}

			this._virtuals = {};
			this.defineSchemaProperties();
			SagaCollection.prototype.constructor.apply(this, arguments);
		},

		__isAVirtual: function(attribute){
			return !!this.mongooseSchemaForVirtual(attribute);
		},

		mongooseSchemaForVirtual: function(attribute){
			if (!this.mongooseSchema || !this.mongooseSchema.collection || !this.mongooseSchema.collection[attribute]) {
				return false;
			}
			return this.mongooseSchema.collection && this.mongooseSchema.collection[attribute];
		},

		getVirtualAttribute: function(virtualAttribute){

			var currentValue = this._virtuals[virtualAttribute];

			if (currentValue !== undefined) {
				return currentValue;
			}

			var subMongooseSchema = this.mongooseSchemaForVirtual(virtualAttribute);

			if (subMongooseSchema instanceof app.MongooseArraySchema) {
				var Collection = subMongooseSchema.getCollectionClass();
				currentValue = new Collection(null, {
					parent: {
						instance: this,
						path: ''
					},					
					url:this.url+'/'+virtualAttribute
				});
			}

			//other case...
			this.setVirtualAttribute(virtualAttribute, currentValue);

			return this._virtuals[virtualAttribute];
		},

		setVirtualAttribute: function(virtualAttribute, newValue){
			this._virtuals[virtualAttribute] = newValue;
		},



		get: function (id, options) {
			if (id instanceof this.model) {
				return SagaCollection.prototype.get.apply(this, arguments);
			}
			var url = this.url instanceof Function ? this.url() : this.url;

			if (this.__isAVirtual(id)) {
				return this.getVirtualAttribute(id, options);
			}

			if (id === 'new') {
				var doc = new this.model({}, {
					urlRoot: url,
					parent: {
						instance: this,
						path: ''
					}
				});

				if(options && options.add){
					this.add(doc);
				}

				return doc;
			}

			return SagaCollection.prototype.get.apply(this, arguments);
		},

		getBySlug: function (slug) {
			var doc = this.findWhere({
				slug: slug
			});
			var url = this.url instanceof Function ? this.url() : this.url;
			if (!doc) {
				this.add(
					new this.model({
						slug: slug
						}, {
					urlRoot: url,
					parent: {
						instance: this,
						path: ''
					}
				}));
				doc = this.last();
			}
			return doc;
		}
	});
	
	_.extend(MongooseCollection.prototype, collectionHelpers(MongooseCollection));
	_.extend(MongooseCollection.prototype, collectionPropertiesDefinitions(MongooseCollection));
	_.extend(MongooseCollection.prototype, collectionSync(MongooseCollection));
	_.extend(MongooseCollection.prototype, collectionValidation(MongooseCollection));
	

	return MongooseCollection;
});