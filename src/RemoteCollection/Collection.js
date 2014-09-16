define([
	'./mixins/sync',
	'./mixins/pagination',
	'./../shared/actions_mixin',
	'./../shared/error_mixin'

	], function (
	sync,
	pagination,
	actions_mixin,
	error_mixin
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
		}
	});

	_.extend(RemoteCollection.prototype, sync(SagaCollection));
	_.extend(RemoteCollection.prototype, pagination(SagaCollection));
	_.extend(RemoteCollection.prototype, actions_mixin(SagaCollection));
	_.extend(RemoteCollection.prototype, error_mixin(SagaCollection));
	
	return RemoteCollection;
});