define([
	'./mixins/sync',
	'./mixins/pagination',
	'./mixins/helpers',
	'./../shared/actions_mixin',
	'./../shared/error_mixin',
	'./../RemoteModel/Model'

	], function (
	sync,
	pagination,
	helpers,
	actions_mixin,
	error_mixin,
	Model
) {
	'use strict';

	var SagaCollection = require('sgc-model').Collection;

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

	});

	_.extend(RemoteCollection.prototype, sync(SagaCollection));
	_.extend(RemoteCollection.prototype, pagination(SagaCollection));
	_.extend(RemoteCollection.prototype, helpers(SagaCollection));
	
	_.extend(RemoteCollection.prototype, actions_mixin(SagaCollection));
	_.extend(RemoteCollection.prototype, error_mixin(SagaCollection));
	
	return RemoteCollection;
});