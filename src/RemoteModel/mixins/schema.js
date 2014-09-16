define([
	'./../descriptor/Descriptor'
	], function (
		Descriptor
) {
	'use strict';

	return function(/*SagaModel*/){
		return {
			//Override me
			configureSchema: function(){},


			_getSchemaAttributes: function(){
				if (!this.__schemaAttributes) {
					this.__schemaAttributes = {};	
				}
				return this.__schemaAttributes;
			},

			_addSchemaAttribute: function(attribute, descriptorData){

				if (!attribute) {
					return;
				}

				if (this._hasSchemaAttribute(attribute)) {
					throw new Error('Attribute already use');
				}

				var descriptor = new Descriptor(descriptorData);

				this._getSchemaAttributes()[attribute] = descriptor;
			},

			_removeSchemaAttribute: function(attribute){
				if (!this._hasSchemaAttribute(attribute)) {
					return;
				}
				
				this._getSchemaAttributes()[attribute].clear();

				delete this._getSchemaAttributes()[attribute];
			},

			_hasSchemaAttribute: function(attribute){
				return this._getSchemaDescription(attribute) !== undefined;
			},

			_getSchemaDescription: function(attribute){
				return this._getSchemaAttributes()[attribute];
			},

			generateSchemaAttribute: function(attribute, options){
				if (this._hasSchemaAttribute(attribute)) {
					throw new Error('Attribute already use');
				}

				options = _.defaults(options|| {}, {
					type:'PRIMITIVE', /* PRIMITIVE, COLLECTION, MODEL */
					// generator:null, /* RemoteModel or RemoveCollection*/
					attribute:attribute
				});

				this._addSchemaAttribute(attribute, options);

				return this._generateGetSetForAttribute.apply(this, [attribute, options]);
			}
		};
	};
});