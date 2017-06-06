//autoria minha =3 Vinicius Carlos Maschio
var DebugArray = [];


var AddToDebugger = function(obj){
	DebugArray.push(obj);
}

/**
 * Arrumar a nomeação - mudar de 'Debug' para 'Editor'!
 */
pd.DebugScreen = cc.Layer.extend(
		{
			CheckBoxFlipped:null,
			CheckBoxBounding:null,
			editSpritePosX:null,
			editSpritePosY:null,
			editSpriteScaleX:null,
			editSpriteScaleY:null,
			dragging:null,
			dragOffSet:null,
			editSpriteRotation:null,
			editSpriteAlpha:null,
			boundingBoxImage:null,
			Target:null,
			mouseOffSet:null,
			arrayIndex:null,
			targetNameToDisplay:null,
			functionState:null,
			ctor:function(){
				this._super();
			},
			init:function(){
				this.getParent().debugScreen = this; 
				pd.CurrentDebugScreen = this;
				this.setPosition(512, 100);
				this.functionState = 0;
				this.arrayIndex = 0;
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

				GlobalDebugger = this;

				pd.setInput(this, pd.setInput.MOUSE_DOWN, "onMouseDown");
				pd.setInput(this, pd.setInput.MOUSE_MOVE, "onMouseDragged");
				pd.setInput(this, pd.setInput.MOUSE_UP, "onMouseUp");
				
				DebugArray = [];
				
				this.exitButtonFunc();
			},
			removeGeneralUi:function(){
				if(this.UiGeral != null || this.UiGeral != undefined)
					this.UiGeral.removeFromParent(true);
				if(this.btn_general != null || this.btn_general != undefined)
					this.btn_general.removeFromParent(true);
				if(this.btn_audio != null || this.btn_audio != undefined)
					this.btn_audio.removeFromParent(true);
				if(this.btn_animation != null || this.btn_animation != undefined)
					this.btn_animation.removeFromParent(true);
				this.UiGeral = null; this.btn_general = null; this.btn_audio = null; this.btn_animation = null;
			},
			exitButtonFunc:function(){

				this.UiGeral = new cc.Sprite(pd.res.mainDebugInterface);
				this.UiGeral.setPosition(0,0);
				this.addChild(this.UiGeral);
				this.btn_general = new cc.Sprite(pd.res.btn_general);
				this.btn_general.setPosition(-165,0);
				this.addChild(this.btn_general)
				this.btn_audio = new cc.Sprite(pd.res.btn_audio);
				this.btn_audio.setPosition(170,0);
				this.addChild(this.btn_audio)
				this.btn_animation = new cc.Sprite(pd.res.btn_animation);
				this.btn_animation.setPosition(5,0);
				this.addChild(this.btn_animation)
			},
			
			initInterface2:function(){
				this.AddInterface = new cc.Sprite(pd.res.debuggerUi2);
				this.AddInterface.setPosition(70,115);
				this.addChild(this.AddInterface);
				
				this.anchorPercX = new cc.EditBox(new cc.Size(38,24), new cc.Scale9Sprite(pd.res.textBoxImage));
				this.anchorPercX.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
				this.anchorPercX.setFontColor(new cc.color(0,0,0,255));
				this.anchorPercX.setPosition(50,144);
				this.anchorPercY = new cc.EditBox(new cc.Size(38,24), new cc.Scale9Sprite(pd.res.textBoxImage));
				this.anchorPercY.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
				this.anchorPercY.setFontColor(new cc.color(0,0,0,255));
				this.anchorPercY.setPosition(50,144);

				this.anchorValorX= new cc.EditBox(new cc.Size(24,24), new cc.Scale9Sprite(pd.res.textBoxImage));
				this.anchorValorX.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
				this.anchorValorX.setFontColor(new cc.color(0,0,0,255));
				this.anchorValorX.setPosition(50,144);
				this.anchorValorY= new cc.EditBox(new cc.Size(24,24), new cc.Scale9Sprite(pd.res.textBoxImage));
				this.anchorValorY.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);	
				this.anchorValorY.setFontColor(new cc.color(0,0,0,255));
				this.anchorValorY.setPosition(50,144);
				
			},
			initGeneralDebugger:function(){
				var debug = new pd.GeneralDebugScreen();
				this.getParent().addChild(debug, 9999);
				debug.init();
				this.removeFromParent();
			},
			
			onMouseDown:function (event) {
				loc = event.getLocation();
				loc = this.convertToNodeSpace(loc);
				mouseRect = new cc.rect(loc.x, loc.y, 3, 3);
				if(cc.rectIntersectsRect(mouseRect, this.btn_general.getBoundingBox())){
					this.removeGeneralUi();
					this.initGeneralDebugger();
				}
				else if(cc.rectIntersectsRect(mouseRect, this.btn_audio.getBoundingBox())){
					cc.log('under construction')
				}
				else if(cc.rectIntersectsRect(mouseRect, this.btn_animation.getBoundingBox())){
					cc.log('under construction')
				}
								
			},
			onMouseDragged:function(event) {

			},
			onMouseExited:function(event){
				this.onMouseUp(event);
			},
			//funcao ao soltar botao do mouse
			onMouseUp:function (event) {
			
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
				// cc.log(key);
				
				if(key == 112){//f1
					if(this.isVisible())
						this.setVisible(false);
					else
						this.setVisible(true);
				}
				if(this.isVisible()){
					if(key == 9){
						if(this.arrayIndex < DebugArray.length - 1 && DebugArray.length > 0){
							this.arrayIndex++;
							this.Target = DebugArray[this.arrayIndex];
							this.TargetChanged();
							cc.log(this.Target.displayFrame().getTexture());
						}
						else if(DebugArray.length > 0){
							this.arrayIndex = 0;
							this.Target = DebugArray[this.arrayIndex];
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
				}
			}
		});