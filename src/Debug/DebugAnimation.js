//autoria minha =3 Vinicius Carlos Maschio
var DebugArray = [];
var AddToDebugger = function(obj){
	DebugArray.push(obj);
}


var DebugScreen = cc.Sprite.extend(
		{
			ctor:function(){
				this._super(resPadrao.debuggerUi);
				// Custom intialization
			},
			init:function()
			{
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
				
				//Target.Animation.n

				
				return true;
			},
			
			UpdateFunction:function(dt){
				

			},

			//funcao ao precionar botao do mouse
			onMouseDown:function (event) {
				mouse = event.getLocation();
				mouseRect = new cc.rect(mouse.x, mouse.y, 1,1);
			},
			onMouseDragged:function(event) {
				if(this.MouseOffSet != null && this.MouseOffSet != undefined){
					mouse = event.getLocation();
					cc.log(this.MouseOffSet);
					this.setPosition(mouse.x + this.getBoundingBox().width/2 - this.MouseOffSet.x, mouse.y - this.getBoundingBox().height/2 - this.MouseOffSet.y )
					//this.setPosition(mouse.x + this.getBoundingBox().width/2, mouse.y - this.getBoundingBox().height/2);

				}
			},
			onMouseExited:function(event){
				this.onMouseUp(event);
			},
			//funcao ao soltar botao do mouse
			onMouseUp:function (event) {
				this.MouseOffSet = null;
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
				cc.log(key);
				if(key == 37){
				}
				if(key == 38){				
				}
				if(key == 39){
				}
				if(key == 40){				
				}
			},
			setTarget:function(newTarget){
				this.Target = newTarget;
			}
		});
