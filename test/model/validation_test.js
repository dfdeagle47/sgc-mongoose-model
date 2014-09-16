define([
	'sgc-mongoose-model', 
	'chai'
], function(RemoteModel, chai)  {
    'use strict';
    return function() {

        var expect = chai.expect;
        var Model = RemoteModel.Model;
        var Collection = RemoteModel.Collection;

        describe('Test Model validation ', function() {

        	it('test validate unknow attributes', function(){
                var model = new Model();
                expect(function(){
                    model.validate(['name']);    
                }).to['throw'](Error);
            });

            it('test undefined array, will check all submodels and collections', function(){
                var model = new Model();

                var validateCount  = 0;

                var SubModel = Model.extend({
                    validate: function(){
                        validateCount++;
                        return undefined;
                    }
                });


                var SubCollection = Collection.extend({
                    validate: function(){
                        validateCount++;
                        return undefined;
                    }
                });

                model.generateSchemaAttribute('submodel', {type:'MODEL', generator:SubModel});
                model.generateSchemaAttribute('submodel1', {type:'MODEL', generator:SubModel});
                model.generateSchemaAttribute('subcollection', {type:'COLLECTION', generator:SubCollection});
                model.generateSchemaAttribute('subcollection1', {type:'COLLECTION', generator:SubCollection});

                model.validate();
                chai.assert.equal(validateCount, 4);
            });

            it('test validate submodel with lazy creation for children', function(done){
                var model = new Model();

                var SubModel = Model.extend({
                    configureSchema: function(){
                        this.generateSchemaAttribute('subsubmodel', {type:'MODEL', generator:Model});
                        this.generateSchemaAttribute('subsubcollection', {type:'MODEL', generator:Collection});
                    }, 
                    get: function(attr, options){
                        if (attr === 'subsubmodel') {
                            chai.assert.equal(options.lazyCreation, false);
                        }
                        if (attr === 'subsubcollection') {
                            chai.assert.equal(options.lazyCreation, false);
                        }
                        return Model.prototype.get.apply(this, arguments);
                    }
                });

                model.generateSchemaAttribute('submodel', {type:'MODEL', generator:SubModel});

                model.validate();
                done();
            });

            it('test generated error is correctly configured', function(){
                var model = new Model();

               var SubModel = Model.extend({
                validate: function(){
                    return this.generateError('VERBOSE', 1) || 
                    Model.prototype.validate.apply(this, arguments);
                }
                });
                model.generateSchemaAttribute('submodel', {type:'MODEL', generator:SubModel});
                var error = model.validate();
                expect(error).to.be.an['instanceof'](model.submodel._ModelError);
                error.verbose.should.equal('VERBOSE');
                error.identifier.should.equal(1);
                error.model.should.equal(model.submodel);
            });

        });
    };
});