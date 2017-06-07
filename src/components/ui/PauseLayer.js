/**
 * Created by ??? on ???.
 * @class
 * @extends {cc.Layer}
 * @classdesc Menu em formato de barra lateral exibido ao pausar uma cena de jogo.
 */
pd.PauseLayer = cc.Layer.extend({/**@lends pd.PauseLayer#*/

    /**
     * Armazena uma referência para o node que está manipulando o tutorial.
     * @type {cc.Node}
     */
    _handler:null,

    /**
     * A opacidade que a layer de foco deve possuir
     * @type {Number}
     */
    _focusLayerOpacity:100,

    /**
     * Indica se os botões estão disponíveis para serem clicados.
     * @type {Boolean}
     */
    isUILocked:false,

    /**
     * O espaço em 'x' que a barra lateral ocupa.
     * @type {Number}
     */
    offset:123,

    /**
     * O tempo da transição da barra lateral.
     * @type {Number}
     */
    slideTime:0.2,

    /**
     * @type {cc.Sprite}
     **/
    _sidebar:null,

    /**
     * @type {pd.Button}
     **/
    _btnMenu:null,

    /**
     * @type {pd.Button}
     **/
    _btnTutorial:null,

    /**
     * @type {pd.Button}
     **/
    _btnMute:null,

    /**
     * @type {pd.Button}
     **/
    _btnRestart:null,

    /**
     * @type {pd.Button}
     **/
    _btnResume:null,

    /**
     * @type {cc.LayerColor}
     **/
    _bgMask:null,
    
    /**
     * @constructs
     * @param {cc.Node} _handler - o container onde o componente deve ser adicionado.
     * @param {Number} _focusLayerOpacity - o valor de opacidade da layer preta que desfoca o jogo.
     */
    ctor: function(_handler, _focusLayerOpacity) {
        this._super();

        this._handler = _handler;
        this._focusLayerOpacity = _focusLayerOpacity || pd.PauseLayer.DEFAULT_FOCUS_LAYER_OPACITY;
        this.isUILocked = false;
        
        if(this._handler.onPause)
            this._handler.onPause();

        this._buildUI();
        this._slide(pd.PauseLayer.SLIDE_DIRECTION_ENTERING);
    },

    /**
     * Constrói os elementos de interface.
     * @private
     */
    _buildUI: function() {
        this._sidebar = pd.createSprite("pd_pause_interface", -this.offset, cc.winSize.height/2, this, 1);

        this._btnMenu = new pd.Button(this.offset, 480, this, "_onButtonClick", "pd_btn_menu_normal.png", "pd_btn_menu_pressed.png");
        this._sidebar.addChild(this._btnMenu, pd.ZOrders.PAUSE_LAYER_UI_ELEMENTS);
        this._btnTutorial = new pd.Button(this.offset, 280, this, "_onButtonClick", "pd_btn_tutorial_normal.png", "pd_btn_tutorial_pressed.png");
        this._sidebar.addChild(this._btnTutorial, pd.ZOrders.PAUSE_LAYER_UI_ELEMENTS);
        
        const muteButtonFrameName = pd.audioEngine.isMuted ? "pd_btn_muted" : "pd_btn_audio";
        this._btnMute = new pd.Button(this.offset/(pd.delegate.context == pd.Delegate.CONTEXT_PALCO ? 2 : 1), 80, this, "_onButtonClick", muteButtonFrameName + "_normal.png", muteButtonFrameName + "_pressed.png");
        this._sidebar.addChild(this._btnMute, pd.ZOrders.PAUSE_LAYER_UI_ELEMENTS);

        if(pd.delegate.context == pd.Delegate.CONTEXT_PALCO){
            this._btnRestart = new pd.Button(this.offset*1.5, 80, this, "_onButtonClick", "pd_btn_restart_normal.png", "pd_btn_restart_pressed.png");
            this._sidebar.addChild(this._btnRestart, pd.ZOrders.PAUSE_LAYER_UI_ELEMENTS);
        }

        this._btnResume = new pd.Button(this.offset*2, cc.winSize.height/2, this, "_onButtonClick", "pd_btn_resume_normal.png", "pd_btn_resume_pressed.png");
        this._btnResume.defineKey(pd.Keys.ESC);
        this._sidebar.addChild(this._btnResume, pd.ZOrders.PAUSE_LAYER_UI_ELEMENTS);

        this._bgMask = new cc.LayerColor(cc.color(0, 0, 0, 0), 1100, 800);
        this._bgMask.setPosition(0, 0);
        this.addChild(this._bgMask, 0);
    },

    /**
     * Realiza a entrada/saída do menu lateral.
     * @param direction {pd.PauseLayer.SLIDE_DIRECTION_EXITING|pd.PauseLayer.SLIDE_DIRECTION_ENTERING}
     * @private
     */
    _slide: function(direction){
        if(direction == pd.PauseLayer.SLIDE_DIRECTION_EXITING) {
            var multiplier = -1.5;
            this._bgMask.runAction(cc.sequence(
                cc.fadeOut(this.slideTime),
                cc.delayTime(0.1),
                cc.callFunc(this._onSidebarExited, this)
            ));
        }
        else {
            multiplier = 1;
            this._bgMask.runAction(cc.fadeTo(this.slideTime, this._focusLayerOpacity));
        }

        this._sidebar.runAction(cc.moveBy(this.slideTime, cc.p(2 * this.offset * multiplier, 0)));
    },

    /**
     * Manipula eventos de clique dentro da interface.
     * @param caller {cc.Node}
     * @param isPressed {Boolean}
     * @private
     */
    _onButtonClick:function(caller, isPressed){
        if(this.isUILocked)
            return;

        if(!isPressed) {
            if(caller != this._btnMute) {
                this.isUILocked = true;
                caller.cleanup();
            }
            
            switch(caller) {
                case this._btnMenu: var cb = this._onMenuButton; break;
                case this._btnTutorial: cb = this._onTutorialButton; break;
                case this._btnMute: cb = this._onMuteButton; break;
                case this._btnRestart: cb = this._onRestartButton; break;
                case this._btnResume: cb = this._onResumeButton; break;
            }
            
            caller.runAction(cc.sequence(
                cc.delayTime(0.1),
                cc.callFunc(cb, this)
            ));
        }
    },

    /**
     * Manipula a seleção do botão de menu.
     * @private
     */
    _onMenuButton:function(){
        this._handler.cleanup();
        pd.audioEngine.stopMusic();
        pd.audioEngine.stopAllEffects();
        pd.audioEngine.playEffect(pd.res.fx_button);

        if(pd.delegate.context != pd.Delegate.CONTEXT_PALCO) {
            var scene = new pd.delegate.activeNamespace.MainScene();
            var transition = FadeWhiteTransition(1, scene);
            pd.switchScene(transition, this._handler, 0.2);
        }
        else {
            pd.delegate.finish();
        }

        cc.log("[pd.PauseLayer] Voltando ao menu inicial.");
    },

    /**
     * Manipula a seleção do botão de tutorial.
     * @private
     */
    _onTutorialButton:function(){
        var tutorialScene = new pd.Tutorial(this._handler, true);
        this.removeFromParent(true);
        pd.audioEngine.playEffect(pd.res.fx_button);

        cc.log("[pd.PauseLayer] Tutorial aberto.");
    },

    /**
     * Manipula a seleção do botão de mutar.
     * @private
     */
    _onMuteButton:function(){
        pd.audioEngine.toggleMute();
        
        if(pd.audioEngine.isMuted){
            this._btnMute.normalImg = cc.spriteFrameCache.getSpriteFrame("pd_btn_muted_normal.png");
            this._btnMute.pressedImg = cc.spriteFrameCache.getSpriteFrame("pd_btn_muted_pressed.png");
        }
        else{
            pd.audioEngine.playEffect(pd.res.fx_button);
            this._btnMute.normalImg = cc.spriteFrameCache.getSpriteFrame("pd_btn_audio_normal.png");
            this._btnMute.pressedImg = cc.spriteFrameCache.getSpriteFrame("pd_btn_audio_pressed.png");
        }

        this._btnMute.setSpriteFrame(this._btnMute.normalImg);
        cc.log("[pd.PauseLayer] Status do botão de mute alterado.");
    },

    /**
     * Manipula a seleção do botão de resetar.
     * @private
     */
    _onRestartButton:function(){
        pd.audioEngine.stopMusic();
        pd.audioEngine.stopAllEffects();
        pd.audioEngine.playEffect(pd.res.fx_button);
        this._handler.cleanup();

        var scene = new pd.delegate.activeNamespace.MainScene();
        var transition = FadeWhiteTransition(1, scene);
        pd.switchScene(transition, this._handler);

        cc.log("[pd.PauseLayer] Botão de reset pressionado.");
    },

    /**
     * Manipula a seleção do botão de voltar ao jogo.
     * @private
     */
    _onResumeButton: function() {
        pd.audioEngine.playEffect(pd.res.fx_escrever);
        this._slide(pd.PauseLayer.SLIDE_DIRECTION_EXITING);

        cc.log("[pd.PauseLayer] PauseLayer fechada.");
    },

    /**
     * Finaliza o processo de destruíção.
     * @private
     */
    _onSidebarExited:function(){
        if(this._handler.onResume) {
            this._handler.onResume();
        }
        this._handler.pauseButton.isLocked = true;
        this._handler.pauseButton.runAction(new cc.Sequence(new cc.DelayTime(0.2), new cc.CallFunc(this._handler.pauseButton.unlock, this._handler.pauseButton)));
        this.removeFromParent(true);
    }
});

/**
 * @constant
 * @type {string}
 */
pd.PauseLayer.SLIDE_DIRECTION_EXITING = "slideDirectionExiting";

/**
 * @constant
 * @type {string}
 */
pd.PauseLayer.SLIDE_DIRECTION_ENTERING = "slideDirectionEntering";

/**
 * @constant
 * @type {number}
 */
pd.PauseLayer.DEFAULT_FOCUS_LAYER_OPACITY = 100;