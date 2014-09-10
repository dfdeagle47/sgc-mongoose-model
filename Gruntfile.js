function GruntTasks (grunt) {
	'use strict';

	grunt.initConfig({
		jsonlint: {
			pkg: {
				src: 'package.json'
			},
			bower: {
				src: 'bower.json'
			},
			jshint: {
				src: '.jshintrc'
			},
			jscsrc: {
				src: '.jscsrc'
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			src: [
				'src/**/*.js',
				'test/**/*.js'
			]
		},
		jscs: {
			src: [
				'src/**/*.js',
				'test/**/*.js'
			]
		},
		clean: {
			coverage: [
				'test/coverage'
			],
			dist: [
				'dist'
			]
		},
		requirejs: {
			all: {
				options: {
					baseUrl: 'src',
					name: 'sgc-model',
					// mainConfigFile: 'src/public/dist/init.js',
					out: 'dist/sgc-model.min.js',
					optimize: 'uglify2',
					generateSourceMaps: false,
					preserveLicenseComments: false,
					inlineText: true,
					findNestedDependencies: true
					// paths: {
					// 	requireLib: 'bower_components/requirejs/require'
					// },
					// include: [
					// 	'requireLib'
					// ]
				}
			}
		},
		mocha_phantomjs: {
			test: [
				'test/index.html'
			]
		}
	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('verify', [
		'jsonlint',
		'jshint',
		'jscs'
	]);

	grunt.registerTask('test', [
		'mocha_phantomjs'
	]);

	grunt.registerTask('build', [
		'verify',
		'clean:dist',
		'requirejs'
	]);

	grunt.registerTask('ci', [
		'build',
		'test'
	]);
}

module.exports = GruntTasks;