var UI_Chargen_abilities_ability = function(component, name, value) {
	this.name = name;
	this.component = component;

	this.value = value || 8;
	this.mod =app.getModStr(this.value);

	this.base = 0;
	this.bought = 0;

	this.raceBonus = 0;
	this.subraceBonus = 0;
	this.levelBouns = 0;

	this.canBeInc = false;
	this.canBeDec = false;


	this.$div = $('<div />', {class:'char_ability'});
	var $name = $('<div />', {class:'char_ability_name', text:app.abr(name,true)});
	this.$mod = $('<div />', {class:'char_ability_mod', text: this.mod});
	this.$val = $('<div />', {class:'char_ability_val', text:this.value});

	this.$div.append($name);
	this.$div.append(this.$mod);
	this.$div.append(this.$val);

	this.$calc = $('<div />', {class:'char_abilitycalc'});

	this.$base = $('<div />', {class:'char_abilitycalc_base'});
	this.$baseValue = $('<div />', {class:'char_abilitycalc_base_val', text: this.base});
	this.$baseTitle = $('<div />', {class:'char_abilitycalc_base_tit', text: app.local('cg_Base_Value')});

	this.$calc.append(this.$base);
	this.$base.append(this.$baseValue);
	this.$base.append(this.$baseTitle);


	this.$race = $('<div />', {class:'char_abilitycalc_base'});
	this.$raceValue = $('<div />', {class:'char_abilitycalc_base_val'});
	this.$raceTitle = $('<div />', {class:'char_abilitycalc_base_tit', text: app.local('cg_Race_Bonus')});
	// this.$raceName = $('<div />', {class:'char_abilitycalc_base_name'});
	this.$calc.append(this.$race);
	this.$race.append(this.$raceValue);
	this.$race.append(this.$raceTitle);
	// this.$race.append(this.$raceName);

	
	this.$subrace = $('<div />', {class:'char_abilitycalc_base'});
	this.$subraceValue = $('<div />', {class:'char_abilitycalc_base_val', text: this.base});
	this.$subraceTitle = $('<div />', {class:'char_abilitycalc_base_tit', text: app.local('cg_Subrace_Bonus')});
	// this.$subraceName = $('<div />', {class:'char_abilitycalc_base_name'});
	this.$calc.append(this.$subrace);
	this.$subrace.append(this.$subraceValue);
	this.$subrace.append(this.$subraceTitle);
	// this.$subrace.append(this.$subraceName);

	this.$bought = $('<div />', {class:'char_abilitycalc_base'});
	this.$boughtValue = $('<div />', {class:'char_abilitycalc_base_val', text: this.bought});
	this.$boughtTitle = $('<div />', {class:'char_abilitycalc_base_tit', text: app.local('cg_Bought_Bonus')});
	this.$calc.append(this.$bought);
	this.$bought.append(this.$boughtValue);
	this.$bought.append(this.$boughtTitle);


	this.$level = $('<div />', {class:'char_abilitycalc_base'});
	this.$levelValue = $('<div />', {class:'char_abilitycalc_base_val', text: this.base});
	this.$levelTitle = $('<div />', {class:'char_abilitycalc_base_tit', text: app.local('cg_Level_Bonus')});
	this.$calc.append(this.$level);
	this.$level.append(this.$levelValue);
	this.$level.append(this.$levelTitle);





	this.$board = $('<div />', {class:'char_abilityboard'});

	var plusFunc = function(self) {
		return function() {
			self.pointInc();
		}
	}(this)
	this.$boardInc = $('<div />', {class:'char_abilityboard_inc'});
	this.$board.append(this.$boardInc);
	this.$boardIncBtn = $('<span />', {class:'inline-button char_abilityboard_btn',text:'+1',click:plusFunc});
	this.$boardIncTxt = $('<span />', {class:'char_abilityboard_txt',text:'За 2 очка'});
	this.$boardInc.append(this.$boardIncBtn);
	this.$boardInc.append(this.$boardIncTxt);


	var minusFunc = function(self) {
		return function() {
			self.pointDec();
		}
	}(this)
	this.$boardDec = $('<div />', {class:'char_abilityboard_dec'});
	this.$board.append(this.$boardDec);
	this.$boardDecBtn = $('<span />', {class:'inline-button char_abilityboard_btn',click:minusFunc}).html('&minus;1');
	this.$boardDecTxt = $('<span />', {class:'char_abilityboard_txt'});
	this.$boardDec.append(this.$boardDecBtn);
	this.$boardDec.append(this.$boardDecTxt);


	var setFunc = function(self) {
		return function() {
			var val = this.value;
			if (!val) {
				val = 0;
			}
			val = parseInt(val);
			if (isNaN(val)) {
				val = 0;
			}
			if (val > 18) {
				val = 18;
			}
			this.value = val;
			self.setBase(val, true);
		}
	}(this)
	this.$boardInp = $('<div />', {class:'char_abilityboard_inp'});
	this.$board.append(this.$boardInp);
	this.$boardInpBtn = $('<input />', {class:'char_abilityboard_btn',type:'text'}).attr('size',2).keyup(setFunc);
	this.$boardInpTxt = $('<span />', {class:'char_abilityboard_txt',text:app.local('cg_SetupValue')});
	this.$boardInp.append(this.$boardInpBtn);
	this.$boardInp.append(this.$boardInpTxt);


	var checkFunc = function(self) {
		return function() {

			self.component.abilitiesBonusChoisen[self.name] = this.checked;
			self.component.callEvent('change_abilitiesBonusChoisen');
		}
	}(this)
	this.$boardRaceAtChoice = $('<div />', {class:'char_abilityboard_over'});
	this.$board.append(this.$boardRaceAtChoice);
	this.$boardRaceAtChoiceBtn = $('<input />', {class:'char_abilityboard_checkbox',type:'checkbox'}).change(checkFunc);
	this.$boardRaceAtChoiceTxt = $('<span />', {class:'char_abilityboard_txt',text: ''+app.local('cg_Race_Bonus') + ' +1'});
	this.$boardRaceAtChoice.append(this.$boardRaceAtChoiceBtn);
	this.$boardRaceAtChoice.append(this.$boardRaceAtChoiceTxt);




	this.component.subscribe.changeRule.push(this.genReaction_SetRule());
	this.component.subscribe['change' + name+'_base'].push(this.genReaction_changeBase());
	this.component.subscribe['change' + name+'_bought'].push(this.genReaction_changeBought());
	this.component.subscribe['changePoints'].push(this.genReaction_changePoints());
	this.component.subscribe['change_abilitiesBonusChoisen'].push(this.genReaction_changeAbilitiesBonusChoisen());


	this.component.module.events['changeRace'].push(this.genReaction_changeRace());
	this.component.module.events['changeSubrace'].push(this.genReaction_changeSubace());

}




