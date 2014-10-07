define([], function () {
	'use strict';

	return function(/*SagaModel*/){
		return {

			getActions: function(){
				if (!this._actions) {
					this._actions = {};
				}
				return this._actions;
			},

			hasAction: function(actionName){
				return actionName in this.getActions();
			},

			getActionDescriptor: function(actionName){
				return this.getActions()[actionName];
			},

			addAction: function(actionName, descriptor){
				this.getActions()[actionName] = descriptor;
			},

			removeAction: function(actionName){
				delete this.getActions()[actionName];
			},

			generateAction: function(actionName, descriptor){
				if (this.hasAction(actionName)) {
					throw new Error('action already defined');
				}

				descriptor = _.defaults(descriptor||{}, {
					method : 'POST'
				});

				this.addAction(actionName, descriptor);
			},

			executeAction: function(actionName, actionArgs, options){
				if (!this.hasAction(actionName)) {
					throw new Error('Unknow action', actionName);
				}

				actionArgs = actionArgs||{};

				var descriptor = this.getActionDescriptor(actionName);
				
				var syncOptions = _.extend(_.clone(descriptor), {data:actionArgs});

				var params = _.extend(syncOptions, options);

				if (!params.url) {
					params.url = this.generateUrlForAction(actionName);
				}

				return this.sync(undefined, this, params)				;
			},

			generateUrlForAction: function(actionName){
				var baseUrl = _.result(this, 'url');
				return baseUrl+='/'+_.string.underscored(actionName);
			}

		};
	};
});