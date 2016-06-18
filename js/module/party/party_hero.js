var UI_Party_Hero = function(o) {
	if (!o.hasOwnProperty('module')) {
		throw new Error('Нет свойства module');
	} else {
		this.module = o.module;
	}
	this.id = o.data.id;
	this.data = o.data;
	this.displayed = false;
	this.$stats = o.statdiv;
	this.init();
	this.createHTML();
	this.updateHTML();
}

UI_Party_Hero.prototype.init = function() {
	var arr = ['name','type','race','exp','class','level','initiative', 'speed', 'ac', 'hp','hpCurrent','hitDice','hitDiceTotal','hitDiceCurrent','SpellcastingAbility','SpellSaveDC','SpellAttackBonus', 'attacks'];

	for (var i = arr.length - 1; i >= 0; i--) {
		this[arr[i]] = this.data[arr[i]]
	};

	this.aligment = this.data.aligment;
	this.skills = [];
	this.skillsIndex = {};
	this.bindEvents();
};


UI_Party_Hero.prototype.keyupBind = function(attr) {
	this['$'+attr].keyup(function(self, attr){
		return function(e) {
			self.data[attr] = $(this).val();
			self.updateHTML({without:attr});
			self.updating();
		}
	}(this, attr))
}

UI_Party_Hero.prototype.createHTML = function() {
	this.createHTMLInList();
	this.createHTMLStats();

	var arr = ['name', 'class', 'race', 'level', 'aligment', 'exp', 'initiative', 'speed', 'ac', 'hp', 'hpCurrent', 'hitDiceTotal', 'hitDice', 'hitDiceCurrent', 'spellcastingAbility', 'spellSaveDC', 'spellAttackBonus']
	for (var i = arr.length - 1; i >= 0; i--) {
		this.keyupBind(arr[i]);
	};

}

UI_Party_Hero.prototype.createHTMLInList = function() {
	this.$divInList = $('<div />', {class:'batle-encounter withHoverButtons'});
	var funcSelcet = function(self) {
		return function() {
			self.module.callEvent('selectHero',self.id);
		}
	}(this)

	this.$l_header = $('<div />', {
		class: 'batle-encounter-name link',
		text: this.name,
		click: funcSelcet
	})
	this.$divInList.append(this.$l_header );

	this.$l_subheader = $('<div />', {
		class: 'party-hero-type',
		text: this.race + ', ' + this.class + ', ' + app.local('Level') + ' ' + this.level,
		click: funcSelcet 
	})
	this.$divInList.append(this.$l_subheader);


	this.$hoverButtons = $('<div />',{class:'hoverButtons hoverButtons-topRight'});
	this.$hoverButtonEdit = $('<span />', {
		class: 'inline-button hoverButton',
		text: app.local('Delete'),
		click: function(self){
			return function() {
				if (window.confirm(app.local('Delete')+'?')) {
					self.module.callEvent('heroDelete',self.id);
				}
			}
		}(this)
	});
	this.$hoverButtons.append(this.$hoverButtonEdit);
	this.$divInList.append(this.$hoverButtons);


	this.$hoverButtonJSON = $('<span />', {
		class: 'inline-button hoverButton',
		text: app.local('json'),
		click: function(self){
			return function() {
				self.module.callEvent('heroJSON',self.data);
			}
		}(this)
	});
	this.$hoverButtons.append(this.$hoverButtonJSON);

}

