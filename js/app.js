var App = function(o) {
	var hash = window.location.hash;
	console.log(hash)
	switch (hash) {
		case '#rus' : 
			this.lang = hash.substr(1);	
			break;
		default :
			this.lang = 'eng';	
			break;

	}
}
App.prototype.getMod = function(val) {
	return this.arrOfModificators[val];
}
App.prototype.getModStr = function(val) {
	var result = this.getMod(val);
	return this.getModSimbol(result);
}
App.prototype.getModSimbol = function(val) {
	return val < 0 ? '' + val : '+' + val;
}
App.prototype.arrOfModificators = [-5,-5,-4,-4,-3,-3,-2,-2,-1,-1,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10];


App.prototype.local = function(name) {
	if (!name) {
		return '';
	}
	var local = {
		'AC'                   : {eng : 'AC',                   rus : 'КД'},
		'Search'               : {eng : 'Search',               rus : 'Поиск'},
		'Actions'              : {eng : 'Actions',              rus : 'Дейсвтия'},
		'Legenady Actions'     : {eng : 'Legenady Actions',     rus : 'Легедарные Дейсвтия'},
		'Armor class'          : {eng : 'Armor class',          rus : 'Класс Доспеха'},

		'Hit points'           : {eng : 'Hit points',           rus : 'Хиты'},
		'Hits'                 : {eng : 'Hits',                 rus : 'Хиты'},
		'Hit Dices'            : {eng : 'Hit Dices',            rus : 'Кость хитов'},
		'Hits at 1 level'      : {eng : 'Hits at 1 level',      rus : 'Хиты на 1 уровне'},
		'Hits at next level'   : {eng : 'Hits at next level',   rus : 'Хиты на следующих уровнях'},
		'd'                    : {eng : 'd',                    rus : 'к'},
		'modificator'          : {eng : 'modificator',          rus : 'модификатор'},
		'for each level'       : {eng : 'for each level',       rus : 'за каждый уровень'},
		'or'                   : {eng : 'or',                   rus : 'или'},

		'Speed'                : {eng : 'Speed',                rus : 'Скорость'},
		'STR'                  : {eng : 'STR',                  rus : 'СИЛ'},
		'DEX'                  : {eng : 'DEX',                  rus : 'ЛОВ'},
		'CON'                  : {eng : 'CON',                  rus : 'ТЕЛ'},
		'INT'                  : {eng : 'INT',                  rus : 'ИНТ'},
		'WIS'                  : {eng : 'WIS',                  rus : 'МУД'},
		'CHA'                  : {eng : 'CHA',                  rus : 'ХАР'},
		'Save Throws'          : {eng : 'Save Throws',          rus : 'Спасброски'},
		'Perception'           : {eng : 'Perception',           rus : 'Проницательность'},
		'Stealth'              : {eng : 'Stealth',              rus : 'Скрытность'},
		'Damage Resistances'   : {eng : 'Damage Resistances',   rus : 'Сопротивление урону'},
		'Damage Immunities'    : {eng : 'Damage Immunities',    rus : 'Иммунитет к урону'},
		'Condition Immunities' : {eng : 'Condition Immunities', rus : 'Иммунитеты к состоянию'},
		'Senses'               : {eng : 'Senses',               rus : 'Чувства'},
		'Languages'            : {eng : 'Languages',            rus : 'Языки'},
		'Challenge'            : {eng : 'Challenge',            rus : 'Опасность'},
		'XP'                   : {eng : 'XP',                   rus : 'ОО'},
		'Class'                : {eng : 'Class',                rus : 'Класс'},
		'Subclass'             : {eng : 'Subclass',             rus : 'Подкласс'},
		'Race'                 : {eng : 'Race',                 rus : 'Расса'},
		'Subrace'              : {eng : 'Subrace',              rus : 'Подрасса'},
		'Feature'              : {eng : 'Feature',              rus : 'Свойтсва'},
		'Ownership'            : {eng : 'Ownership',            rus : 'Владения'},

		'Additional Setting'   : {eng : 'Additional Setting',   rus : 'Дополнительные свойства'},
		'List of Monsters'     : {eng : 'List of Monsters'  ,   rus : 'Список чудовищ'},
		'Encounter compound'   : {eng : 'Encounter compound',   rus : 'Состав сцены'},
		'btn_AddToEncounter'   : {eng : 'Add to Encounter',     rus : 'Добавить к сцене'},
		'STRENGTH'             : {eng : 'STRENGTH',             rus : 'СИЛА'},
		'DEXTERITY'            : {eng : 'DEXTERITY',            rus : 'ЛОВКОСТЬ'},
		'CONSTITUTION'         : {eng : 'CONSTITUTION',         rus : 'ТЕЛОСЛОЖЕНИЕ'},
		'INTELEGENCE'          : {eng : 'INTELEGENCE',          rus : 'ИНТЕЛЕКТ'},
		'WISDOM'               : {eng : 'WISDOM',               rus : 'МУДРОСТЬ'},
		'CHARISMA'             : {eng : 'CHARISMA',             rus : 'ХАИЗМА'},
		'cg_Base_Value'        : {eng : 'Base',                 rus : 'Базовое значение'},
		'cg_Race_Bonus'        : {eng : 'Race Bonus',           rus : 'Рассовый бонус'},
		'cg_Subrace_Bonus'     : {eng : 'Subrace Bonus',        rus : 'Субрассовый бонус'},
		'cg_Bought_Bonus'      : {eng : 'Bought Bonus',         rus : 'Купленные очки'},
		'cg_Level_Bonus'       : {eng : 'Level Bonus',          rus : 'Бонус уровня'},
		'cg_Gen_Established'   : {eng : 'Established Value',    rus : 'Установленные значения'},
		'cg_Gen_PoinBuy'       : {eng : 'Poin Buy',             rus : 'Покупка очков'},
		'cg_Rule_Variant'      : {eng : 'Rule Variant',         rus : 'Вараинт правил'},
		'cg_SetupValue'        : {eng : 'Setup Value',          rus : 'Определите значение'},
		'Abilities'            : {eng : 'Abilities',            rus : 'Характеристики'},
		'cg_For2points'        : {eng : 'For 2 points',         rus : 'За 2 очка'},
		'cg_For1point'         : {eng : 'For 1 point',          rus : 'За 1 очко'},
		'cg_Back2points'       : {eng : 'Back 2 points',        rus : 'Вернуть 2 очка'},
		'cg_Back1point'        : {eng : 'Back 1 point',         rus : 'Вернуть 1 очко'},
		'cg_BasicProperties'   : {eng : 'Basic Properties',     rus : 'Основные свйства'},
		'race_Dwarf'           : {eng : 'Dwarf',                rus : 'Дварф'},
		'race_Dwarf_Mountain'  : {eng : 'Mountain Dwarf',       rus : 'Горный дварф'},
		'race_Dwarf_Hill'      : {eng : 'Hill Dwarf',           rus : 'Холмовой дварф'},
		'race_Dragonborn'      : {eng : 'Dragonborn',           rus : 'Драконорожденный'},
		"race_Elf"             : {eng : 'Elf',                  rus : 'Эльф'},
		"race_Genasi"          : {eng : 'Genasi',               rus : 'Генази'},
		"race_Aarakocra"       : {eng : 'Aarakocra',            rus : 'Ааракокра'},
		"race_Human"           : {eng : 'Human',                rus : 'Человек'},
		"race_Gnome"           : {eng : 'Gnome',                rus : 'Гном'},
		"race_Tiefling"        : {eng : 'Tiefling',             rus : 'Тифлинг'},
		"race_Half-Elf"        : {eng : 'Half-Elf',             rus : 'Полуэльф'},
		"race_Halfling"        : {eng : 'Halfling',             rus : 'Полурослик'},
		"race_Goliath"         : {eng : 'Goliath',              rus : 'Голиаф'},
		"race_Half-Orc"        : {eng : 'Half-Orc',             rus : 'Полуорк'},

		'race_Elf_Hight'       : {eng : 'Hight Elf',            rus : 'Высший эльф'},
		'race_Elf_Wood'        : {eng : 'Wood Elf',             rus : 'Лесной эльф'},
		'race_Elf_Drow'        : {eng : 'Dark Elf (Drow)',      rus : 'Темный эльф (дроу)'},
		'race_Human_Calishite' : {eng : 'Calishite',            rus : 'Калишит'},
		'race_Human_Chondathan': {eng : 'Chondathan',           rus : 'Чондатанец'},
		'race_Human_Damaran'   : {eng : 'Damaran',              rus : 'Дамарец'},
		'race_Human_Illuskan'  : {eng : 'Illuskan',             rus : 'Иллусканец'},
		'race_Human_Mulan'     : {eng : 'Mulan',                rus : 'Мулан'},
		'race_Human_Rashemi'   : {eng : 'Rashemi',              rus : 'Рашеми'},
		'race_Human_Shou'      : {eng : 'Shou',                 rus : 'Шу'},
		'race_Human_Tethyrian' : {eng : 'Tethyrian',            rus : 'Тетриец'},
		'race_Human_Turami'    : {eng : 'Turami',               rus : 'Тёрами'},
		'race_Gnome_Rock'      : {eng : 'Rock Gnome',           rus : 'Скальный гном'},
		'race_Gnome_Deep'      : {eng : 'Deep Gnome',           rus : 'Лесной гном'},
		'race_Halfling_Lightfoot': {eng : 'Lightfoot',          rus : 'Легконогий'},
		'race_Halfling_Stout': {eng : 'Stout',                  rus : 'Коренастый'},

		'gen_steps_Steps'      : {eng : 'Steps',                rus : 'Шаги'},
		'gen_steps_Race'       : {eng : 'Select Race',          rus : 'Выбор расы'},
		'gen_steps_Class'      : {eng : 'Select Class',         rus : 'Выбор класса'},
		'gen_steps_Abilities'  : {eng : 'Select Abilities',     rus : 'Выбор характеристик'},
		'gen_steps_Equipment'  : {eng : 'Select Equipment',     rus : 'Выбор экипировки'},

		'race_abilitiesBonus'  : {eng : '?abilitiesBonus',      rus : 'Увеличение характеристик'},
		'race_age'             : {eng : 'Age',                  rus : 'Возраст'},
		'race_age_up'          : {eng : 'Up',                   rus : 'До'},
		'race_age_year'        : {eng : 'years',                rus : 'лет'},

		'class_Sorcerer'       : {eng : 'Sorcerer',             rus : 'Чародей'},
		'class_Fighter'        : {eng : 'Fighter',              rus : 'Воин'},
		'class_Monk'           : {eng : 'Monk',                 rus : 'Монах'},
		'class_Cleric'         : {eng : 'Cleric',               rus : 'Клерик'},
		'class_Druid'          : {eng : 'Druid',                rus : 'Друид'},
		'class_Rogue'          : {eng : 'Rogue',                rus : 'Плут'},
		'class_Ranger'         : {eng : 'Ranger',               rus : 'Следопыт'},
		'class_Wizard'         : {eng : 'Wizard',               rus : 'Волшебник'},
		'class_Warlock'        : {eng : 'Warlock',              rus : 'Колдун'},
		'class_Barbarian'      : {eng : 'Barbarian',            rus : 'Варвар'},
		'class_Paladin'        : {eng : 'Paladin',              rus : 'Паладин'},
		'class_Bard'           : {eng : 'Bard',                 rus : 'Бард'},


		'Armors'               : {eng : 'Armors',               rus : 'Доспехи'},
		'Light armor'          : {eng : 'Light armor',          rus : 'Легкие доспехи'},

		'Weapon'               : {eng : 'Weapon',               rus : 'Оружие'},
		'Simple weapon'        : {eng : 'Simple weapon',        rus : 'Простое оружие'},
		'Long sword'           : {eng : 'Long sword',           rus : 'Длинный меч'},
		'Short sword'          : {eng : 'Short sword',          rus : 'Короткий меч'},
		'Rapire'               : {eng : 'Rapire',               rus : 'Рапира'},
		'Hand crossbow'        : {eng : 'Hand crossbow',        rus : 'Ручной арболет'},

		'Instruments'          : {eng : 'Instruments',          rus : 'Инструменты'},
		'Music instrument'     : {eng : 'Music instrument',     rus : 'Инструменты'},

		'Save throws'          : {eng : 'Save throws',           rus : 'Спасброски'},

		'Skills'               : {eng : 'Skills',               rus : 'Навыки'},
		'Any skill'            : {eng : 'Any skill',            rus : 'Любой навык'},

		'of you choice'        : {eng : 'of you choice',        rus : 'на ваш выбор'},

		'Party'                : {eng : 'Party',                rus : 'Приключенцы'},
		'Encounter list'       : {eng : 'Encounter list',       rus : 'Боевые сцены'},
		'Options'              : {eng : 'Options',              rus : 'Настройки'},
		'New'                  : {eng : 'New',                  rus : 'Новый'},
		'Load'                 : {eng : 'Load',                 rus : 'Загрузить'},
		'Edit'                 : {eng : 'Edit',                 rus : 'Изменить'},
		'Sort'                 : {eng : 'Sorting',              rus : 'Сортировать'},
		'Next'                 : {eng : 'Next',                 rus : 'Следующий'},
		'Save'                 : {eng : 'Save',                 rus : 'Сохранить'},

		'Name'                 : {eng : 'Name',                 rus : 'Имя'},
		'Aligment'             : {eng : 'Aligment',             rus : 'Мировоззрение'},
		'Level'                : {eng : 'Level',                rus : 'Уровень'},
		'Exp'                  : {eng : 'Exp',                  rus : 'Опыт'},
		'Initiative'           : {eng : 'Initiative',           rus : 'Инициатива'},
		'Proficiency bonus'    : {eng : 'Proficiency bonus',    rus : 'Бонус мастрества'},
		'Hit Point Maximum'    : {eng : 'Hit Point Maximum',    rus : 'Максимум хитов'},
		'Current Hit Points'   : {eng : 'Current Hit Points',   rus : 'Текущие хиты'},
		'Total'                : {eng : 'Total',                rus : 'Всего'},
		'Hit dice'             : {eng : 'Hit dice',             rus : 'Кость хитов'},
		'Sucsesses'            : {eng : 'Sucsesses',            rus : 'Успехи'},
		'Failures'             : {eng : 'Failures',             rus : 'Провалы'},
		'Death saves'          : {eng : 'Death saves',          rus : 'Спасброски от смерти'},
		'Spellcasting ability' : {eng : 'Spellcasting ability', rus : 'Базовая характеристика заклинаний'},
		'Spell Save DC'        : {eng : 'Spell Save DC',        rus : 'Сложность спасброска заклинаний'},
		'Spell Attack bonus'   : {eng : 'Spell Attack bonus',   rus : 'Модификатор броска атаки заклинаний'},


		'Saving throw str'     : {eng : 'Saving throw STR',     rus : 'Спасбросок силы'},
		'Saving throw dex'     : {eng : 'Saving throw DEX',     rus : 'Спасбросок ловокости'},
		'Saving throw con'     : {eng : 'Saving throw CON',     rus : 'Спасбросок телосложения'},
		'Saving throw int'     : {eng : 'Saving throw INT',     rus : 'Спасбросок интелекта'},
		'Saving throw wis'     : {eng : 'Saving throw WIS',     rus : 'Спасбросок мудрости'},
		'Saving throw cha'     : {eng : 'Saving throw CHA',     rus : 'Спасбросок харизмы'},
		'Acrobatics'           : {eng : 'Acrobatics',           rus : 'Акробатика'},
		'Animal handing'       : {eng : 'Animal handing'  ,     rus : 'Уход за животными'},
		'Arcana'               : {eng : 'Arcana',               rus : 'Магия'},
		'Atletics'             : {eng : 'Atletics',             rus : 'Атлетика'},
		'Deception'            : {eng : 'Deception',            rus : 'Обман'},
		'History'              : {eng : 'History',              rus : 'История'},
		'Insight'              : {eng : 'Insight',              rus : 'Проницательность'},
		'Intimidate'           : {eng : 'Intimidate',           rus : 'Запугивание'},
		'Investigation'        : {eng : 'Investigation',        rus : 'Исследоание'},
		'Medicine'             : {eng : 'Medicine',             rus : 'Целительство'},
		'Nature'               : {eng : 'Nature',               rus : 'Прироа'},
		'Perception'           : {eng : 'Perception',           rus : 'Внимательность'},
		'Perfomance'           : {eng : 'Perfomance',           rus : 'Выступление'},
		'Persuasion'           : {eng : 'Persuasion',           rus : 'Убеждение'},
		'Religion'             : {eng : 'Religion',             rus : 'Религия'},
		'Sleight of hand'      : {eng : 'Sleight of hand',      rus : 'Ловкость рук'},
		'Stealth'              : {eng : 'Stealth',              rus : 'Скрытность'},
		'Survival'             : {eng : 'Survival',             rus : 'Выживание'},

	}
	return local[name] ? local[name][this.lang] : name;
}

App.prototype.abr = function(abr, local) {
	var o = {
		'STR' : 'STRENGTH',
		'DEX' : 'DEXTERITY',
		'CON' : 'CONSTITUTION',
		'INT' : 'INTELEGENCE',
		'WIS' : 'WISDOM',
		'CHA' : 'CHARISMA',
	}
	if (local) {
		return this.local(o[abr]);
	}
	return o[abr]
}

App.prototype.moduleEvents = {};
App.prototype.moduleEvents.monster_SelectedInList = function(name) {
	this.uiMonsterStats.show(name);
}
App.prototype.moduleEvents.serach_InputChange = function(text) {
	this.uiMonsterList.filter({text:text});
}
App.prototype.moduleEvents.serach_SelectPrevious = function() {
	this.uiMonsterList.selectPrevious();
}
App.prototype.moduleEvents.serach_SelectNext = function() {
	this.uiMonsterList.selectNext();
}

var app = new App();
