define([], function () {
	'use strict';

	var Descriptor = function(info){
		_.extend(this, info);
	};

	_.extend(Descriptor.prototype, {

		clear: function(){
			for(var key in this){
				if (key !== 'clear') {
					this[key] = null;	
				}
			}
		},

		isValidable: function(){
			return true;
		}
	});

	return Descriptor;
});