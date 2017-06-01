//funcToCall ex: 
//createObject1:function(mouse){
//	var objeto = this.createPedra(mouse.x, mouse.y, 1);
//	return {obj:objeto, txt:'this.createPedra(' + mouse.x + ', ' + mouse.y + ', 1);\n'};
//},

pd.CreationDebugger = cc.Node.extend({
	ctor:function(targetLayer){
		this._super();
		this.objToCreate = 0;
		this.textToPrint = [];
		this.createdObjectList = [];	
		this.FuncToCall = [];
		this.targetLayer = targetLayer;

		pd.setKeyboard(this, "onKeyDown", "onKeyUp");
		pd.setInput(this, pd.setInput.MOUSE_DOWN, "onMouseDown");
		return true;
	},
	addFunc:function(caller, func){
		this.FuncToCall.push({caller:caller, func:func});
	},
	onKeyDown:function(key){
		if(key == 80){
			var textoTotal = "";
			for(var i = 0; i < this.textToPrint.length; i++){
				textoTotal += this.textToPrint[i];
			}
			cc.log(textoTotal);
		}
		if(key == 46){//del
			this.objToCreate = -1;
		}
		if(key >= 96 && key <= 105){
			if(key - 96 <= this.FuncToCall.length)
				this.objToCreate = key - 96;
		}
		cc.log(this.objToCreate)
	},

	onKeyUp:function(key){
		
	},
	onMouseDown:function(event){
		mouse = event.getLocation();
		mouse = this.targetLayer.convertToNodeSpace(mouse);
		mouse.x = Math.floor(mouse.x);
		mouse.y = Math.floor(mouse.y);
		if(this.objToCreate > 0){
			var args = this.FuncToCall[this.objToCreate - 1].caller[this.FuncToCall[this.objToCreate - 1].func](mouse);
			this.createdObjectList.push(args.obj);
			this.textToPrint.push(args.txt);
			args.obj.text = args.txt;
		}
		else if(this.objToCreate == -1){
			mouseBox = cc.rect(mouse.x, mouse.y, 1, 1);
			for(var i = 0; i < this.createdObjectList.length; i++){
				if(cc.rectIntersectsRect(mouseBox, this.createdObjectList[i].getBoundingBox())){
					var obj = this.createdObjectList[i];
					this.textToPrint.splice(this.textToPrint.indexOf(obj.text), 1);
					this.createdObjectList.splice(i, 1);
					obj.removeFromParent();
					break;
				}
			}
		}
	},
	
	
});