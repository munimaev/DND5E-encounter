var UI_Class = function(component, o) {
	// if(!o.hasOwnProperty('div')) {
	// 	throw new Error('Нет свойства div');
	// } else {
	// 	if (typeof o.div == 'string') {
	// 		this.$div = $(o.div)
	// 	}
	// 	else {
	// 		this.$div = o.div;
	// 	}
	// }
	if(!component) {
		throw new Error('Нет свойства component');
	} else {
		this.component = component;
	}
	this.id = o.id;
	this.name = app.local(o.name);
	this.abilitisUpLevels = o.abilitisUpLevels;
	this.hits = o.hits;
	this.ownership = o.ownership;
	this.levels = o.levels;
	this.selected = false;

	this.subclass = null;
	this.subclasses = {};
	this.subclassesList = o.subclasses;

	this.createDiv();
	this.addSublcasses(o);

	this.component.events['changeClass'].push(this.reaction_changeClass());

}

UI_Class.prototype.createDiv = function() {
	this.$div = $('<div />', {class:'variant'});
	var func = this.createClick(this);
	this.$span = $('<span />', {class:'link',text:this.name,click:func});
	this.$div.append(this.$span);

	this.$features = $('<div />');
	this.createDivHits()
};

UI_Class.prototype.createDivHits = function() {
	var $div = $('<div />');


	var $h1 = $('<h5 />',{text:app.local('Hits')});

	var text1 = '';
	var text2 = '';
	var text3 = '';
	if (this.hits) {
		text1 = '1'+app.local('d')+this.hits.dice+' '+app.local('for each level')
		text2 = this.hits.firstLevel.base+' + '+app.local('modificator') + ' ' + app.local(this.hits.firstLevel.mods[0])
		text3 = '1'+app.local('d')+this.hits.dice+' ('+app.local('or')+' '+app.local(this.hits.nextLevel.alt)+')'+' + '+app.local('modificator') + ' ' + app.local(this.hits.firstLevel.mods[0])+ ' ' +app.local('for each level')
	}
	var $p1 = this.createFetureP(app.local('Hit Dices'),text1);
	var $p2 = this.createFetureP(app.local('Hits at 1 level'),text2);
	var $p3 = this.createFetureP(app.local('Hits at next level'),text3);




	var text4 = '';
	var text5 = '';
	var text6 = '';
	var text7 = '';
	var text8 = '';
	if (this.ownership) {

		var arrArm = [];
		var len = this.ownership.armor.length;
		for(var i = 0; i < len; i++) {
			if (this.ownership.armor[i].hasOwnProperty('type')) {
				arrArm.push(app.local(this.ownership.armor[i].type))	
			}
			else if (this.ownership.armor[i].hasOwnProperty('category')) {
				arrArm.push(app.local(this.ownership.armor[i].category))	
			}
		}
		text4 = arrArm.join(', ');

		var arrWpn = [];
		var len = this.ownership.weapon.length;
		for(var i = 0; i < len; i++) {
			if (this.ownership.weapon[i].hasOwnProperty('type')) {
				arrWpn.push(app.local(this.ownership.weapon[i].type))	
			}
			else if (this.ownership.weapon[i].hasOwnProperty('category')) {
				arrWpn.push(app.local(this.ownership.weapon[i].category))	
			}
		}
		text5 = arrWpn.join(', ');


		var arrIns = [];
		var len = this.ownership.instrument.length;
		for(var i = 0; i < len; i++) {
			if (this.ownership.instrument[i].hasOwnProperty('category')) {
				var txt = app.local(this.ownership.instrument[i].category)  + ' × ' +  this.ownership.instrument[i].number;
				if (this.ownership.instrument[i].restriction == 'any') {
					txt += ' ' + app.local('of you choice');
				}
				arrIns.push(txt)	
			}
		}
		text6 = arrIns.join(', ');


		var arrSav = [];
		var len = this.ownership.saveThrow.length;
		for(var i = 0; i < len; i++) {
			if (this.ownership.saveThrow[i].hasOwnProperty('category')) {
				var txt = '';
				if (this.ownership.saveThrow[i].category == 'ability') {
					txt += app.abr(this.ownership.saveThrow[i].ability, true);
				}
				arrSav.push(txt)	
			}
		}
		text7 = arrSav.join(', ');


		var arrSkl = [];
		var len = this.ownership.skill.length;
		for(var i = 0; i < len; i++) {
			if (this.ownership.skill[i].hasOwnProperty('category')) {
				var txt = app.local(this.ownership.skill[i].category)  + ' × ' +  this.ownership.skill[i].number;
				if (this.ownership.skill[i].restriction == 'any') {
					txt += ' ' + app.local('of you choice');
				}
				arrSkl.push(txt)	
			}
		}
		text8 = arrSkl.join(', ');



	}
	var $h2 = $('<h5 />',{text:app.local('Ownership')});
	var $p4 = this.createFetureP(app.local('Armors'),text4);
	var $p5 = this.createFetureP(app.local('Weapon'),text5);
	var $p6 = this.createFetureP(app.local('Instruments'),text6);
	var $p7 = this.createFetureP(app.local('Save throws'),text7);
	var $p8 = this.createFetureP(app.local('Skills'),text8);


	// var $h3 = $('<h4 />',{text:app.local('Progress')});
	var $d1 = this.createProgressDiv();


	this.$features
		.append($div
			.append($h1)
			.append($p1)
			.append($p2)
			.append($p3)

			.append($h2)
			.append($p4)
			.append($p5)
			.append($p6)
			.append($p7)
			.append($p8)


			// .append($h3)
			.append($d1)
		);

};

