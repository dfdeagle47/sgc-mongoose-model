define([
], function () {
	'use strict';

	return function(/*SagaModel*/){
		return {

			_defineActionFunction: function() {

				var properties = {};
				var me = this;
				var getAction = function(action){
					return function(){
						return function(args, options){
							return this['do'].apply(this, [action, args, options]);
						};
					};
				};

				this.mongooseSchema.getActions().keys().forEach(function(key){
					if(key in me){
						key = '_'+key;
					}
					properties[key] = {get: getAction(key)};
				});

				Object.defineProperties(this, properties);
			},


			_defineAttributesProperties: function(){
				this._generateGetSetForAttributes(this.schemaAttributes());
			},


			schemaAttributes: function(){
				return this.mongooseSchema.getAttributes().keys();
			},

			defineSchemaProperties: function(){
				if(!this.mongooseSchema){
					return;
				}
				this._defineAttributesProperties();
				this._defineActionFunction();
			}
		};
	};
});