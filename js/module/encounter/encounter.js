var UI_Encounter = function(o) {
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


UI_Encounter.prototype.init = function(o) {


	this.$el = $('<div />', {id:'el'});
	this.$div.append(this.$el)
	this.$emsml = $('<div />', {id:'emsml'});
	this.$div.append(this.$emsml)
	this.$emm = $('<div />', {id:'emm'});
	this.$div.append(this.$emm)

	this.$eml = $('<div />', {id:'eml'});
	this.$emsml.append(this.$eml)
	this.$ems = $('<div />', {id:'ems'});
	this.$emsml.append(this.$ems)


	this.uiEncounterList = new UI_Encounter_list({div:this.$el,module:this});
	this.encouterDB = new UI_Encounter_data();

	var msSubHeaderBtn = [{
		eventName: 'addMonster',
		text : 'btn_AddToEncounter'
	}];

	this.uiMonsterStats = new UI_Monster_stats({
		div: this.$emm,
		module: this,
		preInit: {
			subHeaderButton: msSubHeaderBtn
		}
	});
	this.uiMonsterList = new UI_Monster_list({
		div: this.$eml,
		module: this
	});
	this.uiMonsterSearch = new UI_Monster_search({
		div: this.$ems,
		module: this,
		preInit: {
			inputSerachOnEnter: 'addMonster'
		}
	});

	this.bestiary = new UI_Monster_data();


	this.uiEncounterList.init();
	this.encouterDB.init();

	this.bestiary.init();
	this.uiMonsterStats.init();
	this.uiMonsterList.init();
	this.uiMonsterSearch.init();

	
	this.bindEvents();
};

UI_Encounter.prototype.updateHTML = function(o) {
	if (!o || o.displayed) {
		if (this.displayed) {
			this.$div.removeClass('nondisplay');
		} else {
			this.$div.addClass('nondisplay');
		}
	}
};





UI_Encounter.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Encounter.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}


UI_Encounter.prototype.bindEvents= function() {

	this.app.signUpForAnEvent('selectModule', function(self){
		return function(moduleId) {
			var prev = self.displayed;
			self.displayed = self.id == moduleId ? true : false;
			if (prev != self.displayed) {
				self.updateHTML();
			}
		}
	}(this));

	this.signUpForAnEvent('encounterCansel', function(self){
		return function() {
			self.app.callEvent('selectModulePrev');
		}
	}(this));


	this.signUpForAnEvent('encounterUpdate', function(self){
		return function(enc) {
			self.app.callEvent('selectModulePrev');
			self.app.callEvent('encounterUpdate',enc);
		}
	}(this));


	this.app.signUpForAnEvent('encounterEdit', function(self){
		return function(encounterObj) {
			self.uiEncounterList.data = encounterObj.initData
			self.uiEncounterList.init();
		}
	}(this));

	this.app.signUpForAnEvent('encounterNew', function(self){
		return function(encounterObj) {

			self.uiEncounterList.data = {
				name : app.local('New'),
				id : 'encounter_'+ new Date().getTime(),
				composition : []
			}
			self.uiEncounterList.init();
		}
	}(this));


	this.signUpForAnEvent('encounterDelete', function(self){
		return function(id) {
			self.app.callEvent('encounterDelete',id);
		}
	}(this));

	this.signUpForAnEvent('encounterJSON', function(self){
		return function(json) {
			self.app.callEvent('popupJSON',json);
		}
	}(this));



}

UI_Encounter.prototype.getSelectedMonsterInList = function() {
	return this.uiMonsterList.selectedMonster[0].name
}