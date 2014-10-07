require.config({
	deps: ['sgc-mongoose-model', 'underscore.str', 'test'],
	shim: {
		'jquery': {
			exports: '$'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			exports: 'Backbone',
			deps: ['jquery', 'underscore']
		},
		'sgc-mongoose-model': {
			deps: [
				'sgc-model'
			]
		},
		'sgc-model': {
			deps: [
				'backbone',
				'underscore.str'
			]
		},
		'sinonIE': {
			deps: ['sinon']
		},
		'underscore.str': {
			deps: ['underscore']
		},
	},
	paths: {
		
		'jquery': '../bower_components/jquery/dist/jquery.min',
		
		'backbone': '../bower_components/backbone/backbone',
		
		'underscore': '../bower_components/underscore/underscore',
		
		'underscore.str': '../bower_components/underscore.string/lib/underscore.string',

		'mocha': '../node_modules/mocha/mocha',

		'chai': '../node_modules/chai/chai',
		// sinon: '../node_modules/sinon/lib/sinon',
		'sinon': '../node_modules/sinon/pkg/sinon',

		'sinonIE': '../node_modules/sinon/pkg/sinon-ie',

		'sgc-model': '../bower_components/sgc-model/dist/sgc-model.min',
		// 'sgc-model': '../bower_components/sgc-model/src/sgc-model',

		'sgc-mongoose-model': '../src/sgc-mongoose-model',
		// 'sgc-mongoose-model': '../dist/sgc-mongoose-model.min',

		'test': '../test/test'
	},
	baseUrl: '../src'
});