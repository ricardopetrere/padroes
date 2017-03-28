
if (!cc.sys.isNative) {

	pd.GeneralDebugScreen2 = cc.Sprite.extend(
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
				locked:null,
				dragging:null,
				mouseOffSet:null,
				ctor:function(){
					this._super(pd.resPadrao.debuggerUi2);
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
					this.arrayTODOS = pd.DebugArrayClickable;
					for(i = 0; i < pd.DebugArrayNonClickable.length; i++){
						this.arrayTodos.push(pd.DebugArrayNonClickable[i]);
					}
					this.locked = false;
					this.dragging = false;
					GlobalDebugger = this;
					this.setPosition(800,500);
					this.setScale(1.5);
					pd.setInput(this, pd.setInput.MOUSE_DOWN, "onMouseDown");
					pd.setInput(this, pd.setInput.MOUSE_MOVE, "onMouseDragged");
					pd.setInput(this, pd.setInput.MOUSE_UP, "onMouseUp");

					this.btFechar = new cc.Sprite(pd.resPadrao.btn_fechar);
					this.btFechar.setPosition(155, 219);
					this.btFechar.setScale(0.60);
					this.addChild(this.btFechar, 5);

					this.btMais = new cc.Sprite(pd.resPadrao.btn_mais);
					this.btMais.setPosition(140, 219);
					this.btMais.setScale(0.60);
					this.addChild(this.btMais, 5);

					
					//this.editAnchorPX = new cc.EditBox(new cc.Size(24,18), new cc.Scale9Sprite(pd.resPadrao.textBoxImage));
						this.editAnchorPX = new cc.EditBox(new cc.Size(28, 20), new cc.Scale9Sprite(pd.resPadrao.BoundingBox));
					this.editAnchorPX.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
					this.editAnchorPX.setFontColor(new cc.color(0,0,0,255));
					this.editAnchorPX.setPosition(100,178);
					this.editAnchorPX.setFontSize(16);
					this.addChild(this.editAnchorPX);

					this.editAnchorPY = new cc.EditBox(new cc.Size(28,20), new cc.Scale9Sprite(pd.resPadrao.BoundingBox));
					this.editAnchorPY.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
					this.editAnchorPY.setFontColor(new cc.color(0,0,0,255));
					this.editAnchorPY.setPosition(143,178);
					this.editAnchorPY.setFontSize(16);
					this.addChild(this.editAnchorPY);


					this.editAnchorVX = new cc.EditBox(new cc.Size(30,20), new cc.Scale9Sprite(pd.resPadrao.BoundingBox));
					this.editAnchorVX.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
					this.editAnchorVX.setFontColor(new cc.color(0,0,0,255));
					this.editAnchorVX.setPosition(100,158);
					this.editAnchorVX.setFontSize(10);
					this.addChild(this.editAnchorVX);
					
					this.editAnchorVY = new cc.EditBox(new cc.Size(30,20), new cc.Scale9Sprite(pd.resPadrao.BoundingBox));
					this.editAnchorVY.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
					this.editAnchorVY.setFontColor(new cc.color(0,0,0,255));
					this.editAnchorVY.setPosition(143, 158);
					this.editAnchorVY.setFontSize(10);
					this.addChild(this.editAnchorVY);

					this.InternalAnchor = null;

					this.editZOrder = new cc.EditBox(new cc.Size(70,20), new cc.Scale9Sprite(pd.resPadrao.BoundingBox));
					this.editZOrder.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
					this.editZOrder.setFontColor(new cc.color(0,0,0,255));
					this.editZOrder.setPosition(120,20);
					this.editZOrder.internalZOrder = 0;
					this.editZOrder.setFontSize(16);
					this.addChild(this.editZOrder);
					
					this.editRed = new cc.EditBox(new cc.Size(32,20), new cc.Scale9Sprite(pd.resPadrao.BoundingBox));
					this.editRed.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
					this.editRed.setFontColor(new cc.color(0,0,0,255));
					this.editRed.setPosition(40,107);
					this.editRed.internalZOrder = 0;
					this.editRed.setFontSize(14);
					this.addChild(this.editRed);
					
					this.editGreen = new cc.EditBox(new cc.Size(32,20), new cc.Scale9Sprite(pd.resPadrao.BoundingBox));
					this.editGreen.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
					this.editGreen.setFontColor(new cc.color(0,0,0,255));
					this.editGreen.setPosition(40,87);
					this.editGreen.internalZOrder = 0;
					this.editGreen.setFontSize(14);
					this.addChild(this.editGreen);
					
					this.editBlue = new cc.EditBox(new cc.Size(32,20), new cc.Scale9Sprite(pd.resPadrao.BoundingBox));
					this.editBlue.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
					this.editBlue.setFontColor(new cc.color(0,0,0,255));
					this.editBlue.setPosition(40,67);
					this.editBlue.internalZOrder = 0;
					this.editBlue.setFontSize(14);
					this.addChild(this.editBlue);
					
					this.colorFusion = new cc.LayerColor(new cc.Color(255,255,255), 46, 14);
					this.colorFusion.setPosition(110, 40);
					this.addChild(this.colorFusion);

					this.CheckBoxLocked = new cc.Sprite(pd.resPadrao.uncheckedButton);
					this.CheckBoxLocked.isSelected = false;
					this.CheckBoxLocked.setScale(0.5);
					this.CheckBoxLocked.setPosition(139,106);
					this.addChild(this.CheckBoxLocked);
					
					this.CheckBoxShowAP = new cc.Sprite(pd.resPadrao.uncheckedButton);
					this.CheckBoxShowAP.isSelected = false;
					this.CheckBoxShowAP.setScale(0.5);
					this.CheckBoxShowAP.setPosition(147,87);
					this.addChild(this.CheckBoxShowAP);
					
					if(pd.CurrentDebugTarget != null && pd.CurrentDebugTarget != undefined){
						this.Target = pd.CurrentDebugTarget;
						this.TargetChanged();
					}

					this.schedule(this.UpdateFunction,0.5,cc.RepeatForever);
					
					return true;
				},
				UpdateFunction:function(dt){
					if(this.Target != null && this.Target != undefined){
						if(this.editZOrder.internalZOrder != parseInt(this.editZOrder.string)){
							this.Target.setLocalZOrder(parseInt(this.editZOrder.string));
							this.editZOrder.internalZOrder = this.Target.getLocalZOrder();
						} 

						var size = this.Target.getBoundingBox();
						var anchor1 = cc.p(parseFloat(this.editAnchorPX.string), parseFloat(this.editAnchorPY.string));
						var anchor2 = cc.p(this.editAnchorVX.string / size.width , this.editAnchorVY.string / size.height);
					
						if(isNaN(anchor1.x)){
							anchor1.x = 0.0;
						}
						if(isNaN(anchor1.y)){
							anchor1.y = 0.0;
						}
						if(isNaN(anchor1.x)){
							anchor2.x = 0.0;
						}
						if(isNaN(anchor1.x)){
							anchor2.y = 0.0;
						}
						
						if(this.InternalAnchor.x != anchor1.x || this.InternalAnchor.y != anchor1.y){
							cc.log('trocou por %')
							this.Target.setAnchorPoint(anchor1.x, anchor1.y);
							this.InternalAnchor = anchor1;				

							var size = this.Target.getBoundingBox();
							this.editAnchorVX.string = size.width * this.Target.getAnchorPoint().x;
							this.editAnchorVY.string = size.height * this.Target.getAnchorPoint().y;
						} 
						else if(this.InternalAnchor.x != anchor2.x || this.InternalAnchor.y != anchor2.y){
							cc.log('trocou por valor')
							this.Target.setAnchorPoint(anchor2.x, anchor2.y);
							this.InternalAnchor = anchor2;	
							var anchor = this.Target.getAnchorPoint();
							this.editAnchorPX.string = anchor.x;
							this.editAnchorPY.string = anchor.y;							
						}
						

						this.Target.setColor(new cc.Color(parseInt(this.editRed.string),
								parseInt(this.editGreen.string),
								parseInt(this.editBlue.string)));
						
						this.colorFusion.setColor(new cc.Color(parseInt(this.editRed.string),
								parseInt(this.editGreen.string),
								parseInt(this.editBlue.string)));			
					}

				},
				TargetChanged: function(){
					pd.CurrentDebugTarget = this.Target;
					
					if(this.crossRef != null && this.crossRef != undefined){
						this.crossRef.removeFromParent();
					}
					
					this.InternalAnchor = this.Target.getAnchorPoint();
					
					var anchor = this.Target.getAnchorPoint();
					this.editAnchorPX.string = anchor.x;
					this.editAnchorPY.string = anchor.y;					
					
					var size = this.Target.getBoundingBox();
					this.editAnchorVX.string = size.width * anchor.x;
					this.editAnchorVY.string = size.height * anchor.y;

					this.editZOrder.string = this.Target.getLocalZOrder();
					this.editZOrder.internalZOrder = this.Target.getLocalZOrder();
					
					cor = this.Target.getColor();
					this.editRed.string = cor.r;
					this.editGreen.string = cor.g;
					this.editBlue.string = cor.b;

					this.editAnchorVX.setFontSize(9);
					this.editAnchorVY.setFontSize(9);
					
				},

				lockUnlock:function(){
					if(this.Target != undefined && this.Target != null){
						if(this.CheckBoxLocked.isSelected){
							this.CheckBoxLocked.isSelected = false;
							this.CheckBoxLocked.setTexture(pd.resPadrao.uncheckedButton);
							this.locked = false;

						}
						else{
							this.CheckBoxLocked.isSelected = true;
							this.CheckBoxLocked.setTexture(pd.resPadrao.checkedButton);
							this.locked = true;
						}
					}
				},
				
				showAnchorPoint:function(){
					if(this.Target != undefined && this.Target != null){
						if(this.CheckBoxShowAP.isSelected){
							this.CheckBoxShowAP.isSelected = false;
							this.CheckBoxShowAP.setTexture(pd.resPadrao.uncheckedButton);
							this.crossActive = false;
							this.crossRef.removeFromParent();
							this.crossRef = null;
						}
						else{
							this.CheckBoxShowAP.isSelected = true;
							this.CheckBoxShowAP.setTexture(pd.resPadrao.checkedButton);
							this.crossActive = true;
							
							var newCross = new cc.Sprite(pd.resPadrao.cross); 
							this.crossRef = newCross;
							this.crossRef.setScale(1);
							this.Target.addChild(newCross, 99999);
							newCross.setPosition(parseInt(this.editAnchorVX.string), parseInt(this.editAnchorVY.string));
							newCross.runAction(new cc.RepeatForever(new cc.Sequence(new cc.TintTo(2, 255, 255, 255), new cc.TintTo(2, 0, 0, 0))));
							
						}
					}
				},
				
				exitButtonFunc:function(){
					//volta pro debug inicial
					var debug = new pd.DebugScreen();
					this.getParent().addChild(debug, 9999);
					debug.init();
					this.removeFromParent();
				},
				initGeneralDebugger:function(){
					var debug = new pd.GeneralDebugScreen();
					debug.init();
					this.getParent().addChild(debug, 9999);
					this.removeFromParent();
				},
				//funcao ao precionar botao do mouse
				onMouseDown:function (event) {
					mouse = event.getLocation();

					if(this.Target != null && this.Target != undefined){
						m = this.convertToNodeSpace(mouse);
						mouseRect = new cc.rect(m.x, m.y, 1,1);
						if(cc.rectIntersectsRect(mouseRect, this.CheckBoxLocked.getBoundingBox())){
							this.lockUnlock();
							return;
						}	
						if(cc.rectIntersectsRect(mouseRect, this.CheckBoxShowAP.getBoundingBox())){
							this.showAnchorPoint();
							return;
						}	
					}

					mouseRect = new cc.rect(mouse.x, mouse.y, 1,1);
					if(!cc.rectIntersectsRect(mouseRect, this.getBoundingBox())){

						if (this.locked && this.crossRef != null){
							mConverted = this.Target.convertToNodeSpace(mouse);
							mConverted = cc.rect(mConverted.x, mConverted.y, 1, 1);
							if(cc.rectIntersectsRect(mConverted, this.crossRef.getBoundingBox())){
								this.dragging = true;
								cc.log('dragging')
							}
						}
						else
						for(i = 0; i < pd.DebugArrayClickable.length; i++){
							box = pd.DebugArrayClickable[i].getBoundingBox();
							box.x += pd.DebugArrayClickable[i].getOffsetPosition().x/2;
							box.y += pd.DebugArrayClickable[i].getOffsetPosition().y/2;
							mConverted = pd.DebugArrayClickable[i].getParent().convertToNodeSpace(mouse);
							mConverted = cc.rect(mConverted.x, mConverted.y, 1, 1);
							if(cc.rectIntersectsRect(mConverted, box) && !this.locked){
								if(this.Target != pd.DebugArrayClickable[i]){
									this.Target = pd.DebugArrayClickable[i];
									this.TargetChanged();
									break;
								}
							}
						}					
					}
					mouse = this.convertToNodeSpace(mouse);
					if(mouse.x >= 0 && mouse.x <= 185 && mouse.y >= 210 && mouse.y <= 230){
						mouseRect = new cc.rect(mouse.x, mouse.y, 1,1);
						if(cc.rectIntersectsRect(mouseRect, this.btFechar.getBoundingBox())){
							this.exitButtonFunc();
						}
						if(cc.rectIntersectsRect(mouseRect, this.btMais.getBoundingBox())){
							this.initGeneralDebugger();
						}
						else{
							this.MouseOffSet = cc.p(mouse.x, mouse.y - 230);
							this.MouseOffSet.x *= 1.5;
							this.MouseOffSet.y *= 1.5;
						}
					}
					
				},
				onMouseDragged:function(event) {
					if(this.MouseOffSet != null && this.MouseOffSet != undefined){
						mouse = event.getLocation();
						this.setPosition(mouse.x + this.getBoundingBox().width/2 - this.MouseOffSet.x, mouse.y - this.getBoundingBox().height/2 - this.MouseOffSet.y )
					}
					if(this.dragging){
						mouse = event.getLocation();
						mouse = this.Target.convertToNodeSpace(mouse);
						this.crossRef.setPosition(mouse);					
					}
				},
				onMouseExited:function(event){
					this.onMouseUp(event);
				},
				//funcao ao soltar botao do mouse
				onMouseUp:function (event) {
					this.MouseOffSet = null;
					if(this.dragging){
						pos = this.crossRef.getPosition();
						
						this.editAnchorVX.string = pos.x;
						this.editAnchorVY.string = pos.y;
					}
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
						this.Target.x - 1;
					}
					if(key == 38){
						this.Target.y + 1;					
					}
					if(key == 39){
						this.Target.x + 1;
					}
					if(key == 40){
						this.Target.y - 1;					
					}
				},
				setTarget:function(newTarget){
					this.Target = newTarget;
					pd.CurrentDebugTarget = this.Target;
				}
			});
}
var createBoundingBox = function(x,y, width, height){				
	var boundingBoxImage = new cc.Scale9Sprite(pd.resPadrao.BoundingBox);
	boundingBoxImage.setPosition(x,y);
	boundingBoxImage.setContentSize(width, height);
	return boundingBoxImage;
}