define([
	'sgc-mongoose-model',
	'chai'
], function (SGCMongooseModel, chai) {
	'use strict';

	return function(){
		chai.should();
		var Model = SGCMongooseModel.Model;
		var Collection = SGCMongooseModel.Collection;

		describe('Helpers', function(){

            it('Added items in collection are MongooseModel', function(){
                var collection = new Collection();
                collection.add('1');
                chai.expect(collection.at(0)).to.be.an['instanceof'](Model);
            });		


            it('Adding two items with same id in collection (merge it)', function(){
                var collection = new Collection();
                collection.add('1');
                collection.add('1');
                collection.length.should.equal(1);

                collection = new Collection();
                collection.add({_id:'1'});
                collection.add({_id:'1'});
                collection.length.should.equal(1);

            });

            it('Get or create with id', function(){
                var collection = new Collection();
                collection.add('1');
                collection.get('2', {getOrCreate:true});
                collection.length.should.equal(2);

                collection.get({_id:'3515'}, {getOrCreate:true});
                collection.length.should.equal(3);


                collection.get({_id:'3515'}, {getOrCreate:true});
                collection.length.should.equal(3);

                collection.get('3515', {getOrCreate:true});
                collection.length.should.equal(3);
            });                 
		});
	};
});
