define([
	'./ModelError'
	], function (
		ModelError
) {
	'use strict';

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