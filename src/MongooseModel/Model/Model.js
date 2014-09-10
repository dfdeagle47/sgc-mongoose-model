define([
	'saga/model/SagaModel/Model/Model',

	'saga/model/MongooseModel/Collection/Collection',

	'saga/types/validateType',
	'saga/ajax/SGAjax',

	
	'./mixins/modelSchemaAction',
	'./mixins/modelSchemaPropertiesDefinition',
	'./mixins/modelSchemaSetter',
	'./mixins/modelSchemaSync',
	'./mixins/modelSchemaValidation',
	'./mixins/modelSchemaGetter'

], function (
	Model,
	SagaCollection, 
	is, 
	SGAjax,

	modelSchemaAction,
	modelSchemaPropertiesDefinition, 
	modelSchemaSetter,
	modelSchemaSync,
	modelSchemaValidation,
	modelSchemaGetter
	) {

	'use strict';

	var MongooseModel = Model.extend({

		constructor: function(attributes, options){
			if(options){
				if('custom_url' in options){
					this.custom_url = options.custom_url;
				}
				if('url' in options){
					this.urlRoot = options.url;
				}
				if('urlRoot' in options){
					this.urlRoot = options.urlRoot;
				}
				if(options.parent){
					this.parent = options.parent;
				}
				this.isValidationRef = options.isValidationRef;
			}

			this._originalAttributes = {};
			this.defineSchemaProperties();

			var ret = Model.prototype.constructor.apply(this, arguments);
			this.postCreate && this.postCreate(options);

			this._recorded = {};
			this.set('record-change', false);

			// window.instances[this.cid] = this;

			return ret;
		}, 

		_isRecordingChanges:null,
		_recorded:null,

		idAttribute: '_id',

		parent: {
			instance: null,
			path: null
		},

		primitiveTypes: ['String', 'Number', 'Boolean', 'Date', 'ObjectId'],

		//model to be transformed in id in toJSON if _isId
		_isId: false,

		root: function(){
			var instance = this;
			var path = '';
			while(instance.parent.instance){
				var parent = instance.parent;
				instance = parent.instance;
				path += parent.path;
			}
			return {instance:instance, path:path};
		},


		revert: function(){
			for(var key in this._originalAttributes){
				this.set(key, this._originalAttributes[key]);
			}
		},


		//Deprecated
		treeVirtuals: function(){
			return this.schema.virtuals.clone().merge(this.schema.tree);
		},

		//TODO: improve function to avoid remove embedded models and collections, and clear them
		clear: function(options){
			options = _.defaults(options||{}, {
				recursive:true
			});

			//Clear collections
			var cols = this.getAllCollections({lazyCreation:false});
			for(var attr in cols){
				cols[attr].clear();
				// cols[attr].reset([], {clear:true});
			}

			//Clear embedded models
			var models = this.getAllModels({lazyCreation:false});
			for(attr in models){
				models[attr].clear(options);	
			}

			// this.mongooseSchema = null;
			this.parent = null;

			window.instances[this.cid] = 'cleared';

			return Model.prototype.clear.apply(this, arguments);
		},

		validForSave : function(){
			return null;
		},

		__tIsValid: function(__t){
			if(!App.__t_valids){
				return false;
			}
			else{
				return App.__t_valids.contains(__t);
			}
		},

		clone: function () {
			var clone = Model.prototype.clone.apply(this, arguments);
			for(var attr in clone.attributes) {
				if(clone.attributes[attr] instanceof MongooseModel) {
					clone.attributes[attr] = clone.attributes[attr].clone();
				}
				if(clone.attributes[attr] instanceof SagaCollection) {
					clone.attributes[attr] = clone.attributes[attr].clone({models:true});
				}
			}
			return clone;
		}
		
	});

	_.extend(MongooseModel.prototype, modelSchemaAction(MongooseModel));
	_.extend(MongooseModel.prototype, modelSchemaPropertiesDefinition(MongooseModel));
	_.extend(MongooseModel.prototype, modelSchemaSetter(MongooseModel));
	_.extend(MongooseModel.prototype, modelSchemaSync(MongooseModel));
	_.extend(MongooseModel.prototype, modelSchemaValidation(MongooseModel));
	_.extend(MongooseModel.prototype, modelSchemaGetter(MongooseModel));
	

	return MongooseModel;
});