UI_Party_Hero.prototype.createHTMLStats = function() {
	this.$divStats = $('<div />', {class:'party-hero-stats'});
	var base = $('<div />', {class:'party-hero-base'});
	var name = $('<div />', {class:'party-hero-name'});
	var nameTitle = $('<div />', {class:'party-hero-title', text: app.local('Name')});
	var nameValue = $('<div />', {class:'party-hero-value-large'});
	this.$name = $('<input />', {class:'heroInput', value: this.data.name});

	var baseother = $('<div />', {class:'party-hero-baseother'});

	var klass = $('<div />', {class:'party-hero-class'});
	var klassTitle = $('<div />', {class:'party-hero-title', text: app.local('Class')});
	var klassValue = $('<div />', {class:'party-hero-value'});
	this.$class = $('<input />', {class:'heroInput', value: app.local(this.class)});

	var race = $('<div />', {class:'party-hero-race'});
	var raceTitle = $('<div />', {class:'party-hero-title', text: app.local('Race')});
	var raceValue = $('<div />', {class:'party-hero-value'});
	this.$race = $('<input />', {class:'heroInput', value: app.local(this.race)});

	var level = $('<div />', {class:'party-hero-level'});
	var levelTitle = $('<div />', {class:'party-hero-title', text: app.local('Level')});
	var levelValue = $('<div />', {class:'party-hero-value'});
	this.$level = $('<input />', {class:'heroInput', value: this.data.level});


	var aligment = $('<div />', {class:'party-hero-aligment'});
	var aligmentTitle = $('<div />', {class:'party-hero-title', text: app.local('Aligment')});
	var aligmentValue = $('<div />', {class:'party-hero-value'});
	this.$aligment = $('<input />', {class:'heroInput', value: app.local(this.aligment)});

	var exp = $('<div />', {class:'party-hero-exp'});
	var expTitle = $('<div />', {class:'party-hero-title', text: app.local('Exp')});
	var expValue = $('<div />', {class:'party-hero-value'});
	this.$exp = $('<input />', {class:'heroInput', value: this.data.exp});


	var abilities = $('<div />', {class:'party-hero-abilities'});

	var proficiencyBonusTable = this.createHTMLproficiencyTable();


	var abilitiesTable = this.createHTMLAbilityTable();
	this.createHTMLSaveThrow();
	this.createHTMLSkills();

	var battle = $('<div />', {class:'party-hero-battle'});






	var block3 = $('<div />', {class:'party-hero-battle'});
	
	var initiative = $('<div />', {class:'party-hero-initiative'});
	var initiativeTitle = $('<div />', {class:'party-hero-title', text: app.local('Initiative')});
	var initiativeValue = $('<div />', {class:'party-hero-value-large'});
	this.$initiative = $('<input />', {class:'heroInput', value: this.data.initiative});

	var speed = $('<div />', {class:'party-hero-speed'});
	var speedTitle = $('<div />', {class:'party-hero-title', text: app.local('Speed')});
	var speedValue = $('<div />', {class:'party-hero-value-large'});
	this.$speed = $('<input />', {class:'heroInput', value: this.data.speed});


	this.$divStats
	.append(base
		.append(name
			.append(nameTitle)
			.append(nameValue
				.append(this.$name)
			)
		)
		.append(baseother
			.append(klass
				.append(klassTitle)
				.append(klassValue
					.append(this.$class)
				)
			)
			.append(race
				.append(raceTitle)
				.append(raceValue
					.append(this.$race)
				)
			)
			.append(aligment
				.append(aligmentTitle)
				.append(aligmentValue
					.append(this.$aligment)
				)
			)
			.append(level
				.append(levelTitle)
				.append(levelValue
					.append(this.$level)
				)
			)
			.append(exp
				.append(expTitle)
				.append(expValue
					.append(this.$exp)
				)
			)
		)

		.append(initiative
			.append(initiativeTitle)
			.append(initiativeValue
					.append(this.$initiative)
				)
		)
		.append(speed
			.append(speedTitle)
			.append(speedValue
					.append(this.$speed)
				)
		)
		.append(proficiencyBonusTable)
		// .append(this.createHTMLarmorClass())
		.append(this.createHTMLhealth())
		.append(this.createHTMLspellcasting())
	)
	.append(abilities
		.append(abilitiesTable)
	)
	// .append(battle
	// 	// .append(this.createHTMLattacks())
	// )
}