UI_Class.prototype.createFetureP = function(b,p,d) {
	var $div = $('<div />');
	if (p.substr(-2)!='. ') {
		if (p.substr(-1) != '.') p+='.';
		if (p.substr(-1) != ' ') p+=' ';
	}
	if (b.substr(-2)!='. ') {
		if (b.substr(-1) != '.') b+='.';
		if (b.substr(-1) != ' ') b+=' ';
	}
	var $p = $('<p/>',{class:'feture-p'})
	var $b = $('<b/>', {text: b})
	var $span = $('<span/>', {text: p})

	$div.append($p.append($b).append($span))

	if (d) {
		if (typeof d == 'string') {
			$div.append($('<div />').html(d))
		}
		else if (typeof d == 'function') {
			$div.append($('<div />').html(d(this)))
		}

	}
	return $div;
};
UI_Class.prototype.createFetureDiv = function(b,p,d) {
	var $div = $('<div />');
	if (p.length && p.substr(-2)!='. ') {
		if (p.substr(-1) != '.') p+='.';
		if (p.substr(-1) != ' ') p+=' ';
	}
	if (b.length && b.substr(-2)!='. ') {
		if (b.substr(-1) != '.') b+='.';
		if (b.substr(-1) != ' ') b+=' ';
	}

	// var $p = $('<p/>',{class:'feture-p'})
	var $h = $('<h5/>', {text: b})
	$div.append($h)

	var arr = p.split('\n');
	var len = arr.length;
	for (var i =0; i < len; i++) {
		$div.append($('<p/>', {text: arr[i]}))
	}
	// var $p = $('<p/>', {text: p})


	if (d) {
		if (typeof d == 'string') {
			$div.append($('<div />').html(d))
		}
		else if (typeof d == 'function') {
			$div.append($('<div />').html(d(this)))
		}

	}
	return $div;
};


UI_Class.prototype.createProgressDiv = function() {
	var $result = $('<div />');
	
	if (this.levels) {
		for (var i = 0; i <= 19; i++) {
			var args = {
				level : i,
				masteryBonus :  this.levels.masteryBonus ? this.levels.masteryBonus[i] : null,
				feats :  this.levels.feats ? this.levels.feats[i] : null
			}
			$result.append(this.createProgressLevelDiv(args));
		}
		var len = this.levels.length;
		for (var i = 0; i < len ; i++) {
			
		}
	}
	return $result;
};


