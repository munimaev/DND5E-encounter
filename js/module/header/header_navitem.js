var UI_Header_Navitem = function(o) {
	if (!o.hasOwnProperty('module')) {
		throw new Error('Нет свойства module');
	} else {
		this.module = o.module;
	}
	this.events = {};
	this.moduleId = o.moduleId;
	this.title = o.title;
	this.isSelected = false;

	this.init();
}



UI_Header_Navitem.prototype.init = function() {
	this.createHtml();
	this.bindEvents();
};


UI_Header_Navitem.prototype.createHtml = function() {
	this.$div = $('<div />', {
		class: 'nav-item',
		click: function(self){
			return function() {
				self.module.callEvent('selectModuleInHeader',self.moduleId)
			}
		}(this)
	});

	var $title = $('<div />', {
		class: 'nav-item-title',
		text: this.title
	});
	this.$div.append($title);
}


UI_Header_Navitem.prototype.updateHTML = function(o) {
	if (!o || o.selected) {
		if (this.isSelected) {
			this.$div.addClass('selected');
		} else {
			this.$div.removeClass('selected');
		}
	}
}


UI_Header_Navitem.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Header_Navitem.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}


UI_Header_Navitem.prototype.bindEvents = function() {

	this.module.signUpForAnEvent('selectModule', function(self){
		return function(id) {
			var prev = self.isSelected;
			self.isSelected = id == self.moduleId ? true : false;
			if (prev != self.isSelected) {
				self.updateHTML({selected:true});
			}
		}
	}(this))

}

