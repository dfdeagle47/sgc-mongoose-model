define([], function () {
	'use strict';

	return function(){
		return {
			navigateRepresentation: function(){
				var base = ''
				if (this._parent) {
					base = this._parent.navigateRepresentation()+'/'+this._path||'';
				}

				if (this.collection) {
					base = this.collection.navigateRepresentation();
				}

				if (!base) {
					base = this.constructor.getCollectionName();	
				}

				return base +'/'+(this.isNew() ? 'new' : this.id);	
			}
		};
	};
});