define([
	'./helpers_test',
	'./lifecycle_test',
	'./schema_test',
	'./urlTesting_test',
	'./submodel_setter_test',
	'./validation_test'
], function (
	helpers,
	lifecycle,
	schema,
	urlTesting,
	submodel_setter_test,
	validation_test
) {
	'use strict';

	return function(){
		validation_test();
		helpers();
		lifecycle();
		schema();
		urlTesting();
		submodel_setter_test();
	};
});
