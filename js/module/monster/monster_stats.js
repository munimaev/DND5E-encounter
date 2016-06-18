var UI_Monster_stats = function(o) {
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
	this.current = null;
	this.currentDiv = null;
	if (o.hasOwnProperty('preInit')) {
		this.preInit(o.preInit)
	}

	if (this.module.signUpForAnEvent) {
		this.module.signUpForAnEvent('showMonster', function(self){
			return function(name) {
				console.log(name)
				self.show(name)
			}
		}(this))
	}
	if (this.module.signUpForAnEvent) {
		this.module.signUpForAnEvent('showHero', function(self){
			return function(name) {
				self.showHero(name)
			}
		}(this))
	}
}







// возварщает набор кнопок под заголовокм
UI_Monster_stats.prototype.subHeaderButton = function() {
	return '';
}

UI_Monster_stats.prototype.preInit = function(preInit) {
	// добавлем кнопки назначенные модулем
	if (preInit.hasOwnProperty('subHeaderButton')) {
		this.subHeaderButton = function(arr) {
			return function() {

				var len = arr.length;
				var div = $('<div />', {
					class: 'monster-subHeaderButtons'
				});
				var self = this;

				for (var i = 0; i < len; i++) {
					var func = function(eventName, arg) {
						
						var getArg = function(){return arg;} 
						if (eventName == 'addMonster') {
							getArg = function(self) {return self.current.name;}
						}

						return function() {
							self.module.callEvent(eventName, getArg(self))
						}
					}(arr[i].eventName,arr[i].arg)

					var $btn = $('<span />', {
						class: 'inline-button monster-subHeaderButton',
						text: app.local(arr[i].text),
						click: func
					})

					div.append($btn);
				}

				return div;

			}
		}(preInit.subHeaderButton)
	}
	
}











UI_Monster_stats.prototype.updateDiv = function() {

	if (this.current === null) return;

	this.$div.empty();
			// this.$div.css('padding','10px 10px 10px 5px');

	var $divStats = $('<div />',{class:'monster-halfblock'});

	$divStats.append($('<h3 />', {
		text: this.current.name
	}))

	$divStats.append($('<div />', {
		class: 'monster-type',
		text: this.current.type + ', ' + this.current.aligment
	}))

	$divStats.append(this.subHeaderButton())

	$divStats.append($('<div />', {
		class: 'monster-hr'
	}))

	var acType = this.current.acType ? ' ('+this.current.acType+')' : '';
	$divStats.append($('<p />', {
		class: 'monster-p'
	}).html('<b>' + app.local('Armor class') + '</b> ' + this.current.ac + acType))

	var hpFormula = this.current.hpFormula ? ' ('+this.current.hpFormula+')' : '';
	$divStats.append($('<p />', {
		class: 'monster-p'
	}).html('<b>' + app.local('Hit points') + '</b> ' + this.current.hp + hpFormula))

	$divStats.append($('<p />', {
		class: 'monster-p'
	}).html('<b>' + app.local('Speed') + '</b> ' + this.current.speed))


	$divStats.append($('<div />', {
		class: 'monster-hr'
	}))

	$divStats.append(this.abilitiesTable({
		str : this.current.str,
		dex : this.current.dex,
		con : this.current.con,
		int : this.current.int,
		wis : this.current.wis,
		cha : this.current.cha
	}))

	$divStats.append($('<div />', {
		class: 'monster-hr'
	}))
	
	if (this.current.saveThrows) {
		$divStats.append($('<p />', {
			class: 'monster-p'
		}).html('<b>' + app.local('Save Throws') + '</b> ' + this.getSaveThrows()))
	}

	if (this.current.skills) {
		$divStats.append($('<p />', {
			class: 'monster-p'
		}).html('<b>' + app.local('Skills') + '</b> ' + this.getSkills()))
	}

	if (this.current.damageResistances) {
		$divStats.append($('<p />', {
			class: 'monster-p'
		}).html('<b>' + app.local('Damage Resistances') + '</b> ' + this.current.damageResistances))
	}

	if (this.current.damageImmunities) {
		$divStats.append($('<p />', {
			class: 'monster-p'
		}).html('<b>' + app.local('Damage Immunities') + '</b> ' + this.current.damageImmunities))
	}

	if (this.current.conditionImmunities) {
		$divStats.append($('<p />', {
			class: 'monster-p'
		}).html('<b>' + app.local('Condition Immunities') + '</b> ' + this.current.conditionImmunities))
	}


	if (this.current.senses) {
		$divStats.append($('<p />', {
			class: 'monster-p'
		}).html('<b>' + app.local('Senses') + '</b> ' + this.current.senses))
	}

	if (this.current.languages) {
		$divStats.append($('<p />', {
			class: 'monster-p'
		}).html('<b>' + app.local('Languages') + '</b> ' + this.current.languages))
	}

	if (this.current.challenge || this.current.xp) {
		$divStats.append($('<p />', {
			class: 'monster-p'
		}).html('<b>' + app.local('Challenge') + '</b> ' + this.current.challenge + ' (' + this.current.xp + app.local('XP')  + ')'))
	}

	$divStats.append($('<div />', {
		class: 'monster-hr'
	}))

	if (this.current.additionalSetting) {
		$divStats.append(this.getParsedP(this.current.additionalSetting, 'monster-p'))
	}

	if (this.current.description) {
		$divStats.append($('<p />', {
		}).html(this.current.description))
	}


	var $divActions = $('<div />',{class:'monster-halfblock'});

	if (this.current.actions) {
		$divActions.append($('<h5 />', {
			class : 'monster-h5',
			text: app.local('Actions')
		}))
		$divActions.append(this.getParsedP(this.current.actions, 'monster-action-p'))
	}


	if (this.current.legendaryActions) {
		$divActions.append($('<h5 />', {
			class : 'monster-h5',
			text: app.local('Legenady Actions')
		}))
		$divActions.append(this.getParsedP(this.current.legendaryActions, 'monster-action-p'))
	}
	this.$div.append($divStats);
	this.$div.append($divActions);

};

