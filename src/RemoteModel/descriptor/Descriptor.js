define([], function () {
	'use strict';

	var Descriptor = function(info){
		info = _.defaults(info|| {}, {
			type:"PRIMITIVE"
		})
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

		isPrimitiveDescriptor: function(path){
			return this.type == "PRIMITIVE";
		},

		isModelDescriptor: function(path){
			return this.type == "MODEL";
		},

		isCollectionDescriptor: function(path){
			return this.type == "COLLECTION";
		},


		isValidable: function(){
			return true;
		}
	});

	return Descriptor;
});