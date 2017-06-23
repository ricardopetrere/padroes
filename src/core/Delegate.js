/**
 * Created by Ryan Balieiro on 22/05/17.
 * Ponto de entrada da biblioteca - define o namespace 'pd'.
 * @namespace pd
 *
 * Lista de pendências:
 * - transformar as arrow keys e os botões de interface (pause button e exit button) em pd.StandardButton.
 * - alterar a pd.TutorialLayer para criar as 'teclas' no formato novo.
 * - inserir um método para criar um joystick na pd.TutorialLayer.
 * - desacoplar as dependências dos arquivos de boot da engine.
 */
var pd = {};

/**
 * @global
 * @type {String}
 */
var padroesPath = cc.game.config["padroesPath"];

/**
 * Indica se o modo debug está ativo (não setar esta variável manualmente!).
 * @type {boolean}
 */
pd.debugMode = cc.game.config[cc.game.CONFIG_KEY.debugMode] != cc.game.DEBUG_MODE_NONE;

/**
 * Versão atual dos padrões.
 * @type {string}
 */
pd.version = "2.4";

cc.log("[pd] Padrões Cocos Versão: " + pd.version);
if(pd.debugMode)
    cc.log("[pd] O modo de debug está ativo!");

/**
 * @class
 * @extends {cc.Class}
 * @classdesc Objeto singleton responsável por gerenciar as preferências do jogo e do ambiente onde a aplicação está rodando.
 */
