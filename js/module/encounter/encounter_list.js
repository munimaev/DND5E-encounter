var UI_Encounter_list = function(o) {
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

	this.data = {
		id: 'Пяточок гоблинов',
		name: 'Пяточок гоблинов',
		composition: [
			{name:'Ааракокра (Aarakocra)',amount:3},
			{name:'Древний Синий Дракон (Ancient Blue Dragon)',amount:1},
			{name:'Разбуженный Куст (Awakened Shrub)',amount:4},
			{name:'Синий Слаад (Blue Slaad)',amount:2},
			{name:'Аватар Смерти (Avatar of Death)',amount:5}
		]
	}


	// this.compound = {};
	// this.selectedMonster = [];


	//==================

	this.events = {};
	this.bindEvents();

	this.monsters = []
	this.monsterIndex = {};
	this.inited = false;
	// this.init();
}

UI_Encounter_list.prototype.init = function() {
	
	this.name = this.data.name;
	this.id = this.data.id;
	this.composition = this.data.composition;

	if (this.monsters.length) {
		this.monsters.forEach(
			function(o){
				o.$div.detach();
			}, this
		)
		this.monsters = []
		this.monsterIndex = {};
	}

	this.composition.forEach( function(o,i){
		var m = new UI_Encounter_List_Monster({data: o, component: this});
		this.monsters.push(m);
		this.monsterIndex[o.name] = m;
	}, this);

	if (!this.inited) {
		this.createHTML();
	}

	this.updateHTML();
	this.inited = true;
}


UI_Encounter_list.prototype.createHTML = function() {
	this.$blockHeader = $('<h5 />', {class:'block-header',text:app.local('Encounter compound')})
	this.$div.append(this.$blockHeader);

	this.$buttons = $('<div />',{class:'block-padding'}).css('padding-bottom','0.2em')
	this.$div.append(this.$buttons);


	this.$buttonDelete = $('<span />', {
		class: 'inline-button monster-subHeaderButton',
		text: app.local('Delete'),
		click: function(self) {
			return function() {
				if (confirm(app.local('Delete') + '?')) {
					self.module.callEvent('encounterDelete', self.id);
				}
			}
		}(this)
	});
	this.$buttons.append(this.$buttonDelete);


	this.$buttonSave = $('<span />', {
		class: 'inline-button monster-subHeaderButton',
		text: app.local('Save'),
		click: function(self) {
			return function() {
				self.module.callEvent('encounterUpdate', {
					id: self.id,
					name: self.name,
					composition: self.genComposition()
				});
			}
		}(this)
	});
	this.$buttons.append(this.$buttonSave);


	this.$buttonUpdate = $('<span />', {
		class: 'inline-button monster-subHeaderButton',
		text: app.local('Update'),
		click: function(self) {
			return function() {
				self.module.callEvent('encounterUpdate', {
					id: self.id,
					name: self.name,
					composition: self.genComposition()
				});
			}
		}(this)
	});
	this.$buttons.append(this.$buttonUpdate);

	this.$buttonCansel = $('<span />', {
		class: 'inline-button monster-subHeaderButton',
		text: app.local('Cansel'),
		click: function(self) {
			return function() {
				self.module.callEvent('encounterCansel');
			}
		}(this)
	});
	this.$buttons.append(this.$buttonCansel);


	this.$buttonJSON = $('<span />', {
		class: 'inline-button monster-subHeaderButton',
		text: app.local('JSON'),
		click: function(self) {
			return function() {
				self.module.callEvent('encounterJSON',{
					id: self.id,
					name: self.name,
					composition: self.genComposition()
				});
			}
		}(this)
	});
	this.$buttons.append(this.$buttonJSON);
	

	var $inputWrapper = $('<div />', {class:'block-padding'})
	this.$div.append($inputWrapper);
	this.$header = $('<input />', {type:'text', class:'inlineInput e-name', value:this.name})
	this.$header.keyup(function(self){
		return function() { 
			var val = $(this).val();
			self.name = val;
		}
	}(this))
	$inputWrapper.append(this.$header);


	this.$blockList = $('<div />', {class:'block-list',style:'top:82px;'})
	this.$div.append(this.$blockList);

	this.$divInList = $('<div />', {class:'e-encounter withHoverButtons'});
	this.$blockList.append(this.$divInList);

	var table = $('<table />', {class:'e-composition'});
	this.$composition = $('<tbody />');
	this.$divInList.append(table.append(this.$composition));

};


UI_Encounter_list.prototype.updateHTML = function() {
	this.$header.val(this.name);
	this.monsters.forEach(
		function(o){
			o.$div.detach();
		}, this
	)
	this.monsters.forEach(
		function(m){
			this.$composition.append( m.$div );
		}, this
	)
	
};





UI_Encounter_list.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Encounter_list.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}


UI_Encounter_list.prototype.bindEvents= function() {

	this.signUpForAnEvent('zeroAmount', function(self){
		return function(monsterId) {
			self.monsterIndex[monsterId].$div.remove();
			for (var i = self.monsters.length - 1; i >= 0; i--) {
				if (self.monsters[i].id == monsterId) {
					self.monsters.splice(i,1)
				}
			};
			delete self.monsterIndex[monsterId];
		}
	}(this))

	this.signUpForAnEvent('showMonster', function(self){
		return function(monsterId) {
			self.module.callEvent('showMonster',monsterId);
		}
	}(this))


	this.module.signUpForAnEvent('addMonster', function(self){
		return function(monsterId) {
			console.log('monsterId',monsterId)
			if (self.monsterIndex[monsterId]) {
				self.monsterIndex[monsterId].changeAmount(1)
			} else {
				var m = new UI_Encounter_List_Monster({data: {id:monsterId,name:monsterId,amount:1}, component: self});
				self.monsters.push(m);
				self.monsterIndex[monsterId] = m;
				self.updateHTML();
			}
		}
	}(this));

}



UI_Encounter_list.prototype.genComposition = function() {
	var result = [];
	for (var i = this.monsters.length - 1; i >= 0; i--) {
		result.push({name:this.monsters[i].id, amount:this.monsters[i].amount});
		
	};
	return result;
}