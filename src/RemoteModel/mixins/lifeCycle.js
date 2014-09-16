define([], function () {
	'use strict';

	return function(SagaModel){
		return {
			clear: function(){
				this._parent = null;
				return SagaModel.prototype.clear.apply(this, arguments);
			}
		};
	};
});