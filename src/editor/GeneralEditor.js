//autoria minha =3 Vinicius Carlos Maschio
pd.DebugArrayClickable = [];
pd.DebugArrayNonClickable = [];
pd.CurrentDebugScreen = null;
pd.CurrentDebugTarget = null;

var DEBUGGER_ID_COUNT = 0;
pd.AddToDebugger = function(obj, type, name){
	obj.Debugger_Id = DEBUGGER_ID_COUNT;
	if(!name)
		name = "obj" + obj.Debugger_Id;
	
	obj.debugName = name;
	DEBUGGER_ID_COUNT++;
	if(type == null || type == undefined || type == 0)
		pd.DebugArrayClickable.push(obj);
	else if(type == 1){
		pd.DebugArrayNonClickable.push(obj);
	}
}


if (!cc.sys.isNative) {

pd.GeneralDebugScreen = cc.Sprite.extend(
		{
			CheckBoxFlipped:null,
			CheckBoxBounding:null,
			editSpritePosX:null,
			editSpritePosY:null,
			editSpriteScaleX:null,
			editSpriteScaleY:null,
			editSpriteRotation:null,
			editSpriteAlpha:null,
			boundingBoxImage:null,
			Target:null,
			dragging:null,
			locked:null,
			mouseOffSet:null,
			ctor:function(){
				this._super(pd.res.debuggerUi);
			},
			init:function()
			{
				pd.CurrentDebugScreen = this;
				cc.eventManager.addListener({
					event: cc.EventListener.KEYBOARD,
					onKeyPressed:  function(keyCode, event){
						var debugElement = event.getCurrentTarget();
						debugElement.keyDown(keyCode, event);
					},
					onKeyReleased: function(keyCode, event){
						var debugElement = event.getCurrentTarget();
					}
				}, this);
				this.dragging = false;
				this.locked = false;
				//pd.DebugArrayClickable = [];
				
				this.arrayTODOS = pd.DebugArrayClickable;
				for(i = 0; i < pd.DebugArrayNonClickable.length; i++){
					this.arrayTodos.push(pd.DebugArrayNonClickable[i]);
				}
				
				
				GlobalDebugger = this;
				this.setPosition(800,500);
				this.setScale(2);
				pd.setInput(this, pd.setInput.MOUSE_DOWN, "onMouseDown");
				pd.setInput(this, pd.setInput.MOUSE_MOVE, "onMouseDragged");
				pd.setInput(this, pd.setInput.MOUSE_UP, "onMouseUp");

				this.btFechar = new cc.Sprite(pd.res.btn_fechar);
				this.btFechar.setPosition(129, 217);
				this.btFechar.setScale(0.60);
				this.addChild(this.btFechar, 5);

				this.btMais = new cc.Sprite(pd.res.btn_mais);
				this.btMais.setPosition(114, 217);
				this.btMais.setScale(0.60);
				this.addChild(this.btMais, 5);
				
				this.boundingBoxImage = new cc.Scale9Sprite(pd.res.BoundingBox);
				this.boundingBoxImage.setOpacity(0);
				this.addChild(this.boundingBoxImage);

				this.CheckBoxLocked = new cc.Sprite(pd.res.uncheckedButton);
				this.CheckBoxLocked.isSelected = false;
				this.CheckBoxLocked.setScale(0.5);
				this.CheckBoxLocked.setPosition(123,80);
				this.addChild(this.CheckBoxLocked);
				
				this.CheckBoxFlipped = new cc.Sprite(pd.res.uncheckedButton);
				this.CheckBoxFlipped.isSelected = false;
				this.CheckBoxFlipped.setScale(0.5);
				this.CheckBoxFlipped.setPosition(55,80);
				this.addChild(this.CheckBoxFlipped);
				
				this.CheckBoxBounding = new cc.Sprite(pd.res.uncheckedButton);
				this.CheckBoxBounding.isSelected = false;
				this.CheckBoxBounding.setScale(0.5);
				this.CheckBoxBounding.setPosition(115,23);
				this.addChild(this.CheckBoxBounding);
				
				this.editSpriteRotation = new cc.EditBox(new cc.Size(38,22), new cc.Scale9Sprite(pd.res.textBoxImage));
				this.editSpriteRotation.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
				this.editSpriteRotation.setFontColor(new cc.color(0,0,0,255));
				this.editSpriteRotation.setPosition(73,109);

				this.editSpriteAlpha = new cc.EditBox(new cc.Size(38,22), new cc.Scale9Sprite(pd.res.textBoxImage));
				this.editSpriteAlpha.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
				this.editSpriteAlpha.setFontColor(new cc.color(0,0,0,255));
				this.editSpriteAlpha.setPosition(62,53);

				this.addChild(this.editSpriteRotation);
				this.addChild(this.editSpriteAlpha);


				this.editSpritePosX = new cc.EditBox(new cc.Size(38,24), new cc.Scale9Sprite(pd.res.textBoxImage));
				this.editSpritePosX.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
				this.editSpritePosX.setFontColor(new cc.color(0,0,0,255));
				this.editSpritePosX.setPosition(50,172);

				this.editSpritePosY = new cc.EditBox(new cc.Size(38,24), new cc.Scale9Sprite(pd.res.textBoxImage));
				this.editSpritePosY.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
				this.editSpritePosY.setFontColor(new cc.color(0,0,0,255));
				this.editSpritePosY.setPosition(50,144);
				
				this.addChild(this.editSpritePosX);
				this.addChild(this.editSpritePosY);

				
				this.editSpriteScaleX = new cc.EditBox(new cc.Size(38,24), new cc.Scale9Sprite(pd.res.textBoxImage));
				this.editSpriteScaleX.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
				this.editSpriteScaleX.setFontColor(new cc.color(0,0,0,255));
				this.editSpriteScaleX.setPosition(113,172);

				this.editSpriteScaleY = new cc.EditBox(new cc.Size(38,24), new cc.Scale9Sprite(pd.res.textBoxImage));
				this.editSpriteScaleY.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
				this.editSpriteScaleY.setFontColor(new cc.color(0,0,0,255));
				this.editSpriteScaleY.setPosition(113,144);

				this.addChild(this.editSpriteScaleX);
				this.addChild(this.editSpriteScaleY);
				this.schedule(this.UpdateFunction,0.5,cc.RepeatForever);
				
				if(pd.CurrentDebugTarget != null && pd.CurrentDebugTarget != undefined){
					this.Target = pd.CurrentDebugTarget;
					this.TargetChanged();
				}
				return true;
			},
			UpdateFunction:function(dt){
				if(this.Target != null && this.Target != undefined){
					this.Target.x = parseInt(this.editSpritePosX.string);
					this.Target.y = parseInt(this.editSpritePosY.string);
					this.Target.setScaleX(parseFloat(this.editSpriteScaleX.string));
					this.Target.setScaleY(parseFloat(this.editSpriteScaleY.string));
					this.Target.setOpacity(parseInt(this.editSpriteAlpha.string));
					this.Target.setRotation(parseInt(this.editSpriteRotation.string));
					if(this.CheckBoxBounding.isSelected){
						this.boundingBoxImage.setContentSize(this.Target.getBoundingBox().width, this.Target.getBoundingBox().height);
						this.boundingBoxImage.setPosition(this.Target.getBoundingBox().x + this.Target.getBoundingBox().width/2 + this.Target.getOffsetPosition().x/2 , this.Target.getBoundingBox().y  + this.Target.getBoundingBox().height/2 + this.Target.getOffsetPosition().y/2);
						//this.boundingBoxImage.setPosition(this.convertToNodeSpace(this.boundingBoxImage.getPosition()));
					}					
				}

			},
			ShowBoundingBox:function(){
				if(this.Target != undefined && this.Target != null){	
					if(this.CheckBoxBounding.isSelected){
						this.CheckBoxBounding.isSelected = false;
						this.CheckBoxBounding.setTexture(pd.res.uncheckedButton);
						this.boundingBoxImage.setOpacity(0);
					}
					else{
						this.CheckBoxBounding.isSelected = true;
						this.CheckBoxBounding.setTexture(pd.res.checkedButton);
						this.boundingBoxImage.setOpacity(255);
						//this.boundingBoxImage.setAnchorPoint(this.Target.getAnchorPoint());
						this.boundingBoxImage.setContentSize(this.Target.getBoundingBox().width, this.Target.getBoundingBox().height);
						this.boundingBoxImage.setPosition(this.Target.getBoundingBox().x + this.Target.getBoundingBox().width/2 + this.Target.getOffsetPosition().x/2 , this.Target.getBoundingBox().y  + this.Target.getBoundingBox().height/2 + this.Target.getOffsetPosition().y/2  );
						//this.boundingBoxImage.setPosition(this.convertToNodeSpace(this.boundingBoxImage.getPosition()));		
					}
				}
			},

			FlipImage:function(){
				if(this.Target != undefined && this.Target != null){
					if(this.CheckBoxFlipped.isSelected){
						this.CheckBoxFlipped.isSelected = false;
						this.CheckBoxFlipped.setTexture(pd.res.uncheckedButton);
						this.Target.setFlippedX(false);
	
					}
					else{
						this.CheckBoxFlipped.isSelected = true;
						this.CheckBoxFlipped.setTexture(pd.res.checkedButton);
						this.Target.setFlippedX(true);
	
					}
				}
			},
			lockUnlock:function(){
				if(this.Target != undefined && this.Target != null){
					if(this.CheckBoxLocked.isSelected){
						this.CheckBoxLocked.isSelected = false;
						this.CheckBoxLocked.setTexture(pd.res.uncheckedButton);
						this.locked = false;

					}
					else{
						this.CheckBoxLocked.isSelected = true;
						this.CheckBoxLocked.setTexture(pd.res.checkedButton);
						this.locked = true;
					}
				}
			},
			TargetChanged: function(){

				pd.CurrentDebugTarget = this.Target;
				
				this.boundingBoxImage.removeFromParent();
				this.Target.getParent().addChild(this.boundingBoxImage, 1000);
				this.boundingBoxImage.setOpacity(0);
				this.CheckBoxFlipped.isSelected = false;
				this.CheckBoxFlipped.setTexture(pd.res.uncheckedButton);
				this.CheckBoxBounding.isSelected = false;
				this.CheckBoxBounding.setTexture(pd.res.uncheckedButton);
				if(this.Target.getRotation() == 0){
					this.editSpriteRotation.string = "0";
				}
				else{
					this.editSpriteRotation.string = this.Target.getRotation();
				}
				this.editSpritePosX.string = this.Target.x;
				this.editSpritePosY.string = this.Target.y;
				
				this.editSpriteScaleX.string = this.Target.getScaleX();
				this.editSpriteScaleY.string = this.Target.getScaleY();
				
				
				this.editSpriteAlpha.string = this.Target.getOpacity();
				
			},
			exitButtonFunc:function(){
				//volta pro debug inicial
				var debug = new pd.DebugScreen();
				this.boundingBoxImage.removeFromParent();
				this.getParent().addChild(debug, 9999);
				debug.init();
				this.removeFromParent();
			},
			initGeneralDebugger2:function(){
				var debug = new pd.GeneralDebugScreen2();
				debug.init();
				this.boundingBoxImage.removeFromParent();
				this.getParent().addChild(debug, 9999);
				this.removeFromParent();
			},
			//funcao ao precionar botao do mouse
			onMouseDown:function (event) {
				mouse = event.getLocation();

				mouseRect = new cc.rect(mouse.x, mouse.y, 1,1);
				///// colisaoComOsObj
				if(this.Target != null && this.Target != undefined){
					m = this.convertToNodeSpace(mouse);
					mouseRect = new cc.rect(m.x, m.y, 1,1);
					if(cc.rectIntersectsRect(mouseRect, this.CheckBoxFlipped.getBoundingBox())){
						this.FlipImage();
						return;
					}
					if(cc.rectIntersectsRect(mouseRect, this.CheckBoxBounding.getBoundingBox())){
						this.ShowBoundingBox();
						return;
					}	
					if(cc.rectIntersectsRect(mouseRect, this.CheckBoxLocked.getBoundingBox())){
						this.lockUnlock();
						return;
					}	
				}
				
				if(!cc.rectIntersectsRect(mouseRect, this.getBoundingBox())){
					for(i = 0; i < pd.DebugArrayClickable.length; i++){
						box = pd.DebugArrayClickable[i].getBoundingBox();
						box.x += pd.DebugArrayClickable[i].getOffsetPosition().x/2;
						box.y += pd.DebugArrayClickable[i].getOffsetPosition().y/2;
						mConverted = pd.DebugArrayClickable[i].getParent().convertToNodeSpace(mouse);
						mConverted = cc.rect(mConverted.x, mConverted.y, 1, 1);
						if(cc.rectIntersectsRect(mConverted, box)){
							if(this.Target != pd.DebugArrayClickable[i] && !this.locked){
								this.Target = pd.DebugArrayClickable[i];
								this.TargetChanged();
								break;
							}
							else if (this.Target == pd.DebugArrayClickable[i]){
								this.dragging = true;
							}
						}
					}					
				}
				mouse = this.convertToNodeSpace(mouse);
				if(mouse.x >= 0 && mouse.x <= 135 && mouse.y >= 210 && mouse.y <= 230){
					mouseRect = new cc.rect(mouse.x, mouse.y, 1,1);
					if(cc.rectIntersectsRect(mouseRect, this.btFechar.getBoundingBox())){
						this.exitButtonFunc();
					}
					if(cc.rectIntersectsRect(mouseRect, this.btMais.getBoundingBox())){
						this.initGeneralDebugger2();
					}
					else{
						this.MouseOffSet = cc.p(mouse.x, mouse.y - 230);
						this.MouseOffSet.x *= 2;
						this.MouseOffSet.y *= 2;
					}
				}
				
			},
			onMouseDragged:function(event) {
				if(this.MouseOffSet != null && this.MouseOffSet != undefined){
					mouse = event.getLocation();
					this.setPosition(mouse.x + this.getBoundingBox().width/2 - this.MouseOffSet.x, mouse.y - this.getBoundingBox().height/2 - this.MouseOffSet.y )
					//this.setPosition(mouse.x + this.getBoundingBox().width/2, mouse.y - this.getBoundingBox().height/2);	
				}
				if(this.dragging){
					mouse = event.getLocation();
					mouse = this.Target.getParent().convertToNodeSpace(mouse);
					this.Target.setPosition(mouse.x, mouse.y);
					this.editSpritePosX.string = parseInt(this.Target.x);
					this.editSpritePosY.string = parseInt(this.Target.y);					
				}
			},
			onMouseExited:function(event){
				this.onMouseUp(event);
			},
			//funcao ao soltar botao do mouse
			onMouseUp:function (event) {
				this.MouseOffSet = null;
				this.dragging = false;
			},

			onTouchesBegan: function(t, e) {
				//Inicio do toque na tela - o indice 0 representa o primeiro toque
				var touch = t[0];

				this.onMouseDown(touch);
				ispressed = true;
			},

			onTouchesEnded: function(t, e) {
				//Fim do toque na tela - o indice 0 representa o primeiro toque
				var touch = t[0];
				this.onMouseUp(touch);
			},

			onTouchesMoved: function(t, e) {
				//Movimento do toque na tela - o indice 0 representa o primeiro toque
				var touch = t[0];
				this.onMouseDragged(touch);
			},
			keyDown: function(key,event){
				if(key == 9){
					if(this.arrayIndex < this.arrayTODOS.length - 1 && this.arrayTODOS.length > 0){
						this.arrayIndex++;
						this.Target = this.arrayTODOS[this.arrayIndex];
						this.TargetChanged();
					}
					else if(this.arrayTODOS.length > 0){
						this.arrayIndex = 0;
						this.Target = this.arrayTODOS[this.arrayIndex];
						this.TargetChanged();
					}
				}
				if(key == 37){
					this.editSpritePosX.string = parseInt(this.editSpritePosX.string) - 1;
				}
				if(key == 38){
					this.editSpritePosY.string = parseInt(this.editSpritePosY.string) + 1;					
				}
				if(key == 39){
					this.editSpritePosX.string = parseInt(this.editSpritePosX.string) + 1;
				}
				if(key == 40){
					this.editSpritePosY.string = parseInt(this.editSpritePosY.string) - 1;					
				}
			},
			setTarget:function(newTarget){
				this.Target = newTarget;
			}
		});
}
var createBoundingBox = function(x,y, width, height){				
	var boundingBoxImage = new cc.Scale9Sprite(pd.res.BoundingBox);
	boundingBoxImage.setPosition(x,y);
	boundingBoxImage.setContentSize(width, height);
	return boundingBoxImage;
}