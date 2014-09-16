define([
	'./mixins/sync',
	'./mixins/schema',
	'./mixins/getter',
	'./mixins/setter',
	'./mixins/getterCreator',
	'./mixins/lifeCycle',
	'./mixins/validation',
	'./../shared/actions_mixin',
	'./../shared/error_mixin'
], function (
	sync,
	schema,
	getter, 
	setter,
	getterCreator,
	lifeCycle,
	validation,
	actions_mixin, 
	error_mixin

) {
	'use strict';
	var SagaModel = require('sgc-model').Model;
	

	var RemoteModel = SagaModel.extend({

		constructor: function(attr, options){
			options = _.defaults(options||{}, {
				parent: null,
				path: null
			});

			var res =  SagaModel.prototype.constructor.apply(this, arguments);

			this._path = options.path;
			this._parent = options.parent;

			this.configureSchema();
			return res;
		},

		idAttribute: '_id'
		
	}, {
		modelName: null,
		getCollectionName: function(){
			if (!_.isString(this.modelName)) {
				return '';
			}
			return this.modelName.toLowerCase()+'s';
		}
	});

	_.extend(RemoteModel.prototype, sync(SagaModel));
	_.extend(RemoteModel.prototype, schema(SagaModel));
	_.extend(RemoteModel.prototype, getter(SagaModel));
	_.extend(RemoteModel.prototype, setter(SagaModel));
	_.extend(RemoteModel.prototype, getterCreator(SagaModel));
	_.extend(RemoteModel.prototype, lifeCycle(SagaModel));
	_.extend(RemoteModel.prototype, validation(SagaModel));
	
	_.extend(RemoteModel.prototype, actions_mixin(SagaModel));
	_.extend(RemoteModel.prototype, error_mixin(SagaModel));




	return RemoteModel;
});