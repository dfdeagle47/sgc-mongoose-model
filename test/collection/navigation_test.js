define([
    'sgc-mongoose-model', 
    'chai', 
    'sinonIE'], function(RemoteModel, chai)  {
    'use strict';
    return function() {


        var Collection = RemoteModel.Collection;
        var Model = RemoteModel.Model;

        chai.should();

        describe('Test navigate representation users/35151/comments', function() {

            it('Test navigate representation comments', function(){

                var collection = new (Collection.extend({},
                {
                    modelName:'Comment'
                }))();
                collection.navigateRepresentation().should.equal('comments');
            });

        	it('Test navigate representation', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))('35151');
                var SubCollection = Collection.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('comments', {type:'COLLECTION', generator:SubCollection});
                parentModel.comments.navigateRepresentation().should.equal('users/35151/comments');
        	});

            it('Test navigate representation users/35151/comments/321', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))('35151');
                var SubCollection = Collection.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('comments', {type:'COLLECTION', generator:SubCollection});

                parentModel.comments.add('321');
                parentModel.comments.at(0).navigateRepresentation().should.equal('users/35151/comments/321');

            });

            it('Test navigate representation users/35151', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))('35151');
                parentModel.navigateRepresentation().should.equal('users/35151');
            });


            it('Test model from collection comments/123', function(){
                var collection = new (Collection.extend({},
                {
                    modelName:'Comment'
                }))();
                
                collection.add('123');
                collection.at(0).navigateRepresentation().should.equal('comments/123');
            });


            it('Test submodel from model users/35151/author/6512', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))('35151');
                parentModel.generateSchemaAttribute('author', {type:'MODEL', generator:Model});

                parentModel.author.set('_id', '6512');
                parentModel.author.navigateRepresentation().should.equal('users/35151/author/6512');
            });

        });
    };
}); 