UI_Party_Hero.prototype.createHTMLAbilityTable = function() {
	var abilitiesTable = $('<table />', {class:'party-hero-abilities-table'}).attr('width','100%').attr('cellpadding','5px');
		this.$abilitiesTbody = $('<tbody />').attr('valign','top');
		abilitiesTable.append(this.$abilitiesTbody);
		var arr = [[
			'str', app.local('STR')
		], [
			'dex', app.local('DEX')
		], [
			'con', app.local('CON')
		], [
			'int', app.local('INT')
		], [
			'wis', app.local('WIS')
		], [
			'cha', app.local('CHA')
		], ]
		arr.forEach(function(o,i,a){
			this['$abilitiesTr'+o[0]] = $('<tr />')
			var $td1 = $('<td />');
			this['$skillsTd'+o[0]] = $('<td />', {class:'tdSkill'}).attr('width','100%');
			this[o[0]] = new UI_Party_Hero_Ability({
				data: {
					ability : o[0],
					title: o[1],
					value: this.data[o[0]]
				},
				component: this
			})
			abilitiesTable
				.append(this['$abilitiesTr'+o[0]]
					.append($td1
						.append(this[o[0]].$div)
					)
					.append(this['$skillsTd'+o[0]])
				)
		},this)
	return abilitiesTable;
}

UI_Party_Hero.prototype.createHTMLSkills = function() {
	for (var i in UI_Party_Hero_Skill.prototype.initBase) {
		var skill = new UI_Party_Hero_Skill({id:i,val:this.data[i],component:this});
		this.skills.push(skill);
		this.skillsIndex[i] = skill;
		this['$skillsTd'+skill.ability].append(skill.$div);
	}
}

UI_Party_Hero.prototype.createHTMLSaveThrow = function() {
	for (var i in UI_Party_Hero_Save.prototype.initBase) {
		var skill = new UI_Party_Hero_Save({id:i,val:this.data[i],component:this});
		this.skills.push(skill);
		this.skillsIndex[i] = skill;
		this['$skillsTd'+skill.ability].append(skill.$div);
	}	
}


UI_Party_Hero.prototype.createHTMLproficiencyTable = function() {
	var proficiencyBonusTable = $('<table />', {class:'party-hero-proficiencyBonus-table'}).attr('width','100%').attr('cellpadding','0px').attr('cellspacing','0px');
	
	var tbTr = $('<tr />')
	
	var tbTd1 = $('<td />')
	var proficiencyBonusValue = $('<div />', {class:'party-hero-proficiencyBonus-value'});
	var proficiencyBonusValueWrapper = $('<div />', {class:'party-hero-proficiencyBonus-value-wrapper'});
	this.proficiencyBonusValueSpan = $('<big />', {text:'+1'});
	
	var tbTd2 = $('<td />').attr('width','100%')
	var proficiencyBonusTitle = $('<div />', {class:'party-hero-proficiencyBonus-title'});
	var proficiencyBonusTitleWrapper = $('<div />', {class:'party-hero-proficiencyBonus-title-wrapper',text:app.local('Proficiency bonus')});

	
	// var inTr = $('<tr />')
	
	// var inTd1 = $('<td />')
	// var inspirationValue = $('<div />', {class:'party-hero-proficiencyBonus-value'});
	// var inspirationValueWrapper = $('<div />', {class:'party-hero-proficiencyBonus-value-wrapper'});
	// var inspirationValueSpan = $('<big />').html('&#10003;');
	
	// var inTd2 = $('<td />').attr('width','100%')
	// var inspirationTitle = $('<div />', {class:'party-hero-proficiencyBonus-title'});
	// var inspirationTitleWrapper = $('<div />', {class:'party-hero-proficiencyBonus-title-wrapper',text:app.local('Inspiration')});



	proficiencyBonusTable
	.append(tbTr
		.append(tbTd1
			.append(proficiencyBonusValue
				.append(proficiencyBonusValueWrapper
					.append(this.proficiencyBonusValueSpan)
				)
			)
		)
		.append(tbTd2
			.append(proficiencyBonusTitle
				.append(proficiencyBonusTitleWrapper)
			)
		)
	)
	// .append(inTr
	// 	.append(inTd1
	// 		.append(inspirationValue
	// 			.append(inspirationValueWrapper
	// 				.append(inspirationValueSpan)
	// 			)
	// 		)
	// 	)
	// 	.append(inTd2
	// 		.append(inspirationTitle
	// 			.append(inspirationTitleWrapper)
	// 		)
	// 	)
	// )

	return proficiencyBonusTable;
}

