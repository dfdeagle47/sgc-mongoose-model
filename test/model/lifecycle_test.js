define([
	'sgc-mongoose-model', 
	'chai'
], function(RemoteModel, chai)  {
    'use strict';
    return function() {

        var expect = chai.expect;
        var Model = RemoteModel.Model;
        // var Collection = RemoteModel.Collection;

        describe('Testing Mongoose model life cycle', function() {
			it('Creating a Model instance', function () {
				var model = new (Model.extend({}, {
                    modelName: 'User'
                }))();
				expect(model).to.be.an['instanceof'](Model);
                chai.assert.equal(model.url(), '/api/users');
			});

        });


        describe('Testing Model serialization', function() {
            // defaults to json
            // JSON attributes
        });
    };
});