UI_Chargen_abilities_ability.prototype.updateDiv = function(o) {
	if (!o || o.value) {
		this.$baseValue.html(this.base)
		this.$val.html(this.value);
		$(this.$boardInpBtn).attr('value', this.base);
	}
	if (!o || o.mod) {
		this.$mod.html(app.getModStr(this.value));
	}
	if (!o || o.raceBonus) {
		var b = this.getRaceBonus();
		this.$raceValue.html(b);
		if (b == 0) {
			this.$race.addClass('nondisplay');
		} 
		else {
			this.$race.removeClass('nondisplay');
		}
	}
	if (!o || o.subraceBonus) {
		this.$subraceValue.html(this.subraceBonus);
		if (this.subraceBonus == 0) {
			this.$subrace.addClass('nondisplay');
		} 
		else {
			this.$subrace.removeClass('nondisplay');
		}
	}
	if (!o || o.levelBouns) {
		this.$levelValue.html(this.levelBouns);
		if (this.levelBouns == 0) {
			this.$level.addClass('nondisplay');
		} 
		else {
			this.$level.removeClass('nondisplay');
		}
	}

	if (!o || o.rule) {
		this.$baseValue.html(this.base)
		if (this.component.generation.rule == 1) {
			this.$bought.addClass('nondisplay');
			this.$boardDec.addClass('nondisplay');
			this.$boardInc.addClass('nondisplay');
			this.$boardInp.removeClass('nondisplay');
		}
		if (this.component.generation.rule == 2) {
			this.$bought.removeClass('nondisplay');
			this.$boardDec.removeClass('nondisplay');
			this.$boardInc.removeClass('nondisplay');
			this.$boardInp.addClass('nondisplay');
		}
	}
	if (!o || o.boardInc) {

		if (this.canBeInc) {
			this.$boardIncBtn.removeClass('inline-button__disabled');
		} else {
			this.$boardIncBtn.addClass('inline-button__disabled');
		}
		switch (this.pointData[this.base + this.bought].inc) {
			case 1:
				this.$boardIncTxt.html(app.local('cg_For1point'));
				break;
			case 2:
				this.$boardIncTxt.html(app.local('cg_For2points'));
				break;
			default:
				this.$boardIncTxt.html('Нельзя увеличить');
				break;
		}
		
	}
	if (!o || o.boardDec) {

		if (this.canBeDec) {
			this.$boardDecBtn.removeClass('inline-button__disabled');
		} else {
			this.$boardDecBtn.addClass('inline-button__disabled');
		}
		switch (this.pointData[this.base + this.bought].dec) {
			case 1:
				this.$boardDecTxt.html(app.local('cg_Back1point'));
				break;
			case 2:
				this.$boardDecTxt.html(app.local('cg_Back2points'));
				break;
			default:
				this.$boardDecTxt.html('Нельзя уменьшить');
				break;
		}
		
	}

	if (!o || o.abilitiesBonusChoisen) {
		if (!this.component.abilitiesBonusAtChoice || ~this.component.abilitiesBonusAtChoice.not.indexOf(this.name)) {
			this.$boardRaceAtChoiceBtn.prop( "disabled", true );
			this.$boardRaceAtChoice.addClass('nondisplay')
		}
		else {
		console.log(this.component.abilitiesBonusChoisen[this.name])
			this.$boardRaceAtChoice.removeClass('nondisplay')
			if (this.component.abilitiesBonusChoisen[this.name]) {

			} else {
				var count = 0;
				for (var i in this.component.abilitiesBonusChoisen) {
					if (this.component.abilitiesBonusChoisen[i]) {
						count++;
					}
				}
				console.log('count, this.component.abilitiesBonusAtChoice.total',count, this.component.abilitiesBonusAtChoice.total)
				if (count < this.component.abilitiesBonusAtChoice.total) {
					this.$boardRaceAtChoiceBtn.prop( "disabled", false );
				} else {
					this.$boardRaceAtChoiceBtn.prop( "disabled", true )
				}
			}
		}
	}
}



