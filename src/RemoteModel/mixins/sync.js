define([], function () {
	'use strict';

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
			}
		};
	};
});