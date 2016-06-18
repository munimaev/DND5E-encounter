var UI_Monster_search = function(o) {
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
	if (o.hasOwnProperty('preInit')) {
		this.preInit(o.preInit)
	}
}


UI_Monster_search.prototype.init = function() {
	this.createHTML();
	this.updateHTML();
}

UI_Monster_search.prototype.createHTML = function() {
	var len = this.module.bestiary.list.length;
	this.$div.empty();
	this.$div.append($('<h5 />',{class:'block-header',text:app.local('Search')}))
	var inputWrap = $('<div />',{class:'block-pading'})
	var $input = $('<input />',{type:'text', class: 'monster-search-input'});

	$input.keyup(this.genKeyupFunc());
	$input.keydown(this.genKeydownFunc());
	inputWrap.append($input);
	this.$div.append(inputWrap);
};

UI_Monster_search.prototype.updateHTML = function() {
	var len = this.module.bestiary.list.length;
	this.$div.empty();
	this.$div.append($('<h5 />',{class:'block-header',text:app.local('Search')}))

	var $input = $('<input />',{type:'text', class: 'monster-search-input'});
	$input.keyup(this.genKeyupFunc());
	$input.keydown(this.genKeydownFunc());
	this.$div.append($input);
};





UI_Monster_search.prototype.onEnter = function() {
	return true;
}

UI_Monster_search.prototype.preInit = function(preInit) {
	if (preInit.hasOwnProperty('inputSerachOnEnter')) {
		if (preInit.inputSerachOnEnter == 'addMonster') {
			this.onEnter = function(self) {
				return function() {
					self.module.callEvent('addMonster', self.module.getSelectedMonsterInList());
					return false;
				}
			}(this)
		}
	}
}

UI_Monster_search.prototype.genKeyupFunc = function() {
	var self = this;
	return function(e) {
		if (e.keyCode == 38 || e.keyCode == 40 ) {
			return false;
		}
		var val = $(this).val();
		self.module.callEvent('searchFilter', val);
	}
}

UI_Monster_search.prototype.genKeydownFunc = function() {
	var self = this;
	return function(e) {
		if (e.keyCode == 38) {
			self.module.callEvent('searchMonsterPrevious');
			return false;
		}
		if (e.keyCode == 40 ) {
			self.module.callEvent('searchMonsterNext');
			return false;
		}
		if (e.keyCode == 13 ) {
			return self.onEnter();
		}
	}
}