UI_Chargen_abilities_ability.prototype.pointData =  {
	 0 : {inc: 0, dec: null},
	 1 : {inc: 0, dec: null},
	 2 : {inc: 0, dec: null},
	 3 : {inc: 0, dec: null},
	 4 : {inc: 0, dec: null},
	 7 : {inc: 0, dec: null},
	 6 : {inc: 0, dec: null},
	 7 : {inc: 0, dec: null},
	 8 : {inc: 1, dec: null},
	 9 : {inc: 1, dec: 1},
	10 : {inc: 1, dec: 1},
	11 : {inc: 1, dec: 1},
	12 : {inc: 1, dec: 1},
	13 : {inc: 2, dec: 1},
	14 : {inc: 2, dec: 2},
	15 : {inc: Infinity , dec: 2}
}

UI_Chargen_abilities_ability.prototype.pointInc = function() {
	var val = this.pointData[this.base + this.bought].inc;
	if (val <= this.component.generation.points && val <= 2) {
		//Важен порядок из второй вызывается событие
		this.setBought(this.bought+1,true);
		this.component.generation.changePoints(-val);
	}
}


UI_Chargen_abilities_ability.prototype.pointDec = function() {
	var val = this.pointData[this.base + this.bought].dec;
	if (val != null) {
		//Важен порядок из второй вызывается событие
		this.setBought(this.bought-1,true);
		this.component.generation.changePoints(+val);
	}
}




