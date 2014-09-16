define([
    'sgc-mongoose-model', 
    'chai'
], function(SGCModel, chai)  {
    'use strict';
    return function() {
        var expect = chai.expect;
        var Model = SGCModel.Model;
        var Collection = SGCModel.Collection;


        chai.should();

        describe('Testing Sub collection', function() {

            it('Auto generator correct collection', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();
                var SubCollection = Collection.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('comments', {type:'COLLECTION', generator:SubCollection});
                expect(parentModel.comments).to.be.an['instanceof'](SubCollection);
            });


            it('set subcollection with array of string', function(){

                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();

                var SubModel=  Model.extend();


                var SubCollection = Collection.extend({
                	model:SubModel
                },
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('comments', {type:'COLLECTION', generator:SubCollection});
                
                parentModel.comments = ['1','2','3'];

                parentModel.comments.at(0).id.should.equal('1');
                parentModel.comments.at(1).id.should.equal('2');
                parentModel.comments.at(2).id.should.equal('3');

            });

            it('set subcollection with array of jsons', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();

                var SubModel=  Model.extend();


                var SubCollection = Collection.extend({
                	model:SubModel
                },
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('comments', {type:'COLLECTION', generator:SubCollection});
                
                parentModel.comments = [{_id: '1'}, {_id: '2'}, {_id: '3'}];

				parentModel.comments.at(0).id.should.equal('1');
                parentModel.comments.at(1).id.should.equal('2');
                parentModel.comments.at(2).id.should.equal('3');

            });


            it('Force a collection to be set ', function(){
                var parentModel = new (Model.extend({}))();

                var SubCollection = Collection.extend({});
                parentModel.generateSchemaAttribute('comments', {type:'COLLECTION', generator:SubCollection});
            
                //Create
                parentModel.comments;

                parentModel.set('comments', new SubCollection());

            });

            it('replaced subcollection correctly cleared ', function(done){
                var parentModel = new (Model.extend({}))();

                var SubCollection1 = Collection.extend({
                    clear: function(){
                        done();
                        return Collection.prototype.clear.apply(this, arguments);
                    }
                });

                var SubCollection2 = Collection.extend();
                parentModel.generateSchemaAttribute('comments', {type:'COLLECTION', generator:SubCollection1});
                //Create
                parentModel.comments;

                parentModel.comments = new SubCollection2();
                done('Not cleared');
            });

             it('Test subCollection attr from parent ', function(done){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();
                var SubCollection = Collection.extend({

                    constructor: function(models, options){
                        
                        chai.assert.equal(options.parent, parentModel);
                        chai.assert.equal(options.path, 'comments');
                        done();
                        return Collection.prototype.constructor.apply(this, arguments);
                    }
                    
                });

                parentModel.generateSchemaAttribute('comments', {type:'COLLECTION', generator:SubCollection, defaultAttrs: {
                    _id:'xyz123456789'
                }});   

                parentModel.comments;
                done('Fail to constructor sub colleciton');

             });

        });
    };
}); 