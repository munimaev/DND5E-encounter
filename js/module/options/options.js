var UI_Options = function(o) {
	if (!o.hasOwnProperty('div')) {
		throw new Error('Нет свойства div');
	} else {
		if (typeof o.div == 'string') {
			this.$div = $(o.div)
		} else {
			this.$div = o.div;
		}
	}
	if (!o.hasOwnProperty('app')) {
		throw new Error('Нет свойства app');
	} else {
		this.app = o.app;
	}
	this.id = o.id
	this.displayed = false;
	this.events = {};
	this.options = [];
}

UI_Options.prototype.init = function(o) {
	this.createHtml();
	this.bindEvents();
};

UI_Options.prototype.createHtml = function() {

	this.$optionsList = $('<div />', {class: 'firstColumn'});
	this.$div.append(this.$optionsList);
	var header = $('<h5 />', {
		class: 'block-header',
		text: app.local('Options')
	})
	this.$optionsList.append(header)


	this.$list = $('<div/>', {
		class: 'block-list'
	}).css({top:'70px'})
	this.$optionsList.append(this.$list)


	this.$optionstats = $('<div />', {class: 'firstColumnAfter'});
	this.$div.append(this.$optionstats);

	this.options.push(new UI_Options_Option_Saveload({module:this}));

	this.options.forEach(function(o,i,a){
		this.$optionsList.append(o.$divInList)
		this.$optionstats.append(o.$div)
	}, this)

}

UI_Options.prototype.updateHTML = function(o) {
	if (!o || o.displayed) {
		if (this.displayed) {
			this.$div.removeClass('nondisplay');
		} else {
			this.$div.addClass('nondisplay');
		}
	}
};



UI_Options.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Options.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}


UI_Options.prototype.bindEvents = function() {

	this.app.signUpForAnEvent('selectModule', function(self){
		return function(moduleId) {
			var prev = self.displayed;
			self.displayed = self.id == moduleId ? true : false;
			if (prev != self.displayed) {
				self.updateHTML();
			}
		}
	}(this))

	this.signUpForAnEvent('updatingHero', function(self){
		return function(heroId) {
			self.app.callEvent('updatingHero', heroId)
		}
	}(this))

	this.signUpForAnEvent('optionJSON', function(self){
		return function() {
			self.app.callEvent('optionJSON')
		}
	}(this))

	this.signUpForAnEvent('optionLoad', function(self){
		return function() {
			self.app.callEvent('optionLoad')
		}
	}(this))

}
