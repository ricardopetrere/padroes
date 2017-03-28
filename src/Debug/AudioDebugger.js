var DebugScreen = cc.Sprite.extend(
		{
			audio:null,
			effectVector:null,
			musicVector:null,
			ctor:function(){
				this._super(resPadrao.debuggerAudioUi);
				// Custom intialization
			},
			init:function()
			{
				this.getSfxBgmList();
				this.audio = pd.audioEngine.getInstance();
				setInput(this);
				
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

			},
			onMouseExited:function(event){
				this.onMouseUp(event);
			},
			//funcao ao soltar botao do mouse
			onMouseUp:function (event) {
				this.MouseOffSet = null;
			},

			onTouchesBegan: function(t, e) {
				var touch = t[0];
				this.onMouseDown(touch);
				ispressed = true;
			},

			onTouchesEnded: function(t, e) {
				var touch = t[0];
				this.onMouseUp(touch);
			},

			onTouchesMoved: function(t, e) {
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
			},
			playEffect:function(effect){
				this.audio.playEffect(effect);
			},
			stopAllEffects:function(){
				this.audio.stopAllEffects();
			},
			playMusic:function(musica){
				this.audio.stopMusic();
				this.audio.playMusic(musica);
			},
			getSfxBgmList:function(){
				this.effectVector = [];
				this.musicVector = [];	
				for(i = 0; i < resources.length; i++){
					if(resources[i].indexOf(".mp3") != -1 || resources[i].indexOf(".wav") != -1){
						if(resources[i].indexOf("bgm_") != -1){
							this.musicVector.push(resources[i]);
						}
						else{
							this.effectVector.push(resources[i]);
						}
					}
				}
				for(i = 0; i < resAdicional.length; i++){
					if(resAdicional[i].indexOf(".mp3") != -1 || resAdicional[i].indexOf(".wav") != -1){
						if(resAdicional[i].indexOf("bgm_") != -1){
							this.musicVector.push(resAdicional[i]);
						}
						else{
							this.effectVector.push(resAdicional[i]);
						}
					}
				}
				
			}
			
		});

AudioSelector = function(){
	
}