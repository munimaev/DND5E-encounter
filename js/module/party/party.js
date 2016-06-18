var UI_Party = function(o) {
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
	this.party = [];
	this.partyIndex = {};
	this.events = {};
	this.id = o.id
	this.displayed = false;
	this.init();
}

UI_Party.prototype.createHtml = function() {

	this.$heroesList = $('<div />', {class: 'firstColumn'});
	this.$div.append(this.$heroesList);
	var header = $('<h5 />', {
		class: 'block-header',
		text: app.local('Party')
	})
	this.$heroesList.append(header)


	this.$buttons = $('<div />',{class:'block-padding'})
	this.$heroesList.append(this.$buttons);
	

	this.$buttonNewhero = $('<span />', {
		class: 'inline-button monster-subHeaderButton',
		text: app.local('New'),
		click: function(self) {
			return function() {
				self.callEvent('heroNew');
			}
		}(this)
	});
	this.$buttons.append(this.$buttonNewhero);


	this.$buttonLoadhero = $('<span />', {
		class: 'inline-button monster-subHeaderButton',
		text: app.local('Load'),
		click: function(self) {
			return function() {
				self.callEvent('loadNew');
			}
		}(this)
	});
	this.$buttons.append(this.$buttonLoadhero);



	this.$list = $('<div/>', {
		class: 'block-list'
	}).css({top:'70px'})
	this.$heroesList.append(this.$list)


	this.$heroeStats = $('<div />', {class: 'firstColumnAfter'});
	this.$div.append(this.$heroeStats);

	// this.$monsters = $('<div />', {class: 'secondColumn'});
	// this.$div.append(this.$monsters);

}
UI_Party.prototype.updateHTML = function(o) {
	if (!o || o.displayed) {
		if (this.displayed) {
			this.$div.removeClass('nondisplay');
		} else {
			this.$div.addClass('nondisplay');
		}
	}

};
UI_Party.prototype.init = function(o) {
	this.createHtml();
	this.genParty();
	this.bindEvents();
};

UI_Party.prototype.genParty = function(arg) {
	var partyData = this.getParrtyData();
	var len = partyData.length;
	for (var i = 0; i < len; i++) {
		var hero = new UI_Party_Hero({data:partyData[i], statdiv: this.$heroeStats, module:this});
		this.party.push(hero);
		this.partyIndex[partyData[i].id] = hero;
		this.$list.append(hero.$divInList);
	}
};



UI_Party.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Party.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}


UI_Party.prototype.bindEvents = function() {

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

	this.signUpForAnEvent('heroNew', function(self){
		return function() {
			var data = self.getTemplateJSON();
			data.id = new Date().getTime();
			var hero = new UI_Party_Hero({data:data, statdiv: self.$heroeStats, module:self});
			self.party.push(hero);
			self.partyIndex[hero.id] = hero;
			self.$list.append(hero.$divInList);
			self.app.callEvent('heroNew',hero)
		}
	}(this))

	this.signUpForAnEvent('heroDelete', function(self){
		return function(id) {
			for (var i = self.party.length - 1; i >= 0; i--) {
				if(self.party[i].id == id) {
					self.party[i].$divInList.detach();
					self.party[i].$divStats.detach();
					self.party.splice(i,i)
					break;
				}
			};
			delete self.partyIndex[id];
			self.app.callEvent('heroDelete', id);

		}
	}(this))


	this.signUpForAnEvent('loadNew', function(self){
		return function() {
			var result = prompt(app.local('Load') + ' JSON', '');
			var data = null;
			try {
				data = JSON.parse(result); 
			}			
			catch (e) {
				alert(app.local('Error in JSON'));
				data = null;
			}
			if (data) {
				data.id = new Date().getTime();
				var hero = new UI_Party_Hero({data:data, statdiv: self.$heroeStats, module:self});
				self.party.push(hero);
				self.partyIndex[hero.id] = hero;
				self.$list.append(hero.$divInList);
				self.app.callEvent('heroNew',hero)
			}

		}
	}(this))


	this.signUpForAnEvent('heroJSON', function(self){
		return function(json) {
			self.app.callEvent('popupJSON',json)

		}
	}(this))

	this.app.signUpForAnEvent('battleHP', function(self){
		return function(data) {
			self.callEvent('battleHP',data);
		}
	}(this))


}

