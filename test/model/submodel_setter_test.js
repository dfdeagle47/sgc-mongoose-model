define([
    'sgc-mongoose-model', 
    'chai' 
], function(SGCModel, chai)  {
    'use strict';
    return function() {
        // var expect = chai.expect;
        var Model = SGCModel.Model;
        // var Collection = SGCModel.Collection;


        chai.should();

        describe('Testing helpers Model', function() {



            it('Test Set submodel attr from parent', function(done){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();

                var SubModel = Model.extend(
                {
                    constructor: function(attrs, options){
                        chai.assert.equal(options.parent, parentModel);
                        chai.assert.equal(options.path, 'comment');
                        done();
                        return Model.prototype.constructor.apply(this, arguments);
                    }
                    
                });

                parentModel.generateSchemaAttribute('comment', {type:'MODEL', generator:SubModel});
                parentModel.comment;
                done('Fail, arguments nok');

            });

            it('Test Set model with object attr with embedded submodel info', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();
                var SubModel = Model.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('comment', {type:'MODEL', generetor:SubModel});

                parentModel.set({
                    '_id':'3511', 
                    'comment':{'_id':'f4d3f4d'},
                    'name':'Comment name...'
                });

                parentModel.attributes.should.have.property('name');
                parentModel.attributes.should.have.property('comment');
                parentModel.attributes.should.have.property('_id');
                parentModel.comment.attributes.should.have.property('_id');

            });

            it('Test Set model with object attr with _id submodel info', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();
                var SubModel = Model.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('comment', {type:'MODEL', generetor:SubModel});

                parentModel.set({
                    'comment':'f4d3f4d'
                });
                parentModel.attributes.should.have.property('comment');
                parentModel.comment.attributes.should.have.property('_id');
                
                parentModel.comment.id.should.equal('f4d3f4d');
                parentModel.comment.get('_id').should.equal('f4d3f4d');
            });

            it('Test force options for model schema', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();

                var SubModel = Model.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('comment', {type:'MODEL', generetor:SubModel});

                var oldInstanceId = parentModel.comment.cid;
                parentModel.set('comment', new SubModel(), {force:true});
                var newInstanceId = parentModel.comment.cid;
                newInstanceId.should.not.to.equal(oldInstanceId);
            });


            it('Test model replacement', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();

                var SubModel = Model.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('comment', {type:'MODEL', generetor:SubModel});

                var comment1 = parentModel.comment;

                var replaceWithModel = new SubModel();
                parentModel.comment = replaceWithModel;
                var comment2 = parentModel.comment;

                comment1.cid.should.not.to.equal(comment2.cid);
            });

            it('Test model force set', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();

                var SubModel = Model.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('comment', {type:'MODEL', generetor:SubModel});

                var comment = new SubModel();
                parentModel.comment = comment;

                comment.should.to.equal(parentModel.comment);
            });

            it('Test set model with string identifier', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();

                var SubModel = Model.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('comment', {type:'MODEL', generetor:SubModel});
                parentModel.comment = '3841';
                parentModel.comment.get('_id').should.to.equal('3841');
            });

            it('Test set model with jsonObject', function(){
                var parentModel = new (Model.extend({},
                {
                    modelName:'User'
                }))();

                var SubModel = Model.extend({},
                {
                    modelName:'Comment'
                });

                parentModel.generateSchemaAttribute('comment', {type:'MODEL', generetor:SubModel});

                
                parentModel.comment = {
                    _id:'3841', 
                    name: 'aName'
                };
                
                parentModel.comment.get('_id').should.to.equal('3841');
                parentModel.comment.get('name').should.to.equal('aName');
            });



            it('replaced submodel correctly cleared', function(done){
                var parentModel = new Model();

                var SubModel = Model.extend({
                    clear: function(){
                        done();
                        return Model.prototype.clear.apply(this, arguments);
                    }
                });

                parentModel.generateSchemaAttribute('author', {type:'MODEL', generator:SubModel});

                parentModel.author = {_id:'351851'};

                var newAuthor = new SubModel({
                    _id:'3515f1d581f'
                });

                parentModel.author = newAuthor;

                done('Fail to clear old model');

            });

        });
    };
});