var UI_Battle_Encounters_Encounter = function(o) {
	if (!o.hasOwnProperty('module')) {
		throw new Error('Нет свойства module');
	} else {
		this.module = o.module;
	}
	this.key = o.key;
	this.selectedInList = false;
	this.id = o.data.id;
	this.name = o.data.name;
	this.composition = [];
	this.monster = null;
	this.turn = null;
	this.events = {};
	this.initData = o.data

	this.createHTML(o.data);
	this.createObj(o.data);

	this.module.signUpForAnEvent('selectEncounter', function(self){
		return function(key) {
			var prev = self.selectedInList;
			self.selectedInList = key == self.key ? true : false;
			if (prev != self.selectedInList) {
				self.updateHTML();
			}
		}
	}(this))

	this.signUpForAnEvent('showMonster', function(self){
		return function(key) {
			self.module.callEvent('showMonster',key);
		}
	}(this))

	this.signUpForAnEvent('showHero', function(self){
		return function(key) {
			self.module.callEvent('showHero',key);
		}
	}(this))

	this.signUpForAnEvent('selectMonster', function(self){
		return function(key) {
			self.monster = self.composition[key];
		}
	}(this))

	this.signUpForAnEvent('selectHero', function(self){
		return function(key) {
			self.monster = self.composition[key];
		}
	}(this))


	this.signUpForAnEvent('sortOnInitiative', function(self){
		return function(key) {
			self.monster = null;
			var len = self.composition.length;
			for (var i = 0; i < len; i++) {
				self.composition[i].$divInList.detach()
			}
			self.composition.sort(function(a,b) {
				return b.initiative - a.initiative;
			})
			for (var i = 0; i < len; i++) {
				self.$list.append(self.composition[i].$divInList)
				self.composition[i].key = i;
				self.composition[i].selectedInList = false;
				self.composition[i].updateHTML();
			}
			self.turn = self.composition[0];
			self.callEvent('setCurrenTurnToCharacter',self.turn.key);
		}
	}(this))

	this.signUpForAnEvent('nextTurn', function(self){
		return function() {
			var nextKey = 0;
			if (self.turn) {
				nextKey = self.turn.key + 1;
			}
			if (nextKey >= self.composition.length) {
				nextKey = 0;
			}
			self.turn = self.composition[nextKey];
			self.callEvent('setCurrenTurnToCharacter',nextKey);

		}
	}(this))

	this.signUpForAnEvent('positionUp', function(self){
		return function(key) {
			var len = self.composition.length;
			if (key == 0) {
				return;
			}
			for (var i = 0; i < len; i++) {
				self.composition[i].$divInList.detach()
			}
			self.composition.splice(key-1,0,self.composition.splice(key,1)[0]);
			for (var i = 0; i < len; i++) {
				self.$list.append(self.composition[i].$divInList)
				self.composition[i].key = i;
				self.composition[i].selectedInList = false;
				self.composition[i].updateHTML();
			}
		}
	}(this))

	this.signUpForAnEvent('positionDown', function(self){
		return function(key) {
			var len = self.composition.length;
			if (key - 1 == len) {
				return;
			}
			for (var i = 0; i < len; i++) {
				self.composition[i].$divInList.detach()
			}
			self.composition.splice(key+1,0,self.composition.splice(key,1)[0]);
			for (var i = 0; i < len; i++) {
				self.$list.append(self.composition[i].$divInList)
				self.composition[i].key = i;
				self.composition[i].selectedInList = false;
				self.composition[i].updateHTML();
			}
		}
	}(this))


	this.module.signUpForAnEvent('battleHP', function(self){
		return function(data) {
			self.callEvent('battleHP',data)
		}
	}(this))


}

