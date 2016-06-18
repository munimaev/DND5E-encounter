var UI_Battle = function(o) {


	this.$popupWrap = $('#popup-wrap');
	this.$popupWrap.click(function(e){
		if( e.target.id == 'popup-wrap') {
			$(this).addClass('nondisplay');
		}
	})
	this.$popup = $('#popup');

	this.currentModule = null;
	this.previousModule = null;

	this.events = {};
	this.bindEvents();




	this.uiHeader = new UI_Header({div:'#h', app:this, id:'header'});
	this.uiEncounters = new UI_Encounter({div:'#e', app:this, id:'encounter'});
	this.uiBattle = new UI_Battle_Encounters({div:'#b', app:this, id:'battle'});
	this.uiParty = new UI_Party({div:'#p', app:this, id:'party'});
	this.uiOptions = new UI_Options({div:'#o', app:this, id:'options'});
	// this.uiChargen = new UI_Chargen({div:'#c', app:this, id:'chargen'});

	this.modulesIndex = {
		uiHeader : this.uiHeader,
		uiEncounters : this.uiEncounters,
		uiBattle : this.uiBattle,
		uiParty : this.uiParty,
		uiOptions : this.uiOptions,
		// uiChargen : this.uiChargen,
	}
	this.modules = [
		this.uiHeader,
		this.uiEncounters,
		this.uiBattle,
		this.uiParty,
		this.uiOptions,
		// this.uiChargen
	]


	this.uiHeader.init();
	this.uiBattle.init();
	this.uiEncounters.init();
	this.uiOptions.init();
	// this.uiChargen.init();

	this.callEvent('selectModule','party')
	this.uiParty.callEvent('selectHero','Барик Теоденович')

}

UI_Battle.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Battle.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}

UI_Battle.prototype.getHeroStateForMonsterView = function(name) {
	return this.uiParty.partyIndex[name].data;
}

UI_Battle.prototype.bindEvents = function() {

	this.signUpForAnEvent('selectModule', function(self){
		return function(moduleId) {
			self.previousModule = self.currentModule;
			self.currentModule = moduleId;
		}
	}(this))

	this.signUpForAnEvent('selectModulePrev', function(self){
		return function() {
			self.callEvent('selectModule',self.previousModule)
		}
	}(this))

	this.signUpForAnEvent('encounterEdit', function(self){
		return function(encounterId) {
			self.callEvent('selectModule','encounter')
		}
	}(this))

	this.signUpForAnEvent('encounterNew', function(self){
		return function() {
			self.callEvent('selectModule','encounter')
		}
	}(this))


	this.signUpForAnEvent('popupJSON', function(self){
		return function(json) {
			self.$popup.html(JSON.stringify(json))
			self.$popupWrap.removeClass('nondisplay');
		}
	}(this))

	this.signUpForAnEvent('optionJSON', function(self){
		return function() {
			var json = {
				encounters : self.uiBattle.getEncountersArray(),
				party      : self.uiParty.getPartyArray(),
			}

			self.$popup.html(JSON.stringify(json))
			self.$popupWrap.removeClass('nondisplay');
		}
	}(this))

	this.signUpForAnEvent('optionLoad', function(self){
		return function() {


			var result = prompt(app.local('Load') + ' JSON', '');
			var data = null;
			try {data = JSON.parse(result); 
			}			
			catch (e) {
				alert(app.local('Error in JSON'));
				data = null;
			}

			if (data) {
				self.uiBattle.deleteAll();
				var len = data.encounters.length;
				for(var i = 0; i < len; i++) {
					self.uiBattle.genEncounterFunc(data.encounters[i], self.uiBattle.encounters.length)
				}

				self.uiParty.deleteAll();
				var len = data.party.length;
				for(var i = 0; i < len; i++) {
					
					var hero = new UI_Party_Hero({data: data.party[i], statdiv: self.uiParty.$heroeStats, module:self.uiParty});
					self.uiParty.party.push(hero);
					self.uiParty.partyIndex[hero.id] = hero;
					self.uiParty.$list.append(hero.$divInList);
					self.uiParty.app.callEvent('heroNew',hero)
				}
			}

		}
	}(this))


}

