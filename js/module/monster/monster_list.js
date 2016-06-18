var UI_Monster_list = function(o) {

	this.selectedMonster = [];
	this.filtredMonster = [];
	this.allMonsters = {};
	this.textFilter = null;
	this.textFilterPrev = null;

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

	this.events = {};
	this.bindEvents();
}

UI_Monster_list.prototype.init = function() {

	this.$div.addClass('monsterList');

	var len = this.module.bestiary.list.length;
	this.filtredMonster = [];
	// console.log(this.textFilter)
	for (var i = 0; i < len; i++) {
		if (this.textFilter === null || ~this.module.bestiary.list[i].indexOf(this.textFilter)) {

			var element = this.createMonster({
				name: this.module.bestiary.list[i]
			})
			this.filtredMonster.push({
					name: this.module.bestiary.list[i], element: element
			});
			this.$div.append(element);

		}
	}

	this.updateHTML();


}


UI_Monster_list.prototype.updateHTML = function() {
	for (var i = this.selectedMonster.length - 1; i >= 0; i--) {
		this.selectedMonster[i].obj.div.addClass('monsterList-monster__selected')
	};
	if (this.textFilter != this.textFilterPrev) {
		this.filtredMonster = []
		for (var i in this.allMonsters) {
			if (this.textFilter === null || ~i.indexOf(this.textFilter)) {
				this.allMonsters[i].div.removeClass('nondisplay')
				this.filtredMonster.push({name:i,obj:this.allMonsters[i]})
			} else {
				this.allMonsters[i].div.addClass('nondisplay')
			}
		}
		this.textFilterPrev = this.textFilter;
	}
};


UI_Monster_list.prototype.createMonster = function(o) {
	if(!o.hasOwnProperty('name')) {
		throw new Error('Нет свойства div');
	}
	var result = this.allMonsters[o.name]
	if (result) {
		return result.div;
	} else {
		this.allMonsters[o.name] = {};
	}

	var tag = o.tag || 'div';
	var self = this;
	var func = function(name) {
		return function() {

			self.selectMonster(name, this);
		}
	}(o.name)
	var name = o.name;
	name = name.replace('(','<br><span class="small">')
	name = name.replace(')','</span>')

	var $span = $('<span />',{});
	$span.html(name);

	var htmlClass = 'link monsterList-monster';
	for (var j = this.selectedMonster.length - 1; j >= 0; j--) {
		if (o.name == this.selectedMonster[j].name) {
			htmlClass += " monsterList-monster__selected";
			break;
		}
	};

	var $div = $('<div />', {
		class: htmlClass ,
		click : func
	}).append($span)

	 this.allMonsters[o.name].div = $div;
	return $div;
}


UI_Monster_list.prototype.selectMonster = function(name) {
	
	this.unselectAllMonster();
	this.selectedMonster.push({obj:this.allMonsters[name],name:name});
	this.module.callEvent('showMonster',name)
	this.updateHTML();

}


UI_Monster_list.prototype.unselectAllMonster = function(needUpd) {
		
	for (var i = this.selectedMonster.length - 1; i >= 0; i--) {
		this.selectedMonster[i].obj.div.removeClass('monsterList-monster__selected')
	};
	this.selectedMonster = [];
	if (needUpd) this.updateHTML();

}


UI_Monster_list.prototype.filter = function(o) {
	this.textFilter = o.text || null;
	this.updateHTML(); 
}

UI_Monster_list.prototype.selectPrevious = function() {
	if (!this.filtredMonster.length) {
		return;
	}
	if (!this.selectedMonster.length) {
		var ind = 0;	
	} else {
		var ind = this.indexOfFiltred(this.selectedMonster[0].name);
	}
	if (ind < 1) {
		ind = 1;
	}
	this.selectMonster(this.filtredMonster[ind-1].name, this.filtredMonster[ind-1].element)


}
UI_Monster_list.prototype.selectNext = function() {
	var filtredLength = this.filtredMonster.length;
	var selectedLength = this.selectedMonster.length;
	if (!filtredLength) {
		return;
	}
	if (!selectedLength) {
		this.selectMonster(this.filtredMonster[0].name);
		return;
	}
	var ind = this.indexOfFiltred(this.selectedMonster[selectedLength-1].name);
	if (ind < 0) {
		throw new Error('Не найден последний текущий монстр');
	}
	if (ind >= filtredLength - 1) {
		ind = filtredLength - 2;
	}
	this.selectMonster(this.filtredMonster[ind+1].name)
}

UI_Monster_list.prototype.indexOfFiltred = function(name) {
	for (var i = this.filtredMonster.length - 1; i >= 0; i--) {
		if (this.filtredMonster[i].name == name) {
			return i;
		}
	};
	return -1;
}










UI_Monster_list.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Monster_list.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}


UI_Monster_list.prototype.bindEvents= function() {

	this.module.signUpForAnEvent('searchMonsterPrevious', function(self){
		return function() {
			self.selectPrevious()
		}
	}(this))

	this.module.signUpForAnEvent('searchMonsterNext', function(self){
		return function() {
			self.selectNext()
		}
	}(this))

	this.module.signUpForAnEvent('searchFilter', function(self){
		return function(filter) {
			self.filter({text:filter})
		}
	}(this))

}