UI_Party.prototype.getHeroStateForMonsterView = function(name) {
	return this.partyIndex[name].data;
}


UI_Party.prototype.getParrtyData = function(o) {
	return [
		{
			id : 'Барик Теоденович',
			name : 'Барик Теоденович',
			type : '',
			race : 'Человек', // такое свойство есть только  у героев
			class : 'Воин', // такое свойство есть только  у героев
			level : '2', // такое свойство есть только  у героев
			exp : 123,
			aligment : 'Lawful neutral',
			ac : 17,
			acType : '',
			hp : 12,
			hpCurrent : 8,
			hpFormula : '8+4',
			hitDice : 10,
			hitDiceTotal : 2,
			hitDiceCurrent : 1,

			SpellcastingAbility : null,
			SpellSaveDC : null,
			SpellAttackBonus : 0,

			attacks : [{
				weapon: 'Short sword',
				type: 'throw',
				range: '5',
				bonus: '+4',
				damage: [1,10,4],
			},{
				weapon: 'Crossbow',
				type: 'Ucol',
				range: '60/120',
				bonus: '+4',
				damage: [1,10,4],
			}],

			'deathSucsesses' : 1,
			'deathFailures' : 2,

			speed : 30,
			str : 16,
			'Saving throw str' : 4,
			dex : 9,
			'Saving throw dex' : 4,
			con : 15,
			'Saving throw con' : 4,
			int : 11,
			'Saving throw int' : 4,
			wis : 13,
			'Saving throw wis' : 4,
			cha : 14,
			'Saving throw cha' : 4,
			saveThrows : '',
			skills : '',
				Acrobatics : -1,
				'Animal handing' : 3,
				Arcana : 0,
				Atletics : 4,
				Deception : 1,
				History : 0,
				Insight : 3,
				Intimidate : 3,
				Investigation : 0,
				Medicine : 5,
				Nature : 0,
				Perception : 3,
				Perfomance : 1,
				Persuasion : 1,
				Religion : 2,
				'Sleight of hand' : -1,
				Stealth : -1,
				Survival : 3,

				initiative : 3,
			damageResistances : '',
			damageImmunities : '',
			conditionImmunities : '',
			senses : '',
			languages : '',
			challenge : '',
			xp : '',
			description : '',
			actions : '',
			legendaryActions : '',
			additionalSetting : '',
		},{
			id : 'Мордур',
			name : 'Мордур',
			type : '',
			race : 'Дроу', // такое свойство есть только  у героев
			class : 'Вор', // такое свойство есть только  у героев
			level : '1', // такое свойство есть только  у героев
			exp : 456,
			aligment : 'Chatic Good',
			ac : 15,
			acType : '',
			hp : 8,
			hpCurrent : 8,
			hpFormula : '8+0',
			hitDice : 8,
			hitDiceTotal : 1,
			hitDiceCurrent : 1,

			SpellcastingAbility : 'DEX',
			SpellSaveDC : 14,
			SpellAttackBonus : 6,

			attacks : [{
				weapon: 'Short sword',
				type: 'throw',
				range: '5',
				bonus: '+4',
				damage: [1,10,4],
			},{
				weapon: 'Crossbow',
				type: 'Ucol',
				range: '60/120',
				bonus: '+4',
				damage: [1,10,4],
			}],

			'deathSucsesses' : 1,
			'deathFailures' : 2,

			speed : 25,
			str : 8,
			'Saving throw str' : 4,
			dex : 18,
			'Saving throw dex' : 4,
			con : 10,
			'Saving throw con' : 4,
			int : 14,
			'Saving throw int' : 4,
			wis : 14,
			'Saving throw wis' : 4,
			cha : 13,
			'Saving throw cha' : 4,
			saveThrows : '',
			skills : '',
				Acrobatics : -1,
				'Animal handing' : 3,
				Arcana : 0,
				Atletics : 4,
				Deception : 1,
				History : 0,
				Insight : 3,
				Intimidate : 3,
				Investigation : 0,
				Medicine : 5,
				Nature : 0,
				Perception : 3,
				Perfomance : 1,
				Persuasion : 1,
				Religion : 2,
				'Sleight of hand' : -1,
				Stealth : -1,
				Survival : 3,

				initiative : 3,
			damageResistances : '',
			damageImmunities : '',
			conditionImmunities : '',
			senses : '',
			languages : '',
			challenge : '',
			xp : '',
			description : '',
			actions : '',
			legendaryActions : '',
			additionalSetting : '',
		},{
			id : 'Нумерик',
			name : 'Нумерик',
			type : '',
			race : 'High elf', // такое свойство есть только  у героев
			class : 'Волшебник', // такое свойство есть только  у героев
			level : '1', // такое свойство есть только  у героев
			exp : 798,
			aligment : 'Chatic good',
			ac : 12,
			acType : '',
			hp : 8,
			hpCurrent : 4,
			hpFormula : '6+2',
			hitDice : 6,
			hitDiceTotal : 1,
			hitDiceCurrent : 1,

			SpellcastingAbility : 'WIS',
			SpellSaveDC : 10,
			SpellAttackBonus : -1,

			attacks : [{
				weapon: 'Short sword',
				type: 'throw',
				range: '5',
				bonus: '+4',
				damage: [1,10,4],
			},{
				weapon: 'Crossbow',
				type: 'Ucol',
				range: '60/120',
				bonus: '+4',
				damage: [1,10,4],
			}],

			'deathSucsesses' : 1,
			'deathFailures' : 2,
			
			speed : 30,
			str : 10,
			'Saving throw str' : 4,
			dex : 15,
			'Saving throw dex' : 4,
			con : 14,
			'Saving throw con' : 4,
			int : 16,
			'Saving throw int' : 4,
			wis : 12,
			'Saving throw wis' : 4,
			cha : 8,
			'Saving throw cha' : 4,
			saveThrows : '',
			skills : '',
				Acrobatics : -1,
				'Animal handing' : 3,
				Arcana : 0,
				Atletics : 4,
				Deception : 1,
				History : 0,
				Insight : 3,
				Intimidate : 3,
				Investigation : 0,
				Medicine : 5,
				Nature : 0,
				Perception : 3,
				Perfomance : 1,
				Persuasion : 1,
				Religion : 2,
				'Sleight of hand' : -1,
				Stealth : -1,
				Survival : 3,

				initiative : 3,
			damageResistances : '',
			damageImmunities : '',
			conditionImmunities : '',
			senses : '',
			languages : '',
			challenge : '',
			xp : '',
			description : '',
			actions : '',
			legendaryActions : '',
			additionalSetting : '',
		}	]
};


