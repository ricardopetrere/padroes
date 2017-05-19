pd.BaseLayer = cc.Layer.extend({
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();
		pd.DebugArrayClickable = [];
		pd.DebugArrayNonClickable = [];
		if(!isPalco){
			this.debugger = new pd.SceneDebugger();
			this.addChild(this.debugger);
		}
		// cc.log('pause ativado')
		return true;
	},
	
	pausarCena:function(){
		this.isPaused = true;
		this.vetorDeAcoesPausadas = pd.pausar(this);
		if(this.pauseButton) {
			this.pauseButton.isPaused = true;
		}
	},
	despausarCena:function(){
		this.isPaused = false;
		pd.resumar(this, this.vetorDeAcoesPausadas);
		if(this.pauseButton) {
			this.pauseButton.isPaused = false;
		}
	},

});
//pra movimentar o pauseButton usar o this.pauseButton.setPosition;
pd.GameLayer = pd.BaseLayer.extend({
	pausedOpacity: 100,
	pauseButton:null,
	ctor:function (pai) {
		//////////////////////////////
		// 1. super init first
		this._super();

		if(pai.pauseButton != null || pai.pauseButton != undefined)
			pai.pauseButton.removeFromParent(true);
		this.pauseButton = new pd.Button(975, 715, this, "pauseButtonFunc", "pd_btn_pause_normal.png", "pd_btn_pause_pressed.png");
		this.pauseButton.defineKey(27);
		this.pauseButton.isLocked = false;
		this.pauseButton.unlock = function(){
			this.isLocked = false;
		}
		pai.addChild(this.pauseButton, 9000);
		pai.pauseButton = this.pauseButton;
		
		
		if(DebugMode == true && isPalco == false){
			pd.setKeyboard(this, "debugger_keyDown", "debugger_keyUp");
		}

		return true;
	},
    //TODO: Juntar essas duas funções com as correspondentes da pd.MainLayer, e colocar na pd.BaseLayer
	debugger_keyDown:function(key)
	{
		if(key == "120"){
			pd.audioEngine.toggleMute();
			cc.log('toggleMute: ' + pd.audioEngine.isMuted);
		}
		else if(key == "112"){
			if(!pd.CurrentDebugScreen)
			{
				debug = new pd.DebugScreen();
				this.addChild(debug, 1000);
				debug.init();
				pd.CurrentDebugScreen = debug;
			}
			else{
				pd.CurrentDebugScreen.removeFromParent();
				pd.CurrentDebugScreen = null;
			}
		}
	},
	debugger_keyUp:function(key){
		
	},
	pauseButtonFunc: function(caller, e){
		if(this.pauseButton.isLocked)
			return;
		if(!this.pauseButton.isPaused && !e){
			pd.audioEngine.playEffect(pd.resPadrao.fx_button);
			pLayer = new pd.PauseLayer(); 
			var menuLayer = mainMenu;//passar a cena a qual voltar em caso de apertar o botao de menu 
			pLayer.init(this, menuLayer, this.pausedOpacity);
			this.getParent().addChild(pLayer,999999);//importante add no valor 9999 para que ele sempre fique por cima da layer
		}
	},
	winGame: function(Personagem, Placa, tremer) {
		this.pauseButton.cleanup();
		winLayer = new pd.WinLayer();
		winLayer.init(this, new activeGameSpace.mainScene, Personagem, Placa, tremer);
		this.getParent().addChild(winLayer, 9999);
		cc.log('Vitória!');
	},

	loseGame: function(Personagem, tremer) {
		this.pauseButton.cleanup();
		loseLayer = new pd.LoseLayer();
		loseLayer.init(this, new activeGameSpace.mainScene, Personagem, tremer);
		this.getParent().addChild(loseLayer, 9999);
		cc.log('Derrota!');
	},

});


pd.MainLayer = pd.BaseLayer.extend({
	pauseButton:null,
	ctor:function (pai) {
		//////////////////////////////
		// 1. super init first
		this._super();
		if(isPalco) {
			this.pauseButton = new pd.Button(975, 715, this, "exitButtonFunc", "pd_btn_close_normal.png", "pd_btn_close_normal.png");
			this.pauseButton.isLocked = false;
			this.pauseButton.unlock = function () {
				this.isLocked = false;
			}
			pai.addChild(this.pauseButton, 9990);
		}
		if(DebugMode == true && isPalco == false){
			pd.setKeyboard(this, "debugger_keyDown", "debugger_keyUp");
			this.debugger.reset();
			this.debugger.addScene('mainScene');
		}
		
		pd.audioEngine.setMute(false);
		pd.audioEngine.setEffectsVolume(1);
		
		return true;
	},

	//TODO: Juntar essas duas funções com as correspondentes da pd.GameLayer, e colocar na pd.BaseLayer
	debugger_keyDown:function(key)
	{
		if(key == "120"){
			pd.audioEngine.toggleMute();
            cc.log('toggleMute: ' + pd.audioEngine.isMuted);
		}
		else if(key == "112"){
			if(!this.debugScreen)
			{
				debug = new pd.DebugScreen();
				this.addChild(debug, 1000);
				debug.init();
				this.debugScreen = debug;
			}
			else{
				this.debugScreen.removeFromParent();
				this.debugScreen = null;
			}
		}
	},
	debugger_keyUp:function(key){

	},
	exitButtonFunc: function(){
		if(!isPaused){
			pd.audioEngine.stopMusic(true);
			pd.finishGame();
		}
	},
	
});
//criar mainLayer