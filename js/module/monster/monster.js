var UI_Monster = function(o) {
	this.uiMonsterStats = new UI_Monster_stats({div:'#mm', module:this});
	this.uiMonsterList = new UI_Monster_list({div:'#ml',module:this} );
	this.uiMonsterSearch = new UI_Monster_search({div:'#ms',module:this} );
	this.bestiary = new UI_Monster_data();

	this.current = null;
	this.bestiary.init();
	this.uiMonsterStats.init();
	this.uiMonsterList.init();
	this.uiMonsterSearch.init();
	this.local = 'rus';

	this.events = {};
	this.bindEvents();

}

