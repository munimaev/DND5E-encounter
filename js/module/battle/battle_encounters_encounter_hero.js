var UI_Battle_Encounters_Encounter_Hero = function(o) {

	this.hero = o.hero;

	UI_Battle_Encounters_Encounter_Character.apply(this, arguments);

}


UI_Battle_Encounters_Encounter_Hero.prototype = Object.create(UI_Battle_Encounters_Encounter_Character.prototype);



UI_Battle_Encounters_Encounter_Hero.prototype.bindEvents = function() {

	UI_Battle_Encounters_Encounter_Character.prototype.bindEvents.apply(this)

	this.component.signUpForAnEvent('selectHero', function(self){
		return function(key) {
			var prev = self.selectedInList;
			self.selectedInList = key == self.key ? true : false;
			if (prev != self.selectedInList) {
				self.updateHTML();
			}
		}
	}(this))

	this.component.signUpForAnEvent('selectMonster', function(self){
		return function(key) {
			if (self.selectedInList != false) {
				self.selectedInList = false;
				self.updateHTML();
			}
		}
	}(this))

	this.component.signUpForAnEvent('battleHP', function(self){
		return function(data) {
			if (self.id == data.heroId) {
				self.changeHP(data.hp)	
			}
		}
	}(this))
}



UI_Battle_Encounters_Encounter_Hero.prototype.onCkickInListFunc = function() {	
	var self = this;
	return function() {
		self.component.callEvent('selectHero',self.key);
		self.component.callEvent('showHero',self.id);
	}
};



UI_Battle_Encounters_Encounter_Hero.prototype.divClassInList = 'batle-encounter batle-encounter-hero';



UI_Battle_Encounters_Encounter_Hero.prototype.getHP = function() {	
	return this.hero.data.hp;
};

UI_Battle_Encounters_Encounter_Hero.prototype.getHPcurrent = function() {	
	return this.hero.data.hpCurrent;
};


UI_Battle_Encounters_Encounter_Hero.prototype.getAC = function() {	
	return this.hero.data.ac;
};



UI_Battle_Encounters_Encounter_Hero.prototype.getSpeed = function() {

	return this.hero.data.speed;
};



UI_Battle_Encounters_Encounter_Hero.prototype.getAbilitiMod = function(abr) {	
	return this.hero.data[abr];
};


UI_Battle_Encounters_Encounter_Hero.prototype.updatingHero = function(heroData) {
	this.hp = Number(heroData.hpCurrent);
	this.ac = Number(heroData.ac);
	this.name = heroData.name;
	this.speed = Number(heroData.speed);
	this.maxHP = Number(heroData.hp);

	this.updateHTML();
}