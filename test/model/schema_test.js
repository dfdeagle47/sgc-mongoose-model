define([
	'sgc-mongoose-model', 
	'chai'
], function(RemoteModel, chai)  {
    'use strict';
    return function() {

        // var expect = chai.expect;
        var Model = RemoteModel.Model;
        var Collection = RemoteModel.Collection;

        describe('Testing remote Schema ', function() {
            it('Testing Add  and Remove schemas attributes', function () {
            	var model = new Model();

            	model._addSchemaAttribute('anAttribute', {});
            	chai.assert.equal(model._hasSchemaAttribute('anAttribute'), true);

            	model._removeSchemaAttribute('anAttribute');
            	chai.assert.equal(model._hasSchemaAttribute('anAttribute'), false);
            });

            it('Testing has attributes methods (with existing and non existing attributes)', function () {
            	var model = new Model();
            	model._addSchemaAttribute('exisitingAttribute', {});
            	chai.assert.equal(model._hasSchemaAttribute('exisitingAttribute'), true);
            	chai.assert.equal(model._hasSchemaAttribute('unExisitingAttribute'), false);
            });


            it('Test default primitive generator ', function () {
                var model = new Model();
                chai.assert.equal(model.generateDefaultPrimitiveForAttribute({'default':5}), 5);
                chai.assert.equal(model.generateDefaultPrimitiveForAttribute(), undefined);
            });            


            it('Test default sub model generator ', function () {
                var model = new (Model.extend({
                }, {
                    modelName:'User'
                }))();
                var defaultAttr = {'attr1' :1};
                var defaultOptions = {'attr2' :2};
                var SubModel = Model.extend({
                    constructor: function(attr, options){
                        chai.assert.equal(defaultAttr.attr1, 1);
                        chai.assert.equal(options.attr2, 2);
                        chai.assert.equal(options.parent, model);
                        chai.assert.equal(options.path, 'submodel');
                        return Model.prototype.constructor.apply(this, arguments);
                    }
                });
                var subModel = model.generateDefaultModelForAttribute(
                    {
                        'generator':SubModel, 
                        'attribute':'submodel',
                        'defaultAttrs': defaultAttr,
                        'defaultOptions':defaultOptions
                    });
                chai.expect(subModel).to.be.an['instanceof'](SubModel);
                chai.assert.equal(subModel._parent, model);
            });            

            it('Test default sub collection generator ', function () {

                var model = new (Model.extend({
                }, {
                    modelName:'User'
                }))();



                var SubCollection = Collection.extend({

                    constructor: function(models, options){
                        chai.assert.equal(models.length, 1);
                        chai.assert.equal(options.attrX, 123);
                        chai.assert.equal(options.parent, model);
                        chai.assert.equal(options.path, 'subCollection');
                        return Collection.prototype.constructor.apply(this, arguments);
                    }
                });

                var collection = model.generateDefaultCollectionForAttribute(
                    {
                        'generator':SubCollection,
                        defaultModels: ['138541'],
                        defaultOptions:{
                            'attrX':123
                        },
                        attribute:'subCollection'
                    });
                chai.expect(collection).to.be.an['instanceof'](SubCollection);

                chai.assert.equal(collection._parent, model);   
            });

            it('Test default generator for primitive', function () {
                var model = new (Model.extend({
                }, {
                    modelName:'User'
                }))();
                var result = model.tryGenerateDefaultValue({type:'PRIMITIVE', 'default':'abcdefg'});
                chai.assert.equal(result, 'abcdefg');   
            });

            it('Test default generator for model', function () {
                var model = new (Model.extend({
                }, {
                    modelName:'User'
                }))();

                var SubModel = Model.extend();

                var result = model.tryGenerateDefaultValue({type:'MODEL', 'generator':SubModel});
                chai.expect(result).to.be.an['instanceof'](SubModel);
            });

            it('Test default generator for collection', function () {
                var model = new (Model.extend({
                }, {
                    modelName:'User'
                }))();

                var result = model.tryGenerateDefaultValue({type:'COLLECTION', 'generator':Collection});
                chai.expect(result).to.be.an['instanceof'](Collection);
            });


            it('Test add twice same schema attribute', function () {
                var model = new Model();

                var SubModel1 = Model.extend();
                var SubModel2 = Model.extend();

                model.generateSchemaAttribute('anAttribute', {type:'MODEL', generator:SubModel1});
                model.generateSchemaAttribute('anAttribute', {type:'MODEL', generator:SubModel2});

                chai.assert.equal(model.anAttribute instanceof SubModel2, true);

            });


            // it('Test set schema for already defined attribute', function () {
            //     var model = new Model();

            //     var SubModel1 = Model.extend();
            //     var SubModel2 = Model.extend();

            //     model.generateSchemaAttribute('anAttribute', {type:'MODEL', generator:SubModel1});

            //     model.anAttribute;

            //     chai.expect(function(){
            //         model.generateSchemaAttribute('anAttribute', {type:'MODEL', generator:SubModel2});    
            //     }).to['throw'](Error);

            // });


           it('Test setter lazy creation params  ', function () {
                var model = new Model();
                
                var SubModel = Model.extend();

                model.generateSchemaAttribute('submodel', {type:'MODEL', generator:SubModel});
                chai.assert.equal(model.get('submodel', {lazyCreation:false}), undefined);

                var lazyCreation = model.get('submodel', {lazyCreation:true});

                var lazyCreation1 = model.get('submodel', {lazyCreation:true});

                chai.assert.equal(lazyCreation, lazyCreation1);

                chai.expect(lazyCreation).to.be.an['instanceof'](SubModel);

            });



           it('Test events triggered when set attributes  ', function (done) {
                var model = new Model();
                
                
                model.on('change:name', function(){
                    chai.assert(true, true);
                });
                model.on('change:firstName', function(){
                    chai.assert(true, true);
                });


                model.generateSchemaAttribute('name', {type:'PRIMITIVE'});
                model.set({
                    name:'Yvan',
                    firstName:'GHELLINCK'
                });
                done();
            });     
        });
    };
});

