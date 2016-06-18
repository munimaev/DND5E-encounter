var UI_Chargen_abilities = function(o) {
	if(!o.hasOwnProperty('div')) {
		throw new Error('Нет свойства div');
	} else {
		if (typeof o.div == 'string') {
			this.$div = $(o.div)
		}
		else {
			this.$div = o.div;
		}
	}
	if(!o.hasOwnProperty('module')) {
		throw new Error('Нет свойства module');
	} else {
		this.module = o.module;
	}

	this.isShow = false;
	this.abilitiesBonusAtChoice =  null;
	this.abilitiesBonusChoisen = {};
	this.subscribe = {
		changeRule: [],

		changeSTR_base: [],
		changeDEX_base: [],
		changeCON_base: [],
		changeINT_base: [],
		changeWIS_base: [],
		changeCHA_base: [],

		changePoints: [],

		change_abilitiesBonusChoisen : [],

		changeSTR_bought: [],
		changeDEX_bought: [],
		changeCON_bought: [],
		changeINT_bought: [],
		changeWIS_bought: [],
		changeCHA_bought: [],

	}


}
UI_Chargen_abilities.prototype.init = function() {

	this.$div.append($('<h4>',{'text':app.local('Abilities')}))

	this.generation = new UI_Chargen_abilities_generation(this);
	this.$div.append(this.generation.$div);


	this.$table = $('<table />').append($('<tbody />',{valign:'top'}));
	var abilityNames = ['CHA','WIS','INT','CON','DEX','STR'];
	for (var i = abilityNames.length - 1; i >= 0; i--) {

		var lower = abilityNames[i].toLowerCase();
		this[lower] = new UI_Chargen_abilities_ability(this, abilityNames[i]);

		var $tr = $('<tr />');

		var $td1 = $('<td />');
		$td1.append(this[lower].$div);
		$tr.append($td1);


		var $td2 = $('<td />');
		$td2.append(this[lower].$calc);
		$tr.append($td2);


		var $td3 = $('<td />');
		$td3.append(this[lower].$board);
		$tr.append($td3);

		this.$table.append($tr);


	};
	this.$div.append(this.$table);



	this.module.events['changeStep'].push(function(self) {
		return function(step) {
			var old = self.isShow;
			if (step == 'abilities') {
				self.isShow = true;
			} else {
				self.isShow = false;
			}
			if  (old != self.isShow) {
				self.updateDiv();
			}
		}
	}(this));


	this.module.events['changeRace'].push(this.genReaction_changeRace());

	this.generation.setPoints(27);
	this.updateDiv();

}


UI_Chargen_abilities.prototype.callEvent = function(name) {
	if (this.subscribe.hasOwnProperty(name)) {
		for (var i = this.subscribe[name].length - 1; i >= 0; i--) {
			this.subscribe[name][i]()
		};
	}
}

UI_Chargen_abilities.prototype.updateDiv = function() {
	if (this.isShow) {
		this.$div.removeClass('nondisplay')
	}
	else  {
		this.$div.addClass('nondisplay');
		return;
	}
	this.generation.updateDiv();
	var arr = ['str','dex','con','int','wis','cha'];
	for (var i = arr.length - 1; i >= 0; i--) {
		this[arr[i]].updateDiv();
	};
}


UI_Chargen_abilities.prototype.genReaction_changeRace = function() {
	var self = this;
	return function() {

		var race = self.module.getCurrentRace();
		var prev = self.abilitiesBonusAtChoice;

		if (race.hasOwnProperty('abilitiesBonusAtChoice')) {
			self.abilitiesBonusAtChoice = race.abilitiesBonusAtChoice;
			self.abilitiesBonusChoisen = {};
		}
		else {
			self.abilitiesBonusAtChoice = null;
			self.abilitiesBonusChoisen = {};
		}

		if (self.abilitiesBonusAtChoice != prev) {
			self.updateDiv();
		}

	}
}