UI_Party_Hero.prototype.createHTMLarmorClass= function() {
	var table = $('<table/>', {class:'party-hero-abilities-table'}).attr({width:'90%',cellpadding:0,cellspacing:0})
	var tbody = $('<tbody />').attr({valign:'top'});
	var tr = $('<tr/>');
	var td1 = $('<td/>');
	var td2 = $('<td/>');

	var ac = $('<div />', {class:'party-hero-ac'})
	var acValue = $('<div />', {class:'party-hero-acValue'})
	var acTitle = $('<div />', {class:'party-hero-acTitle',text:app.local('Armor class')})
	this.$ac = $('<input />', {class:'heroInput heroInputSkill',val:this.data.ac})

	var acPart1 = $('<div />', {class:'party-hero-skill'})
	var acPart1Value = $('<div />', {class:'party-hero-skill-value',text:app.getModSimbol(8)})
	var acPart1Title = $('<div />', {class:'party-hero-skill-title',text:app.local('Dexterity modifier')})

	var acPart2 = $('<div />', {class:'party-hero-skill'})
	var acPart2Value = $('<div />', {class:'party-hero-skill-value',text:app.getModSimbol(4)})
	var acPart2Title = $('<div />', {class:'party-hero-skill-title',text:app.local('Armor')})

	var acPart3 = $('<div />', {class:'party-hero-skill'})
	var acPart3Value = $('<div />', {class:'party-hero-skill-value',text:app.getModSimbol(6)})
	var acPart3Title = $('<div />', {class:'party-hero-skill-title',text:app.local('Shield')})

	var acPart4 = $('<div />', {class:'party-hero-skill'})
	var acPart4Value = $('<div />', {class:'party-hero-skill-value',text:app.getModSimbol(3)})
	var acPart4Title = $('<div />', {class:'party-hero-skill-title',text:app.local('Misc')})

	return table
		.append(tbody
			.append(tr
				.append(td1
					.append(ac
						.append(acTitle)
						.append(acValue
							.append(this.$ac)
						)
					)
				)
				// .append(td2
				// 	.append(acPart1
				// 		.append(acPart1Value)
				// 		.append(acPart1Title)
				// 	)
				// 	.append(acPart2
				// 		.append(acPart2Value)
				// 		.append(acPart2Title)
				// 	)
				// 	.append(acPart3
				// 		.append(acPart3Value)
				// 		.append(acPart3Title)
				// 	)
				// 	.append(acPart4
				// 		.append(acPart4Value)
				// 		.append(acPart4Title)
				// 	)
				// )
			)
		)
}