UI_Chargen_abilities_ability.prototype.setBought = function(numb, upd) {
	this.bought = numb;
	this.updVal();
	this.component.callEvent('change' + this.name+'_bought');
	if (upd) {
		this.updateDiv({'value':true,'bought':numb});
	}
}



UI_Chargen_abilities_ability.prototype.genReaction_SetRule = function() {
	var self = this;
	return function(){
		var ruleId = self.component.generation.rule
		console.log(ruleId)
		if (ruleId == 1) {
			self.setBase(0, false);
		}
		if (ruleId == 2) {
			self.setBase(8, false);
		}
		self.updateDiv({'value':true, 'rule':true, 'boardInc':true, 'boardDec':true});
	}
}



UI_Chargen_abilities_ability.prototype.setBase = function(numb, upd) {
	this.base = numb;
	this.component.callEvent('change' + this.name+'_base');
	if (upd) {
		this.updateDiv({'value':true});
	}
}


UI_Chargen_abilities_ability.prototype.genReaction_changeBase = function(abr) {
	var self = this;
	return function(){
		self.updVal();		
	}
}

UI_Chargen_abilities_ability.prototype.setRaceBonus = function(numb, upd) {
	this.raceBonus = numb;
	this.updVal();
	this.updateDiv({'raceBonus':true});
}

UI_Chargen_abilities_ability.prototype.getRaceBonus = function() {
	var result = this.raceBonus;
	// console.log(msg)
	if (this.component.abilitiesBonusChoisen[this.name]) {
		result++;
	}
	return result;
}

UI_Chargen_abilities_ability.prototype.setSubraceBonus = function(numb, upd) {
	this.subraceBonus = numb;
	this.updVal();
	this.updateDiv({'subraceBonus':true});
}


UI_Chargen_abilities_ability.prototype.updVal = function(abr) {
	this.value = this.base + this.bought + this.getRaceBonus() + this.subraceBonus + this.levelBouns;
	this.mod = app.getMod(this.value);
	this.updateDiv({value:true,mod:true})
}



UI_Chargen_abilities_ability.prototype.genReaction_changePoints = function(abr) {
	var self = this;
	return function(){

		if (self.pointData[self.base + self.bought].inc <= self.component.generation.points) {
			self.canBeInc = true;
		} else {
			self.canBeInc = false;
		}

		if (self.pointData[self.base + self.bought].dec != null) {
			self.canBeDec = true;
		} else {
			self.canBeDec = false;
		}
		self.updateDiv({boardInc:true,boardDec:true,});
	}
}
UI_Chargen_abilities_ability.prototype.genReaction_changeBought = function(abr) {
	var self = this;
	return function(){
		self.$boughtValue.html(self.bought);
		self.updVal();		
	}
}

UI_Chargen_abilities_ability.prototype.genReaction_changeRace = function() {
	var self = this;
	return function() {
		var bonuses = self.component.module.getCurrentRace();
		if (bonuses.hasOwnProperty('abilitiesBonus') && bonuses.abilitiesBonus.hasOwnProperty(self.name)) {
				self.setRaceBonus(bonuses.abilitiesBonus[self.name])
		}
		else {
			self.setRaceBonus(0)
		}
	}
}

UI_Chargen_abilities_ability.prototype.genReaction_changeSubace = function() {
	var self = this;
	return function() {
		var subrace = self.component.module.getCurrentSubrace();
		if (subrace && subrace.hasOwnProperty('abilitiesBonus') && subrace.abilitiesBonus.hasOwnProperty(self.name))  {
			self.setSubraceBonus(subrace.abilitiesBonus[self.name])
		}
		else {
			self.setSubraceBonus(0)
		}
	}
}

UI_Chargen_abilities_ability.prototype.genReaction_changeAbilitiesBonusChoisen = function() {
	var self = this;
	return function() {
		self.updateDiv({
			abilitiesBonusChoisen : true,
			value : true,
			mod : true,
			raceBonus : true
		})
	}
}