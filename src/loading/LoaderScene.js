/**
 * Created by Ryan Balieiro on 19/05/17.
 * @class
 * @extends {cc.LoaderScene|cc.Scene}
 * @classdesc Componente responsável pelo pré-carregamento do framework.
 */
pd.LoaderScene = (cc.sys.isNative ? cc.Scene : cc.LoaderScene).extend({/** @lends pd.LoaderScene#*/

    /**
     * Logo do J.Piaget/Piaget+Digital
     * @type {cc.Sprite}
     */
    _logo:null,

    /**
     * Feedback de carregando.
     * @type {cc.Sprite}
     */
    _feedback:null,

    /**
     * Mensagem de feedback.
     * @type {cc.LabelTTF}
     */
    _textFeedback:null,

    /**
     * O tipo da animação a ser feita pelos elementos de UI da tela.
     * @type {String}
     */
    _animationType:"",

    /**
     * true, se a aplicação já foi pré-carregada - false, se a aplicação estiver sendo pré-carregada.
     * @type {Boolean}
     */
    _didPreload:false,

    /**
     * @constructs
     * @param {Boolean} [didPreload=false]
     */
    ctor: function(didPreload) {
        this._super();

        if(this._didPreload == true || this._didPreload == false)
            this._didPreload = didPreload;

        if(cc.sys.isNative) {
            const bg = new cc.LayerColor(pd.delegate.context == pd.Delegate.CONTEXT_PORTAL ? cc.color(255, 135, 10) : cc.color(101, 167, 228),
                cc.winSize.width, cc.winSize.height);
            this.addChild(bg);
        }
    },

    /**
     * Entry point da cena.
     * @override
     */
    onEnter: function() {
        if(!this._didPreload)
            this._super();
        else
            cc.Scene.prototype.onEnter.apply(this);
    },

    /**
     * Manipula a entrada na cena.
     * @override
     */
    onEnterTransitionDidFinish: function() {
        this._super();
    },

    /**
     * Exit point da cena.
     */
    onExit: function() {
        if(!this._didPreload)
            this._super();
        else
            cc.Scene.prototype.onExit.apply(this);
    },

    /**
     * Sobrescreve a inicialização default do objeto-pai, customizando a tela de boot do framework.<br />
     * Ps: por enquanto apenas escondi os objetos default da tela padrão da Cocos, pois removê-los ou não construí-los implicaria na necessidade de sobescrever outras funções da classe.
     */
    init: function() {
        this._super();
        const bg = new cc.LayerColor(pd.delegate.context == pd.Delegate.CONTEXT_PORTAL ? cc.color(255, 135, 10) : cc.color(101, 167, 228),
            cc.winSize.width, cc.winSize.height);
        this.addChild(bg);

        for(var i in this) {
            if(this[i] instanceof cc.Node)
                this[i].visible = false;
        }

        if(this._animationType == "")
            this.setAnimationType(pd.LoaderScene.ANIMATION_TYPE_NONE);

        if(this._animationType != pd.LoaderScene.ANIMATION_TYPE_NONE) {
            bg.attr({opacity: 0});
            bg.runAction(cc.fadeIn(0.5));
        }
    },

    /**
     * Seta o tipo de animação a ser feita pela tela.
     * @param {String} animationType
     */
    setAnimationType: function(animationType) {
        this._animationType = animationType;
    },

    /**
     * Realiza a construção dos elementos da cena, adicionando-os e animando-os.
     */
    buildUp: function() {
        this._logo = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.PORTAL_LOGO));
        this.addChild(this._logo);

        if(this._animationType == pd.LoaderScene.ANIMATION_TYPE_HIDDEN) {
            this._logo.visible = false;
        }

        if(this._animationType == pd.LoaderScene.ANIMATION_TYPE_FULL) {
            this._logo.attr({x: 512, y: 500, scaleX: 0.5, scaleY: 0.5, opacity: 0});

            this._logo.runAction(cc.sequence(
                cc.spawn(cc.fadeIn(0.3), cc.scaleTo(0.3, 1, 1).easing(cc.easeBackOut())),
                cc.callFunc(function () {
                    cc.audioEngine.playEffect(pd.resLoad.fx_logo);
                }),
                cc.rotateTo(0.05, -2),
                cc.rotateTo(0.1, 2),
                cc.rotateTo(0.1, -2),
                cc.rotateTo(0.05, 0),
                cc.delayTime(0.4),
                cc.callFunc(this._onScreenDidBuild, this)
            ));
        }
        else if(this._animationType == pd.LoaderScene.ANIMATION_TYPE_SIMPLE) {
            this._logo.attr({x: -512, y: 500});
            cc.audioEngine.playEffect(pd.resLoad.fx_swish);
            this._logo.runAction(cc.sequence(
                cc.moveTo(0.4, 512, 500).easing(cc.easeBackOut()),
                cc.callFunc(this._onScreenDidBuild, this)
            ));
        }
        else {
            this._logo.attr({x: 512, y: 500});
            this._onScreenDidBuild();
        }
    },

    /**
     * Inicializa o objeto de feedback de progresso.
     * @param {Number} x
     * @param {Number} y
     * @private
     */
    _addCircleFeedback: function(x, y) {
        this._circleFeedback = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("progressFeedback0001.png"));
        this._circleFeedback.attr({x:x, y:y, scaleX: 0.8, scaleY: 0.8});

        const animFrames = [];
        var str = "";

        for (var i = 1 ; i < 15 ; i++) {
            str = "progressFeedback00" + (i < 10 ? ("0" + i) : i) + ".png";
            var animFrame = new cc.AnimationFrame();
            animFrame.initWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame(str), 1, null);
            animFrames.push(animFrame);
        }

        var animation = new cc.Animation(animFrames, 0.02, 999999);
        this._circleFeedback.runAction(cc.animate(animation));
        this.addChild(this._circleFeedback);
    },

    /**
     * Finaliza o processo de construção da tela.
     * @private
     */
    _onScreenDidBuild: function() {
        this._addCircleFeedback(536, -150);

        this._textFeedback = new cc.LabelTTF("", cc.sys.isNative ? pd.resLoad.lato : "Lato", 21);
        this._textFeedback.setColor(cc.color(255,255,255));
        this._textFeedback.setPosition(this._circleFeedback.x, 100);
        this.addChild(this._textFeedback);

        if(this._animationType != pd.LoaderScene.ANIMATION_TYPE_NONE && this._animationType != pd.LoaderScene.ANIMATION_TYPE_HIDDEN) {
            cc.audioEngine.playEffect(pd.resLoad.fx_woosh);
            this._circleFeedback.runAction(cc.sequence(
                cc.moveTo(0.15, this._circleFeedback.x, 200),
                cc.callFunc(pd.loader.onScreenReady, pd.loader)
            ));
        }
        else {
            this._circleFeedback.setPosition(this._circleFeedback.x, 200);
            pd.loader.onScreenReady();
        }

        if(this._animationType == pd.LoaderScene.ANIMATION_TYPE_HIDDEN) {
            this._textFeedback.setVisible(false);
            this._circleFeedback.setVisible(false);
        }
    },

    /**
     * Exibe uma mensagem customizada.
     * @param {String} msg
     */
    displayMessage: function(msg) {
        if(this._textFeedback) {
            this._textFeedback.setString(msg.toUpperCase());
        }
    },

    /**
     * Exibe o progresso do carregamento.
     * @param {Number} perc
     */
    displayProgress: function(perc) {
        this.displayMessage("Carregando: " + parseInt(perc).toString() + "%");
    },

    /**
     * Exibe uma mensagem de erro.
     * @param {String} msg
     */
    displayWarning: function(msg) {
        if(this._textFeedback) {
            this._textFeedback.setString(msg.toUpperCase());
            this._textFeedback.setColor(cc.color(255, 0, 0));
            this._circleFeedback.setVisible(false);
        }
    },

    /**
     * Destrói os elementos visuais da cena, fazendo uma animação.
     */
    destroy: function() {
        this._circleFeedback.cleanup();
        this.displayProgress(100);

        if(this._animationType != pd.LoaderScene.ANIMATION_TYPE_NONE && this._animationType != pd.LoaderScene.ANIMATION_TYPE_HIDDEN) {
            this.runAction(cc.sequence(
                cc.delayTime(0.2),
                cc.spawn(cc.targetedAction(this._circleFeedback, cc.fadeOut(0.3)), cc.targetedAction(this._textFeedback, cc.moveBy(0.3, 0, -300))),
                cc.callFunc(function () {
                    cc.audioEngine.playEffect(pd.resLoad.fx_woosh);
                }, this),
                cc.targetedAction(this._logo, cc.spawn(cc.moveBy(0.15, 1114, 0))),
                cc.callFunc(pd.loader.onGameReadyToStart, pd.loader)
            ));
        }
        else {
            pd.loader.onGameReadyToStart();
        }
    }
});

/**
 * Nesta configuração, a tela de loading é estática e abrupta, aparecendo e sumindo da tela instantaneamente.
 * @constant
 * @type {string}
 */
pd.LoaderScene.ANIMATION_TYPE_NONE = "animationTypeNone";

/**
 * Nesta configuração é feita uma animação básica, tweenando o logo da esquerda para a direita.
 * @constant
 * @type {string}
 */
pd.LoaderScene.ANIMATION_TYPE_SIMPLE = "animationTypeSimple";

/**
 * A animação completa é feita nesta configuração: tweenando o logo, tocando o som de introdução e tweenando o feedback de carregamento.
 * @constant
 * @type {string}
 */
pd.LoaderScene.ANIMATION_TYPE_FULL = "animationTypeFull";

/**
 * Esta configuração é uma implementação semelhante ao antigo "Loader Sombrio", mostrando apenas uma layer da cor azul do fundo do palco.
 * @constant
 * @type {string}
 */
pd.LoaderScene.ANIMATION_TYPE_HIDDEN = "animationTypeHidden";