UI_Party_Hero.prototype.createHTMLhealth= function() {
	var block = $('<div />', {class:'party-hero-hpblock'});
	var hp= $('<div />', {class:'party-hero-hp'});

	var hpMax= $('<div />', {class:'party-hero-hpMax'});
	var hpMaxTitle= $('<div />', {class:'party-hero-hpMaxTitle', text:app.local('Hit Point Maximum')});
	var hpMaxValue= $('<div />', {class:'party-hero-hpMaxValue'});
	this.$hp  = $('<input />', {class:'heroInput heroInputR',value:this.data.hp})

	var hpCur= $('<div />', {class:'party-hero-hpCur'});
	var hpCurTitle= $('<div />', {class:'party-hero-hpCurTitle', text:app.local('Current Hit Points')});
	var hpCurValue= $('<div />', {class:'party-hero-hpCurValue'});
	this.$hpCurrent  = $('<input />', {class:'heroInput heroInputR',value:this.data.hpCurrent})


	var hitDiceWrap= $('<div />', {class:'party-hero-hp-left'});
	var total= $('<div />', {class:'party-hero-hpMax'});
	var totalTitle= $('<div />', {class:'party-hero-hpMaxTitle', text:app.local('Total')});
	var totalValue= $('<div />', {class:'party-hero-hpMaxValue'})
	this.$hitDiceTotal  = $('<input />', {class:'heroInput heroInputShort',value:this.data.hpCurrent});
	var totalValueD= $('<span />', { text:' '+app.local('d')+' '})
	this.$hitDice  = $('<input />', {class:'heroInput heroInputShort',value:this.data.hitDice});

	var hitDice= $('<div />', {class:'party-hero-hitDice'});
	var hitDiceTitle= $('<div />', {class:'party-hero-hpCurTitle', text:app.local('Hit dice')});
	var hitDiceValue= $('<div />', {class:'party-hero-hpCurValue'});
	this.$hitDiceCurrent  = $('<input />', {class:'heroInput heroInputShort',value:this.data.hitDiceCurrent});

	var death = $('<div />', {class:'party-hero-hp-right'});
	var sucsess = $('<div />', {class:'party-hero-hpMax'});
	var sucsessTitle = $('<div />', {class:'party-hero-hpMaxTitle', text:app.local('Sucsesses')});
	var sucsessValue = $('<div />', {class:'party-hero-hpMaxValue'});

	var  deatSaveCircle = function() {
		var c = $(this);
		if (c.hasClass('party-hero-skill-marker-filled')) {
			c.removeClass('party-hero-skill-marker-filled');
		} else {
			c.addClass('party-hero-skill-marker-filled');
		}
	}

	this.sucsess1 = $('<div />', {class:'party-hero-death-marker party-hero-skill-marker-circle',click:deatSaveCircle});
	this.sucsess2 = $('<div />', {class:'party-hero-death-marker party-hero-skill-marker-circle',click:deatSaveCircle});
	this.sucsess3 = $('<div />', {class:'party-hero-death-marker party-hero-skill-marker-circle',click:deatSaveCircle});

	var failures = $('<div />', {class:'party-hero-hpMax'}).css({'margin-top':'0.20em'});
	var failuresTitle = $('<div />', {class:'party-hero-hpMaxTitle', text:app.local('Failures')});
	var failuresValue = $('<div />', {class:'party-hero-hpMaxValue'});
	this.failures1 = $('<div />', {class:'party-hero-death-marker party-hero-skill-marker-circle',click:deatSaveCircle});
	this.failures2 = $('<div />', {class:'party-hero-death-marker party-hero-skill-marker-circle',click:deatSaveCircle});
	this.failures3 = $('<div />', {class:'party-hero-death-marker party-hero-skill-marker-circle',click:deatSaveCircle});

	var deathTitle= $('<div />', {class:'party-hero-hpCurTitle-full', text:app.local('Death saves')});

	return block
		.append(hp
			.append(hpMax
				.append(hpMaxTitle)
				.append(hpMaxValue
					.append(this.$hp)
				)
			)
			.append(hpCur
				.append(hpCurTitle)
				.append(hpCurValue
					.append(this.$hpCurrent)
				)
			)
		)
		.append(hitDiceWrap
			.append(total
				.append(totalTitle)
				.append(totalValue
					.append(this.$hitDiceTotal)
					.append(totalValueD)
					.append(this.$hitDice)
				)
			)
			.append(hitDice
				.append(hitDiceTitle)
				.append(hitDiceValue
					.append(this.$hitDiceCurrent)
				)
			)
		)
		.append(death
			.append(sucsess
				.append(sucsessTitle)
				.append(sucsessValue
					.append(this.sucsess1)
					.append(this.sucsess2)
					.append(this.sucsess3)
				)
			)
			.append(failures
				.append(failuresTitle)
				.append(failuresValue
					.append(this.failures1)
					.append(this.failures2)
					.append(this.failures3)
				)
			)
			.append(deathTitle)
		);
}