UI_Monster_stats.prototype.init = function() {
	this.updateDiv();
}

UI_Monster_stats.prototype.getParsedP = function(str, htmlClass) {
	var arr = str.split('<br><b>');
	if (arr[0] == '') {
		arr.splice(0,1);
	}
	for (var i = arr.length - 1; i >= 0; i--) {
		arr[i] = arr[i].replace('</b><br>','</b>. ');
	};

	var result = arr.join('</p><p class="'+htmlClass+'"><b>');

	result = '<p class="'+htmlClass+'"><b>'+result+'</p>';
	return result;

}

UI_Monster_stats.prototype.getSaveThrows = function() {
	var result =this.current.saveThrows;
	result = result.replace('Dex', app.local('DEX'));
	result = result.replace('Str', app.local('STR'));
	result = result.replace('Con', app.local('CON'));
	result = result.replace('Int', app.local('INT'));
	result = result.replace('Wis', app.local('WIS'));
	result = result.replace('Cha', app.local('CHA'));

	return result;

}

UI_Monster_stats.prototype.getSkills = function() {
	var result =this.current.skills;
	result = result.replace('Perception', app.local('Perception'));
	result = result.replace('Stealth', app.local('Stealth'));

	return result;

}

UI_Monster_stats.prototype.show = function(name) {
	this.changeCurrent(name);
	this.updateDiv();
	// console.log(this.current)
}
UI_Monster_stats.prototype.showHero = function(name) {
	this.current = this.module.getHeroStateForMonsterView(name);
	this.updateDiv();
	// console.log(this.current)
}

UI_Monster_stats.prototype.changeCurrent = function(name) {
	this.current = this.module.bestiary.base[name];
}




UI_Monster_stats.prototype.abilitiesTable = function(o) {

	var str = o.str;
	var dex = o.dex;
	var con = o.con;
	var int = o.int;
	var wis = o.wis;
	var cha = o.cha;

	return ''
		+ '<table width="100%" cellpadding="2em" cellspacing="0px" class="ability">'
		+ '	<thead>'
		+ '		<tr>'
		+ '			<th width="16.6666%">' + app.local('STR') + '</th>'
		+ '			<th width="16.6666%">' + app.local('DEX') + '</th>'
		+ '			<th width="16.6666%">' + app.local('CON') + '</th>'
		+ '			<th width="16.6666%">' + app.local('INT') + '</th>'
		+ '			<th width="16.6666%">' + app.local('WIS') + '</th>'
		+ '			<th width="16.6666%">' + app.local('CHA') + '</th>'
		+ '		</tr>'
		+ '	</thead>'
		+ '	<tbody>'
		+ '		<tr>'
		+ '			<td>' + str + ' (' + app.getModStr(str) + ')</td>'
		+ '			<td>' + dex + ' (' + app.getModStr(dex) + ')</td>'
		+ '			<td>' + con + ' (' + app.getModStr(con) + ')</td>'
		+ '			<td>' + int + ' (' + app.getModStr(int) + ')</td>'
		+ '			<td>' + wis + ' (' + app.getModStr(wis) + ')</td>'
		+ '			<td>' + cha + ' (' + app.getModStr(cha) + ')</td>'
		+ '		</tr>'
		+ '	</tbody>'
		+ '</table>';


}