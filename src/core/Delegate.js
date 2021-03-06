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
     * Hash com os caminhos pré-carregados do paths.json.
     * @type {{padroesPath:String, volumePath:String, videoFolderPath:String}}
     */
    paths:null,

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
     * Indica se o tutorial já foi instanciado
     * @type {Boolean}
     */
    isTutorialSet: false,

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
     * Seta o objeto com os paths pré-carregados.
     * @param {Object} paths
     */
    setPaths: function(paths) {
        this.paths = paths;
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
     * Verifica se o namespace indicado é o palco.
     * @param {Object} ns
     * @returns {Boolean}
     */
    isNamespacePalco: function(ns) {
        return ns.hasOwnProperty("targetBuild");
    },

    /**
     * Inicializa o namespace indicado.
     * @param {Object} ns
     * @param {String} [customPath] - um caminho específico, caso o jogo não esteja na raíz do projeto.
     */
    initWithNamespace: function(ns, customPath) {
        this.activeNamespace = ns;
        activeGameSpace = ns; // legado - apenas para manter compatível!

        // ns.resPath = "res/";
        // ns.srcPath = "src/";
        ns.resPath = pd.Delegate.DefaultPaths.resPath;
        ns.srcPath = pd.Delegate.DefaultPaths.srcPath;

        if(!ns.res && ns.Resources)
            ns.res = ns.Resources;

        if(this.context == pd.Delegate.CONTEXT_PALCO && !this.isNamespacePalco(ns)) {
            if(ns.JsonList) {
                for(var i in ns.JsonList) {
                    if(ns.JsonList[i].lastIndexOf(customPath) == -1)
                        // ns.JsonList[i] = ns.JsonList[i].replace("res/", customPath + "/res/");
                        ns.JsonList[i] = customPath + "/" + ns.JsonList[i];
                }
            }

            if (ns.resPath.lastIndexOf(customPath) == -1)
                // ns.resPath = ns.resPath.replace("res/", customPath + "/res/");
                ns.resPath = customPath + "/" + ns.resPath;

            if (ns.srcPath.lastIndexOf(customPath) == -1)
                // ns.srcPath = ns.srcPath.replace("src/", customPath + "/src/");
                ns.srcPath = customPath + "/" + ns.srcPath;
        }

        this._initGameResources(ns);

        pd.DebugScenes = [];
        pd.loader.loadModuleDependencies();
        this.init();
    },

    /**
     * Inicializa os resources do jogo
     * @param ns
     * @private
     */
    _initGameResources: function (ns) {
        if (ns.res && !ns.g_resources) {
            for (var n in ns.res) {
                ns.res[n] = cc.path.join(ns.resPath, ns.res[n]);
            }
            ns.g_resources = pd.objectToArray(ns.res);
        }
    },

    /**
     * Navega para a cena inicial do namespace carregado.
     */
    bootUp: function() {
        var mainSceneClass = this.activeNamespace[pd.Delegate.DefaultPaths.mainScene];
        if(pd.debugMode == true || (this.context == pd.Delegate.CONTEXT_PALCO && this.activeNamespace.srcPath.lastIndexOf("jogo") == -1)) {
            if (this.transitionTime > 0) {
                var mainScene = pd.FadeWhiteTransition(this.transitionTime, new mainSceneClass());
            } else {
                mainScene = new mainSceneClass();
            }
        }
        else {
            this.transitionTime = 0.8;
            mainScene = pd.FadeWhiteTransition(this.transitionTime, new mainSceneClass());
        }
        this.isTutorialSet = false;
        pd.delegate.activeNamespace.tutorialData = [];
        cc.director.runScene(mainScene);
        pd.debugger.init();
        pd.debugger.addShortcut(pd.Delegate.DefaultPaths.mainScene);
    },

    /**
     * Seta o tutorial do jogo.
     * @param {pd.TutorialLayer[]} tutorialPages
     * @param {cc.SpriteFrame|cc.LabelTTF} tutorialTitleSpriteFrameOrText
     */
    setTutorial: function(tutorialPages, tutorialTitleSpriteFrameOrText) {
        if (!this.isTutorialSet) {
            this.isTutorialSet = true;
            pd.Tutorial.setHeader(tutorialTitleSpriteFrameOrText);
            for (var i in tutorialPages) {
                this.activeNamespace.tutorialData.push(tutorialPages[i]);
            }

            this.activeNamespace.tutoriais = this.activeNamespace.tutorialData; //legado.
        }
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
        pd.pool.reset();
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

            var transition = pd.FadeWhiteTransition(cc.sys.isMobile ? 0.3 : 0.4, new palco[pd.Delegate.DefaultPaths.mainScene]());
            cc.director.runScene(transition);
        }
        else {
            this.releaseAll();
            transition = pd.FadeWhiteTransition(0.6, new this.activeNamespace[pd.Delegate.DefaultPaths.mainScene]());
            pd.delegate.retain(transition);
            cc.director.runScene(transition);
        }
    },

    /**
     * Executa a animação de vitória.
     * @param {cc.SpriteFrame} circleSpriteFrame
     * @param {cc.SpriteFrame} messageSpriteFrame
     * @param {Boolean} [tiltScreen=true]
     */
    winGame: function(circleSpriteFrame, messageSpriteFrame, tiltScreen) {
        this._gameOver(pd.GameOverLayer.TYPE_WIN, circleSpriteFrame, messageSpriteFrame, tiltScreen);
    },

    /**
     * Executa a animação de derrota.
     * @param {cc.SpriteFrame} circleSpriteFrame
     * @param {Boolean} [tiltScreen=true]
     */
    loseGame: function(circleSpriteFrame, tiltScreen) {
        this._gameOver(pd.GameOverLayer.TYPE_LOSE, circleSpriteFrame, null, tiltScreen);
    },

    /**
     * Chamada a layer de GameOver, informando o tipo e os sprites utilizados
     * @param {string} type
     * @param {cc.SpriteFrame} circleSpriteFrame
     * @param {cc.SpriteFrame} messageSpriteFrame
     * @param {Boolean} [tiltScreen=true]
     * @private
     */
    _gameOver: function (type, circleSpriteFrame, messageSpriteFrame, tiltScreen) {
        if(pd.currentScene.uiButton)
            pd.currentScene.uiButton.cleanup();
        const gameOverLayer = new pd.GameOverLayer();
        gameOverLayer.init(pd.currentScene, type, circleSpriteFrame, messageSpriteFrame, tiltScreen);
        pd.currentScene.addChild(gameOverLayer, pd.ZOrders.GAME_OVER_LAYER);
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
 * Caminhos padrão dentro dos padrões
 * @enum {string}
 */
pd.Delegate.DefaultPaths = {};
/**
 * src/
 * @type {string}
 */
pd.Delegate.DefaultPaths.srcPath = "src/",//initWithNamespace
/**
 * res/
 * @type {string}
 */
pd.Delegate.DefaultPaths.resPath = "res/",//initWithNamespace
/**
 * metadata/
 * @type {string}
 */
pd.Delegate.DefaultPaths.metadataFolder = "metadata/",
/**
 * metadata/modules.json
 * @type {string}
 */
pd.Delegate.DefaultPaths.modulesPath = pd.Delegate.DefaultPaths.metadataFolder + "modules.json",
/**
 * MainScene
 * @type {string}
 */
pd.Delegate.DefaultPaths.mainScene = "MainScene",
/**
 * Config.js
 * @type {string}
 */
pd.Delegate.DefaultPaths.configFileName = "Config.js"
/**
 * src/Config.js
 * @type {string}
 */
pd.Delegate.DefaultPaths.configFileLocation = pd.Delegate.DefaultPaths.srcPath + pd.Delegate.DefaultPaths.configFileName;

/**
 * @type pd.Delegate
 */
pd.delegate = pd.generateSingleton(pd.Delegate);

/**
 * Atalho para facilitar a chamada ao método de reter objetos.
 * @type {function}
 * @param {cc.Node} obj
 */
pd.retain = function(obj) {
    pd.delegate.retain(obj);
}
