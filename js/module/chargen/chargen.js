var UI_Chargen = function(o) {

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

	this.id = o.id;
	this.displayed = false;

	this.$gm = $('<div />',{id:'gm'})
	this.$ga = $('<div />',{id:'ga'})
	this.$gs = $('<div />',{id:'gs'})
	this.$gr = $('<div />',{id:'gr'})
	this.$gc = $('<div />',{id:'gc'})

	// this.$div.append(this.$gm);
	this.$div.append(this.$ga);
	this.$div.append(this.$gs);
	this.$div.append(this.$gr);
	this.$div.append(this.$gc);

	// this.uiChangenMain = new UI_Chargen_main({div:this.$gm, module:this});
	this.uiChargenAbilties = new UI_Chargen_abilities({div:this.$ga, module:this});
	this.uiChargenSteps = new UI_Chargen_steps({div:this.$gs, module:this});
	this.uiChargenRace = new UI_Chargen_race({div:this.$gr, module:this});
	this.uiChargenClass = new UI_Chargen_class({div:this.$gc, module:this});

	// this.uiChangenMain.init();
	this.uiChargenSteps.init();
	this.uiChargenRace.init();
	this.uiChargenClass.init();
	this.uiChargenAbilties.init();

	this.bindEvents();

	// this.uiChangenMain.setRace('Elf');

}


UI_Chargen.prototype.updateHTML = function(o) {
	if (!o || o.displayed) {
		if (this.displayed) {
			this.$div.removeClass('nondisplay');
		} else {
			this.$div.addClass('nondisplay');
		}
	}
};



UI_Chargen.prototype.callEvent = function(name, args) {
	if (this.events.hasOwnProperty(name)) {
		this.events[name].forEach(function(v,i,a){v(args)})
	}
};
UI_Chargen.prototype.events = {};
UI_Chargen.prototype.events.changeRace = [];
UI_Chargen.prototype.events.changeSubrace = [];
UI_Chargen.prototype.events.changeClass = [];
UI_Chargen.prototype.events.changeStep = [];



UI_Chargen.prototype.getCurrentRace = function() {
	return this.uiChargenRace.race;
}
UI_Chargen.prototype.getCurrentSubrace = function() {
	var result = this.uiChargenRace.subrace
	return result;	
}


UI_Chargen.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Chargen.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}


UI_Chargen.prototype.bindEvents= function() {

	this.app.signUpForAnEvent('selectModule', function(self){
		return function(moduleId) {
			var prev = self.displayed;
			self.displayed = self.id == moduleId ? true : false;
			if (prev != self.displayed) {
				self.updateHTML();
			}
		}
	}(this));

}