UI_Class.prototype.createProgressLevelDiv = function(o) {
	var $result = $('<div />');

	var $h = $('<h4/>', {
		text: app.local('Level') + ' ' + (o.level+1)
	});
	$result.append($h);

	if (o.masteryBonus) {
		var $p1 = this.createFetureP(app.local('Mastery bonus'),'+'+o.masteryBonus);
		$result.append($p1);
	}
	if (o.feats && o.feats.length) {
		var len = o.feats.length;
		for (var i = 0; i < len; i++) {
			var feat = ClassFeats[o.feats[i]];
			$result.append(this.createFetureDiv(feat.b,feat.p,feat.d));
		}
	}



	return $result;
};

;



UI_Class.prototype.updateDiv = function() {
	if (this.selected) {
		this.$span.addClass('selected');
	} else {
		this.$span.removeClass('selected');
	}
};

UI_Class.prototype.createClick = function(self) {
	var self = this;
	return function() {
		self.component.selectClass(self.id)
	}
}



UI_Class.prototype.reaction_changeClass = function() {
	var self = this;
	return function(id) {
		var prev = self.selected;
		self.selected = self.id == id ? true : false;
		if (prev != self.selected) {

			console.log(self.subclassesList)
			console.log(self.subclasses);


			if (self.subclassesList && self.subclassesList.length) {
				self.component.selectSubClass(self.subclassesList[0])
			}

			self.updateDiv();

		}
	}
}

UI_Class.prototype.addSublcasses = function(o) {
	if (!o.hasOwnProperty('subclasses')) {
		return;
	}
	var len = o.subclasses.length;
	for (var i = 0; i < len; i++) {
		this.subclasses[o.subclasses[i]] = new UI_Subclass(this, o.subclasses[i]);
	}
}












var UI_Subclass = function(component, id) {
	if(!component) {
		throw new Error('Нет свойства component');
	} else {
		this.component = component;
	}
	this.levels = SubClasses[id].levels;
	this.selected = false;

	this.component.component.events['changeSubClass'].push(this.reaction_changeSubClass());
	this.createDiv();
}

UI_Subclass.prototype.createDiv = function() {
	this.$div = $('<div />', {class:'variant'});
	var func = this.createClick(this);
	this.$span = $('<span />', {class:'link',text:this.name,click:func});
	this.$div.append(this.$span);

	this.$features = $('<div />');
	this.$features.append(this.createProgressDiv())
};
UI_Subclass.prototype.createProgressDiv = function() {
	var $result = $('<div />');
	
	if (this.levels) {
		for (var i = 0; i <= 19; i++) {
			var args = {
				level : i,
				feats :  this.levels.feats ? this.levels.feats[i] : null
			}
			$result.append(this.createProgressLevelDiv(args));
		}
		var len = this.levels.length;
		for (var i = 0; i < len ; i++) {
			
		}
	}
	return $result;
};

UI_Subclass.prototype.createProgressLevelDiv = function(o) {
	if (!o.feats.length) {
		return '';
	}
	var $result = $('<div />');

	var $h = $('<h4/>', {
		text: app.local('Level') + ' ' + (o.level+1)
	});
	$result.append($h);

	if (o.feats && o.feats.length) {
		var len = o.feats.length;
		for (var i = 0; i < len; i++) {
			var feat = ClassFeats[o.feats[i]];
			$result.append(UI_Class.prototype.createFetureDiv.call(this,feat.b,feat.p,feat.d));
		}
	}



	return $result;
}

UI_Subclass.prototype.reaction_changeSubClass = function() {
	var self = this;
	return function(id) {
		var prev = self.selected;
		self.selected = self.id == id ? true : false;
		if (prev != self.selected) {
			self.updateDiv();
		}
	}
}


UI_Subclass.prototype.createClick = function(self) {
	var self = this;
	return function() {
		self.component.selectSubClass(self.id)
	}
}
