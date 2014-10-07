define([
	'./RemoteCollection/Collection',
	'./RemoteModel/Model',
	'./Prototype/Backbone'
	],
function (
	Collection, 
	Model
) {
	'use strict';

	return {
		Collection: Collection,
		Model: Model
	};
});
