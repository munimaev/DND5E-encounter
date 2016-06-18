
var UI_Chargen_abilities_generation = function(component) {
	this.component = component;
	this.rule = 1;
	this.points = 27;
	this.levelPoints = 0;
	this.levelPointsMax = 0;

	this.$div = $('<div />',{class:'char_abilitycalc_head'});
	this.$p1 = $('<p />', {text:app.local('cg_Rule_Variant') + ' '});
	this.$div.append(this.$p1);
	this.$select = $('<select />');
	var func = function(self) {
		return function() {
			self.rule = self.$select.val()
			self.component.callEvent('changeRule');
		}
	}(this);
	this.$select.change(func)
	this.$p1.append(this.$select);
	this.$select.append($('<option />',{value:1,text:app.local('cg_Gen_Established')}));
	this.$select.append($('<option />',{value:2,text:app.local('cg_Gen_PoinBuy')}));

	this.$p2 = $('<p />',{text:'Очки для распеределения: '})
	this.$points = $('<span />')
	this.$p2.append(this.$points);
	this.$p2.append('/27.');
	this.$div.append(this.$p2);



	this.$p3 = $('<p />',{text:'Очки за уровни: '})
	this.$levelPoints = $('<span />')
	this.$levelPointsMax = $('<span />')
	this.$p3.append(this.$levelPoints);
	this.$p3.append('/');
	this.$p3.append(this.$levelPointsMax);
	this.$div.append(this.$p3);


	this.component.subscribe.changeRule.push(this.genReaction_SetRule());


}

UI_Chargen_abilities_generation.prototype.updateDiv = function() {
	this.$points.html(this.points);
	this.$levelPoints.html(this.levelPoints);
	this.$levelPointsMax.html(this.levelPointsMax);
	if (this.showPoints) {
		this.$p2.removeClass('nondisplay');
	} else {
		this.$p2.addClass('nondisplay');
	}
	if (this.levelPointsMax < 1) {
		this.$p3.addClass('nondisplay');
	}
}

UI_Chargen_abilities_generation.prototype.changePoints = function(mod) {
	// this.points += mod;
	// this.component.callEvent('changePoints');
	// this.updateDiv();

	this.setPoints(this.points + mod);
}

UI_Chargen_abilities_generation.prototype.setPoints = function(numb) {
	this.points = numb;
	this.component.callEvent('changePoints');
	this.updateDiv();
}

UI_Chargen_abilities_generation.prototype.genReaction_SetRule = function(numb) {
	var self = this;
	return function(){
		if (self.rule == 1) {
			self.showPoints = false;
		}
		if (self.rule == 2) {
			self.showPoints = true;
		}
		self.updateDiv();
	}
}

