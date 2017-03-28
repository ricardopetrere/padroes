//temporario?
pd.MenuItem = cc.Sprite.extend({
	ctor:function(spriteN, spriteS, func, layer){
		this._super(this.spriteN);	
		this.setSpriteFrame(spriteN);
		//cc.log('log');
		this.spriteN = spriteN;
		this.spriteS = spriteS;
		this.func = func;
		this.layerPai = layer;
		this.isClicked = false;
	},
	onMouseDown:function(event){
		rect1 = new cc.rect(event.x, event.y, 3, 3);
		if(cc.rectIntersectsRect(this.getBoundingBox(), rect1)){
			this.setSpriteFrame(this.spriteS);
			this.isClicked = true;
		}
	},
	onMouseMove:function(event){
		rect1 = new cc.rect(event.x, event.y, 3, 3);
		if(!cc.rectIntersectsRect(this.getBoundingBox(), rect1)){
			this.isClicked = false;
			this.setSpriteFrame(this.spriteN);
		}
	},
	onMouseUp:function(event){
		rect1 = new cc.rect(event.x, event.y, 3, 3);
		if(cc.rectIntersectsRect(this.getBoundingBox(), rect1) && this.isClicked){
			this.setSpriteFrame(this.spriteN);
			this.isClicked = false;
			this.layerPai.runAction(new cc.CallFunc(this.func, this.layerPai));
		}
	},
});

pd.Menu = cc.Layer.extend({
	ctor:function(item1, item2, item3, item4){
		this._super();
		if(item1 != undefined && item1 != null)
			this.addChild(item1);
		if(item2 != undefined && item2 != null)
			this.addChild(item2);
		if(item3 != undefined && item3 != null)
			this.addChild(item3);
		if(item4 != undefined && item4 != null)
			this.addChild(item4);
		pd.setInput(this, 0, "onMouseDown");
		pd.setInput(this, 2, "onMouseUp");
		pd.setInput(this, 1, "onMouseDragged");

	},
	onMouseDown:function(event){
		loc = event.getLocation();
		loc = this.convertToNodeSpace(loc);
		var allChildren = this.getChildren();
		for(var i = 0; i< allChildren.length; i++) {
			allChildren[i].onMouseDown(loc);
		}
	},
	onMouseUp:function(event){
		loc = event.getLocation();
		loc = this.convertToNodeSpace(loc);  
		var allChildren = this.getChildren();
		for(var i = 0; i< allChildren.length; i++) {
			allChildren[i].onMouseUp(loc);
		}
	},
	onMouseDragged:function(event){
		loc = event.getLocation();
		loc = this.convertToNodeSpace(loc);
		var allChildren = this.getChildren();
		for(var i = 0; i< allChildren.length; i++) {
			allChildren[i].onMouseMove(loc);
		}
	},
});


