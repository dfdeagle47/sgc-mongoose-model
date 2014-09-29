define([
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
	'use strict';
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