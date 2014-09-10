require.config({
	deps: ['marionette', 'main'],
	shim: {
		// underscore: {
		// 	exports: '_'
		// },
		marionette: {
			exports: 'Backbone.Marionette',
			deps: ['backbone']
		},
		backbone: {
			exports: 'Backbone',
			deps: ['jquery', 'underscore']
		},
		'sgc_model': {
			exports: 'sgc_model',
			deps: ['marionette']	
		}
	},
	paths: {
		jquery: './bower_components/jquery/dist/jquery.min',
		backbone: './bower_components/backbone/backbone',
		sgc_model: './bower_components/sgc-model/src/index',
		underscore: './bower_components/underscore/underscore'
	}
});
