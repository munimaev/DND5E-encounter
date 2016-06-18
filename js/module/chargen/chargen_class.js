var UI_Chargen_class = function(o) {
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
	this.isShow = false;

	this.classes = {};
	
	this.featureDivs = {}
	this.featureSubDivs = {}
}

UI_Chargen_class.prototype.callEvent = function(name, args) {
	if (this.events.hasOwnProperty(name)) {
		this.events[name].forEach(function(v,i,a){v(args)})
	}
};
UI_Chargen_class.prototype.events = {}; 
UI_Chargen_class.prototype.events.changeClass = [];
UI_Chargen_class.prototype.events.changeSubClass = [];



UI_Chargen_class.prototype.init = function() {

	this.$classes = $('<div />',{class:'chargen-variant'}) 
	this.$classes.append($('<h4>',{'text':app.local('Class')}))
	this.$div.append(this.$classes);

	for (var i in Classes) {
		this.createClass(Classes[i]);
		this.$classes.append(this.classes[i].$div)
	}

	this.$subclasses = $('<div />',{class:'chargen-subvariant'})
	this.$subclasses.append($('<h4>',{'text':app.local('Subclass')})) 
	this.$div.append(this.$subclasses);

	this.$features = $('<div />',{class:'chargen-feature'})
	this.$features.append($('<h4>',{'text':app.local('Feature')})) 
	this.$div.append(this.$features);

	this.module.events['changeStep'].push(function(self) {
		return function(step) {
			var old = self.isShow;
			if (step == 'class') {
				self.isShow = true;
			} else {
				self.isShow = false;
			}
			if  (old != self.isShow) {
				self.updateDiv();
			}
		}
	}(this));

	this.updateDiv();
}



UI_Chargen_class.prototype.updateDiv = function () {
    var subClassesDivs = [];
	return function(o) {
		if (this.isShow) {
			this.$div.removeClass('nondisplay')
		}
		else  {
			this.$div.addClass('nondisplay');
			return;
		}

		if (!o || o.subclasses) {
			for (var i = subClassesDivs.length - 1; i >= 0; i--) {
				subClassesDivs[i].detach()
			};
			subClassesDivs = [];
			for (var i in this.subclasses) {
				this.$subclasses.append(this.subclasses[i].$div);
			}

		}
	}
}()


UI_Chargen_class.prototype.createClass = function(o) {
	this.classes[o.id] = new UI_Class(this, o);
}
UI_Chargen_class.prototype.selectClass = function(id) {
	
	if (this.selClass && this.selClass.$features) {
		this.selClass.$features.detach();
	}
	
	this.selClass = this.classes[id];

	if (this.selClass && this.selClass.$features) {
		this.$features.append(this.selClass.$features);
	}

	this.callEvent('changeClass',id)
	this.module.callEvent('changeClass',id);
	this.updateDiv();
}

UI_Chargen_class.prototype.selectSubClass = function(id) {
	
	if (this.selSubClass && this.selSubClass.$features) {
		this.selSubClass.$features.detach();
	}

	this.selSubClass = null;
	if (this.selClass.subclasses && this.selClass.subclasses.length) {
		this.selSubClass
	}

	if (this.selSubClass && this.selSubClass.$features) {
		this.$features.append(this.selSubClass.$features);
	}

	this.callEvent('changeClass',id)
	this.module.callEvent('changeClass',id);
	this.updateDiv();
}