pd.Delegate = cc.Class.extend({/**@lends pd.Delegate#*/

    /**
     * Indicador do contexto em que o jogo está a rodar.
     * @type {String|null}
     */
    context: null,

    /**
     * Aponta para o namespace ativo.
     * @type {Object}
     */
    activeNamespace:null,

    /**
     * Aponta para o último namespace ativo antes do atual.
     */
    lastNameSpace:null,

    /**
     * Componente responsável pela validação da aplicação.
     */
    validator: null,

    /**
     * Controlador interno para o mecanismo de pause/resume.
     * @type {Array}
     */
    _pausedActions: null,

    /**
     * Controlador interno para gerenciar objetos retidos.
     * @type {Array}
     */
    _retainedNodes:null,

    /**
     * Indica se o objeto do namespace atual está pausado.
     * @type {Boolean}
     */
    isPaused:false,

    /**
     * O tempo de transição da tela de loading para a tela de entrada de um namespace no modo debug.
     * @type {number}
     */
    transitionTime: 0,

    /**
     * Construtor padrão.
     * @constructs
     */
    ctor: function() {
        this.context = pd.Delegate.CONTEXT_STAND_ALONE;
    },

    /**
     * Seta o contexto em que o jogo está a rodar.
     * @param {String} context
     */
    setContext: function(context) {
        this.context = context;
        if(this.context == pd.Delegate.CONTEXT_PORTAL) {
            pd.setUIColor(pd.UI_COLOR_ORANGE);
        }
    },

    /**
     * Seta o componente de validação.
     * @param {cc.Class} validator
     */
    setValidator: function(validator) {
        this.validator = validator;
    },

    /**
     * Seta o status de pause/resume.
     * @param {Boolean} paused
     */
    setPaused: function(paused) {
        this.isPaused = paused;
        isPaused = paused; // legado - apenas para manter compatível!
    },

    /**
     * Realiza a inicialização de um namespace.
     * @param {String} resPath
     * @param {String} srcPath
     * @param {String[]} jsList
     * @returns {Object}
     */
    buildNamespace: function(resPath, srcPath, jsList) {
        return {
            resPath:resPath,
            srcPath:srcPath,
            jsList:jsList
        };
    },

    /**
     * Inicializa os controles internos.
     */
    init: function() {
        this._pausedActions = null;
        pd.delegate.setPaused(false);
    },

    /**
     * Inicializa o namespace indicado.
     * @param {Object} ns
     */
    initWithNamespace: function(ns) {
        this.activeNamespace = ns;
        activeGameSpace = ns; // legado - apenas para manter compatível!

        pd.DebugScenes = [];

        if(this.context == pd.Delegate.CONTEXT_PALCO && ns.resPath.lastIndexOf("jogo") != -1) {
            if(ns.resPath.lastIndexOf("games") == -1)
                ns.resPath = ns.resPath.replace("res/", "res/games/");

            if(ns.srcPath.lastIndexOf("games") == -1)
                ns.srcPath = ns.srcPath.replace("src/", "src/games/");
        }

        cc.loader.loadJs(ns.srcPath, ns.jsList, function() {
            if(ns.onInit)
                ns.onInit.apply(ns);

            pd.loader.setTargets(ns.g_resources ? [ns.g_resources, pd.g_resources] : [pd.g_resources]);
            pd.loader.onModuleReady();
        });

        this.init();
    },

    /**
     * Navega para a cena inicial do namespace carregado.
     */
    bootUp: function() {
        if(pd.debugMode == true || (this.context == pd.Delegate.CONTEXT_PALCO && this.activeNamespace.srcPath.lastIndexOf("jogo") == -1)) {
            if (this.transitionTime > 0) {
                var mainScene = FadeWhiteTransition(this.transitionTime, new this.activeNamespace.MainScene());
            } else {
                mainScene = new this.activeNamespace.MainScene();
            }
        }
        else {
            this.transitionTime = 0.8;
            mainScene = FadeWhiteTransition(this.transitionTime, new this.activeNamespace.MainScene());
        }

        cc.director.runScene(mainScene);
        pd.debugger.init();
        pd.debugger.addShortcut("MainScene");
    },

    /**
     * Seta o tutorial do jogo.
     * @param {pd.TutorialLayer[]} tutorialPages
     * @param {cc.SpriteFrame|cc.LabelTTF} tutorialTitleSpriteFrameOrText
     */
    setTutorial: function(tutorialPages, tutorialTitleSpriteFrameOrText) {
        this.activeNamespace.tutorialData = [];
        pd.Tutorial.setHeader(tutorialTitleSpriteFrameOrText);
        for(var i in tutorialPages) {
            this.activeNamespace.tutorialData.push(tutorialPages[i]);
        }

        this.activeNamespace.tutoriais = this.activeNamespace.tutorialData; //legado.
    },

    /**
     * Gerencia o mecanismo de pause.
     * @param {cc.Node} target - o node-raíz a ser pausado.
     * @returns {Array}
     */
    pause: function(target) {
        target.pause();
        const runningActions = cc.director.getActionManager().pauseAllRunningActions();

        pd.delegate.setPaused(true);
        pd.delegate._pausedActions = runningActions;
        return runningActions;
    },

    /**
     * Gerencia o mecanismo de resume.
     * @param {cc.Node} target - o node-raíz a ser despausado.
     * @param {Array} pausedActions
     */
    resume: function(target, pausedActions) {
        target.resume();
        if(pausedActions && pausedActions.length > 0)
            cc.director.getActionManager().resumeTargets(pausedActions);
        if(this._pausedActions != pausedActions && pd.delegate._pausedActions)
            cc.director.getActionManager().resumeTargets(pd.delegate._pausedActions);

        pd.delegate.setPaused(false);
    },

    /**
     * Retem um objeto.
     * @param {cc.Node|cc.Action} target
     */
    retain: function(target) {
        if(!target.hasBeenRetained) {
            target.retain();
            target.hasBeenRetained = true;

            this._retainedNodes = this._retainedNodes || [];
            this._retainedNodes.push(target);
        }
    },

    /**
     * Libera um objeto.
     * @param {cc.Node|cc.Action} target
     */
    release: function(target) {
        if(target.hasBeenRetained) {
            const index = this._retainedNodes.lastIndexOf(target);
            target.release();
            if (index != -1) {
                this._retainedNodes.splice(index, 1);
            }
            target.hasBeenRetained = false;
        }
    },

    /**
     * Libera todos os objetos retidos e (opcional) descarrega o namespace atual.
     */
    releaseAll: function() {
        for(var i in this._retainedNodes) {
            var target = this._retainedNodes[i];
            if(target) {
                target.hasBeenRetained = false;
                target.release();
            }
        }

        this._retainedNodes = [];
    },

    /**
     * Manipula o término do jogo.
     */
    finish: function() {
        if(this.context == pd.Delegate.CONTEXT_PALCO) {
            this.lastNameSpace = this.activeNamespace;
            pd.audioEngine.setMute(false);
            this._destroyGame();

            var transition = FadeWhiteTransition(cc.sys.isMobile ? 0.3 : 0.4, new palco.MainScene());
            cc.director.runScene(transition);
        }
        else {
            this.releaseAll();
            transition = FadeWhiteTransition(0.6, new this.activeNamespace.MainScene());
            pd.delegate.retain(transition);
            cc.director.runScene(transition);
        }

    },

    /**
     * Destrói o jogo atual.
     * @private
     */
    _destroyGame: function() {
        for(var i in this.activeNamespace.tutoriais) {
            pd.delegate.release(this.activeNamespace.tutoriais[i]);
            this.activeNamespace.tutoriais[i] = null;
        }
        this.activeNamespace.tutoriais = null;
        pd.delegate.releaseAll();
        pd.loader.unload(pd.delegate.activeNamespace.res);
    }
});

/**
 * Indicador de que o jogo está a rodar em modo stand alone.
 * @constant
 * @type {string}
 */
pd.Delegate.CONTEXT_STAND_ALONE = "contextStandAlone";

/**
 * Indicador de que o jogo está a rodar no palco.
 * @constant
 * @type {string}
 */
pd.Delegate.CONTEXT_PALCO = "contextPalco";

/**
 * Indicador de que o jogo está a rodar no Piaget+Digital.
 * @constant
 * @type {string}
 */
pd.Delegate.CONTEXT_PORTAL = "contextPortal";

/**
 * Obtém a instância singleton da classe.
 * @function
 * @public
 * @static
 * @returns {pd.Delegate}
 */
pd.Delegate.getInstance = function () {
    if (pd.Delegate.prototype._singleton == null) {
        pd.Delegate.prototype._singleton = new pd.Delegate();
    }
    else {
        throw new Error("[pd.Delegate] Singleton...")
    }
    return pd.Delegate.prototype._singleton;
};

/**
 * @type pd.Delegate
 */
pd.delegate = pd.Delegate.getInstance();

/**
 * Atalho para facilitar a chamada ao método de reter objetos.
 * @type {function}
 */
pd.retain = pd.delegate.retain;
