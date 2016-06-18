var UI_Options_Option_Saveload = function(o) {
	this.title = app.local('Save') + '/' + app.local('Load');
	UI_Options_Option.apply(this, arguments);

}


UI_Options_Option_Saveload.prototype = Object.create(UI_Options_Option.prototype);

UI_Options_Option_Saveload.prototype.createHtml = function() {
	UI_Options_Option.prototype.createHtml.apply(this);

	(this.$div = $('<div>', {}))
	.append(
		(this.$header1 = $('<h5 />', {
			class: 'block-header',
			text: app.local('Save')
		}))
	)
	.append(
		(this.$buttons = $('<div />', {
			class: 'block-padding'
		}))
		.append(
			(this.$buttonJSON = $('<span />', {
				class: 'inline-button monster-subHeaderButton',
				text: 'JSON',
				click: function(self){
					return function() {
						self.module.callEvent('optionJSON');
					}
				}(this)
			}))
		)
	)
	.append(
		(this.$header2 = $('<h5 />', {
			class: 'block-header',
			text: app.local('Load')
		}))
	)
	.append(
		(this.$buttons = $('<div />', {
			class: 'block-padding'
		}))
		.append(
			(this.$buttonJSON = $('<span />', {
				class: 'inline-button monster-subHeaderButton',
				text: app.local('Load'),
				click: function(self){
					return function() {
						self.module.callEvent('optionLoad');
					}
				}(this)
			}))
		)
	)

}
