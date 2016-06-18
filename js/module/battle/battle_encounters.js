var UI_Battle_Encounters = function(o) {
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
	this.id = o.id;
	this.displayed = false;
	this.events = {};
}

UI_Battle_Encounters.prototype.init = function() {
	this.createHtml();

	this.encounters = [];
	this.encountersIndex = {};
	this.encounter = null;
	this.genEncounters();

	this.bindEvents();

};


UI_Battle_Encounters.prototype.createHtml = function() {
	this.$encounters = $('<div />', {id: 'bel'});
	this.$div.append(this.$encounters);
	this.$monsters = $('<div />', {id: 'bml'});
	this.$div.append(this.$monsters);
	this.$stats = $('<div />', {id: 'bms'});
	this.$div.append(this.$stats);

	var header = $('<h5 />', {
		class: 'block-header',
		text: app.local('Encounter list')
	})
	this.$encounters.append(header)


	this.$buttons = $('<div />',{class:'block-padding'})
	this.$encounters.append(this.$buttons);
	

	this.$buttonNewEncounter = $('<span />', {
		class: 'inline-button monster-subHeaderButton',
		text: app.local('New'),
		click: function(self) {
			return function() {
				self.app.callEvent('encounterNew');
			}
		}(this)
	});
	this.$buttons.append(this.$buttonNewEncounter);


	this.$buttonLoad = $('<span />', {
		class: 'inline-button monster-subHeaderButton',
		text: app.local('Load'),
		click: function(self) {
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
					self.genEncounterFunc(data, self.encounters.length)
				}

			}
		}(this)
	});
	this.$buttons.append(this.$buttonLoad);



	this.$list = $('<div/>', {
		class: 'block-list'
	}).css({top:'70px'})
	this.$encounters.append(this.$list)



	var msSubHeaderBtn = [{
		eventName: 'monsterHP',
		text : '-10 hp',
		arg : -10,
	},{
		eventName: 'monsterHP',
		text : ' -5 hp',
		arg :  -5,
	},{
		eventName: 'monsterHP',
		text : ' -1 hp',
		arg :  -1,
	},{
		eventName: 'monsterHP',
		text : ' +1 hp',
		arg :  1,
	},{
		eventName: 'monsterHP',
		text : ' +5 hp',
		arg :  5,
	},{
		eventName: 'monsterHP',
		text : '+10 hp',
		arg : 10,
	}];
	this.uiMonsterStats = new UI_Monster_stats({
		div: this.$stats,
		module: this,
		preInit: {
			subHeaderButton: msSubHeaderBtn
		}
	});
	this.bestiary = new UI_Monster_data();
	this.bestiary.init();
	this.uiMonsterStats.init();


}
UI_Battle_Encounters.prototype.updateHTML = function(o) {
	if (!o || o.displayed) {
		if (this.displayed) {
			this.$div.removeClass('nondisplay');
		} else {
			this.$div.addClass('nondisplay');
		}
	}
};




UI_Battle_Encounters.prototype.genEncounters = function() {
	var arr = this.getEncountersData();
	arr.forEach(function(o, i, a) {
		this.genEncounterFunc(o,i)
	}, this)

};
UI_Battle_Encounters.prototype.genEncounter = function(o, key) {
	return new UI_Battle_Encounters_Encounter({
		key : key,
		module: this,
		data: o,
		div: this.$list
	});
};
UI_Battle_Encounters.prototype.genEncounterFunc = function(o, i) {
		var e = this.genEncounter(o, i);
		this.encounters.push(e);
		this.$list.append(e.$divInList);
		this.encountersIndex[o.id] = e;
};


UI_Battle_Encounters.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}

UI_Battle_Encounters.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}




