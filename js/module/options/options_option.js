var UI_Options_Option = function(o) {
	
	if (!o.hasOwnProperty('module')) {
		throw new Error('Нет свойства module');
	} else {
		this.module = o.module;
	}
	this.id = o.id
	this.displayed = false;
	this.events = {};

	this.createHtml();
	this.bindEvents();
}

UI_Options_Option.prototype.init = function(o) {
};

UI_Options_Option.prototype.createHtml = function() {
	this.$divInList = $('<div>',{class:'batle-encounter'})
	this.$divInListName = $('<div>',{class:'batle-encounter-name link ',text:this.title})
	this.$divInList.append(this.$divInListName);

	this.$div = $('<div>',{text:':-)'})

}
UI_Options_Option.prototype.updateHTML = function(o) {
	
	if (!o || o.displayed) {
		if (this.displayed) {
			this.$div.removeClass('nondisplay');
		} else {
			this.$div.addClass('nondisplay');
		}
	}
};



UI_Options_Option.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Options_Option.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}


UI_Options_Option.prototype.bindEvents = function() {


}
