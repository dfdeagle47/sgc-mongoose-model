define([
	'sgc-mongoose-model', 
	'chai', 
	'sinonIE'
], function(SGCModel, chai)  {
    'use strict';
    return function() {
        var expect = chai.expect;
        var Model = SGCModel.Model;
        var Collection = SGCModel.Collection;

        chai.should();


        describe('Testing actions (for model and collections', function() {

           var server;
             
            beforeEach(function() {
                server = sinon.fakeServer.create();
                server.autoRespond = true;
            });

            afterEach(function () {
                server.restore();
            });       


	        it('test url generator without id (model)', function(){
	        	var XModel = Model.extend({},{
	        		modelName:'User'
	        	});
        		var model = new XModel();
        		var actionName = 'like';
        		chai.assert.equal(model.generateUrlForAction(actionName), '/api/users/like');
        	});


	        it('test url generator with id (model)', function(){
	        	var XModel = Model.extend({},{
	        		modelName:'User'
	        	});
        		var model = new XModel('1471');
        		var actionName = 'like';
        		chai.assert.equal(model.generateUrlForAction(actionName), '/api/users/1471/like');
        	});

	        it('test url generator for collection', function(){
	        	var XCollection = Collection;
        		var collection = new XCollection(undefined, {
        			url: 'anURL'
        		});
        		var actionName = 'like';
        		chai.assert.equal(collection.generateUrlForAction(actionName), 'anURL/like');
        	});


        	it('testing generate actions without descriptor', function(){
        		var model = new Model();
        		var actionName = 'like';
        		model.generateAction(actionName);

        		chai.assert.equal(model.hasAction(actionName), true);

        		var descriptor = model.getActionDescriptor(actionName);

        		descriptor.should.not.equal(undefined);
        		descriptor.should.to.be.a('object');
        	});

        	it('testing generate actions with descriptor', function(){
        		var model = new Model();
        		var actionName = 'like';
        		model.generateAction(actionName);

        		model.getActionDescriptor(actionName);
        		
        	});


        	it('testing generate existing actions', function(){
        		var model = new Model();
        		model.generateAction('like');

        		expect(function(){
        			model.generateAction('like');	
        		}).to['throw'](Error);
        	});


        	it('testing Execute actions', function(done){

                server.respondWith('POST', '/api/users/like',
                [
                       200,
                       {},
                   		'{"name":"Yvan"}'
		       	]);   

	        	var XModel = Model.extend({},{
	        		modelName:'User'
	        	});
        		var model = new XModel();        	

        		model.generateAction('like');

        		model.executeAction('like')
        		.done(function(){
        			done();
        		})
        		.fail(function(){
        			done('FAIL');
        		});
        	});

        	it('testing action execution with custom success (model)', function(done){

                server.respondWith('POST', '/api/users/like',
                [
                       200,
                       {},
                   		'{"name":"Yvan"}'
		       	]);   

	        	var XModel = Model.extend({},{
	        		modelName:'User'
	        	});

        		var model = new XModel();

        		model.generateSchemaAttribute('name', {type:'PRIMITIVE'});

        		model.generateAction('like', {
        			success: function(response){
        				model.set(response);
        			}
        		});

				model.executeAction('like').done(function(){
					chai.assert.equal(model.name, 'Yvan');
					done();
				});

        	});

        	it('testing action execution for Collection', function(done){

                server.respondWith('POST', '/api/users/like',
                [
                       200,
                       {},
                   		'{"name":"Yvan"}'
		       	]);   

	        	var XCollection = Collection.extend({});

        		var collection = new XCollection(undefined, {
	        		url: '/api/users'
	        	});

        		collection.generateAction('like', {
        			success: function(){
        				done();
        			}
        		});

				collection.executeAction('like')
				.fail(function(){
					done('FAIL');
				});

        	});


        });
    };
});