UI_Battle_Encounters_Encounter.prototype.createHTML = function(o) {
	this.createHTMLforList(o);
	this.createHTMLforSelf(o);



};
UI_Battle_Encounters_Encounter.prototype.createHTMLforList = function(o) {
	this.$divInList = $('<div />', {class:'batle-encounter withHoverButtons'});

	var funcSelcet = function(self) {
		return function() {
			self.module.callEvent('selectEncounter',self.key);
		}
	}(this)
	this.$header = $('<div />', {class:'batle-encounter-name link',text:this.name, click:funcSelcet});
	this.$divInList.append(this.$header);


	this.$hoverButtons = $('<div />',{class:'hoverButtons hoverButtons-topRight'});
	this.$hoverButtonEdit = $('<span />', {
		class: 'inline-button hoverButton',
		text: app.local('Edit'),
		click: function(self){
			return function() {
				self.module.callEvent('encounterEdit',self.key);
			}
		}(this)
	});
	this.$hoverButtons.append(this.$hoverButtonEdit);
	this.$divInList.append(this.$hoverButtons);




	this.$composition = $('<table />', {class:'batle-encounter-composition'});
	this.$divInList.append(this.$composition);

	this.$tbody = $('<tbody />');
	o.composition.forEach(
		function(o){
			this.$tbody.append('<tr><td width="30px" style="text-align:right;">'+o.amount+' &times;</td><td>'+o.name+'</td></tr>');
		}, this
	)
	this.$composition.html(this.$tbody);

};
UI_Battle_Encounters_Encounter.prototype.createHTMLforSelf = function(o) {
	this.$div = $('<div />').css({'position':'absolute','top':'0','bottom':'0','right':'0','left':'0'});
	this.$headerSelf = $('<h5 />', {
		class: 'block-header',
		text: o.name
	})
	this.$div.append(this.$headerSelf)
	this.$buttons = $('<div />',{class:'block-padding'})
	this.$div.append(this.$buttons);


	this.$buttonInitiative = $('<span />', {class:'inline-button monster-subHeaderButton', text : app.local('Initiative'), click:function(self){
			return function() {
				self.callEvent('throwInitiative');
			}
	}(this)});
	this.$buttons.append(this.$buttonInitiative);


	this.$buttonSort = $('<span />', {class:'inline-button monster-subHeaderButton', text : app.local('Sort'), click:function(self){
			return function() {
				self.callEvent('sortOnInitiative');
			}
	}(this)});
	this.$buttons.append(this.$buttonSort);


	this.$buttonNext = $('<span />', {class:'inline-button monster-subHeaderButton', text : app.local('Next'), click:function(self){
			return function() {
				self.callEvent('nextTurn');
			}
	}(this)});
	this.$buttons.append(this.$buttonNext);


	this.$updateEncounterBtn = $('<span />', {
		class: 'inline-button monster-subHeaderButton nondisplay',
		text: app.local('Update'),
		click: function(self) {
			return function() {
				self.updateEncounter();
			}
		}(this)
	}).css('margin-left','1em');
	this.$buttons.append(this.$updateEncounterBtn);



	this.$list = $('<div/>', {
		class: 'block-list'
	}).css({'top':'70px','bottom':'0px','overflow':'auto'})
	this.$div.append(this.$list)

};

UI_Battle_Encounters_Encounter.prototype.updateHTML = function(o) {	
	if(!o || o.selected) {
		if (this.selectedInList) {
			this.$header.addClass('selected')
			this.$divInList.addClass('selected')
		} else {
			this.$header.removeClass('selected')
			this.$divInList.removeClass('selected')
		}
	}
	if(!o || o.updateEncounter) {
		if (this.dataToUpdate) {
			this.$updateEncounterBtn.removeClass('nondisplay')
		} else {
			this.$updateEncounterBtn.addClass('nondisplay')
		}
	}
	if(!o || o.name) {
		this.$header.html(this.name);
		this.$headerSelf.html(this.name);
	}
	if(!o || o.composition) {
	}
};

UI_Battle_Encounters_Encounter.prototype.arrAmount = [
	'I','II','III','IV','V','VI','VII','VIII','IX','X',
	'XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'
]
UI_Battle_Encounters_Encounter.prototype.createObj = function(o) {
	var arrAmount = ['I','II','III','IV','V','VI','VII','VII','IX','X']
	o.composition.forEach(
		function(c){
			for (var i = 0; i < c.amount; i++) {
				this.addMonster({
					id : c.name,
					key : this.composition.length,
					amount : this.arrAmount[i],
					component : this,
					name : c.name,
					type : 'monster'
				})

			}
		}, this
	)
	var partyArr = this.module.getPartyData();
	partyArr.forEach(
		function(c){
			var m = new UI_Battle_Encounters_Encounter_Hero({
				id : c.data.name,
				key : this.composition.length,
				amount : '',
				component : this,
				name : c.data.name,
				type : 'hero',
				hero : c
			})
			this.composition.push(m);
			this.$list.append(m.$divInList)
		}, this
	)
};