UI_Party_Hero.prototype.createHTMLspellcasting= function() {
	var sc  = $('<table />', {class:'party-hero-spellcasting'});
	var scb = $('<tbody />');
	var tr1 = $('<tr />');
	var sc0t = $('<td />', {}).attr({'rowspan':2});
	var ac = $('<div />', {class:'party-hero-ac'})
	var acValue = $('<div />', {class:'party-hero-acValue'})
	var acTitle = $('<div />', {class:'party-hero-acTitle',text:app.local('Armor class')})
	this.$ac = $('<input />', {class:'heroInput heroInputSkill',val:this.data.ac})


	var sc1t = $('<td />', {class:'party-hero-title',text: app.local('Spellcasting ability')});
	var sc2t = $('<td />', {class:'party-hero-title',text: app.local('Spell Save DC')});
	var sc3t = $('<td />', {class:'party-hero-title',text: app.local('Spell Attack bonus')});
	
	var tr2 = $('<tr />');
	var sc1v = $('<td />', {class:'party-hero-value-large'});
	var sc2v = $('<td />', {class:'party-hero-value-large'});
	var sc3v = $('<td />', {class:'party-hero-value-large'});
	this.$spellcastingAbility = $('<input />', {class:'heroInput heroInputSkill',value:app.local(this.data.SpellcastingAbility)})
	this.$spellSaveDC = $('<input />', {class:'heroInput heroInputSkill',value:app.local(this.data.SpellSaveDC)})
	this.$spellAttackBonus = $('<input />', {class:'heroInput heroInputSkill',value:app.getModSimbol(this.data.SpellAttackBonus)})

	return sc
		.append(scb
			.append(tr1
				.append(sc0t
					.append(ac
						.append(acTitle)
						.append(acValue
							.append(this.$ac)
						)
					)
				)
				.append(sc1t)
				.append(sc2t)
				.append(sc3t)
			)
			.append(tr2
				.append(sc1v
					.append(this.$spellcastingAbility)
				)
				.append(sc2v
					.append(this.$spellSaveDC)
				)
				.append(sc3v
					.append(this.$spellAttackBonus)
				)
			)
		)
}

UI_Party_Hero.prototype.createHTMLattacksDamage = function(a) {
	var a = a || '';
	if (typeof a == 'string') {
		return a;
	}
	return a[0] + app.local('d') + a[1] + app.getModSimbol(a[2]);

}

UI_Party_Hero.prototype.createHTMLattacks = function() {
	var table = $('<table />', {class:'party-hero-attacks'}).attr({'width':'100%', 'cellpadding':'0px', 'cellspacing':'4px'})
	var tbody = $('<tbody />').attr({'valign':'bottom'})

	var len = this.attacks.length;
	for (var i = 0; i < len; i++) {
		var tr1 = $('<tr />').attr({'width':'70%'})
		var td11 = $('<td />').attr({'colspan':'3'})
		var td11t = $('<div />', {class:'party-hero-attacks-title', text:app.local('Weapon')});
		var td11v = $('<div />', {class:'party-hero-attacks-value', text:app.local(this.attacks[i].weapon)})
		var td12 = $('<td />').attr({'width':'30%'})
		var td12t = $('<div />', {class:'party-hero-attacks-title', text:app.local('Type')});
		var td12v = $('<div />', {class:'party-hero-attacks-value', text:app.local(this.attacks[i].type)})
		var tr2 = $('<tr />')
		var td21 = $('<td />').attr({'width':'30%'})
		var td21t = $('<div />', {class:'party-hero-attacks-title', text:app.local('Range')});
		var td21v = $('<div />', {class:'party-hero-attacks-value', text:app.local(this.attacks[i].range)})
		var td22 = $('<td />').attr({'width':'30%'})
		var td22t = $('<div />', {class:'party-hero-attacks-title', text:app.local('ATK Bonus')});
		var td22v = $('<div />', {class:'party-hero-attacks-value', text:app.local(this.attacks[i].bonus)})
		var td23 = $('<td />').attr({'colspan':'2','width':'40%'})
		var td23t = $('<div />', {class:'party-hero-attacks-title', text:app.local('Damage')});
		var td23v = $('<div />', {class:'party-hero-attacks-value', text:this.createHTMLattacksDamage(this.attacks[i].damage)})

		tbody
			.append(tr1
				.append(td11
					.append(td11t)
					.append(td11v)
				)
				.append(td12
					.append(td12t)
					.append(td12v)
				)
			)
			.append(tr2
				.append(td21
					.append(td21t)
					.append(td21v)
				)
				.append(td22
					.append(td22t)
					.append(td22v)
				)
				.append(td23
					.append(td23t)
					.append(td23v)
				)
			)

		if (len - 1 !=  i) {
			var tr3 = $('<tr />')
			var td3 = $('<td />', {class:'party-hero-attacks-hr'}).attr({'colspan':'4'})
		tbody
			.append(tr3
				.append(td3)
			)

		}


	}

	return table
		.append(tbody)
}


