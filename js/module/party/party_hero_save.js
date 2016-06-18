var UI_Party_Hero_Save = function(o) {
	// if (!o.hasOwnProperty('div')) {
	// 	throw new Error('Нет свойства div');
	// } else {
	// 	if (typeof o.div == 'string') {
	// 		this.$parrent = $(o.div)
	// 	} else {
	// 		this.$parrent = o.div;
	// 	}
	// }
	if (!o.hasOwnProperty('component')) {
		throw new Error('Нет свойства component');
	} else {
		this.component = o.component;
	}
	this.id  = o.id;
	this.title  = app.local(this.id);
	this.value = o.val;
	this.ability = this.initBase[this.id].ability;
	this.marker = this.initBase[this.id].marker;
	
	this.createHTML()
	this.init();
}

UI_Party_Hero_Save.prototype.initBase = {

	'Saving throw str' : {'ability':'str','marker':'diamond'},
	'Saving throw dex' : {'ability':'dex','marker':'diamond'},
	'Saving throw con' : {'ability':'con','marker':'diamond'},
	'Saving throw int' : {'ability':'int','marker':'diamond'},
	'Saving throw wis' : {'ability':'wis','marker':'diamond'},
	'Saving throw cha' : {'ability':'cha','marker':'diamond'},
}

UI_Party_Hero_Save.prototype.init = function() {
	this.updateHTML();
};

UI_Party_Hero_Save.prototype.createHTML = function() {

	this.$div = $('<div />', {class:'party-hero-skill'});
	this.$premarker = $('<div />', {class:'party-hero-skill-premarker'});
	this.$marker = $('<div />', {class:'party-hero-skill-marker party-hero-skill-marker-diamond'});
	this.$value = $('<div />', {class:'party-hero-skill-value'});
	this.$val = $('<input />', {class:'heroInput heroInputSkill'});
	this.$val.keyup(function(self) {
		return function(e) {
			self.value = Number($(this).val());
			self.component.data[self.id] = self.value;
			self.component.updating();
		}
	}(this))
	this.$title = $('<div />', {class:'party-hero-skill-title', text:this.title});

	this.$div
	.append(this.$premarker.append(this.$marker))
	.append(this.$value
		.append(this.$val)
	)
	.append(this.$title)
	
}


UI_Party_Hero_Save.prototype.updateHTML = function(o) {
	this.$val.val(app.getModSimbol(this.value))
}

UI_Party_Hero_Save.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}

UI_Party_Hero_Save.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Party_Hero_Save.prototype.bindEvents = function() {
	this.module.signUpForAnEvent('selectHero', function(self){
		return function(heroId) {
			var prev = self.displayed;
			self.displayed = self.id == heroId ? true : false;
			if (prev != self.displayed) {
				self.updateHTML();
			}
		}
	}(this))
}

