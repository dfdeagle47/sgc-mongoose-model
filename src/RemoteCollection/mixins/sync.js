define([], function () {
	'use strict';

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




		