UI_Battle_Encounters_Encounter.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}

UI_Battle_Encounters_Encounter.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}


UI_Battle_Encounters_Encounter.prototype.getHP = function(id) {
	return this.module.getHP(id);
}

UI_Battle_Encounters_Encounter.prototype.getSpeed = function(id) {
	return this.module.getSpeed(id);
}

UI_Battle_Encounters_Encounter.prototype.getAC = function(id) {
	return this.module.getAC(id);
}


UI_Battle_Encounters_Encounter.prototype.getAbilitiMod = function(id, abr) {	
	return this.module.getAbilitiMod(id, abr);
};


UI_Battle_Encounters_Encounter.prototype.setDataToUpdate = function(enc) {
	this.$tbody.empty();
	this.name = this.initData.name = enc.name;
	enc.composition.forEach(
		function(o){
			this.$tbody.append('<tr><td width="30px" style="text-align:right;">'+o.amount+' &times;</td><td>'+o.name+'</td></tr>');
		}, this
	)
	this.dataToUpdate = enc;
	this.updateHTML({updateEncounter:true,name:true});
};

UI_Battle_Encounters_Encounter.prototype.updateEncounter = function() {

	var comp = this.dataToUpdate.composition;
	var newInitDataComposition = [];
	for (var i = comp.length - 1; i >= 0; i--) {
	 	newInitDataComposition.push({name:comp[i].name, amount:comp[i].amount});
	 }; 

	next:
	for (var i = this.composition.length - 1; i >= 0; i--) {
		if (this.composition[i].hero) {
			continue next;
		}
		for (var j = comp.length - 1; j >= 0; j--) {
			if (comp[j].name == this.composition[i].id) {
				if (--comp[j].amount < 0) {
					this.removeChararcter(i);
				}
				continue next;
			} 
		};
		this.removeChararcter(i);
	};
	for (var j = comp.length - 1; j >= 0; j--) {
		var amountStart = 0;
		for (var i = this.initData.composition.length - 1; i >= 0; i--) {
			if (this.initData.composition[i].name == comp[j].name) {
				amountStart = this.initData.composition[i].amount;
			}
		};
		for (var i = 0; i < comp[j].amount; i++) {
			this.addMonster({
				id : comp[j].name,
				key : this.composition.length,
				amount : this.arrAmount[amountStart+Number(i)],
				component : this,
				name : comp[j].name,
				type : 'monster'
			})
		}
	};
	this.initData.composition = newInitDataComposition;
	this.dataToUpdate = null;
	this.updateHTML();
};

UI_Battle_Encounters_Encounter.prototype.addMonster = function(o) {
	var m = new UI_Battle_Encounters_Encounter_Monster(o)
	this.composition.push(m);
	this.$list.append(m.$divInList)
}
UI_Battle_Encounters_Encounter.prototype.removeChararcter = function(key) {
	this.composition[key].$divInList.detach();
	this.composition.splice(key,1);
}

UI_Battle_Encounters_Encounter.prototype.updatingHero = function(heroData) {
	for (var i = this.composition.length - 1; i >= 0; i--) {
		if (this.composition[i].id == heroData.id) {
			this.composition[i].updatingHero(heroData.data)
			break;
		}	
	};
}


UI_Battle_Encounters_Encounter.prototype.addNewHero = function(hero) {
	var m = new UI_Battle_Encounters_Encounter_Hero({
		id : hero.id,
		key : this.composition.length,
		amount : '',
		component : this,
		name : app.local('New'),
		type : 'hero',
		hero : hero
	})
	this.composition.push(m);
	this.$list.append(m.$divInList)
}

UI_Battle_Encounters_Encounter.prototype.deleteHero = function(id) {
	for (var i = this.composition.length - 1; i >= 0; i--) {
		if (this.composition[i].id == id) {
			this.composition[i].$divInList.detach();
			this.composition.splice(i,1)
			break;
		}	
	};
}