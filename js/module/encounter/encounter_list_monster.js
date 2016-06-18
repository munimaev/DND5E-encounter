var UI_Encounter_List_Monster = function(o) {
	if (!o.hasOwnProperty('component')) {
		throw new Error('Нет свойства component');
	} else {
		this.component = o.component;
	}
	this.id = o.data.name;
	this.name = o.data.name;
	this.amount = o.data.amount;
	this.init();
}


UI_Encounter_List_Monster.prototype.init = function() {
	this.createHTML();
	this.updateHTML();
}

UI_Encounter_List_Monster.prototype.bindEvents = function() {

	this.component.signUpForAnEvent('monsterHP', function(self){
		return function(key) {
			var prev = self.selectedInList;
			self.selectedInList = key == self.key ? true : false;
			if (prev != self.selectedInList) {
				self.updateHTML();
			}
		}
	}(this))

	this.component.signUpForAnEvent('throwInitiative', function(self){
		return function() {
			var mod = app.getMod(self.getAbilitiMod('dex'));
			self.initiative = 1 + Math.round(Math.random() * 19) + mod;
			self.updateHTML({initiative:true});
		}
	}(this))

	this.component.signUpForAnEvent('setCurrenTurnToCharacter', function(self){
		return function(key) {
			var prev = self.currentTurn;
			self.currentTurn = key == self.key ? true : false;
			if (prev != self.currentTurn) {
				self.updateHTML({currentTurn:true});
			}
		}
	}(this))

}



UI_Encounter_List_Monster.prototype.createHTML = function(o) {
	this.$div = $('<tr />');
	var td1 = $('<td />')

	var funcSet = function(self) {
		return function() {
			var val = $(this).val();
			val = parseInt(val);
			if (isNaN(val)) {
				return false;
			}
			self.setAmount(val);
		}
	}(this)
	this.$amount = $('<input />', {class:'inlineInput short'}).keyup(funcSet);
	var  time = $('<span />').html('&nbsp;&times;');


	var funcShow = function(self) {
		return function() {
			self.component.callEvent('showMonster', self.id);
		}
	}(this)
	var td2 = $('<td />',{class:'link',text:this.name, click:funcShow})

	var funcIncrease = function(self, mod) {
		return function() {
			self.changeAmount(mod);
		}
	}
	var $spanIncrease = $('<span />',{class:'inline-button encounterList-monster-span-button', click:funcIncrease(this,1)});
	$spanIncrease.html('+');
	var $spanDegress = $('<span />',{class:'inline-button encounterList-monster-span-button', click:funcIncrease(this,-1)});
	$spanDegress.html('&minus;');

	var td3 = $('<td />',{})
	td3.append($spanIncrease)
	td3.append($spanDegress)


	this.$div
		.append(td1
			.append(this.$amount)
			.append(time)
		)
		.append(td2)
		.append(td3)
};


UI_Encounter_List_Monster.prototype.updateHTML = function(o) {	
	if(!o || o.amount) {
		this.$amount.val(this.amount);
	}
};

UI_Encounter_List_Monster.prototype.changeAmount = function(mod) {	
	this.setAmount(this.amount+mod);
};
UI_Encounter_List_Monster.prototype.setAmount = function(val) {	
	if (val < 1) {
		this.component.callEvent('zeroAmount', this.id);
	}
	else {
		this.amount = val;
		this.updateHTML({amount:true})
	}
};
