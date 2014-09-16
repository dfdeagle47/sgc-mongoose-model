define([], function () {
	'use strict';

	return function(/*SagaModel*/){
		return {


			tryGenerateDefaultValue: function(descriptor){
				if (!descriptor) {
					throw new Error('Unknow type');
				}
				switch(descriptor.type){
					case 'PRIMITIVE':
						return this.generateDefaultPrimitiveForAttribute(descriptor);
					case 'COLLECTION':
						return this.generateDefaultCollectionForAttribute(descriptor);
					case 'MODEL':
						return this.generateDefaultModelForAttribute(descriptor);
					default:
						throw new Error('Unknow type');
				}
			},

			generateDefaultModelForAttribute: function(descriptor) {
				descriptor = _.defaults(descriptor||{}, {
					generator:this.constructor,
					defaultOptions: {},
					path:descriptor.attribute
				});

				_.extend(descriptor.defaultOptions, {
					parent:this,
					path:descriptor.attribute
				});

				return new (descriptor.generator)(descriptor.defaultAttrs, descriptor.defaultOptions);
			},

			generateDefaultCollectionForAttribute: function(descriptor) {
				descriptor = _.defaults(descriptor||{}, {
					defaultOptions: {},
					path:descriptor.attribute
				});

				if (!descriptor.generator) {
					throw new Error('Unknow collection generator');
				}

				_.extend(descriptor.defaultOptions, {
					parent:this,
					path:descriptor.attribute
				});


				descriptor = descriptor||{};

				return new (descriptor.generator)(descriptor.defaultModels, descriptor.defaultOptions);
				
			},

			generateDefaultPrimitiveForAttribute: function(descriptor) {
				descriptor = descriptor||{};
				return descriptor['default'];
			}			
		};
	};
});