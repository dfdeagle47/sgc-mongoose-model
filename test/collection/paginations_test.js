define([
    'sgc-mongoose-model', 
    'chai', 
    'sinonIE'], function(SGCModel, chai)  {
    'use strict';
    return function() {


        var Collection = SGCModel.Collection;
        var Model = SGCModel.Collection;

        chai.should();


        describe('Testing Sub collection Paginate', function() {
            var server;
             
            beforeEach(function() {
                server = sinon.fakeServer.create();
                server.autoRespond = true;
            });

            afterEach(function () {
                server.restore();
            });



            it('Constructor paginate correct when instantiate collection ', function(){
                var collection = new Collection();
                chai.assert.equal(collection._paginate.currentPage, 0);
                chai.assert.equal(collection._paginate.perPage, 0);
                chai.assert.equal(collection._paginate.maxPagesReached, false);
            });



            it('Set pagination and fetch simple case', function(done){

                server.respondWith('GET', '/api/comments?offset=0&limit=3',
                           [200,{},'["1", "2", "3"]']);   

                server.respondWith('GET', '/api/comments?offset=3&limit=3',
                           [200,{},'["4", "5", "6"]']);   


                server.respondWith('GET', '/api/comments?offset=6&limit=3',
                           [200,{},'["7", "8"]']);   

                var XCollection = Collection.extend();

                var collection = new XCollection(undefined, {url:'/api/comments'});

                collection.setPerPage(3);

                collection.fetch({paginate:true})
                .done(function(){
                    chai.assert.equal(collection.length, 3);
                    chai.assert.equal(collection.at(0).id, '1');
                    chai.assert.equal(collection.at(1).id, '2');
                    chai.assert.equal(collection.at(2).id, '3');
                    chai.assert.equal(collection.isMaxReached(), false);

                    collection.fetch({paginate:true}).done(function(){
                        chai.assert.equal(collection.isMaxReached(), false);
                        chai.assert.equal(collection.length, 6);
                        chai.assert.equal(collection.at(3).id, '4');
                        chai.assert.equal(collection.at(4).id, '5');
                        chai.assert.equal(collection.at(5).id, '6');  

                        collection.fetch({paginate:true}).done(function(){
                            chai.assert.equal(collection.length, 8);
                            chai.assert.equal(collection.at(6).id, '7');
                            chai.assert.equal(collection.at(7).id, '8');  
                            chai.assert.equal(collection.isMaxReached(), true);
                            done();
                        })
                        .fail(function(){
                            done('FAIL');
                        });
                    })
                    .fail(function(){
                        done('FAIL');
                    });
                })
                .fail(function(){
                    done('FAIL');
                });
            });


            it('Fetch empty list', function(done){

                server.respondWith('GET', '/api/comments?offset=0&limit=3',
                           [200,{},'[]']);   

                var XCollection = Collection.extend();

                var collection = new XCollection(undefined, {url:'/api/comments'});

                collection.setPerPage(3);

                collection.fetch({paginate:true})
                .done(function(){
                    chai.assert.equal(collection.isMaxReached(), true);
                    done();
                })
                .fail(function(){
                    done('FAIL');
                });
            });

            it('Fetch little list', function(done){
                server.respondWith('GET', '/api/comments?offset=0&limit=3',
                           [200,{},'["1"]']);   

                var XCollection = Collection.extend();

                var collection = new XCollection(undefined, {url:'/api/comments'});

                collection.setPerPage(3);

                collection.fetch({paginate:true})
                .done(function(){
                    chai.assert.equal(collection.isMaxReached(), true);
                    chai.assert.equal(collection.length, 1);
                    done();
                })
                .fail(function(){
                    done('FAIL');
                });
            });

            it('Fetch repaginate a paginate list', function(done){
                server.respondWith('GET', '/api/comments?offset=0&limit=3',
                           [200,{},'["1"]']);   

                server.respondWith('GET', '/api/comments?offset=0&limit=4',
                           [200,{},'["2"]']);   

                var XCollection = Collection.extend();

                var collection = new XCollection(undefined, {url:'/api/comments'});

                collection.setPerPage(3);

                collection.fetch({paginate:true})
                .done(function(){
                    chai.assert.equal(collection.isMaxReached(), true);
                    chai.assert.equal(collection.length, 1);
                    chai.assert.equal(collection.at(0).id, '1');

                    collection.resetPaginate();
                    collection.setPerPage(4);
                    collection.fetch({paginate:true}).done(function(){
                        
                        chai.assert.equal(collection.isMaxReached(), true);
                        chai.assert.equal(collection.length, 1);
                        chai.assert.equal(collection.at(0).id, '2');
                        done();
                    });
                })
                .fail(function(){
                    done('FAIL');
                });
            });

        });


        describe('Testing Sub collection Filtering and sorting', function() {

            var server;
             
            beforeEach(function() {
                server = sinon.fakeServer.create();
                server.autoRespond = true;
            });

            afterEach(function () {
                server.restore();
            });

        	it('Constructor sort correct when new instantiate collection ', function(){
        		var collection = new Collection();
				chai.assert.equal(_.keys(collection._sorts).length, 0);
        	});

        	it('Constructor filters correct when new instantiate collection ', function(){
        		var collection = new Collection();
				chai.assert.equal(_.keys(collection._filters).length, 0);
        	});

        	it('Collection paginate fetch', function(done){
                server.respondWith('GET', '/api/comments',
                           [200,{},'["1", "2", "3", "4", "5", "6", "7"]']);   

                var collection = new Collection({}, {url:'/api/comments'});

                collection.fetch().done(function(){
                    done();
                })
                .fail(function(){
                    done('Error with api');
                });
            });

            it('Collection adding and retreive new filters', function(){
            
                var collection = new Collection({}, {url:'/api/objects'});

                collection.addSGFilter('firstname', 'Yvan');
                collection.addSGFilter('lastname', 'Yvan');

                chai.assert.equal(collection.getSGFilters().firstname, 'Yvan');
                chai.assert.equal(collection.getSGFilters().lastname, 'Yvan');
            });


            it('Collection adding and removing new filters', function(){
                var collection = new Collection({});
                collection.addSGFilter('firstname', 'Yvan');
                collection.addSGFilter('lastname', 'Yvan');
                collection.removeSGFilter('firstname');
                chai.assert.equal(collection.getSGFilters().firstname, undefined);
                chai.assert.equal(collection.getSGFilters().lastname, 'Yvan');
            });

            it('Collection removing unexisting filters', function(){
                var collection = new Collection({});
                collection.addSGFilter('firstname', 'Yvan');
                collection.removeSGFilter('XYZ');
                chai.assert.equal(collection.getSGFilters().firstname, 'Yvan');
            });

            it('Collection adding and removing new filters with silent options false', function(done){
                var collection = new Collection({});
                
                collection.on('add:filter', function(filterName){
                    chai.assert.equal(filterName, 'firstname');
                });


                collection.on('remove:filter', function(filterName){
                    chai.assert.equal(filterName, 'firstname');  
                });

                collection.addSGFilter('firstname', 'Yvan', {silent:false});
                collection.removeSGFilter('XYZ');
                collection.removeSGFilter('firstname');
                done();
            });

            it('Collection adding and removing new filters with silent options true', function(done){
                var collection = new Collection({});
                
                collection.on('add:filter', function(){
                    done('New silent object');
                });


                collection.on('remove:filter', function(){
                    done('New silent object');
                });

                collection.addSGFilter('firstname', 'Yvan', {silent:true});
                collection.removeSGFilter('firstname', {silent:true});
                collection.removeSGFilter('XYZ', {silent:true});
                done();
            });


            it('Test "has filters" methdos (with and without filters)', function(){
                var collection = new Collection({});
                
                chai.assert.equal(collection.hasFilters(), false);
                collection.addSGFilter('firstname', 'Yvan');
                chai.assert.equal(collection.hasFilters(), true);
                collection.removeSGFilter('firstname');
                chai.assert.equal(collection.hasFilters(), false);
                collection.removeSGFilter('XYZ');
                chai.assert.equal(collection.hasFilters(), false);
            });

            it('Test filter data for query ', function(){
                var collection = new Collection({});

                collection.appendFiltersData(undefined);

                var queryData = {};
                collection.appendFiltersData(queryData);
                chai.assert.equal(_.keys(queryData.data).length, 0);

                collection.addSGFilter('firstname', 'Yvan');
                collection.appendFiltersData(queryData = {});
                chai.assert.equal(_.keys(queryData.data).length, 1);
                chai.assert.equal(queryData.data.firstname, 'Yvan');

                collection.removeSGFilter('firstname');
                collection.appendFiltersData(queryData = {});
                chai.assert.equal(_.keys(queryData.data).length, 0);

            });


            it('append incorrect filters string', function(){
                var collection = new Collection({});
                var key = '/:xtca&é';
                var value = '-!è"';
                collection.addSGFilter(key, value);

                var query = collection.appendFiltersData({});
                chai.assert.equal(encodeURIComponent(key) in query.data, true);
                chai.assert.equal(query.data[encodeURIComponent(key)], encodeURIComponent(value));
            });



            it('Test add and retreive sort ', function(){
                var collection = new Collection({});
                collection.addSGSort('name', 'asc');
                chai.assert.equal(collection.hasSorts(), true);
                chai.assert.equal(collection.getSGSort().name, 'asc');
            });

            it('Test retreive unexisting sort ', function(){
                var collection = new Collection({});
                chai.assert.equal(collection.hasSorts(), false);
                chai.assert.equal(collection.getSGSort().name, undefined);
            });

            it('Test add more than limit sort ', function(){
                var collection = new Collection({});
                collection.addSGSort('sort1', 'asc');
                collection.addSGSort('sort2', 'asc');
                chai.assert.equal(_.keys(collection.getSGSort()).length, 1);
            });

            it('Test remove unexisting sort ', function(){
                var collection = new Collection({});
                collection.removeSGSort('sort1');
                chai.assert.equal(collection.hasSorts(), false);
            });

            it('Test add incorrect sort ', function(){
                var collection = new Collection({});
                collection.addSGSort('sort1');
                chai.assert.equal(collection.getSGSort().sort1, 'asc');
            });

            it('Test sort silent options to true ', function(done){
                var collection = new Collection({});

                collection.on('add:sort', function(){
                    done('No silent ok');
                });
                collection.on('remove:sort', function(){
                    done('No silent ok');
                });

                collection.addSGSort('sort1', 'asc', {silent:true});
                collection.removeSGSort('sort1', {silent:true});

                done();
            });

            it('Test sort silent options to false ', function(done){
                var collection = new Collection({});

                collection.on('add:sort', function(sortName){
                    chai.assert.equal(sortName, 'sort1');
                    
                    chai.assert.equal(collection.getSGSort()[sortName], 'asc');
                });
                collection.on('remove:sort', function(sortName){
                    chai.assert.equal(sortName, 'sort1');
                    chai.assert.equal(collection.getSGSort()[sortName], undefined);
                });
                
                collection.addSGSort('sort1', 'asc');
                collection.removeSGSort('sort1');
                collection.removeSGSort('sort2');
                
                done();
            });

            it('append unexisting sort data to query or bad formatted input', function(){
                var collection = new Collection({});

                chai.assert.equal(_.keys(collection.appendSortsData().data).length, 0);
                chai.assert.equal(_.keys(collection.appendSortsData({}).data).length, 0);
            });

            it('append incorrect sort string', function(){
                var collection = new Collection({});
                var key = '/:xtca&é';
                var value = '-")(!è';
                collection.addSGSort(key, value);

                chai.assert.equal(collection.appendSortsData({}).data.sortBy, [encodeURIComponent(key)]);
                chai.assert.equal(collection.appendSortsData({}).data.sortHow, [encodeURIComponent(value)]);
            });


            it('Append sort with two added sorts', function(){
                var collection = new Collection({});

                collection.addSGSort('sort0', 'desc');
                collection.addSGSort('sort1', 'asc');

                chai.assert.equal(_.keys(collection.appendSortsData().data).length, 2);
                chai.assert.equal(collection.appendSortsData().data.sortBy, 'sort1');
                chai.assert.equal(collection.appendSortsData().data.sortHow, 'asc');
            });


            it('Test fetch with no filters but filters options to true', function(done){
                server.respondWith('GET', '/api/comments',
                           [200,{},'["1", "2", "3", "4", "5", "6", "7"]']);   

                var collection = new Collection({}, {url:'/api/comments'});

                collection.fetch({
                    filters:true
                })
                .done(function(){
                    done();
                })
                .fail(function(){
                    done('FAIL');
                });
            });

            it('Test fetch with one filters', function(done){
                server.respondWith('GET', '/api/comments?filterName=Yvan',
                           [200,{},'["1", "2", "3", "4", "5", "6", "7"]']);   

                var collection = new Collection({}, {url:'/api/comments'});

                collection.addSGFilter('filterName', 'Yvan');

                collection.fetch()
                .done(function(){
                    done();
                })
                .fail(function(){
                    done('FAIL');
                });
            });

            it('Test fetch with two filters', function(done){
                server.respondWith('GET', '/api/comments?firstname=123&lastname=XYZ',
                           [200,{},'["1", "2", "3", "4", "5", "6", "7"]']);   

                var XCollection = Model.extend();

                var collection = new XCollection({}, {url:'/api/comments'});

                collection.addSGFilter('firstname', '123');
                collection.addSGFilter('lastname', 'XYZ');

                collection.fetch()
                .done(function(){
                    done();
                })
                .fail(function(){
                    done('FAIL');
                });
            });
     

            it('Test fetch with no filter options and with one setted filter', function(done){
                server.respondWith('GET', '/api/comments',
                           [200,{},'["1", "2", "3", "4", "5", "6", "7"]']);   

                var XCollection = Model.extend();


                var collection = new XCollection({}, {url:'/api/comments'});

                collection.addSGFilter('lastname', 'XYZ');

                collection.fetch({
                    filters:false
                })
                .done(function(){
                    done();
                })
                .fail(function(){
                    done('FAIL');
                });
            });


            it('Test fetch with sort', function(done){
                server.respondWith('GET', '/api/comments?sortBy=name&sortHow=asc',
                           [200,{},'["1", "2", "3", "4", "5", "6", "7"]']);   

                var XCollection = Model.extend();

                var collection = new XCollection({}, {url:'/api/comments'});

                collection.addSGSort('name');

                collection.fetch()
                .done(function(){
                    done();
                })
                .fail(function(){
                    done('FAIL');
                });
            });
     
            it('Test fetch with sort but options sort false', function(done){
                server.respondWith('GET', '/api/comments',
                           [200,{},'["1", "2", "3", "4", "5", "6", "7"]']);   

                var XCollection = Collection.extend({});

                var collection = new XCollection({}, {url:'/api/comments'});

                collection.addSGSort('name');

                collection.fetch({
                    sorts:false
                })
                .done(function(){
                    done();
                })
                .fail(function(){
                    done('FAIL');
                });
            });
     
            it('Test fetch with sort but options sort true and but setted sort', function(done){
                server.respondWith('GET', '/api/comments',
                           [200,{},'["1", "2", "3", "4", "5", "6", "7"]']);   

                var XCollection = Collection.extend({});

                var collection = new XCollection({}, {url:'/api/comments'});

                collection.fetch({
                    sorts:true
                })
                .done(function(){
                    done();
                })
                .fail(function(){
                    done('FAIL');
                });
            });
        });
    };
}); 