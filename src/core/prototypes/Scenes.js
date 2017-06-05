/**
 * Created by Ryan Balieiro on 25/05/17.
 * @desc Protótipos de cena pré-implementados - utilizados como base para as cenas dos jogos.
 *
 * @class
 * @extends {cc.Scene}
 * @classdesc Protótipo de uma cena-base de um jogo.
 */
pd.ScenePrototype = cc.Scene.extend({/**@lends pd.ScenePrototype#*/
    /**
     * @type {pd.debugger}
     */
    debugger:null,
    /**
     * @type {boolean}
     */
    isPaused:false,
    /**
     * @type {pd.Button}
     */
    uiButton:null,
    /**
     * @type {Array}
     */
    pausedActions:null,
    /**
     * Sobrescreve o ponto de entrada da cena.
     * @override
     */
    onEnter: function() {
        this._super();

        //deixar (lógica interna do debugger).
        pd.DebugArrayClickable = [];
        pd.DebugArrayNonClickable = [];
        
        if(!(pd.delegate.context == pd.Delegate.CONTEXT_PALCO)) {
            this.debugger = new pd.SceneDebugger();
            this.addChild(this.debugger);
            if(pd.debugMode == true) {
                pd.setKeyboard(this, "onDebugKeyDown", "onDebugKeyUp");
            }
        }
    },

    /**
     * Trata comandos de debug disparados via teclado.
     * @param key {string}
     */
    onDebugKeyDown: function(key) {
        switch(key) {
            case '112':
                if(!this.debugScreen) {
                    this.debugScreen = new pd.DebugScreen();
                    this.addChild(this.debugScreen, 1000);
                    this.debugScreen.init();
                }
                else {
                    this.debugScreen.removeFromParent();
                    this.debugScreen = null;
                }
                break;
            case '120':
                pd.audioEngine.toggleMute();
                cc.log('[pd.ScenePrototype] ToggleMute: ' + pd.audioEngine.isMuted);
                break;
        }
    },

    /**
     * Trata comandos de debug disparados via teclado.
     * @param key {string}
     */
    onDebugKeyUp: function(key) {},

    /**
     * Pause handler.
     */
    onPause: function() {
        this.isPaused = true;
        for(var i in this.getChildren()) {
            var child = this.getChildren()[i];
            if(child instanceof cc.Node) {
                child.pausedActions = pd.delegate.pause(this.getChildren()[i]);
                if(child.onPause)
                    child.onPause();
            }
        }

        if(this.uiButton) // verificar porque isso está sendo feito e se isso tem alguma utilidade (?)
            this.uiButton.isPaused = true;
    },

    /**
     * Resume handler.
     */
    onResume: function() {
        this.isPaused = false;

        for(var i in this.getChildren()) {
            var child = this.getChildren()[i];
            if(child instanceof cc.Node) {
                pd.delegate.resume(child, child.pausedActions);
                if(child.onResume)
                    child.onResume();
            }
        }

        if(this.uiButton) // verificar porque isso está sendo feito e se isso tem alguma utilidade (?)
            this.uiButton.isPaused = false;
    },

    /**
     * Exit handler.
     * @override
     */
    onExit: function() {
        this._super();
        this.removeAllChildren(true);
    }
});

/**
 * @class
 * @extends {pd.ScenePrototype}
 * @classdesc Classe base para as cenas de menu principal.
 */
pd.MainScene = pd.ScenePrototype.extend({/**@lends pd.MainScene#*/
    /**
     * @constructs
     */
    ctor: function() {
        this._super();

        if(pd.delegate.context == pd.Delegate.CONTEXT_PALCO) {
            this.uiButton = new pd.Button(975, 715, this, "onExitButton", "pd_btn_close_normal.png", "pd_btn_close_pressed.png");
            this.uiButton.isLocked = false;
            this.uiButton.unlock = function () {this.isLocked = false;};
            this.addChild(this.uiButton, 9000);
        }

        pd.delegate.setPaused(false);
        pd.audioEngine.setMute(false);
        pd.audioEngine.setEffectsVolume(1);
    },

    /**
     * @override
     */
    onEnter: function () {
        this._super();
        if(pd.debugMode == true && this.debugger) {
            this.debugger.reset();
            this.debugger.addScene('MainScene');
        }
    },

    /**
     * Callback proveniente do clique no botão de fechar.
     * @private
     */
    onExitButton: function(){
        if(!pd.delegate.isPaused){
            pd.audioEngine.stopMusic(true);
            pd.delegate.finish();
            pd.audioEngine.playEffect(pd.res.fx_button);
        }
    }
});

/**
 * @class
 * @extends {pd.ScenePrototype}
 * @classdesc Classe base para cenas customizadas de um jogo.
 */
pd.GameScene = pd.ScenePrototype.extend({/**@lends pd.GameScene#*/
    /**
     * @type {number}
     */
    pausedOpacity: 100,

    /**
     * @type {pd.Button}
     */
    pauseButton:null,

    /**
     * @constructs
     */
    ctor: function() {
        this._super();
        
        this.uiButton = new pd.Button(975, 715, this, "onPauseButton", "pd_btn_pause_normal.png", "pd_btn_pause_pressed.png");
        this.uiButton.defineKey(27);
        this.uiButton.isLocked = false;
        this.uiButton.unlock = function(){
            this.isLocked = false;
        };

        this.pauseButton = this.uiButton; // manter compatibilidade (legado)...
        this.addChild(this.pauseButton, 9000);
    },

    /**
     * Seta a opacidade da layer foco que cobre a cena após ela ser pausada. <br />
     * Utilizar esta função para cobrir a cena de jogo em situações em que o usuário possa tirar vantagem do recurso de pause para observar a cena com o tempo de jogo pausado.
     * @param {Number} pausedOpacity
     */
    setPausedOpacity: function(pausedOpacity) {
        this.pausedOpacity = pausedOpacity;
    },

    /**
     * Callback do botão de pause.
     * @param caller {cc.Node}
     * @param isPressed {boolean}
     */
    onPauseButton: function(caller, isPressed){
        if(this.pauseButton.isLocked)
            return;
        
        if(!this.pauseButton.isPaused && !isPressed){
            pd.audioEngine.playEffect(pd.res.fx_button);
            var pLayer = new pd.PauseLayer(this, this.pausedOpacity);
            this.addChild(pLayer,999999);
        }

        cc.log("[pd.GameScene] O jogo foi pausado.");
    },

    /**
     * Executa a animação de vitória.
     * @param circleSpriteFrame {cc.SpriteFrame}
     * @param messageSpriteFrame {cc.SpriteFrame}
     * @param tiltScreen {Boolean}
     */
    winGame: function(circleSpriteFrame, messageSpriteFrame, tiltScreen) {
        this.pauseButton.cleanup();
        const winLayer = new pd.WinLayer();
        winLayer.init(this, new pd.delegate.activeNamespace.MainScene(), circleSpriteFrame, messageSpriteFrame, tiltScreen);
        this.addChild(winLayer, 9999);
    },

    /**
     * Executa a animação de derrota.
     * @param circleSpriteFrame {cc.SpriteFrame}
     * @param tiltScreen {Boolean}
     */
    loseGame: function(circleSpriteFrame, tiltScreen) {
        this.pauseButton.cleanup();
        const loseLayer = new pd.LoseLayer();
        loseLayer.init(this, new pd.delegate.activeNamespace.MainScene(), circleSpriteFrame, tiltScreen);
        this.addChild(loseLayer, 9999);
    }
});
