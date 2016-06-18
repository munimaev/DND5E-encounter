var UI_Party_Hero_Skill = function(o) {
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

UI_Party_Hero_Skill.prototype.initBase = {

	// 'Saving throw' : {'ability':'wis','marker':'diamond'},
	'Atletics' : {'ability':'str','marker':'circle'},

	// 'Saving throw' : {'ability':'dex','marker':'diamond'},
	'Acrobatics' : {'ability':'dex','marker':'circle'},
	'Sleight of hand' : {'ability':'dex','marker':'circle'},
	'Stealth' : {'ability':'dex','marker':'circle'},

	// 'Saving throw' : {'ability':'con','marker':'diamond'},

	// 'Saving throw' : {'ability':'int','marker':'diamond'},
	'Arcana' : {'ability':'int','marker':'circle'},
	'History' : {'ability':'int','marker':'circle'},
	'Investigation' : {'ability':'int','marker':'circle'},
	'Nature' : {'ability':'int','marker':'circle'},
	'Religion' : {'ability':'int','marker':'circle'},

	// 'Saving throw' : {'ability':'wis','marker':'diamond'},
	'Animal handing' : {'ability':'wis','marker':'circle'},
	'Insight' : {'ability':'wis','marker':'circle'},
	'Medicine' : {'ability':'wis','marker':'circle'},
	'Perception' : {'ability':'wis','marker':'circle'},
	'Survival' : {'ability':'wis','marker':'circle'},

	// 'Saving throw' : {'ability':'cha','marker':'diamond'},
	'Deception' : {'ability':'cha','marker':'circle'},
	'Intimidate' : {'ability':'cha','marker':'circle'},
	'Perfomance' : {'ability':'cha','marker':'circle'},
	'Persuasion' : {'ability':'cha','marker':'circle'},
}

UI_Party_Hero_Skill.prototype.init = function() {
	this.updateHTML();
};

UI_Party_Hero_Skill.prototype.createHTML = function() {

	this.$div = $('<div />', {class:'party-hero-skill'});
	this.$marker = $('<div />', {class:'party-hero-skill-marker party-hero-skill-marker-circle'});
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
	.append(this.$marker)
	.append(this.$value
		.append(this.$val)
	)
	.append(this.$title)
	
}


UI_Party_Hero_Skill.prototype.updateHTML = function(o) {
	this.$val.val(app.getModSimbol(this.value))
}

UI_Party_Hero_Skill.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}

UI_Party_Hero_Skill.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Party_Hero_Skill.prototype.bindEvents = function() {
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

