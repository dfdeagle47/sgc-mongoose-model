define([
	'./helpers_test',
	'./subCollection_setter_test',
	'./paginations_test'
], function (
	helpers,
	subCollection_setter_test,
	paginations_test
	) {
	'use strict';

	return function(){
		helpers();
		subCollection_setter_test();
		paginations_test();
	};
});