UI_Party.prototype.getTemplateJSON = function() {
	return {"id" : "132","name" : "Новый","type" : "","race" : "", "class" : "","level" : "1","exp" : 0,"aligment" : "","ac" : 10,"acType" : "","hp" : 6,"hpCurrent" : 6,"hpFormula" : "","hitDice" : 6,"hitDiceTotal" : 1,"hitDiceCurrent" : 1,"SpellcastingAbility" : "","SpellSaveDC" : "","SpellAttackBonus" : 0,"speed" : 0,"str" : 10,"Saving throw str" : 0,"dex" : 10,"Saving throw dex" : 0,"con" : 10,"Saving throw con" : 0,"int" : 10,"Saving throw int" : 0,"wis" : 10,"Saving throw wis" : 0,"cha" : 10,"Saving throw cha" : 0,"saveThrows" : "","skills" : "","Acrobatics" : 0,"Animal handing" : 0,"Arcana" : 0,"Atletics" : 0,"Deception" : 0,"History" : 0,"Insight" : 0,"Intimidate" : 0,"Investigation" : 0,"Medicine" : 0,"Nature" : 0,"Perception" : 0,"Perfomance" : 0,"Persuasion" : 0,"Religion" : 0,"Sleight of hand" : 0,"Stealth" : 0,"Survival" : 0,"initiative" : 0,"damageResistances" : "","damageImmunities" : "","conditionImmunities" : "","senses" : "","languages" : "","challenge" : "","xp" : "","description" : "","actions" : "","legendaryActions" : "","additionalSetting" : ""}
}

UI_Party.prototype.getPartyArray = function() {
	var arr = [];
	var len = this.party.length;
	for(var i = 0; i < len; i++) {
		arr.push(this.party[i].data)
	}
	return arr;
}


UI_Party.prototype.deleteAll = function () {

	for (var i = this.party.length - 1; i >= 0; i--) {
		console.log(this.party[i].id)
		this.callEvent('heroDelete', this.party[i].id)
	};

}