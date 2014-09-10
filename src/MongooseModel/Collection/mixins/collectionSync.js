define([
], function (
	) {
	'use strict';
	return function(){
		return {
			
			//deprecated, use json output format from schema... (Voir Yvan)
			// setAsIds: function(){
			// 	this.models.forEach(function(model){
			// 		model._isId = true;
			// 	});
			// },	

			// dummyFetch: function(options) {
			// 	this._prepareFetchOptions(options);
			// 	var url = typeof this.url == "function" ? this.url() : this.url;
			// 	return SGAjax.ajax({
			// 		type: 'GET',
			// 		url: url,
			// 		data: options.data
			// 	});
			// },

			getAttr: function(/*attr*/){
				//revoir
				// var url = this.url instanceof Function ? this.url() : this.url;
				// return SGAjax.ajax({
				// 	type: 'GET',
				// 	url: url + '/' + attr
				// });
			}, 


			JSONFromSchema: function(options){
				options = _.defaults(options||{}, {
					schemaFormat : undefined	
				});
				
				if (!options.schemaFormat) {
					return this.JSONFromSchema(this.mongooseSchema);
				}

				var res = [];
				this.each(function(model){
					var c = options.schemaFormat.getContent();
					res.push(model.JSONFromSchema({schemaFormat:c}));
				});
				return res;
			}
		};
	};
});






