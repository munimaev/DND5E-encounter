var UI_Chargen_steps_step = function(o) {
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
	if(!o.hasOwnProperty('component')) {
		throw new Error('Нет свойства component');
	} else {
		this.component = o.component;
	}
	this.id   = o.obj.id;
	this.name = app.local(o.obj.name)
}
UI_Chargen_steps_step.prototype.init = function() {
	this.$wrap = $('<div />');

	var linkFunc = function(self){
		return function() {
			self.component.setStep(self.id);
		}
	}(this)
	this.$link = $('<span />', {
		class: 'chargen-step-link link',
		text: this.name,
		click: linkFunc
	});


	this.$wrap.append(this.$link);
	this.$div.append(this.$wrap);
	this.updateDiv();
}


UI_Chargen_steps_step.prototype.updateDiv = function() {
}