var Classes = {

	'Bard' : {
		id : 'Bard',
		name : 'class_Bard',
		abilitisUpLevels : {4:2,8:2,12:2,16:2,19:2},
		hits : {
			dice : 8,
			firstLevel : {base : 8, mods : ['CON']},
			nextLevel : {dice : 8, alt : 5 , mods : ['CON']}
		},
		ownership: {
			armor: [{
				category: 'Light armor'
			}],
			weapon: [{
				category: 'Simple weapon'
			}, {
				type: 'Long sword'
			}, {
				type: 'Short sword'
			}, {
				type: 'Rapire'
			}, {
				type: 'Hand crossbow'
			}],
			instrument: [
				{category: "Music instrument", number: 3, restriction : 'any' }
			],
			saveThrow: [{category: 'ability', ability : 'DEX'},{category: 'ability', ability : 'CHA'}],
			skill : [
				{category: "Any skill", number: 3, restriction : 'any' }
			],
		},
		levels: {
			masteryBonus : [2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6],
			feats: [
				[
					'Bard: Spellcasting', 'Bard: Bardic Inspiration (k6)'
				],[
					'Bard: Jack of All Trades', 'Bard: Song of Rest (k6)'
				],[
					'Bard: Bardic Colleges', 'Bard: Expertise'
				],[
					'Bard: Ability Score Improvement'
				],[
					'Bard: Bardic Inspiration (k8)', 'Bard: Font of Inspiration'
				],[
					'Bard: Countercharm', 'Bard: Bardic Colleges Feat'
				],[

				],[
					'Bard: Ability Score Improvement'
				],[
					'Bard: Song of Rest (k8)'
				],[
					'Bard: Bardic Inspiration (k10)', 'Bard: Expertise'
				],[

				],[
					'Bard: Ability Score Improvement'
				],[
					'Bard: Song of Rest (k10)'
				],[
					'Bard: Bardic Colleges Feat', 'Bard: Magical Secrets'
				],[
					'Bard: Bardic Inspiration (k12)', 'Bard: Expertise'
				],[
					'Bard: Ability Score Improvement'
				],[
					'Bard: Song of Rest (k12)'
				],[
					'Bard: Magical Secrets'
				],[
					'Bard: Ability Score Improvement'
				],[
					'Bard: Superior Inspiration'
				]
			],
			cantrip : [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4],
			spellnumber : [4,5,5,7,8,9,10,11,12,14,15,15,16,18,19,19,20,22,22,22],
			spellcells : [
				[2],
				[3],
				[4,2],
				[4,3],
				[4,3,2],
				[4,3,3],
				[4,3,3,1],
				[4,3,3,2],
				[4,3,3,3,1],
				[4,3,3,3,2],
				[4,3,3,3,2,1],
				[4,3,3,3,2,1],
				[4,3,3,3,2,1,1],
				[4,3,3,3,2,1,1],
				[4,3,3,3,2,1,1,1],
				[4,3,3,3,2,1,1,1],
				[4,3,3,3,2,1,1,1,1],
				[4,3,3,3,3,1,1,1,1],
				[4,3,3,3,3,2,1,1,1],
				[4,3,3,3,3,2,2,1,1]
			],
			spellcasting_ability : 'CHA'
		},
		subclasses : ['Bard: College of Lore']
	},
	'Barbarian' : {
		id : 'Barbarian',
		name : 'class_Barbarian',
		abilitisUpLevels : {4:2,8:2,12:2,16:2,19:2}
	},
	'Fighter' : {
		id : 'Fighter',
		name : 'class_Fighter',
		abilitisUpLevels : {4:2,8:2,12:2,16:2,19:2}
	},
	'Wizard' : {
		id : 'Wizard',
		name : 'class_Wizard',
		abilitisUpLevels : {4:2,8:2,12:2,16:2,19:2}
	},
	'Druid' : {
		id : 'Druid',
		name : 'class_Druid',
		abilitisUpLevels : {4:2,8:2,12:2,16:2,19:2}
	},
	'Cleric' : {
		id : 'Cleric',
		name : 'class_Cleric',
		abilitisUpLevels : {4:2,8:2,12:2,16:2,19:2}
	},
	'Warlock' : {
		id : 'Warlock',
		name : 'class_Warlock',
		abilitisUpLevels : {4:2,8:2,12:2,16:2,19:2}
	},
	'Monk' : {
		id : 'Monk',
		name : 'class_Monk',
		abilitisUpLevels : {4:2,8:2,12:2,16:2,19:2}
	},
	'Paladin' : {
		id : 'Paladin',
		name : 'class_Paladin',
		abilitisUpLevels : {4:2,8:2,12:2,16:2,19:2}
	},
	'Rogue' : {
		id : 'Rogue',
		name : 'class_Rogue',
		abilitisUpLevels : {4:2,8:2,12:2,16:2,19:2}
	},
	'Ranger' : {
		id : 'Ranger',
		name : 'class_Ranger',
		abilitisUpLevels : {4:2,8:2,12:2,16:2,19:2}
	},
	'Sorcerer' : {
		id : 'Sorcerer',
		name : 'class_Sorcerer',
		abilitisUpLevels : {4:2,8:2,12:2,16:2,19:2}
	},

}

