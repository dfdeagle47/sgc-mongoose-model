define([
	// 'saga/ajax/SGAjax'
], function (/*SGAjax*/) {
	'use strict';

	return function(/*SagaModel*/){
		return {
			'do': function(action, args){
				// revoir
				// var actionUrl = this._generateUrl() + '/' + action;
				
				// if(args instanceof Array) {
				// 	var argsObj = {};
				// 	if(this.schema.actions[action]){
				// 		if (this.schema.actions[action].args) {
				// 			this.schema.actions[action].args.forEach(function(arg, i){
				// 				argsObj[arg] = args[i];
				// 			});
				// 		}
				// 	}
				// 	args = argsObj;
				// }

				// var deferred = SGAjax.ajax({
				// 	type: 'POST',
				// 	url: actionUrl,
				// 	data: args || {}
				// });

				// var me = this;
				// deferred.done(function(){
				// 	me.trigger('action', args);
				// 	me.trigger('action:'+action, args);
				// });

				// return deferred;
			}
		};
	};
});