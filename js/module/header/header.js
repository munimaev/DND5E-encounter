var UI_Header = function(o) {
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
	this.events = {};
	this.navItemsInitData = [{
		title: app.local('Party'),
		moduleId : 'party'
	},{
		title: app.local('Encounter list'),
		moduleId : 'battle'
	},{
		title: app.local('Options'),
		moduleId : 'options'
	}];
	this.navItems = [];
}



UI_Header.prototype.init = function() {
	this.createHtml();
	this.bindEvents();
};


UI_Header.prototype.createHtml = function() {
	this.navItemsInitData.forEach(function(o,i,a){
		var navItem = new UI_Header_Navitem({
			module: this,
			title : o.title,
			moduleId : o.moduleId
		});
		this.navItems.push(navItem);
		this.$div.append(navItem.$div);
	},this)
}
UI_Header.prototype.createHtmlNavigationItem = function(o) {
	this[o.linkName] = $('<div />', {
		class: 'nav-item',
		click: function(self, moduleId){
			return function() {
				self.app.callEvent('selectModule',moduleId)
			}
		}(this, o.click)
	});

	var $title = $('<div />', {
		class: 'nav-item-title',
		text: o.title
	});
	this[o.linkName].append($title);
	return this[o.linkName];
}



UI_Header.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Header.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}


UI_Header.prototype.bindEvents = function() {

	this.signUpForAnEvent('selectModuleInHeader', function(self){
		return function(id) {
			self.app.callEvent('selectModule',id)
		}
	}(this))
	this.app.signUpForAnEvent('selectModule', function(self){
		return function(id) {
			self.callEvent('selectModule',id)
		}
	}(this))


}