var ClassFeats = {
	'Bard: Spellcasting' : {
		b : 'Использование заклинаний',
		p : '',
		d : function(pers) {
			var  html = ''
				+ '<p><i>Сложность спасброска</i> = 8 + бонус мастерства + модификатор Харизмы</p>'
				+ '<p><i>Модификатор броска атаки</i> = бонус мастерства + модификатор Харизмы</p>';
			var table = '<table width="100%" cellpadding="4em" cellspacing="0px" class="standart">'
				+ 	'<thead valign="top">'
				+ 		'<tr>'
				+ 			'<th rowspan="2">Известные заговоры</th>'
				+ 			'<th rowspan="2">Известные заклинания</th>'
				+ 			'<th colspan="9">Ячейки заклинаний на уровень заклинаний</th>'
				+ 		'</tr>'
				+ 		'<tr>'
				+ 			'<th>1</th>'
				+ 			'<th>2</th>'
				+ 			'<th>3</th>'
				+ 			'<th>4</th>'
				+ 			'<th>5</th>'
				+ 			'<th>6</th>'
				+ 			'<th>7</th>'
				+ 			'<th>8</th>'
				+ 			'<th>9</th>'
				+ 		'</tr>'
				+ 	'</thead>'
				+ 	'<tbody>';

			for (var i = 0; i < 20; i++) {
				table += 	'<tr>'
					+ '<td>'+pers.levels.cantrip[i]+'</td>'
					+ '<td>'+pers.levels.spellnumber[i]+'</td>'


				for (var j = 0; j < 9; j++) {
					table += '<td>';
					if (pers.levels.spellcells[i][j]) {
						table += pers.levels.spellcells[i][j]
					} else {
						table += '&minus;'
					}
					table += '</td>';
				}

				table += 	'</tr>'
			}

			table += 	'</tbody>'
				+ '</table>';


			var  html2 = '<p><b>Исполненние ритуалов.</b> Вы можете исполнить любое известное вам заклинание барда в качестве ритуала, если заклинание позволяет это.</p>'
				+ '<p><b>Фокусировка заклинания.</b> Вы можете использовать ваш музыкальный инструмент  в качестве фокусировки для ваших заклинаний барда.</p>'

			return html+table+html2;
		}
	},
	'Bard: Bardic Inspiration (k6)' : {
		b : 'Вдохновение барда',
		p : 'Своими словами или музыкой вы можете вдохновлять других. Для этого вы должны бонусным действием выбрать одно существо, отличное от вас, в пределах 60 футов, которое может вас слышать. Это существо получает кость бардовского вдохновения — к6.\nВ течение следующих 10 минут это существо может один раз бросить эту кость и добавить результат к проверке характеристики, броску атаки или спасброску, который оно совершает. Существо может принять решение о броске кости вдохновения уже после броска к20, но должно сделать это прежде, чем Мастер объявит результат броска. Как только кость бардовского вдохновения брошена, она исчезает\nВы можете использовать это умение количество раз, равное модификатору вашей Харизмы, но как минимум один раз. Потраченные использования этого умения восстанавливаются после продолжительного отдыха\nВаша кость бардовского вдохновения изменяется с ростом вашего уровня в этом классе. Она становится к8 на 5 уровне, к10 на 10 уровне и к12 на 15 уровне.'
	},
	'Bard: Jack of All Trades' : {
		b : 'Мастер на все руки',
		p : 'Начиная со 2 уровня вы можете добавлять половину бонуса мастерства, округлѐнную в меньшую сторону, ко всем проверкам характеристик, куда этот бонус ещѐ не включѐн.'
	},
	'Bard: Song of Rest (k6)' : {
		b : 'Песнь отдыха',
		p : 'Начиная со 2 уровня вы с помощью успокаивающей музыки или речей можете помочь своим раненым союзникам восстановить их силы во время короткого отдыха. Если вы, или любые союзные существа, способные слышать ваше исполнение, восстанавливаете хиты в конце короткого отдыха, каждый из вас восстанавливает дополнительно 1к6 хитов. Для того, чтобы восстановить дополнительные хиты, существо должно потратить в конце короткого отдыха как минимум одну Кость Хитов.\n Количество дополнительно восстанавливаемых хитов растѐт с вашим уровнем в этом классе: 1к8 на 9 уровне, 1к10 на 13 уровне и 1к12 на 17 уровне.'
	},
	'Bard: Bardic Colleges' : {
		b : 'Коллегия бардов',
		p : 'На 3 уровне вы углубляетесь в традиции выбранной вами коллегии бардов: коллегии знаний или коллегии доблести. Обе они описаны в конце описания класса. Этот выбор предоставляет вам умения на 3, 6 и 14 уровнях.'
	},
	'Bard: Expertise' : {
		b : 'Компетентность',
		p : 'На третьем уровне выберите 2 навыка из тех, которыми вы владеете. Ваш бонус мастерства для этих навыков удваивается.\n На 10 уровне вы можете выбрать ещѐ 2 навыка и получить для них это преимущество.'
	},
	'Bard: Ability Score Improvement' : {
		b : 'Увеличение характеристик',
		p : 'Вы можете повысить значение одной из ваших характеристик на 2 или двух характеристик на 1. Как обычно, значение характеристики при этом не должно превысить 20.'
	},
	'Bard: Bardic Inspiration (k8)' : {
		b : 'Вдохновение барда',
		p : 'Ваша кость бардовского вдохновения становится к8.'
	},
	'Bard: Font of Inspiration' : {
		b : 'Источник вдохновения',
		p : 'Начиная с 5 уровня вы восстанавливаете истраченные вдохновения барда и после короткого и после продолжительного отдыха.'
	},
	'Bard: Countercharm' : {
		b : 'Контрочарование',
		p : 'На 6 уровне вы получаете возможность использовать звуки или слова силы для разрушения воздействующих на разум эффектов. Вы можете действием начать исполнение, которое продлится до конца вашего следующего хода. В течение этого времени вы и все дружественные существа в пределах 30 футов от вас совершают спасброски от запугивания и очарования с преимуществом. Чтобы получить это преимущество, существа должны слышать вас. Исполнение заканчивается преждевременно, если вы оказываетесь недееспособны, теряете способность говорить, или прекращаете исполнение добровольно (на это не требуется действие)'
	},
	'Bard: Bardic Colleges Feat' : {
		b : 'Умение коллегии бардов',
		p : 'Выбранная коллегия бардов предоставляет вам умение.'
	},
	'Bard: Song of Rest (k8)' : {
		b : 'Песнь отдыха',
		p : 'Количество дополнительно восстанавливаемых хитов увеличивается до 1к8.'
	},
	'Bard: Bardic Inspiration (k10)' : {
		b : 'Вдохновение барда',
		p : 'Ваша кость бардовского вдохновения становится к10.'
	},
	'Bard: Expertise' : {
		b : 'Компетентность',
		p : 'Вы можете выбрать ещѐ 2 навыка.'
	},
	'Bard: Song of Rest (k10)' : {
		b : 'Песнь отдыха',
		p : 'Количество дополнительно восстанавливаемых хитов увеличивается до 1к10.'
	},
	'Bard: Magical Secrets' : {
		b : 'Тайны магии',
		p : 'Выберите два заклинания любого класса, включая ваш собственный. Эти заклинания должны быть того уровня, который вы можете использовать, или являться заговорами.\n Теперь эти заклинания считаются для вас заклинаниями барда, и они уже включены в общее количество известных вам заклинаний согласно таблице.\n Ещѐ по два заклинания других классов вы выучите на 14 и 18 уровнях'
	},
	'Bard: Bardic Inspiration (k12)' : {
		b : 'Вдохновение барда',
		p : 'Ваша кость бардовского вдохновения становится к12.'
	},
	'Bard: Song of Rest (k12)' : {
		b : 'Песнь отдыха',
		p : 'Количество дополнительно восстанавливаемых хитов увеличивается до 1к12.'
	},
	'Bard: Magical Secrets' : {
		b : 'Тайны магии',
		p : 'Вы выучите два заклинания других классов.'
	},
	'Bard: Superior Inspiration' : {
		b : 'Превосходное вдохновение',
		p : 'Если на момент броска инициативы у вас не осталось неиспользованных вдохновений, вы получаете одно.'
	},

	'Bard: College of Lore: Bonus Proficiencies' : {
		b : 'Превосходное вдохновение',
		p : 'Если на момент броска инициативы у вас не осталось неиспользованных вдохновений, вы получаете одно.'
	}, 
	'Bard: College of Lore: Cutting Words' : {
		b : 'Превосходное вдохновение',
		p : 'Если на момент броска инициативы у вас не осталось неиспользованных вдохновений, вы получаете одно.'
	},
	'Bard: College of Lore: Additional Magical Secrets' : {
		b : 'Превосходное вдохновение',
		p : 'Если на момент броска инициативы у вас не осталось неиспользованных вдохновений, вы получаете одно.'
	},
	'Bard: College of Lore: Peerless Skill' : {
		b : 'Превосходное вдохновение',
		p : 'Если на момент броска инициативы у вас не осталось неиспользованных вдохновений, вы получаете одно.'
	},
}





















var SubClasses = {

	'Bard: College of Lore' : {
		id : 'Bard: College of Lore',
		name : 'class_Bard: College of Lore',
		levels: {
			feats: [
				[
					
				],[
					
				],[
					'Bard: College of Lore: Bonus Proficiencies', 'Bard: College of Lore: Cutting Words'
				],[

				],[

				],[
					'Bard: College of Lore: Additional Magical Secrets'
				],[

				],[

				],[

				],[

				],[

				],[

				],[

				],[
					'Bard: College of Lore: Peerless Skill'
				],[

				],[

				],[

				],[

				],[

				],[

				]
			],
		},
	}
}