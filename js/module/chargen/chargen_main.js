var UI_Chargen_main = function(o) {
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
	this.race = '';
}

UI_Chargen_main.prototype.init = function() {
	this.$div.append($('<h4>',{'text':app.local('cg_BasicProperties')}))


	this.$inputName = $('<input />',{type:'text'});
	this.$div.append($('<p>',{'text':app.local('cg_Name')+': '}).append(this.$inputName));


	var arr = [];
	for (var i in Races) {
		arr.push({value:i,text:app.local(Races[i].name)})
	}
	this.$inputRace = this.genSelect(arr);
	this.$div.append($('<p>',{'text':app.local('cg_Race')+': '}).append(this.$inputRace));
	this.$inputRace.change(function(self){
		return function() {
			self.setRace($(this).val());
		}
	}(this))

	this.$inputSubrace = this.genSelect();
	this.$div.append($('<p>',{'text':app.local('cg_Subrace')+': '}).append(this.$inputSubrace));
	this.$inputSubrace.change(function(self){
		return function() {
			self.setSubrace($(this).val());
		}
	}(this))


	this.$inputClass = this.genSelect([{text:app.local('Barbarian')},{text:app.local('Bard')}]);
	this.$div.append($('<p>',{'text':app.local('cg_Class')+': '}).append(this.$inputClass));


	var arr = [];
	for (var i = 1; i <= 20; i++) {
		arr.push({text:i})
	}
	this.$inputLevel = this.genSelect(arr);
	this.$div.append($('<p>',{'text':app.local('cg_Level')+': '}).append(this.$inputLevel));


	this.$inputAligment = this.genSelect([{text:app.local('cg_CE')},{text:app.local('cg_LG')}]);
	this.$div.append($('<p>',{'text':app.local('cg_Aligment')+': '}).append(this.$inputAligment));


	this.$inputExperience = $('<input />',{type:'text'});
	this.$div.append($('<p>',{'text':app.local('cg_ExperiencePoints')+': '}).append(this.$inputExperience));

	this.updateDiv();
}

UI_Chargen_main.prototype.updateDiv = function(o) {
	if (!o || o.hasOwnProperty('race')) {
		var race = this.race.id || "default";
		if (race != this.$inputRace.val() ) {
			this.$inputRace.val(race);
		}
		this.$inputSubrace.empty();
		if (Races.hasOwnProperty(race) && Races[race].hasOwnProperty('subrace')) {
			var len = Races[race].subrace.length;
			for (var i =  0; i < len; i++) {
				this.$inputSubrace.append($('<option />', {
					value: app.local(Races[race].subrace[i]),
					text: app.local(Subraces[Races[race].subrace[i]].name)
				}))
			};
		}

	}
	if (!o || o.hasOwnProperty('subrace')) {
		// if (this.subrace.id != this.$inputRace.val() ) {
		// 	this.$inputRace.val(this.subrace.id);
		// }
	}
}

UI_Chargen_main.prototype.genSelect = function(opts,obj) {
	var obj = obj || {};
	var opts = opts || [];
	var len = opts.length;
	var $opt =  $('<select />',obj);
	for (var i = 0; i < len; i++) {
		$opt.append($('<option>',opts[i]));
	};
	return $opt;
}

UI_Chargen_main.prototype.setRace = function(race) {
	this.race = Races[race];
	this.subrace = null;
	if (Races[race].hasOwnProperty('subrace') && Races[race].subrace.length) {
		this.subrace = Subraces[Races[race].subrace[0]]
	}
	this.updateDiv({race:1, subrace:1});
	this.module.callEvent('changeRace',race);
	this.module.callEvent('changeSubrace',race)
}


UI_Chargen_main.prototype.setSubrace = function(subrace) {
	this.subrace = Subraces[subrace];
	this.updateDiv({subrace:1});
	this.module.callEvent('changeSubrace',subrace)
}



