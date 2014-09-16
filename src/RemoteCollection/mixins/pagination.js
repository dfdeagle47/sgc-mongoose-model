define([], function () {
	'use strict';

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




		