var UI_Battle_Encounters_Encounter_Monster = function(o) {

	UI_Battle_Encounters_Encounter_Character.apply(this, arguments);

}

UI_Battle_Encounters_Encounter_Monster.prototype = Object.create(UI_Battle_Encounters_Encounter_Character.prototype);


UI_Battle_Encounters_Encounter_Monster.prototype.bindEvents = function() {

	UI_Battle_Encounters_Encounter_Character.prototype.bindEvents.apply(this);

	this.component.signUpForAnEvent('selectMonster', function(self){
		return function(key) {
			var prev = self.selectedInList;
			self.selectedInList = key == self.key ? true : false;
			if (prev != self.selectedInList) {
				self.updateHTML();
			}
		}
	}(this))

	this.component.signUpForAnEvent('selectHero', function(self){
		return function(key) {
			if (self.selectedInList != false) {
				self.selectedInList = false;
				self.updateHTML();
			}
		}
	}(this))
}