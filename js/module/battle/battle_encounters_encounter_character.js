var UI_Battle_Encounters_Encounter_Character = function(o) {
	if (!o.hasOwnProperty('component')) {
		throw new Error('Нет свойства component');
	} else {
		this.component = o.component;
	}

	this.name = this.genName(o.name, o.amount);
	this.id = o.id;
	this.key = o.key;
	this.maxHP = this.getHP();
	this.hp = this.getHPcurrent();
	this.hpwidth = 5;
	this.initiative = 0;
	this.ac = this.getAC();
	this.speed = this.getSpeed();
	this.showInitiative = true;

	this.currentTurn = false;
	this.currentTurn = false;

	this.bindEvents();

	this.createObj(o.data);
	this.createHTML(o.data);
	this.updateHTML();


}



UI_Battle_Encounters_Encounter_Character.prototype.bindEvents = function() {

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



UI_Battle_Encounters_Encounter_Character.prototype.genName = function(name,amount) {
	return name + ' ' + amount;
};



UI_Battle_Encounters_Encounter_Character.prototype.createObj = function(o) {

};



UI_Battle_Encounters_Encounter_Character.prototype.createHTML = function(o) {
	this.$divInList = $('<div />', {
		class: this.divClassInList + '  withHoverButtons'
	});

	this.$header = $('<div />', {
		class: 'batle-encounter-name link',
		text: this.name,
		click: this.onCkickInListFunc()
	});
	this.$divInList.append(this.$header);

	this.$stats = $('<div />', {class:'small'});
	this.$divInList.append(this.$stats);


	this.$positionButton = $('<div />',{class:'hoverButtons hoverButtons-topRight'});
	this.$positionButtonUp = $('<span />', {
		class: 'inline-button hoverButton-upDown',
		text: '▲',
		click: function(self){
			return function() {
				self.component.callEvent('positionUp',self.key);
			}
		}(this)
	});
	this.$positionButtonDown = $('<span />', {
		class: 'inline-button hoverButton-upDown',
		text: '▼',
		click: function(self){
			return function() {
				self.component.callEvent('positionDown',self.key);
			}
		}(this)
	});

	this.$positionButton.append(this.$positionButtonUp).append(this.$positionButtonDown);
	this.$divInList.append(this.$positionButton);

	this.$initiative = $("<span />", {
		class: ''
	}).append($('<span />', {
		text: app.local('Initiative') + ': '
	}))
	this.$initiativeValue = $("<input />", {
		class: 'inlineInput short vollkorn',
		value: this.initiative
	})
	this.$initiativeValue.keyup(function(self) {
		return function() {
			self.initiative = $(this).val()
		}
	}(this))
	this.$stats.append(this.$initiative);
	this.$initiative.append(this.$initiativeValue);

	this.$stats.append($('<span />').html('&nbsp;&nbsp;&nbsp;'));

	this.$ac = $('<span />', {
		text: this.ac
	})
	var ac = $("<span />", {
		class: '',
		text: app.local('AC') + ': ' 
	}).append(this.$ac)
	this.$stats.append(ac);


	this.$stats.append($('<span />').html('&nbsp;&nbsp;&nbsp;'));

	this.$speed = $('<span />', {
		text:  this.speed
	})
	var speed = $("<span />", {
		class: '',text:app.local('Speed') + ': '
	}).append(this.$speed)
	this.$stats.append(speed);


	var hits = $("<div />", {
		class: 'small'
	}).append($('<span />', {
		text: app.local('Hits') + ': '
	}))
	this.$divInList.append(hits);
	this.$hp = $("<span />", {
		class: '',
		text: this.hp
	})
	hits.append(this.$hp);
	hits.append($("<span />", {
		class: '',
		text: '/'
	}));
	this.$maxHP = $("<span />", {
		class: '',
		text: this.maxHP
	})
	hits.append(this.$maxHP);

	this.$health = $("<div />", {
		class: ''
	}).css('line-height', 0 + 'px');

	this.$divInList.append(this.$health);

	// this.$healthCurrent = $("<div />", {
	// 	class: 'health health-current'
	// }).css('width', this.hp * this.hpwidth + 'px');
	// this.$health.append(this.$healthCurrent);
};

UI_Battle_Encounters_Encounter_Character.prototype.onCkickInListFunc = function() {	
	var self = this;
	return function() {
		self.component.callEvent('selectMonster',self.key);
		self.component.callEvent('showMonster',self.id);
	}
};

UI_Battle_Encounters_Encounter_Character.prototype.divClassInList = 'batle-encounter batle-encounter-monster';


UI_Battle_Encounters_Encounter_Character.prototype.updateHTML = function(o) {	
	if(!o || o.selected) {
		if (this.selectedInList) {
			this.$header.addClass('selected')
			this.$divInList.addClass('selected')
		} else {
			this.$header.removeClass('selected')
			this.$divInList.removeClass('selected')
		}
	}
	if(!o || o.name) {
		this.$header.html(this.name)
	}
	if(!o || o.ac) {
		this.$ac.html(this.ac)
	}
	if(!o || o.speed) {
		this.$speed.html(this.speed)
	}
	if(!o || o.hp || o.maxHP) {
		this.$hp.html(this.hp);
		this.$maxHP.html(this.maxHP);
		this.$health.empty();
		if (this.hp>=0) {
			for (var i = 1; i <= this.hp; i++) {
				var hp1 = $('<div />', {class:"health health-current"});
				this.$health.append(hp1)
			}
			for (var i = this.hp + 1; i <= this.maxHP; i++) {
				var hp1 = $('<div />', {class:"health"});
				this.$health.append(hp1)
			}
		} else {
			for (var i = -1; i >= this.hp; i--) {
				var hp1 = $('<div />', {class:"health health-death"});
				this.$health.append(hp1)
			}
			for (var i = (this.hp * -1)+ 1; i <= this.maxHP; i++) {
				var hp1 = $('<div />', {class:"health"});
				this.$health.append(hp1)
			}
		}


	}
	if(!o || o.initiative) {
		if (this.showInitiative) {
			this.$initiative.removeClass('nondisplay');
		}
		else {
			this.$initiative.addClass('nondisplay');
		}
		this.$initiativeValue.val(this.initiative);
	}
	if(!o || o.currentTurn) {
		if (this.currentTurn) {
			this.$header.addClass('name-current-turn')
			this.$divInList.addClass('div-current-turn')
		} else {
			this.$header.removeClass('name-current-turn')
			this.$divInList.removeClass('div-current-turn')
		}
	}
};


UI_Battle_Encounters_Encounter_Character.prototype.getHP = function() {	
	return this.component.getHP(this.id);
};
UI_Battle_Encounters_Encounter_Character.prototype.getHPcurrent = function() {	
	return this.maxHP;
};



UI_Battle_Encounters_Encounter_Character.prototype.getAC = function() {	
	return this.component.getAC(this.id);
};

UI_Battle_Encounters_Encounter_Character.prototype.getSpeed = function() {	
	return this.component.getSpeed(this.id);
};



UI_Battle_Encounters_Encounter_Character.prototype.changeHP = function(hp) {	
	this.setHP(this.hp+hp);
};



UI_Battle_Encounters_Encounter_Character.prototype.setHP = function(hp) {	
	this.hp = hp > this.maxHP ? this.maxHP : hp;
	if (this.hp < this.maxHP * -1) {
		this.hp = this.maxHP * -1
	} 
	this.updateHTML({hp:true});
};



UI_Battle_Encounters_Encounter_Character.prototype.getAbilitiMod = function(abr) {	
	return this.component.getAbilitiMod(this.id, abr);
};


