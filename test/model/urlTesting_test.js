define([
	'sgc-mongoose-model', 
	'chai'
], function(RemoteModel)  {
    'use strict';
    return function() {

        // var expect = chai.expect;
        var Model = RemoteModel.Model;
        var Collection = RemoteModel.Collection;

        describe('Test url rooting inside model and submodel ', function() {
            
        it('Test default url of parent model /api/users/f4dsf43d41fs', function(){
                
                var TheModel = Model.extend({},{ modelName:'User'});

                var newModel = new TheModel();
                newModel.url().should.equal('/api/users');


                var existingModel = new TheModel({
                    _id:'f4dsf43d41fs'
                });
                existingModel.url().should.equal('/api/users/f4dsf43d41fs');
            });


            it('Test submodel Url with parent id /api/users/f4dsf43d41fs/submodel', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))({
                    _id:'f4dsf43d41fs'
                });

                var SubModel = Model.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('submodel', {type:'MODEL', generator:SubModel});
                parentModel.submodel.url().should.equal('/api/users/f4dsf43d41fs/submodel');

            });

            it('Test submodel Url without parent id /api/users/submodel', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))({
                    // _id:'f4dsf43d41fs'
                });

                var SubModel = Model.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('submodel', {type:'MODEL', generator:SubModel});
                parentModel.submodel.url().should.equal('/api/users/submodel');

            });

            it('Test submodel Url without submodel id /api/users/f4dsf43d41fs/submodel/xyz123456789', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))({
                    _id:'f4dsf43d41fs'
                });

                var SubModel = Model.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('submodel', {type:'MODEL', generator:SubModel, defaultAttrs: {
                    _id:'xyz123456789'
                }});
                parentModel.submodel.url().should.equal('/api/users/f4dsf43d41fs/submodel/xyz123456789');
            });


             it('Test setting url and id after create submodel /api/users/newID/comment/xyz123456789', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();
                var SubModel = Model.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('comment', {type:'MODEL', generator:SubModel, defaultAttrs: {
                    _id:'xyz123456789'
                }});                
                parentModel.submodel;
                parentModel.set('_id', 'newID');

                parentModel.comment.url().should.equal('/api/users/newID/comment/xyz123456789');
             });


   

             it('Test url from collection with an id for parent', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))({
                    _id:'31'
                });

                var SubCollection = Collection.extend();
                parentModel.generateSchemaAttribute('comments', {type:'COLLECTION', generator:SubCollection});                
                parentModel.comments.url().should.equal('/api/users/31/comments');
             });

             it('Test url from collection with no id for parent', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();

                var SubCollection = Collection.extend();
                parentModel.generateSchemaAttribute('comments', {type:'COLLECTION', generator:SubCollection});                
                parentModel.comments.url().should.equal('/api/users/comments');
             });

             it('Test url from collection with custom id for collection Custom_URL', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();

                var SubCollection = Collection.extend();
                parentModel.generateSchemaAttribute('comments', {type:'COLLECTION', generator:SubCollection, defaultOptions:{
                    url: 'Custom_URL'
                }});                
                parentModel.comments.url().should.equal('Custom_URL');
             });


             it('Test url from item of collection /api/users/181/comments/3813', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))('181');

                var SubCollection = Collection.extend();
                parentModel.generateSchemaAttribute('comments', {type:'COLLECTION', generator:SubCollection, defaultOptions:{
                }});
                parentModel.comments.add('3813');
                parentModel.comments.at(0).url();
                parentModel.comments.at(0).url().should.equal('/api/users/181/comments/3813');
             });


        });
    };
});