UI_Battle_Encounters.prototype.bindEvents = function() {
	this.signUpForAnEvent('selectEncounter',function(self){
		return function(key){
			self.setNewEncounter(key);
		}
	}(this))



	this.signUpForAnEvent('monsterHP', function(self){
		return function(hp) {
			if (self.encounter) {
				if (self.encounter.monster) {
					if (self.encounter.monster.hero) {
						self.app.callEvent('battleHP',{hp:hp,heroId:self.encounter.monster.id})
					} else {
						self.encounter.monster.changeHP(hp)	
					}
				}
			}
		}
	}(this));

	this.app.signUpForAnEvent('battleHP', function(self){
		return function(data) {
			self.callEvent('battleHP',data);
		}
	}(this));


	this.signUpForAnEvent('encounterEdit', function(self){
		return function(id) {
			self.app.callEvent('encounterEdit',self.encounters[id]);
		}
	}(this));

	this.app.signUpForAnEvent('selectModule', function(self){
		return function(moduleId) {
			var prev = self.displayed;
			self.displayed = self.id == moduleId ? true : false;
			if (prev != self.displayed) {
				self.updateHTML();
			}
		}
	}(this))

	this.app.signUpForAnEvent('encounterUpdate', function(self){
		return function(enc) {
			if (self.encountersIndex.hasOwnProperty(enc.id)) {
				self.encountersIndex[enc.id].setDataToUpdate(enc);
			} else {
				self.genEncounterFunc(enc, self.encounters.length);
			}
		}
	}(this));


	this.app.signUpForAnEvent('encounterDelete', function(self){
		return function(id) {
			var key = self.encountersIndex[id].key;
			self.encountersIndex[id].$div.detach();
			delete self.encountersIndex[id];
			self.encounters[key].$divInList.detach();
			self.encounters.splice(key,1);

			self.encounters.forEach(function(o,i,a){
				o.key = i;
			})
		}
	}(this));


	this.app.signUpForAnEvent('updatingHero', function(self){
		return function(heroData) {
			for (var i = self.encounters.length - 1; i >= 0; i--) {
				self.encounters[i].updatingHero(heroData)
			};
		}
	}(this));


	this.app.signUpForAnEvent('heroNew', function(self){
		return function(id) {
			for (var i = self.encounters.length - 1; i >= 0; i--) {
				self.encounters[i].addNewHero(id)
			};
		}
	}(this));

	this.app.signUpForAnEvent('heroDelete', function(self){
		return function(id) {
			for (var i = self.encounters.length - 1; i >= 0; i--) {
				self.encounters[i].deleteHero(id)
			};
		}
	}(this));



}


UI_Battle_Encounters.prototype.setNewEncounter = function(key) {
	if (this.encounter) {
		this.encounter.$div.detach();
	}
	this.encounter = this.encounters[key];
	if (this.encounter) {
		this.$monsters.append(this.encounter.$div);
	}
};



UI_Battle_Encounters.prototype.getHP = function(id) {
	var reg = new RegExp(/\s*(\d*)\s*d\s*(\d*)\s*(?=\+\s*(\d*)|)/)
	var a = reg.exec(this.bestiary.base[id].hpFormula)
	var result = 0;
	for (var i = 1 ; i<= a[1]; i++) {
		var add = 1 + Math.round( Math.random() * (a[2]-1))
			result += add;
	}
	if (a[3]) {
		result += Number(a[3])
	}
	return result;
}


UI_Battle_Encounters.prototype.getAC = function(id) {
	var result = this.bestiary.base[id].ac;
	return result;
}

UI_Battle_Encounters.prototype.getSpeed = function(id) {
	var result = this.bestiary.base[id].speed;
	return result;
}


UI_Battle_Encounters.prototype.getAbilitiMod = function(id, abr) {	
	var lower = abr.toLowerCase();
	return this.bestiary.base[id][lower];
};




UI_Battle_Encounters.prototype.getEncountersData = function(o) {
	return [{
		id: 'Пяточок гоблинов',
		name: 'Пяточок гоблинов',
		composition: [{
			name: 'Гоблин (Goblin)',
			amount: 2
		}, ]
	}, {
		id: 'Псарня',
		name: 'Псарня',
		composition: [{
			name: 'Волк (Wolf)',
			amount: 3
		}, ]
	}, {
		id: 'Гоблинская берлога',
		name: 'Гоблинская берлога',
		composition: [{
			name: 'Гоблин (Goblin)',
			amount: 6
		}, ]
	}, {
		id: 'Пещера с двумя водоемами',
		name: 'Пещера с двумя водоемами',
		composition: [{
				name: 'Гоблин (Goblin)',
				amount: 2
			},

		]
	}, {
		id: 'Пещера кларга Медвежатник',
		name: 'Пещера кларга Медвежатник',
		composition: [{
			name: 'Волк (Wolf)',
			amount: 1
		}, {
			name: 'Гоблин (Goblin)',
			amount: 2
		}, ]
	}]
};


UI_Battle_Encounters.prototype.getPartyData = function() {
	return this.app.uiParty.party
};



UI_Battle_Encounters.prototype.getHeroStateForMonsterView = function(name) {
	return this.app.getHeroStateForMonsterView(name);
}

UI_Battle_Encounters.prototype.getEncountersArray = function () {
	var arr = [];
	var len = this.encounters.length;
	for (var i = 0 ; i < len; i++) {
		arr.push(this.encounters[i].initData)
	};
	return arr;
}
UI_Battle_Encounters.prototype.deleteAll = function () {

	for (var i = this.encounters.length - 1; i >= 0; i--) {
		this.app.callEvent('encounterDelete', this.encounters[i].id)
	};

}