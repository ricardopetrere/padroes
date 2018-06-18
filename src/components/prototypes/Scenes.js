/**
 * Created by Ryan Balieiro on 25/05/17.
 * @desc Protótipos de cena pré-implementados utilizados como base para as cenas dos jogos.
 *
 * @class
 * @extends {cc.Scene}
 * @classdesc Protótipo de uma cena-base de um jogo.
 */
pd.ScenePrototype = cc.Scene.extend({/**@lends pd.ScenePrototype#*/
    /**
     * Apontamento para o componente de debug.
     * @type {pd.Debugger}
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
     * A layer principal da cena.
     * @type {*}
     */
    mainLayer:null,

    /**
     * Aponta para o protótipo da classe da main layer da cena.
     * @type {Object}
     */
    mainLayerClass:null,

    /**
     * Sobrescreve o ponto de entrada da cena.
     * @override
     */
    onEnter: function() {
        this._super();

        if(!(pd.delegate.context == pd.Delegate.CONTEXT_PALCO)) {
            this.debugger = pd.debugger; // legado...
            if(pd.debugMode && !cc.sys.isNative) {
                pd.Editor.NodeList = [];
                pd.inputManager.add(pd.InputManager.Events.KEY_DOWN, this, this.onDebugKeyDown);
            }
        }

        if(this.mainLayerClass)
            this.initWithMainLayer(this.mainLayerClass);
    },

    /**
     * Cria, adiciona e inicializa a 'main layer' da cena.
     * @param {Object} mainLayerOrMainLayerClass
     */
    initWithMainLayer: function(mainLayerOrMainLayerClass) {
        if(!(mainLayerOrMainLayerClass instanceof cc.Layer))
            this.mainLayer = new mainLayerOrMainLayerClass();
        else
            this.mainLayer = mainLayerOrMainLayerClass;
        this.addChild(this.mainLayer);
        this.mainLayer.init();
    },

    /**
     * Trata comandos de debug disparados via teclado.
     * @param {String} key
     */
    onDebugKeyDown: function(key) {
        const intKey = parseInt(key);
        if(intKey == pd.Keys.F0 + 1) {
            if(!this._editorScreen) {
                this._editorScreen = new pd.Editor();
                this.addChild(this._editorScreen, pd.ZOrders.EDITOR_SCREEN);
                this._editorScreen.init();
            }
            else {
                this._editorScreen._onExitButtonCall();
                this._editorScreen = null;
            }
        }
        else if (intKey == pd.Keys.F0 + 5) {
            cc.log('[pd.ScenePrototype] Window Reload');
            location.reload(true);
        }
        else if(intKey == pd.Keys.F0 + 11) {
            pd.audioEngine.toggleMute();
            cc.log('[pd.ScenePrototype] ToggleMute: ' + pd.audioEngine.isMuted);
        }
        else {
            pd.debugger.loadShortcut(intKey);
        }
    },

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
        if(cc.sys.isNative) {
            cc.director.getTextureCache().removeUnusedTextures();
        }
        pd.inputManager.reset();
    }
});

/**
 * @class
 * @extends {pd.ScenePrototype}
 * @classdesc Classe base para as cenas de menu principal.
 */
pd.MainScene = pd.ScenePrototype.extend({/**@lends pd.MainScene#*/

    /**
     * Aponta para o protótipo da classe da main layer da cena.
     * @type {Object}
     */
    mainLayerClass:pd.MainLayer,

    /**
     * @constructs
     */
    ctor: function() {
        this._super();

        if(pd.delegate.context == pd.Delegate.CONTEXT_PALCO || pd.debugMode) {
            this.uiButton = new pd.Button(pd.SpriteFrames.BTN_CLOSE, pd.SpriteFrames.BTN_CLOSE_PRESSED, {x:975, y:715}, 1, true, false, this, this.onExitButton);
            this.uiButton.isLocked = false;
            this.uiButton.unlock = function () {
                this.isLocked = false;
            };
            this.addChild(this.uiButton, pd.ZOrders.PAUSE_BUTTON);
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
    },

    /**
     * Callback proveniente do clique no botão de fechar.
     * @param {*} caller
     * @param {Boolean} isKeyDown
     * @private
     */
    onExitButton: function(caller, isKeyDown) {
        if(!pd.delegate.isPaused && !isKeyDown){
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
        this.uiButton = new pd.Button(pd.SpriteFrames.BTN_PAUSE, pd.SpriteFrames.BTN_PAUSE_PRESSED, {x:975, y:715}, null, true, false, this, this.onPauseButton);
        this.uiButton.setKeyCode(pd.Keys.ESC);
        this.uiButton.isLocked = false;
        this.uiButton.unlock = function(){
            this.isLocked = false;
        };
        this.pauseButton = this.uiButton; // manter compatibilidade (legado)...
        this.addChild(this.pauseButton, pd.ZOrders.PAUSE_BUTTON);
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
     * @param {cc.Node} caller
     * @param {Boolean} isPressed
     */
    onPauseButton: function(caller, isPressed){
        if(this.pauseButton.isLocked)
            return;
        
        if(!this.pauseButton.isPaused && !isPressed){
            pd.audioEngine.playEffect(pd.res.fx_button);
            this.pauseGame();
        }
    },

    /**
     * Pausa o jogo.
     */
    pauseGame: function() {
        if(!this.pauseButton.isPaused) {
            var pLayer = new pd.PauseLayer(this, this.pausedOpacity);
            this.addChild(pLayer, pd.ZOrders.PAUSE_LAYER);
            cc.log("[pd.GameScene] O jogo foi pausado.");
        }
    }
});

/**
 * @type {cc.Point}
 */
pd.GameScene.TIP_BUTTON_POS = cc.p(875, 715);

/**
 * @type {cc.Point}
 */
pd.GameScene.CENTER = cc.p(512, 384);