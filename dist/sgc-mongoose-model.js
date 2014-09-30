define('RemoteCollection/mixins/sync',[], function () {
	

	return function(SagaCollection){

		return {

			url: function(){
				if (this._customUrl) {
					return this._customUrl;
				}

				if (this._parent) {
					return  _.result(this._parent, 'url')+'/'+this._path||'';
				}

				return '/api/'+this.constructor.getCollectionName();
			},

			fetch: function(options){
				options = _.defaults(options||{}, {
					paginate:false,
					filters:true,
					sorts:true
				});

				if (options.filters && this.hasFilters()) {
					this.appendFiltersData(options);
				}

				if (options.sorts && this.hasSorts()) {
					this.appendSortsData(options);
				}

				if (options.paginate/* && !this.isMaxReached()*/) {
					this.appendPaginateData(options);
				}

				return SagaCollection.prototype.fetch.apply(this, [options]);
			}
			
		};
	};
});




		
define('RemoteCollection/mixins/pagination',[], function () {
	

	return function(){
		return {


			configurePagination: function(){
				this.resetPaginate();
			},

			setPerPage: function(newPerPage){
				this.getSGPaginate().perPage = newPerPage; 
			}, 

			getSGPaginate: function(){
				if (!this._paginate) {
					this.resetPaginate();
				}
				return this._paginate;
			},

			resetPaginate: function(){
				this._paginate =  {
					currentPage: 0,
					perPage: 0,
					maxPagesReached: false
				};
				this._firstPage = true;
			},	

			setMaxPagesReached: function(){
				this.getSGPaginate().maxPagesReached = true;
			},

			isMaxReached: function () {
				return this.getSGPaginate().maxPagesReached;
			},

			nextPage: function(options){
				options = _.extend(options||{}, {
					paginate:true
				});
				return this.fetch(options);
			},

			configureSorts: function(){
				this.resetSGSort();
			},
			configureFilters: function(){
				this.resetSGFilters();
			},

			computeOffsetPage: function(){
				return this.getSGPaginate().currentPage * this.getSGPaginate().perPage;
			},	

			computeLimitPage: function(){
				return this.getSGPaginate().perPage;
			},

			appendPaginateData: function(queryData){
				queryData = _.defaults(queryData || {}, {
					data : {}
				});

				if (queryData.data.offset !== undefined) {
					throw new Error('Already an offset');
				}

				if (queryData.data.limit !== undefined) {
					throw new Error('Already a limit');
				}

				var success = queryData.success;
				queryData.success = function(collection, results, options){
					success && success.apply(this, arguments);
					collection._firstPage = false;

					options.parse && (results = collection.parse(results, options));

					collection.getSGPaginate().currentPage++;

					if (results.length<options.data.limit) {
						collection.setMaxPagesReached();
					}
				};

				queryData.data.offset = this.computeOffsetPage();
				queryData.data.limit = this.computeLimitPage();
				if (this._firstPage) {
					queryData.reset = true;
				} else {
					queryData.reset = false;
					queryData.remove = false;					
				}


				return queryData;
			},	

			resetSGSort: function () {
				this._sorts = {};
			},


			getSGSort: function () {
				if (!this._sorts) {
					this._sorts = {};
				}
				return this._sorts;
			},

			getSortLimit: function(){
				return 1;
			},

			hasSorts: function(){
				return !!_.keys(this.getSGSort()).length;
			},

			addSGSort: function (name, asc, options) {
				options = _.defaults(options || {}, {
					silent:false
				});
				asc = asc || 'asc';

				if (this.hasSorts()) {
					this.resetSGSort({silent:options.silent});
				}

				this.getSGSort()[name] = asc;

				if (!options.silent) {
					this.trigger('add:sort', name, asc);
				}
			},

			removeSGSort: function (name, options) {
				options = _.defaults(options || {}, {
					silent: false
				});

				if (this.getSGSort()[name] === undefined) {
					return;
				}


				delete (this.getSGSort())[name];

				if (!options.silent) {
					this.trigger('remove:sort', name);
				}
			},

			resetSGFilters: function () {
				this._filters = {};
			},

			getSGFilters: function () {
				if (!this._filters) {
					this._filters = {};
				}
				return this._filters;
			},

			addSGFilter: function (filterName, value, options) {
				options = _.defaults(options || {}, {
					silent:false
				});
				this.getSGFilters()[filterName] = value;

				if (!options.silent) {
					this.trigger('add:filter', filterName, value);
				}
			},

			removeSGFilter: function (filterName, options) {
				options = _.defaults(options || {}, {
					silent:false
				});
				if (this.getSGFilters()[filterName] === undefined) {
					return;
				}

				delete this.getSGFilters()[filterName];

				if (!options.silent) {
					this.trigger('remove:filter', filterName);
				}
			},

			hasFilters: function(){
				return !!_.keys(this.getSGFilters()).length;
			},

			appendFiltersData: function (queryData) {
				queryData = _.defaults(queryData || {}, {
					data : {}
				});

				if (!this.hasFilters()) {
					return queryData;
				}

				var filters = this.getSGFilters();
				for(var filterName in filters){
					queryData.data[encodeURIComponent(filterName)] = encodeURIComponent(filters[filterName]);
				}

				return queryData;
			},


			appendSortsData: function (queryData) {
				queryData = _.defaults(queryData || {}, {
					data : {}
				});
				if (!this.hasSorts()) {
					return queryData;
				}

				var sorts = this.getSGSort();
				for(var sortName in sorts){
					queryData.data.sortBy = encodeURIComponent(sortName);
					queryData.data.sortHow = encodeURIComponent(sorts[sortName]);
				}

				return queryData;
			}

		};
	};
});




		
define('RemoteCollection/mixins/helpers',[], function () {
	

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





define('RemoteCollection/mixins/navigation',[], function () {
	

	return function(){
		return {
			navigateRepresentation: function(){
				var base  = '';

				if (this.constructor.getCollectionName()) {
					base = this.constructor.getCollectionName();
				}

				if (this._parent && this._path && !this.constructor.navigateRoot) {
					 base = this._parent.navigateRepresentation()+'/'+ this._path;
				}

				return base;
			}
		};
	};
});




		
define('shared/actions_mixin',[], function () {
	

	return function(/*SagaModel*/){
		return {

			getActions: function(){
				if (!this._actions) {
					this._actions = {};
				}
				return this._actions;
			},

			hasAction: function(actionName){
				return actionName in this.getActions();
			},

			getActionDescriptor: function(actionName){
				return this.getActions()[actionName];
			},

			addAction: function(actionName, descriptor){
				this.getActions()[actionName] = descriptor;
			},

			removeAction: function(actionName){
				delete this.getActions()[actionName];
			},

			generateAction: function(actionName, descriptor){
				if (this.hasAction(actionName)) {
					throw new Error('action already defined');
				}

				descriptor = _.defaults(descriptor||{}, {
					method : 'POST'
				});

				this.addAction(actionName, descriptor);
			},

			executeAction: function(actionName, actionArgs, options){
				if (!this.hasAction(actionName)) {
					throw new Error('Unknow action', actionName);
				}

				actionArgs = actionArgs||{};

				var descriptor = this.getActionDescriptor(actionName);
				
				var syncOptions = _.extend(_.clone(descriptor), {data:actionArgs});

				var params = _.extend(syncOptions, options);

				if (!params.url) {
					params.url = this.generateUrlForAction(actionName);
				}

				return this.sync(undefined, this, params)				;
			},

			generateUrlForAction: function(actionName){
				var baseUrl = _.result(this, 'url');
				return baseUrl+='/'+actionName;			
			}

		};
	};
});
define('shared/ModelError',[], function () {
	
	
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
define('shared/error_mixin',[
	'./ModelError'
	], function (
		ModelError
) {
	

	return function(/*SagaModel*/){
		return {

			generateError: function(verbose, identifier){
				return new this._ModelError({
					verbose:verbose, 
					identifier:identifier, 
					model:this});
			}, 

			_ModelError: ModelError

		};
	};
});
define('shared/classShared_mixin',[], function () {
	

	return function(/*SagaModel*/){
		return {
			
			modelName: null,

			getCollectionName: function(){
				if (!_.isString(this.modelName)) {
					return '';
				}
				return this.modelName.toLowerCase()+'s';
			}, 

			navigateRoot:false,	
		};
	};
});
define('RemoteModel/mixins/sync',[], function () {
	

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
define('RemoteModel/descriptor/Descriptor',[], function () {
	

	var Descriptor = function(info){
		info = _.defaults(info|| {}, {
			type:"PRIMITIVE"
		})
		_.extend(this, info);
	};

	_.extend(Descriptor.prototype, {

		clear: function(){
			for(var key in this){
				if (key !== 'clear') {
					this[key] = null;	
				}
			}
		},

		isPrimitiveDescriptor: function(path){
			return this.type == "PRIMITIVE";
		},

		isModelDescriptor: function(path){
			return this.type == "MODEL";
		},

		isCollectionDescriptor: function(path){
			return this.type == "COLLECTION";
		},


		isValidable: function(){
			return true;
		}
	});

	return Descriptor;
});
define('RemoteModel/mixins/schema',[
	'./../descriptor/Descriptor'
	], function (
		Descriptor
) {
	

	return function(/*SagaModel*/){
		return {
			//Override me
			configureSchema: function(){},


			_getSchemaAttributes: function(){
				if (!this.__schemaAttributes) {
					this.__schemaAttributes = {};	
				}
				return this.__schemaAttributes;
			},

			_addSchemaAttribute: function(attribute, descriptorData){

				if (!attribute) {
					return;
				}

				// if (this.get(attribute, {lazyCreation:false}) && this._hasSchemaAttribute(attribute)) {
				// 	throw new Error('Attribute already use and setted');
				// }
				var descriptor = new Descriptor(descriptorData);

				this._getSchemaAttributes()[attribute] = descriptor;
			},

			_removeSchemaAttribute: function(attribute){
				if (!this._hasSchemaAttribute(attribute)) {
					return;
				}
				
				this._getSchemaAttributes()[attribute].clear();

				delete this._getSchemaAttributes()[attribute];
			},

			_hasSchemaAttribute: function(attribute){
				return this._getSchemaDescription(attribute) !== undefined;
			},

			_getSchemaDescription: function(attribute){
				return this._getSchemaAttributes()[attribute];
			},

			generateSchemaAttribute: function(attribute, options){
				// if (this._hasSchemaAttribute(attribute)) {
				// 	throw new Error('Attribute already use');
				// }

				options = _.defaults(options|| {}, {
					// type:'PRIMITIVE', /* PRIMITIVE, COLLECTION, MODEL */
					// generator:null, /* RemoteModel or RemoveCollection*/
					attribute:attribute
				});

				this._addSchemaAttribute(attribute, options);

				return this._generateGetSetForAttribute.apply(this, [attribute, options]);
			}
		};
	};
});
define('RemoteModel/mixins/getter',[], function () {
	

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
define('RemoteModel/mixins/setter',[], function () {
	

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

			setPrimitiveAttribute: function(attr, raw, options){
				options = _.extend(options||{}, {
					force:true
				});

				return this.set(attr, raw, options);
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
define('RemoteModel/mixins/getterCreator',[], function () {
	

	return function(/*SagaModel*/){
		return {

			tryGenerateDefaultValue: function(descriptor){
				if (!descriptor) {
					throw new Error('Unknow type');
				}

				if(descriptor.isPrimitiveDescriptor()) {
					return this.generateDefaultPrimitiveForAttribute(descriptor);
				}
				if(descriptor.isModelDescriptor()) {
					return this.generateDefaultModelForAttribute(descriptor);
				}
				if(descriptor.isCollectionDescriptor()) {
					return this.generateDefaultCollectionForAttribute(descriptor); 
				}
				throw new Error('Unknow type');
			},

			generateDefaultModelForAttribute: function(descriptor) {
				descriptor = _.defaults(descriptor||{}, {
					generator:this.constructor,
					defaultOptions: {},
					path:descriptor.attribute
				});

				_.extend(descriptor.defaultOptions, {
					parent:this,
					path:descriptor.attribute
				});

				return new (descriptor.generator)(descriptor.defaultAttrs, descriptor.defaultOptions);
			},

			generateDefaultCollectionForAttribute: function(descriptor) {
				descriptor = _.defaults(descriptor||{}, {
					defaultOptions: {},
					path:descriptor.attribute
				});

				if (!descriptor.generator) {
					throw new Error('Unknow collection generator');
				}

				_.extend(descriptor.defaultOptions, {
					parent:this,
					path:descriptor.attribute
				});


				descriptor = descriptor||{};

				return new (descriptor.generator)(descriptor.defaultModels, descriptor.defaultOptions);
				
			},

			generateDefaultPrimitiveForAttribute: function(descriptor) {
				descriptor = descriptor||{};
				return descriptor['default'];
			}			
		};
	};
});
define('RemoteModel/mixins/lifeCycle',[], function () {
	

	return function(SagaModel){
		return {
			clear: function(){
				this._parent = null;
				return SagaModel.prototype.clear.apply(this, arguments);
			}
		};
	};
});
define('RemoteModel/mixins/validation',[], function () {
	

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
define('RemoteModel/mixins/navigation',[], function () {
	

	return function(){
		return {
			navigateRepresentation: function(){
				var base = '';

				if (this._parent && !this.constructor.navigateRoot) {
					base = this._parent.navigateRepresentation()+'/'+this._path||'';
				}

				if (this.collection) {
					base = this.collection.navigateRepresentation();
				}

				if (!base) {
					base = this.constructor.getCollectionName();	
				}

				return base +'/'+(this.isNew() ? 'new' : this.id);	
			}
		};
	};
});
define('RemoteModel/Model',[
	'./mixins/sync',
	'./mixins/schema',
	'./mixins/getter',
	'./mixins/setter',
	'./mixins/getterCreator',
	'./mixins/lifeCycle',
	'./mixins/validation',
	'./mixins/navigation',
	'./../shared/actions_mixin',
	'./../shared/error_mixin',
	'./../shared/classShared_mixin'
	
], function (
	sync,
	schema,
	getter, 
	setter,
	getterCreator,
	lifeCycle,
	validation,
	navigation,
	actions_mixin, 
	error_mixin,
	classShared_mixin

) {
	
	var SagaModel = require('sgc-model').Model;

	var clazz = _.extend({}, classShared_mixin(SagaModel));

	var RemoteModel = SagaModel.extend({

		constructor: function(attr, options){
			options = _.defaults(options||{}, {
				parent: null,
				path: null
			});

			this.configureSchema();

			var res =  SagaModel.prototype.constructor.apply(this, arguments);

			this._path = options.path;
			this._parent = options.parent;

			
			return res;
		},

		idAttribute: '_id'
		
	}, clazz);

	_.extend(RemoteModel.prototype, sync(SagaModel));
	_.extend(RemoteModel.prototype, schema(SagaModel));
	_.extend(RemoteModel.prototype, getter(SagaModel));
	_.extend(RemoteModel.prototype, setter(SagaModel));
	_.extend(RemoteModel.prototype, getterCreator(SagaModel));
	_.extend(RemoteModel.prototype, lifeCycle(SagaModel));
	_.extend(RemoteModel.prototype, validation(SagaModel));
	_.extend(RemoteModel.prototype, navigation(SagaModel));
	
	_.extend(RemoteModel.prototype, actions_mixin(SagaModel));
	_.extend(RemoteModel.prototype, error_mixin(SagaModel));




	return RemoteModel;
});
define('RemoteCollection/Collection',[
	'./mixins/sync',
	'./mixins/pagination',
	'./mixins/helpers',
	'./mixins/navigation',
	'./../shared/actions_mixin',
	'./../shared/error_mixin',
	'./../shared/classShared_mixin',
	'./../RemoteModel/Model'

	], function (
	sync,
	pagination,
	helpers,
	navigation,
	actions_mixin,
	error_mixin,
	classShared_mixin,
	Model
) {
	

	var SagaCollection = require('sgc-model').Collection;


	var clazz = _.extend({}, classShared_mixin(SagaCollection));

	var RemoteCollection = SagaCollection.extend({
		
		constructor: function(models, options){
			options = _.defaults(options||{}, {
				parent:null,
				path: null
			});

			if (options.url) {
				this._customUrl = options.url;
				delete options.url;
			}

			var res = SagaCollection.prototype.constructor.apply(this, arguments);

			this._parent = options.parent;
			this._path = options.path;	

			this.configurePagination();
			this.configureSorts();
			this.configureFilters();

			return res;
		}, 

		model:Model

	}, clazz);

	_.extend(RemoteCollection.prototype, sync(SagaCollection));
	_.extend(RemoteCollection.prototype, pagination(SagaCollection));
	_.extend(RemoteCollection.prototype, helpers(SagaCollection));
	_.extend(RemoteCollection.prototype, navigation(SagaCollection));
	
	_.extend(RemoteCollection.prototype, actions_mixin(SagaCollection));
	_.extend(RemoteCollection.prototype, error_mixin(SagaCollection));
	
	return RemoteCollection;
});
define('sgc-mongoose-model',[
	'./RemoteCollection/Collection',
	'./RemoteModel/Model'
	],
function (
	Collection, 
	Model
		) {
	

	return {
		Collection: Collection,
		Model: Model
	};
});

