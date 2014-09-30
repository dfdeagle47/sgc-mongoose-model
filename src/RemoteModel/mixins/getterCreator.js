define([], function () {
	'use strict';

	return function(/*SagaModel*/){
		return {

			tryGenerateDefaultValue: function(descriptor){
				if (!descriptor) {
					throw new Error('Unknow type');
				}

				if(descriptor.isPrimitiveDescriptor()) {
					return this.generateDefaultPrimitiveForAttribute(descriptor);
				}
				if(descriptor.isModelDescriptor()) {
					return this.generateDefaultModelForAttribute(descriptor);
				}
				if(descriptor.isCollectionDescriptor()) {
					return this.generateDefaultCollectionForAttribute(descriptor); 
				}
				throw new Error('Unknow type');
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