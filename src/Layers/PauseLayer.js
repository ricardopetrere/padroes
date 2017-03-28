/*  Feito por Vinicius C Maschio/ Sinuva
exemplo de uso
if(!this.isPaused){ //evita de voce poder chamar ele mais de uma vez(fazer do seu jeito essa parte)
            pLayer = new PauseLayer();  //cria o pauseLayer
            var menuLayer = new UPB_MainGame(); //cria referencia de qual Cena a layer de pause ira mudar ao apertar o botao MENU
            pLayer.init(this, menuLayer); //inicia a layer e manda referencia da layer pai(pra poder pausar e despausar), e a Cena MENU
            this.addChild(pLayer); //piff
}
*/

pd.PauseLayer = cc.Layer.extend(
{
	menuScene:null,
	bg_img:null,
	bg_mask:null,
	btn_menu:null,
	btn_tutorial:null,
	btn_mute:null,
	btn_restart:null,
	btn_resume:null,
	offset:null,
	pausedOpacity: 100,
	slideTime:null,
	
	init:function(mamai, menuScene, pausedOpacity)
	{
		this.mamai = mamai;
		
		this.menuScene = menuScene;
		pd.reter(this.menuScene);
		if (pausedOpacity != null) {
			this.pausedOpacity = pausedOpacity;
		}
		this.isPaused = false;
		
		this.offset = 123; //Metade da largura da interface
		this.slideTime = 0.2;
	
		//se a layer que chamou o pause tiver pausarCena, essa função sera chamada.
		if(this.mamai.pausarCena != null && this.mamai.pausarCena != undefined) {
			this.mamai.pausarCena();//pausa a cena pai  //nome ta como mamae pra evitar certos conflitos com a cocos
		}
		
		this.bg_img = pd.cObject("pd_pause_interface", -this.offset, winSize.height/2, this, 1);
	
		this.btn_menu = new pd.Button(this.offset, 480, this, "button_Func", "pd_btn_menu_normal.png", "pd_btn_menu_pressed.png");
		this.bg_img.addChild(this.btn_menu, 9000);
		
		this.btn_tutorial = new pd.Button(this.offset, 280, this, "button_Func", "pd_btn_tutorial_normal.png", "pd_btn_tutorial_pressed.png");
		this.bg_img.addChild(this.btn_tutorial, 9000);
		
		var divisor = isPalco ? 2 : 1;
		var frameName = pd.audioEngine.isMuted ? "pd_btn_muted" : "pd_btn_audio";
		this.btn_mute = new pd.Button(this.offset/divisor, 80, this, "button_Func", frameName + "_normal.png", frameName + "_pressed.png");
		this.bg_img.addChild(this.btn_mute, 9000);
		
		if(isPalco){
			this.btn_restart = new pd.Button(this.offset*1.5, 80, this, "button_Func", "pd_btn_restart_normal.png", "pd_btn_restart_pressed.png");
			this.bg_img.addChild(this.btn_restart, 9000);
		}
		
		this.btn_resume = new pd.Button(this.offset*2, winSize.height/2, this, "button_Func", "pd_btn_resume_normal.png", "pd_btn_resume_pressed.png");
		this.btn_resume.defineKey(27);
		this.bg_img.addChild(this.btn_resume, 9000);
	
		//layer preta transparente de fundo
		this.bg_mask = new cc.LayerColor(cc.color(0, 0, 0, 0), 1100, 800);
		this.bg_mask.setPosition(0, 0);
		this.addChild(this.bg_mask, 0);
		
		this.slideBG(1);
		
		return true;
	},
	
	slideBG: function(direction){
		this.bg_img.runAction(cc.moveBy(this.slideTime, cc.p(2 * this.offset * direction, 0)));
		
		if(direction == 1)
			this.bg_mask.runAction(cc.fadeTo(this.slideTime, this.pausedOpacity));
		else
			this.bg_mask.runAction(cc.sequence(
				cc.fadeOut(this.slideTime),
			cc.delayTime(0.1),
			cc.callFunc(this.funcResume, this)
		));
	},
	
	button_Func:function(caller, isPressed){
		if(this.isPaused)
			return;
		if(isPressed){
			//this.btn_menu.setPosition(this.botao_menu.resetPosition);
			//MUDAR FRAME PARA PRESSIONADO
		}
		else{
			if(caller == this.btn_resume) {
				console.log("resume");
				caller.cleanup();
				pd.audioEngine.playEffect(pd.resPadrao.fx_escrever);
				this.slideBG(-1.5);
			}
			else{
				var cbFunction;
				switch(caller){
					case this.btn_menu:
						cc.log('menu')
						this.isPaused = true;
						caller.cleanup();
						cbFunction = this.funcMenu;
						break;
					case this.btn_tutorial:
						cc.log('tuto')
						this.isPaused = true;
						caller.cleanup();
						cbFunction = this.funcTutorial;
						break;
					case this.btn_mute:
						cc.log('mute')
						cbFunction = this.funcMute;
						break;
					case this.btn_restart:
						cc.log('restart')
						this.isPaused = true;
						caller.cleanup();
						cbFunction = this.funcRestart;
						break;
				}
				
				caller.runAction(new cc.Sequence(
					new cc.DelayTime(0.1),
					new cc.CallFunc(cbFunction, this)
				));
			}
		}
	},
		
	funcResume:function(){
		if(this.mamai.despausarCena != null && this.mamai.despausarCena != undefined) {
			this.mamai.despausarCena();
		}
		this.mamai.pauseButton.isLocked = true;
		this.mamai.pauseButton.runAction(new cc.Sequence(new cc.DelayTime(0.2), new cc.CallFunc(this.mamai.pauseButton.unlock, this.mamai.pauseButton)));
		this.removeFromParent(true);
	},
	
	funcMenu:function(){
		pd.audioEngine.stopMusic();
		pd.audioEngine.stopAllEffects();
		this.mamai.cleanup();
		pd.audioEngine.playEffect(pd.resPadrao.fx_button);
		if(isPalco) pd.finishGame();
		else{
			var scene = new activeGameSpace.mainScene();
			var transition = FadeWhiteTransition(1, scene);
			pd.trocaCena(transition, this.mamai);
		}
	},
	
	funcTutorial:function(){
		var tutorialScene = new pd.TutorialScene(this.mamai, true);
		this.removeFromParent(true);
		pd.audioEngine.playEffect(pd.resPadrao.fx_button);
	},
	
	funcMute:function(){
		pd.audioEngine.toggleMute();
		if(pd.audioEngine.isMuted){
			this.btn_mute.normalImg = cc.spriteFrameCache.getSpriteFrame("pd_btn_muted_normal.png");
			this.btn_mute.pressedImg = cc.spriteFrameCache.getSpriteFrame("pd_btn_muted_pressed.png");
		}
		else{
			pd.audioEngine.playEffect(pd.resPadrao.fx_button);
			this.btn_mute.normalImg = cc.spriteFrameCache.getSpriteFrame("pd_btn_audio_normal.png");
			this.btn_mute.pressedImg = cc.spriteFrameCache.getSpriteFrame("pd_btn_audio_pressed.png");
		}
		
		this.btn_mute.setSpriteFrame(this.btn_mute.normalImg);
	},
	
	funcRestart:function(){
		pd.audioEngine.stopMusic();
		pd.audioEngine.stopAllEffects();
		this.mamai.cleanup();
		pd.audioEngine.playEffect(pd.resPadrao.fx_button);
		var scene = new activeGameSpace.mainScene();
		var transition = FadeWhiteTransition(1, scene);
		pd.trocaCena(transition, this.mamai);
	}
});
