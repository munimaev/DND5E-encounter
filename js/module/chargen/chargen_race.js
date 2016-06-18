var UI_Chargen_race = function(o) {
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
	this.races = {};
	this.race = '';
	this.subracesDivs = [];
	this.selectedRaceFetures = {};
	this.racesFeatureDiv = null;
	this.subracesFeatureDiv = null;

	this.isShow = false;
}

UI_Chargen_race.prototype.init = function() {


	this.$races = $('<div />',{class:'chargen-variant'}) 
	this.$races.append($('<h4>',{'text':app.local('Race')}))
	this.$div.append(this.$races);

	this.$subraces = $('<div />',{class:'chargen-subvariant'})
	this.$subraces.append($('<h4>',{'text':app.local('Subrace')})) 
	this.$div.append(this.$subraces);

	this.$feature = $('<div />',{class:'chargen-feature'})
	this.$feature.append($('<h4>',{'text':app.local('Feature')})) 
	this.$div.append(this.$feature);

	for (var i in Races) {
			var div = $('<div />', {class:'chargen-race-races-race'});
			var func = function(self, id) {
				return function() {
					self.setRace(id)
				}
			}(this, Races[i].id)
			var link = $('<span />', {class:'chargen-race-races-race-link link', text:app.local(Races[i].name),click:func});
			div.append(link);

			var subraces = {};

			if (Races[i].hasOwnProperty('subrace')) {
				var len = Races[i].subrace.length;
				for (var j = 0; j< len; j++) {
					var subObj = Subraces[Races[i].subrace[j]];
					var divs = $('<div />', {class:'chargen-race-races-race'});
					var funcs = function(self, id) {
						return function() {
							self.setSubrace(id)
						}
					}(this, subObj.id)
					var links = $('<span />', {class:'chargen-race-races-race-link link', text:app.local(subObj.name),click:funcs});
					divs.append(links);
					subraces[subObj.id] = {
						id : subObj.id,
						name : subObj.name,
						div : divs,
						link : links,
						abilitiesBonus : subObj.abilitiesBonus,
						feature : this.createFeature(subObj)
					}
				}
			}
			this.races[i] = {
				id : i,
				div : div,
				link : link,
				name : Races[i].name,
				subraces : subraces,
				data : Races[i],
				abilitiesBonus : Races[i].abilitiesBonus,
				feature : this.createFeature(Races[i])
			}

			if (Races[i].hasOwnProperty('abilitiesBonusAtChoice') ) {
				this.races[i].abilitiesBonusAtChoice = Races[i].abilitiesBonusAtChoice;
			}

			this.$races.append(div)
	}

	this.module.events['changeStep'].push(function(self) {
		return function(step) {
			var old = self.isShow;
			if (step == 'race') {
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



UI_Chargen_race.prototype.updateDiv = function(o) {

	if (this.isShow) {
		this.$div.removeClass('nondisplay')
	}
	else  {
		this.$div.addClass('nondisplay');
		return;
	}
	if (!o || o.race) {
		for (var i in this.races) {
			this.races[i].link.removeClass('selected');
		}
		if (this.race) {
			this.race.link.addClass('selected');
		}
	}
	if (!o || o.subrace) {
		for (var i = this.subracesDivs.length - 1; i >= 0; i--) {
			this.subracesDivs[i].div.detach();
			this.subracesDivs[i].link.removeClass('selected');
		};
		this.subracesDivs = [];
		for (var i in this.race.subraces) {
			this.$subraces.append(this.race.subraces[i].div);
			this.subracesDivs.push(this.race.subraces[i])
		}
		if (this.subrace) {
			this.subrace.link.addClass('selected');
		}
	}
	if (!o || o.feature) {
		if (this.racesFeatureDiv) {
			this.racesFeatureDiv.detach();
		}
		if (this.subracesFeatureDiv) {
			this.subracesFeatureDiv.detach();
		}
		if (this.race) {
			this.$feature.append(this.race.feature);
			this.racesFeatureDiv = this.race.feature;
		}
		if (this.subrace) {
			this.$feature.append(this.subrace.feature);
			this.subracesFeatureDiv = this.subrace.feature;
		}
	}
}

UI_Chargen_race.prototype.createFeature = function(o) {
	var $result = $('<div />');
	var $h5 = $('<h5 />',{text: app.local(o.name)});

	$result.append($h5);
	if (o.abilitiesBonus) {
		var bonus = [];
		for (var i in o.abilitiesBonus) {
			bonus.push( app.local(i) + ' +' + o.abilitiesBonus[i] + '');
		}
		$result.append(this.createFeatureP(
			app.local('race_abilitiesBonus'),
			bonus.join(', ')
		))
	}
	if (o.age) {
		$result.append(this.createFeatureP(
			app.local('race_age'),
			app.local('race_age_up') +' '+ o.age +' '+ app.local('race_age_year') +'.'
		))
	}
	if (o.size) {
		$result.append(this.createFeatureP(
			app.local('Size'),
			app.local('Size_'+o.size)
		))
	}
	if (o.speed) {
		$result.append(this.createFeatureP(
			app.local('Speed'),
			o.speed +' '+app.local('футов')+' / '+ (o.speed/5*1.5)+' '+app.local('метров')+' / '+(o.speed/5)+' '+app.local('клеток')+'.'
		))
	}
	if (o.languages && o.languages.length) {
		var lang = [];
		for (var i = o.languages.length - 1; i >= 0; i--) {
			lang.push(app.local('lang_'+o.languages[i]));
		};
		$result.append(this.createFeatureP(
			app.local('Languages'),
			lang.join(', ')
		))
	}
	if (o.features && o.features.length) {
		var len = o.features.length;
		for (var i = 0; i < len; i++) {
			$result.append(this.createFeatureP(
				Features[o.features[i]].b,
				Features[o.features[i]].p,
				Features[o.features[i]].d
			))	
		};
	}
	return $result;
}
UI_Chargen_race.prototype.createFeatureP = function(b,p,d) {
	if (b.substr(-1)!='.') b+='.';
	if (b.substr(-2)!='. ') b+=' ';
	if (p.substr(-1)!='.') p+='.';
	if (p.substr(-2)!='. ') p+=' ';
	var $p = $('<p>',{class:'feture-p'}).append($('<b />').html(b)).append($('<span />').html(p));
	if (typeof d == 'function') {
		return $('<div>',{class:''}).append($p).append(d(this));
	}
	else {
		return $('<div>',{class:''}).append($p).append(d);
	}
	return $p;

}
UI_Chargen_race.prototype.genSelect = function(opts,obj) {
	var obj = obj || {};
	var opts = opts || [];
	var len = opts.length;
	var $opt =  $('<select />',obj);
	for (var i = 0; i < len; i++) {
		$opt.append($('<option>',opts[i]));
	};
	return $opt;
}

UI_Chargen_race.prototype.setRace = function(race) {
	this.race = this.races[race];
	this.subrace = null;
	if (this.race.hasOwnProperty('subraces')) {
		for (var i in this.race.subraces) {
			this.subrace = this.race.subraces[i];
			break;
		}
	}
	this.updateDiv({race:1, subrace:1,feature:1 });
	this.module.callEvent('changeRace',race);
	// this.module.callEvent('changeSubrace',race)
}


UI_Chargen_race.prototype.setSubrace = function(subrace) {
	this.subrace = this.race.subraces[subrace];
	this.updateDiv({subrace:1,feature:1});
	// this.module.callEvent('changeSubrace',subrace)
}


var Races = {

	'Elf' : {
		id : 'Elf',
		name : 'race_Elf',
		abilitiesBonus : {
			DEX: 2,
		},
		subrace : ['High Elf','Wood Elf','Drow Elf'],
		age : 750,
		size : 'medium',
		speed : 30,
		languages : ['common','elf'],
		features : [
			'darkvision',
			'Elf heightened senses',
			'Elf Fey origin',
			'Elf Trance',
		]
	},
	// 'Genasi' : {
	// 	id : 'Genasi',
	// 	name : 'race_Genasi',
	// 	abilitiesBonus : {
	// 		CON : 2,
	// 	},
	// 	subrace : ['Air Genasi']
	// },
	// 'Aarakocra' : {
	// 	id : 'Aarakocra',
	// 	name : 'race_Aarakocra',
	// 	abilitiesBonus : {
	// 		DEX : 2,
	// 		WIS : 1,

	// 	}
	// },
	'Human' : {
		id : 'Human',
		name : 'race_Human',
		abilitiesBonus : {
			STR: 1,
			DEX: 1,
			CON: 1,
			INT: 1,
			WIS: 1,
			CHA: 1,
		},
		subrace : ['Calishite','Chondathan','Damaran','Illuskan','Mulan','Rashemi','Shou','Tethyrian','Turami'],
		age : 100,
		size : 'medium',
		speed : 30,
		languages : ['common','one any']
	},
	'Gnome' : {
		id : 'Gnome',
		name : 'race_Gnome',
		abilitiesBonus : {
			INT: 2,
		},
		subrace : [
			'Rock Gnome','Deep Gnome'
		],
		age : 500,
		size : 'small',
		speed : 25,
		languages : ['common','gnom'],
		features : [
			'darkvision',
			'Gnome cunning',
		]
	},
	'Tiefling' : {
		id : 'Tiefling',
		name : 'race_Tiefling',
		abilitiesBonus : {
			WIS: 2,
			INT: 1,
		},
		age : 100,
		size : 'medium',
		speed : 30,
		languages : ['common','inferno'],
		features : [
			'darkvision',
			'Tiefling infernal resistance',
			'Tiefling Devil\'s legacy',
		]
	},
	'Half-Elf' : {
		id : 'Half-Elf',
		name : 'race_Half-Elf',
		abilitiesBonus : {
			CHA: 2,
		},
		abilitiesBonusAtChoice : {
			not : ['CHA'],
			total : 2,
		},
		age : 180,
		size : 'medium',
		speed : 30,
		languages : ['common','elf','two any'],
		features : [
			'darkvision',
			'Elf Fey origin',
			'Half-Elf Versatility skills',
			'Half-Elf Increased  abilities' 
		]
	},
	'Dragonborn' : {
		id : 'Dragonborn',
		name : 'race_Dragonborn',
		abilitiesBonus : {
			WIS: 1,
			STR: 2
		},
		age : 80,
		size : 'medium',
		speed : 30,
		languages : ['common','dragon'],
		features : [
			'Dragonborn Legacy of the dragons',
			'Dragonborn breath weapon',
			'Dragonborn damage resistance',
		]
	},
	'Dwarf' : {
		id : 'Dwarf',
		name : 'race_Dwarf',
		abilitiesBonus : {
			CON: 2,
		},
		subrace : ['Mountain Dwarf','Hill Dwarf'],
		age : 350,
		size : 'medium',
		speed : 25,
		languages : ['common','dwarven'],
		features : [
			'darkvision',
			'dwarven resistance',
			'dwarven military training',
			'dwarven property tools',
			'dwarven knowledge of stone',
		]
	},
	'Halfling' : {
		id : 'Halfling',
		name : 'race_Halfling',
		abilitiesBonus : {
			DEX: 2,
		},
		subrace : ['Lightfoot Halfling','Stout Halfling'],
		age : 150,
		size : 'small',
		speed : 25,
		languages : ['common','halfling'],
		features : [
			'Halfling Lucky',
			'Halfling Brave',
			'Halfling Agility',
		]
	},
	// 'Goliath' : {
	// 	id : 'Goliath',
	// 	name : 'race_Goliath',
	// 	abilitiesBonus : {
	// 		STR: 2,
	// 		CON: 1,
	// 	}
	// },
	'Half-Orc' : {
		id : 'Half-Orc',
		name : 'race_Half-Orc',
		abilitiesBonus : {
			STR: 2,
			CON: 1,
		},
		age : 75,
		size : 'small',
		speed : 30,
		languages : ['common','orc'],
		features : [
			'darkvision',
			'Half-Orc threatened species',
			'Half-Orc Enduring resistance',
			'Half-Orc Fierce attacks',
		]
	}

}


var Features = {
	'darkvision' : {
		b : 'Тѐмное зрение',
		p : ' На расстоянии в 60 футов вы при тусклом освещении можете видеть так, как будто это яркое освещение, и в темноте так, как будто это тусклое освещение. В темноте вы не можете различать цвета, только оттенки серого',
	},
	'dwarven resistance' : {
		b : 'Дварфская устойчивость',
		p : 'Вы совершаете с преимуществом спасброски от яда, и вы получаете сопротивление к урону ядом.',
	},
	'dwarven military training' : {
		b : 'Дварфская боевая тренировка',
		p : 'Вы владеете боевым топором, ручным топором, лѐгким и боевым молотами.',
	},
	'dwarven property tools' : {
		b : 'Владение инструментами',
		p : 'Вы владеете ремесленными инструментами на ваш выбор: инструменты кузнеца, пивовара или каменщика',
	},
	'dwarven knowledge of stone' : {
		b : 'Знание камня',
		p : 'Если вы совершаете проверку Интеллекта (История), связанную с происхождением работы по камню, вы считаетесь владеющим навыком История, и добавляете к проверке удвоенный бонус мастерства вместо обычного.',
	},
	'dwarven possession armor' : {
		b : 'Владение доспехами дварфов',
		p : 'Вы владеете лѐгкими и средними доспехами.',
	},
	'dwarven stamina' : {
		b : 'Дварфская выдержка',
		p : 'Максимальное значение ваших хитов увеличивается на 1, и вы получаете 1 дополнительный хит с каждым новым уровнем.',
	},


	'Halfling Lucky' : {
		b : 'Везучий',
		p : 'Если при броске атаки, проверке характеристики или спасброске у вас выпало «1», вы можете перебросить кость, и должны использовать новый результат.',
	},
	'Halfling Brave' : {
		b : 'Храбрый',
		p : 'Вы совершаете с преимуществом спасброски от испуга',
	},
	'Halfling Agility' : {
		b : 'Проворство полуросликов',
		p : 'Вы можете проходить сквозь пространство, занятое существами, чей размер больше вашего',
	},
	'Halfling Stability stocky' : {
		b : 'Устойчивость коренастых',
		p : 'Вы совершаете с преимуществом спасброски от яда, и вы получаете сопротивление к урону ядом.',
	},
	'Halfling Natural secrecy' : {
		b : 'Естественная скрытность',
		p : 'Вы можете предпринять попытку скрыться даже если заслонены только существом, превосходящими вас в размере как минимум на одну категорию.',
	},


	'Elf heightened senses' : {
		b : 'Обострѐнные чувства',
		p : 'Вы владеете навыком Внимательность.',
	},
	'Elf Fey origin' : {
		b : 'Фейское происхождение',
		p : 'Вы совершаете с преимуществом спасброски от очарования, и вас невозможно магически усыпить',
	},
	'Elf Trance' : {
		b : 'Транс',
		p : 'Эльфы не спят. Вместо этого они погружаются в глубокую медитацию, находясь в полубессознательном состоянии до 4 часов в сутки (обычно такую медитацию называют трансом). Во время этой медитации вы можете грезить о разных вещах. Некоторые из этих грѐз являются ментальными упражнениями, выработанными за годы тренировок. После такого отдыха вы получаете все преимущества, которые получает человек после 8 часов сна',
	},

	'Elf Possession elven weapons' : {
		b : 'Владение эльфийским оружием',
		p : 'Вы владеете длинным мечом, коротким мечом, коротким и длинным луками.',
	},
	'Elf High Spell' : {
		b : 'Заговор',
		p : 'Вы знаете один заговор из списка заклинаний волшебника. Базовой характеристикой для его использования является Интеллект.',
	},
	'Elf High Additional language' : {
		b : 'Дополнительный язык',
		p : 'Вы можете говорить, читать и писать на ещѐ одном языке, на ваш выбор.',
	},

	'Elf Wood Quick legs' : {
		b : 'Быстрые ноги',
		p : 'Ваша базовая скорость перемещения увеличивается до 35 футов',
	},
	'Elf Wood Masking in the wild' : {
		b : 'Маскировка в дикой местности',
		p : 'Вы знаете один заговор из списка заклинаний волшебника. Базовой характеристикой для его использования является Интеллект.',
	},

	'Drow Excellent darkvision' : {
		b : 'Превосходное тѐмное зрение',
		p : 'Ваше тѐмное зрение имеет радиус 120 футов',
	},
	'Drow Sensitivity to the sun' : {
		b : 'Чувствительность к солнцу',
		p : 'Вы совершаете с помехой броски атаки и проверки Мудрости (Внимательность), основанные на зрении, если вы, цель вашей атаки или изучаемый предмет расположены на прямом солнечном свете.',
	},
	'Drow Magic' : {
		b : 'Магия дроу',
		p : 'Вы знаете заклинание пляшущие огоньки. Когда вы достигаете 3 уровня, вы можете один раз в день использовать заклинание огонь фей. При достижении 5 уровня вы также сможете раз в день использовать заклинание тьма. «Раз в день» означает, что бы должны окончить продолжительный отдых, прежде чем сможете наложить это заклинание ещѐ раз посредством данного умения. Базовой характеристикой для их использования является Харизма.',
	},
	'Drow Possession of a weapon Drow' : {
		b : 'Владение оружием дроу',
		p : 'Вы владеете рапирой, коротким мечом и ручным арбалетом.',
	},



	'Dragonborn Legacy of the dragons' : {
		b : 'Наследие драконов',
		p : 'Вы получаете драконье наследие. Выберите тип дракона из таблицы «Наследие драконов». Вы получаете оружие дыхания и сопротивление к урону соответствующего вида, как указано в таблице.)',
		d : function(self) {
				var arr = [['Белый','Холод','15-футовый конус (спас. Тел.)'],['Бронзовый','Электричество','Линия 5 на 30 футов (спас. Лов.)'],['Зелѐный','Яд','15-футовый конус (спас. Тел.)'],['Золотой','Огонь','15-футовый конус (спас. Лов.)'],['Красный','Огонь','15-футовый конус (спас. Лов.)'],['Латунный','Огонь','Линия 5 на 30 футов (спас. Лов.)'],['Медный','Кислота','Линия 5 на 30 футов (спас. Лов.)'],['Серебряный','Холод','15-футовый конус (спас. Тел.)'],['Синий','Электричество','Линия 5 на 30 футов (спас. Лов.)'],['Чѐрный','Кислота','Линия 5 на 30 футов (спас. Лов.)']];
				var $t = $('<table />', {
						cellpadding: '4em',
						cellspacing: '0px',
						class: 'standart'
					})
					.attr('width','100%')
					.append(
						$('<thead />').append($('<tr>')
							.append($('<th />', {
								text: 'Дракон'
							}))
							.append($('<th />', {
								text: 'Вид урона'
							}))
							.append($('<th />', {
								text: 'Оружие дыхания'
							})))
					)
				var len = arr.length;
				var $tb = $('<tbody />');
				var links = [];

				var updateDiv = function() {
					return function(){
						for (var i = links.length - 1; i >= 0; i--) {
							links[i].div.removeClass('selected');
						};
						if (self.selectedRaceFetures['Dragonborn Legacy of the dragons']) {
							links[self.selectedRaceFetures['Dragonborn Legacy of the dragons'].id].div.addClass('selected');	
						}
						
					}
				}()
				for (var i = 0; i < len; i++) {
					var $tr = $('<tr />');
					$tb.append($tr);
						
						var $link = $('<td />', {
							text: arr[i][0],
							class : 'link',
							click : function(id) {
								return function() {
									self.selectedRaceFetures['Dragonborn Legacy of the dragons'] = {
										id : id,
										data : arr[id]
									}
									updateDiv(id);
								}
							}(i)
						});

						links.push({div:$link});

						$tr.append($link)
						$tr.append($('<td />', {
							text: arr[i][1]
						}))
						$tr.append($('<td />', {
							text: arr[i][2]
						}))
					
				};
				$t.append($tb);
				updateDiv();
				return function() {
					return $t;	
				}
			
		}
	},
	'Dragonborn breath weapon' : {
		b : 'Оружие дыхания',
		p : 'Вы можете действием выдохнуть разрушительную энергию. Ваше наследие драконов определяет размер, форму и вид урона вашего выдоха.',
		d : '<p>Когда вы используете оружие дыхания, все существа в зоне выдоха должны совершить спасбросок, вид которого определяется вашим наследием. Сложность этого спасброска равна 8 + ваш модификатор Телосложения + ваш бонус мастерства. Существа получают урона 2к6 в случае проваленного спасброска, или половину этого урона, если спасбросок был успешен. Урон повышается до 3к6 на 6 уровне, до 4к6 на 11, и до 5к6 на 16 уровне.</p><p>После использования оружия дыхания вы не можете использовать его повторно, пока не завершите короткий либо продолжительный отдых.</p>'
	},
	'Dragonborn damage resistance' : {
		b : 'Сопротивление урону',
		p : 'Вы получаете сопротивление к урону того вида, который указан в вашем наследии драконов.',
	},


	'Gnome cunning' : {
		b : 'Гномья хитрость',
		p : 'Вы совершаете с преимуществом спасброски Интеллекта, Мудрости и Харизмы против магии.',
	},
	'Gnome Deep Nature illusion' : {
		b : 'Природная иллюзия',
		p : 'Вы знаете заклинание малая иллюзия. Базовой характеристикой для его использования является Интеллект',
	},
	'Gnome Deep Communication with animals' : {
		b : 'Общение с маленькими зверями',
		p : 'С помощью звуков и жестов вы можете передавать простые понятия Маленьким или ещѐ меньшим зверям. Лесные гномы любят животных и часто держат белок, барсуков, кроликов, кротов, дятлов и других животных в качестве питомцев.',
	},
	'Gnome Rock Craft knowledge' : {
		b : 'Ремесленные знания',
		p : 'При совершении проверки Интеллекта (История) применительно к магическому, алхимическому или технологическому объекту, вы можете добавить к проверке удвоенный бонус мастерства вместо обычного',
	},
	'Gnome Rock Tinsmith' : {
		b : 'Жестянщик',
		p : ' Вы владеете ремесленными инструментами (инструменты жестянщика). С их помощью вы можете, потратив 1 час времени и материалы на сумму в 10 зм, создать Крошечное механическое устройство (КД 5, 1 хит). Это устройство перестаѐт работать через 24 часа (если вы не потратите 1 час на поддержание его работы). Вы можете действием разобрать его; в этом случае вы можете получить обратно использованные материалы. Одновременно вы можете иметь не более трѐх таких устройств.',
		d : '<p>При создании устройства выберите один изследующих вариантов:</p><p><i>Заводная игрушка.</i> Эта заводная игрушка изображает животное, чудовище или существо, вроде лягушки, мыши, птицы, дракона или солдатика. Поставленная на землю, она проходит 5 футов в случайном направлении за каждый ваш ход, издавая звуки, соответствующие изображаемому существу.</p><p><i>Зажигалка.</i> Это устройство производит миниатюрный огонѐк, с помощью которого можно зажечь свечу, факел или костѐр. Использование этого устройства требует действия.</p><p><i>Музыкальная шкатулка.</i> При открытии эта шкатулка проигрывает мелодию средней громкости. Шкатулка перестаѐт играть если мелодия закончилась или если шкатулку закрыли.</p>'
	},


	'Half-Elf Versatility skills' : {
		b : 'Универсальность навыков',
		p : 'Вы получаете владение двумя навыками на ваш выбор'
	},
	'Half-Elf Increased  abilities' : {
		b : 'Увеличение характеристик',
		p : 'Значения двух характеристик отличных от харизмы на ваш выбор увеличиваются на 1'
	},

	'Half-Orc threatened species' : {
		b : 'Угрожающий вид',
		p : 'Вы владеете навыком Запугивание'
	},
	'Half-Orc Enduring resistance' : {
		b : 'Непоколебимая стойкость',
		p : 'Если ваши хиты опустились до нуля, но вы при этом не убиты, ваши хиты вместо этого опускаются до 1. Вы не можете использовать эту способность снова, пока не завершите длительный отдых.'
	},
	'Half-Orc Fierce attacks' : {
		b : 'Свирепые атаки',
		p : 'Если вы совершили критическое попадание рукопашной атакой оружием, вы можете добавить к урону ещѐ одну кость урона оружия'
	},



	'Tiefling infernal resistance' : {
		b : 'Адское сопротивление',
		p : 'Вы получаете сопротивление к урону огнѐм.'
	},
	'Tiefling Devil\'s legacy' : {
		b : 'Дьявольское наследие',
		p : 'Вы знаете заклинание чудотворство. При достижении 3 уровня вы можете один раз в день активировать адское озмездие как заклинание 2 уровня. При достижении 5 уровня вы также можете один раз в день активировать аклинание тьма. «Раз в день» означает, что бы должны окончить продолжительный отдых, прежде чем сможете наложить это заклинание ещѐ раз посредством данного умения. Базовой характеристикой для этих заклинаний является Харизма'
	},
}


var Subraces = {
	'Mountain Dwarf' : {
		id : 'Mountain Dwarf',
		name : 'race_Dwarf_Mountain',
		abilitiesBonus : {
			STR: 2,
		},
		features : [
			'dwarven possession armor',
		]
	},
	'Hill Dwarf' : {
		id : 'Hill Dwarf',
		name : 'race_Dwarf_Hill',
		abilitiesBonus : {
			WIS: 1,
		},
		features : [
			'dwarven stamina',
		]
	},
	'High Elf' : {
		id : 'High Elf',
		name : 'race_Elf_Hight',
		abilitiesBonus : {
			INT: 1,
		},
		features : [
			'darkvision',
			'Elf Possession elven weapons',
			'Elf High Spell',
			'Elf High Additional language',
		]
	},
	'Wood Elf' : {
		id : 'Wood Elf',
		name : 'race_Elf_Wood',
		abilitiesBonus : {
			WIS: 1,
		},
		features : [
			'darkvision',
			'Elf Possession elven weapons',
			'Elf Wood Quick legs',
			'Elf Wood Masking in the wild',
		]
	},
	'Drow Elf' : {
		id : 'Drow Elf',
		name : 'race_Elf_Drow',
		abilitiesBonus : {
			CHA: 1,
		},
		features : [
			'darkvision',
			'Drow Excellent darkvision',
			'Drow Sensitivity to the sun',
			'Drow Magic',
			'Drow Possession of a weapon Drow',
		]
	},
	'Air Genasi' : {
		id : 'Air Genasi',
		name : 'race_Genasi_Air',
		abilitiesBonus : {
			DEX: 1,
		}
	},
	'Earth Genasi' : {
		id : 'Earth Genasi',
		name : 'race_Genasi_Earth',
		abilitiesBonus : {
			STR: 1,
		}
	},
	'Fire Genasi' : {
		id : 'Fire Genasi',
		name : 'race_Genasi_Fire',
		abilitiesBonus : {
			INT: 1,
		}
	},
	'Water Genasi' : {
		id : 'Water Genasi',
		name : 'race_Genasi_Water',
		abilitiesBonus : {
			WIS: 1,
		}
	},
	'Calishite' : {
		id : 'Calishite',
		name : 'race_Human_Calishite',
	},
	'Chondathan' : {
		id : 'Chondathan',
		name : 'race_Human_Chondathan',
	},
	'Damaran' : {
		id : 'Damaran',
		name : 'race_Human_Damaran',
	},
	'Illuskan' : {
		id : 'Illuskan',
		name : 'race_Human_Illuskan',
	},
	'Mulan' : {
		id : 'Mulan',
		name : 'race_Human_Mulan',
	},
	'Rashemi' : {
		id : 'Rashemi',
		name : 'race_Human_Rashemi',
	},
	'Shou' : {
		id : 'Shou',
		name : 'race_Human_Shou',
	},
	'Tethyrian' : {
		id : 'Tethyrian',
		name : 'race_Human_Tethyrian',
	},
	'Turami' : {
		id : 'Turami',
		name : 'race_Human_Turami',
	},
	'Rock Gnome' : {
		id : 'Rock Gnome',
		name : 'race_Gnome_Rock',
		abilitiesBonus : {
			CON: 1,
		},
		features : [
			'Gnome Rock Craft knowledge',
			'Gnome Rock Tinsmith',
		]
	},
	'Deep Gnome' : {
		id : 'Deep Gnome',
		name : 'race_Gnome_Deep',
		abilitiesBonus : {
			DEX: 1,
		},
		features : [
			'Gnome Deep Nature illusion',
			'Gnome Deep Communication with animals',
		]
	},
	'Lightfoot Halfling' : {
		id : 'Lightfoot Halfling',
		name : 'race_Halfling_Lightfoot',
		abilitiesBonus : {
			CHA: 1,
		},
		features : [
			'Halfling Natural secrecy'
		]
	},
	'Stout Halfling' : {
		id : 'Stout Halfling',
		name : 'race_Halfling_Stout',
		abilitiesBonus : {
			CON: 1,
		},
		features : [
			'Halfling Stability stocky'
		]
	}

}



