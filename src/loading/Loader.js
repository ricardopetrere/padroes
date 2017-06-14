/**
 * Created by Ryan Balieiro on 19/05/17.
 * @class
 * @extends {cc.Class}
 * @classdesc Wrapper básico responsável por gerenciar operações de carregamento dentro da aplicação.
 */
pd.Loader = cc.Class.extend({/** @lends pd.Loader#*/
    /**
     * @type {pd.Loader}
     */
    _singleton: null,

    /**
     * Aponta para a cena de carregamento ativa.
     * @type {pd.LoaderScene}
     */
    loaderScene:null,

    /**
     * Matriz com os vetores de assets a serem carregados. <br/ >
     * Caso não haja nenhuma operação de carregamento em atividade, é igual a null.
     * @type {Object[]}
     */
    _res:null,

    /**
     * Aponta para o índice i da matriz _res[i][j] que está sendo carregado.
     */
    _currentRes:-1,

    /**
     * Objeto nativo responsável pelo carregamento de assets.
     * @type {cc.Loader}
     */
    _ccLoader:null,

    /**
     * Construtor padrão.
     * @constructs
     */
    ctor: function() {
        this._res = null;
        this._currentRes = -1;
    },

    /**
     * Determina o método de carregamento a ser empregado para o módulo atual. <br/>
     * Dependendo do contexto ou do status da aplicação, uma estratégia de carregamento diferente deve ser empregada: <br/>
     * - Se não estiver no palco ou se o palco estiver sendo inicializado, deve-se fazer um pré-carregamento da aplicação, carregando os recursos utilizados pelos padrões. <br/>
     * - Se estiver no palco, e o usuário estiver abrindo no jogo, não há a necessidade de se fazer um pré-carregamento, pois os recursos utilizados pelos padrões já estão carregados na memória.
     */
    onModuleReady: function() {
        if(pd.delegate.context != pd.Delegate.CONTEXT_PALCO || pd.delegate.activeNamespace.srcPath.lastIndexOf("palco") != -1)
            pd.loader.preload();
        else
            pd.loader.initModule();
    },

    /**
     * Realiza o pré-carregamento da aplicação.
     * @returns {pd.LoaderScene}
     */
    preload: function() {
        if(!cc.sys.isNative) {
            var _cc = cc;
            if (!_cc.loaderScene) {
                _cc.loaderScene = new pd.LoaderScene();
                _cc.loaderScene.setAnimationType(pd.debugMode ? pd.LoaderScene.ANIMATION_TYPE_NONE : pd.LoaderScene.ANIMATION_TYPE_FULL);
                _cc.loaderScene.init();
                cc.eventManager.addCustomListener(cc.Director.EVENT_PROJECTION_CHANGED, function () {
                    _cc.loaderScene._updateTransform();
                });
            }

            _cc.loaderScene.initWithResources(pd.load_resources, this._onPreloadDidFinish, this);

            cc.director.runScene(_cc.loaderScene);
            this.loaderScene = _cc.loaderScene;
            return _cc.loaderScene;
        }
        else {
            cc.LoaderScene.preload(pd.load_resources, function () {
                this.loaderScene = new pd.LoaderScene();
                this.loaderScene.setAnimationType(pd.debugMode ? pd.LoaderScene.ANIMATION_TYPE_NONE : pd.LoaderScene.ANIMATION_TYPE_FULL);
                cc.director.runScene(this.loaderScene);
                this._onPreloadDidFinish();
            }, this);
        }
    },

    /**
     * Inicializa a aplicação após a finalização da operação de preload.
     * @private
     */
    _onPreloadDidFinish: function() {
        cc.spriteFrameCache.addSpriteFrames(pd.resLoad.p_loader);
        this.loaderScene.buildUp();
    },

    /**
     * Recarrega o core da aplicação do zero (apenas para debugar!)
     */
    reloadCore: function() {
        if(!cc.sys.isNative)
            return;

        pd.delegate.activeNamespace = palco;
        this.loaderScene = new pd.LoaderScene();
        this.loaderScene.setAnimationType(pd.LoaderScene.ANIMATION_TYPE_HIDDEN);
        cc.director.runScene(this.loaderScene);
        pd.delegate.releaseAll();
    },

    /**
     * Realiza o pré-carregamento de um módulo da aplicação.
     * @param {String} root
     */
    preloadModule: function(root) {
        this.loaderScene = new pd.LoaderScene(true);
        this.loaderScene.init();
        cc.director.runScene(this.loaderScene);

        cc.loader.loadJs(root, ["Config.js"], function() {
            const pattern = root.substr(root.lastIndexOf("/") + 1, root.length - 1);
            pd.delegate.initWithNamespace(eval(pattern));
        });
    },

    /**
     * Inicializa o carregamento de um módulo da aplicação.
     */
    initModule: function() {
        this.loaderScene.setAnimationType(pd.debugMode ? pd.LoaderScene.ANIMATION_TYPE_NONE : pd.LoaderScene.ANIMATION_TYPE_SIMPLE);
        this.loaderScene.init();
        this.loaderScene.buildUp();
    },

    /**
     * Seta os assets a serem carregados.
     * @param resArray {Object[]} - vetor de objetos, sendo cada objeto um vetor de assets.
     */
    setTargets:function(resArray) {
        this._res = resArray;
    },

    /**
     * Inicializa o processo de construção da tela.
     */
    onScreenReady: function() {
        if(pd.delegate.context == pd.Delegate.CONTEXT_PALCO && pd.delegate.validator) {
            pd.delegate.validator.init();
        }
        else {
            this.onGameReadyToLoad();
        }
    },

    /**
     * Inicializa o processo de carregamento do módulo atual.
     */
    onGameReadyToLoad: function() {
        pd.delegate.setValidator(null);
        this._currentRes = -1;
        this._load(pd.delegate.activeNamespace.g_resources);
    },

    /**
     * Inicializa o processo de carregamento do próximo vetor de assets.
     * @private
     */
    _load: function() {
        this._currentRes++;
        if(this._currentRes < this._res.length)
            this._ccLoader = cc.loader.load(this._res[this._currentRes], this._onLoadProgress, this._onLoadComplete);
    },

    /**
     * Manipula o progresso do processo de carregamento.
     * @param {Object} target - o objeto sendo carregado.
     * @param {Number} totalItems - o número total de itens sendo carregados.
     * @param {Number} loadedItems - o número total de itens já carregados.
     * @private
     */
    _onLoadProgress: function(target, totalItems, loadedItems) {
        const progress = pd.loader._currentRes/pd.loader._res.length*100 + loadedItems/totalItems*(100/pd.loader._res.length);
        pd.loader.loaderScene.displayProgress(progress);
    },

    /**
     * Manipula a finalização do processo de carregamento.
     * @param {Object|null} err - objeto de erro (null, se não ocorreu nenhum erro).
     * @param {Array} loadedObjects - lista de objetos carregados.
     * @private
     */
    _onLoadComplete: function(err, loadedObjects) {
        if(!err) {
            if(pd.loader._currentRes == pd.loader._res.length - 1)
                pd.loader.loaderScene.destroy();
            else
                pd.loader._load();
        }
        else {
            cc.log("[pd.Loader] Ocorreu um erro ao carregar os assets do jogo!");
        }
    },

    /**
     * Manipula o processo de inicialização do jogo.
     */
    onGameReadyToStart: function() {
        for(var i in this._res) {
            this.addSpriteFrames(this._res[i], this._res[i] == pd.g_resources);
        }

        pd.delegate.bootUp();
    },

    /**
     * Procura os spriteframes dentro do vetor de assets e adiciona-os ao cache.
     * @param {Array} res
     * @param {Boolean} isInternal - indica se a requisição é proveniente de um carregamento interno dos 'padrões'.
     */
    addSpriteFrames: function(res, isInternal) {
        for(i = 0; i < res.length; i++) {
            if(res[i].indexOf(".plist") != -1) {
                cc.spriteFrameCache.addSpriteFrames(res[i]);
                cc.log("[pd.Loader] pList " + (isInternal ? "PADRÃO" : "do jogo") +  " adicionado ao cache com sucesso: " + res[i])
            }
        }
    },

    /**
     * Realiza o descarregamento do módulo (jogo) atual.
     * @param {Array} res
     */
    unload: function(res) {
        for(var i in res) {
            if(res[i].indexOf(".plist") != -1) {
                cc.spriteFrameCache.removeSpriteFramesFromFile(res[i]);
            }
            else if(res[i].indexOf(".png") != -1 || res[i].indexOf(".jpg") != -1) {
                cc.textureCache.removeTextureForKey(res[i]);
            }
            else if(res[i].indexOf(".mp3") != -1 || res[i].indexOf(".wav") != -1) {
                cc.audioEngine.unloadEffect(res[i]);
            }
            cc.loader.release(res[i]);
        }

        cc.eventManager.removeAllListeners();
        cc.sys.garbageCollect();
    },

    /**
     * Realiza um descarregamento forçado de todos os assets pré-carregados pela aplicação, assim como remove todos os listeners de evento ativos. <br />
     * Utilizar apenas para fins de debugging.
     */
    hardUnload: function() {
        cc.eventManager.removeAllListeners();
        cc.spriteFrameCache.removeSpriteFrames();
        cc.textureCache.removeAllTextures();
        cc.director.purgeCachedData();
    }
});

/**
 * Obtém a instância singleton da classe.
 * @function
 * @public
 * @static
 * @returns {pd.Loader}
 */
pd.Loader.getInstance = function () {
    if (pd.Loader.prototype._singleton == null) {
        pd.Loader.prototype._singleton = new pd.Loader();
    }
    return pd.Loader.prototype._singleton;
};

/**
 * @type pd.Loader
 */
pd.loader = pd.Loader.getInstance();
