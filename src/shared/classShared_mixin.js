define([], function () {
	'use strict';

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