UI_Party_Hero.prototype.updateHTML = function(o) {
	if (!o || o.displayed) {
		if (this.displayed) {
			this.$divInList.addClass('selected');
			this.$l_header.addClass('selected');
			this.$stats.append(this.$divStats);
		} else { 
			this.$divInList.removeClass('selected');
			this.$l_header.removeClass('selected');
			this.$divStats.detach();
		}
	}

	var arr = ['name', 'class', 'race', 'level', 'aligment', 'exp', 'initiative', 'speed', 'ac', 'hp', 'hpCurrent', 'hitDiceTotal', 'hitDice', 'hitDiceCurrent', 'spellcastingAbility', 'spellSaveDC', 'spellAttackBonus']
	for (var i = arr.length - 1; i >= 0; i--) {
		if (!o || arr[i] != o.without) {
			this['$'+arr[i]].val( app.local(this.data[arr[i]] ));
		}
	};



	this.proficiencyBonusValueSpan.html(app.getModSimbol( Math.ceil(Number(this.data.level) / 4)+1));

	this.$l_header.html(this.data.name);
	this.$l_subheader.html(this.data.race+', '+this.data.class+', '+app.local('Level')+' '+this.data.level);


	// this.sucsess1 = $('<div />', {class:'party-hero-death-marker party-hero-skill-marker-circle'});
	// this.sucsess2 = $('<div />', {class:'party-hero-death-marker party-hero-skill-marker-circle'});
	// this.sucsess3 = $('<div />', {class:'party-hero-death-marker party-hero-skill-marker-circle'});
	// this.failures1 = $('<div />', {class:'party-hero-death-marker party-hero-skill-marker-circle'});
	// this.failures2 = $('<div />', {class:'party-hero-death-marker party-hero-skill-marker-circle'});
	// this.failures3 = $('<div />', {class:'party-hero-death-marker party-hero-skill-marker-circle'});



}

UI_Party_Hero.prototype.callEvent = function(eventName, arg) {
	if (this.events.hasOwnProperty(eventName)) {
		for (var i = this.events[eventName].length - 1; i >= 0; i--) {
			this.events[eventName][i](arg)
		};
	}
	else {
		console.log('Нет события ' + eventName)
	}
}

UI_Party_Hero.prototype.signUpForAnEvent = function(eventName, func) {
	if (!this.events.hasOwnProperty(eventName)) {
		this.events[eventName] = [];
	}
	this.events[eventName].push(func);
}

UI_Party_Hero.prototype.bindEvents = function() {
	this.module.signUpForAnEvent('selectHero', function(self){
		return function(heroId) {
			var prev = self.displayed;
			self.displayed = self.id == heroId ? true : false;
			if (prev != self.displayed) {
				self.updateHTML();
			}
		}
	}(this))

	this.module.signUpForAnEvent('battleHP', function(self){
		return function(data) {
			if (self.id == data.heroId) {
				self.data.hpCurrent += data.hp;
				self.updateHTML();
			}
		}
	}(this))
}

UI_Party_Hero.prototype.updating = function() {
	this.module.callEvent('updatingHero',{id:this.id, data:this.data});
}


