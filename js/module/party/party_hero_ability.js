var UI_Party_Hero_Ability = function(o) {
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
	this.ability = o.data.ability;
	this.title = o.data.title;
	this.value = o.data.value;
	
	this.createHTML()
	this.init();;
}

UI_Party_Hero_Ability.prototype.init = function() {
	this.modTxt = app.getModStr(this.value);
	this.updateHTML();
};

UI_Party_Hero_Ability.prototype.createHTML = function() {

	this.$div = $('<div />', {class:'party-hero-ability'});

	var abilityMod = $('<div />', {class:'party-hero-ability-mod'});
	var abilityModWrapper = $('<div />', {class:'party-hero-ability-mod-wrapper'});
	var abilityModSquaer = $('<div />', {class:'party-hero-ability-mod-squaer'});
	this.$mod = $('<div />', {class:'party-hero-ability-mod-value'});

	var abilityValue = $('<div />', {class:'party-hero-ability-value'});
	var abilityValueWrapper = $('<div />', {class:'party-hero-ability-value-wrapper'});
	var abilityValueSquaer = $('<div />', {class:'party-hero-ability-value-squaer'});
	var abilityValueRound = $('<div />', {class:'party-hero-ability-value-round'});
	var abilityValueValue = $('<div />', {class:'party-hero-ability-value-value'});
	this.$value = $('<input />', {class:'heroInput ability'})
	this.$value.keyup(function(self) {
		return function(e) {
			self.value = Number($(this).val());
			self.modTxt = app.getModStr(self.value);
			self.$mod.html(self.modTxt);
			self.component.data[self.ability] = self.value;
			self.component.updating();
		}
	}(this))
	this.$title = $('<div />', {class:'party-hero-ability-value-title'});

	this.$div
	.append(abilityMod
		.append(abilityModWrapper
			.append(this.$mod)
		)
	)
	.append(abilityValue
		.append(abilityValueWrapper
			.append(abilityValueSquaer
				.append(abilityValueRound
					.append(abilityValueValue
						.append(this.$value)
					)
					.append(this.$title)
				)
			)
		)
	)
	
}


UI_Party_Hero_Ability.prototype.updateHTML = function(o) {
	this.$mod.html(this.modTxt);
	this.$value.val(this.value);
	this.$title.html(this.title);
}

UI_Party_Hero_Ability.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}

UI_Party_Hero_Ability.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Party_Hero_Ability.prototype.bindEvents = function() {
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

