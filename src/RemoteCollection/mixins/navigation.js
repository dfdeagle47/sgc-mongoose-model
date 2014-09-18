define([], function () {
	'use strict';

	return function(){
		return {
			navigateRepresentation: function(){
				var base  = '';

				if (this.constructor.getCollectionName()) {
					base = this.constructor.getCollectionName();
				}

				if (this._parent && this._path && !this.constructor.navigateRoot) {
					 base = this._parent.navigateRepresentation()+'/'+ this._path;
				}

				return base;
			}
		};
	};
});




		