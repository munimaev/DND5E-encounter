var UI_Chargen_steps = function(o) {
	if (!o.hasOwnProperty('div')) {
		throw new Error('Нет свойства div');
	} else {
		if (typeof o.div == 'string') {
			this.$div = $(o.div)
		} else {
			this.$div = o.div;
		}
	}
	if (!o.hasOwnProperty('module')) {
		throw new Error('Нет свойства module');
	} else {
		this.module = o.module;
	}
	this.steps = {};
	this.step = 'race';

}
UI_Chargen_steps.prototype.init = function() {

	this.$div.append($('<h4>', {
		'text': app.local('gen_steps_Steps')
	}))
	this.$main = $('<div />')

	this.$div.append(this.$main);
	var len = this.stepsArr.length;
	for (var i = 0; i < len; i++) {
		this.steps[this.stepsArr[i].id] = new UI_Chargen_steps_step({
			div : this.$main,
			module : this.module,
			component : this,
			obj : this.stepsArr[i]
		});
		this.steps[this.stepsArr[i].id].init();
	}

	this.updateDiv();

}


UI_Chargen_steps.prototype.updateDiv = function() {
	for (var i in this.steps) {
		if (this.step != i) {
			this.steps[i].$link.removeClass('selected');
		}
		else {
			this.steps[i].$link.addClass('selected');
		}
	}
}

UI_Chargen_steps.prototype.setStep = function(step) {
	this.step = step;
	this.updateDiv();
	this.module.callEvent('changeStep', step);
}

UI_Chargen_steps.prototype.stepsArr = [
	{
		id: 'race',
		name: 'gen_steps_Race'
	}, {
		id: 'class',
		name: 'gen_steps_Class'
	}, {
		id: 'abilities',
		name: 'gen_steps_Abilities'
	}, {
		id: 'equipment',
		name: 'gen_steps_Equipment'
	}, 
]