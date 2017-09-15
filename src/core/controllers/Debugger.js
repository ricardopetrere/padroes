/**
 * Created by Ryan Balieiro on 06/06/17.
 * @class
 * @extends {cc.Class}
 * @classdesc Componente responsável por gerenciar todos os controladores internos relacionados a operações de 'debug' da aplicação. <br />
 *            Implementa as funcionalidades do antigo 'SceneDebugger'. Optei por renomeá-lo para 'Debugger', pois ele é o único componente dos padrões utilizado para debugar o jogo. Considerar a possibilidade de dividir este componente em subcomponentes em implementações futuras. <br />
 *            O antigo 'Debugger' agora foi renomeado para 'Editor'.
 */
pd.Debugger = cc.Class.extend({/**@lends pd.Debugger#*/

    /**
     * @type {pd.Debugger}
     */
    _singleton:null,

    /**
     * Vetor com os metadados setados pelo programador visando criar atalhos em seu jogo.
     * @type {{targetSceneName:String, callbackFunction:Function,
            callbackCaller:*, callbackArguments:Array}[]}
     */
    _shortcuts: null,

    /**
     * Inicializa os controladores internos, resetando-os para o estado inicial.
     */
    init: function() {
        this._shortcuts = null;
    },

    /**
     * Verifica se a aplicação está rodando no palco.
     * @returns {boolean}
     */
    _isPalco: function() {
        return pd.delegate.context == pd.Delegate.CONTEXT_PALCO;
    },

    /**
     * Adiciona um atalho.
     * @param {String|null} targetSceneName - a cena para qual deseja-se navegar.
     * @param {Function|null} callbackFunction - a função de callback a ser executada.
     * @param {*|null} callbackCaller - o objeto responsável por chamar a função de callback.
     * @param {Array|null} [callbackArguments] - os argumentos a serem passados para a função de callback.
     */
    addShortcut: function(targetSceneName, callbackFunction, callbackCaller, callbackArguments) {
        if(!pd.debugMode || this._isPalco())
            return;

        cc.log(targetSceneName);
        if(!this._shortcuts)
            this._shortcuts = [];

        if(!this._hasShortcut(targetSceneName, callbackFunction, callbackCaller, callbackArguments)) {
            const shortcut = {targetSceneName:targetSceneName, callbackFunction:callbackFunction,
                callbackCaller:callbackCaller, callbackArguments:callbackArguments};
            this._shortcuts.push(shortcut);
        }
    },

    /**
     * Verifica se um atalho já foi adicionado para evitar duplicações. (uso interno).
     * @param callbackCaller {*|null} - o objeto responsável por chamar a função de callback.
     * @param callbackArguments {Array|null} - os argumentos a serem passados para a função de callback.
     * @param {String|null} targetSceneName - a cena para qual deseja-se navegar.
     * @param {Function|null} callbackFunction - a função de callback a ser executada.
     * @private
     * @returns {Boolean}
     */
    _hasShortcut: function(targetSceneName, callbackFunction, callbackCaller, callbackArguments) {
        for(var i in this._shortcuts) {
            var shortcut = this._shortcuts[i];
            var func1 = shortcut.callbackFunction ? shortcut.callbackFunction.toString() : null;
            var func2 = callbackFunction ? callbackFunction.toString() : null;

            if(shortcut.targetSceneName == targetSceneName && func1 == func2) {
                return true;
            }
        }

        return false;
    },

    /**
     * Carrega o atalho especificado.
     * @param {Number} id
     */
    loadShortcut: function(id) {
        if(!pd.debugMode || this._isPalco() || !this._shortcuts || !this._shortcuts[id])
            return;

        const shortcut = this._shortcuts[id];
        if(shortcut.callbackFunction && shortcut.callbackCaller)
            shortcut.callbackFunction.apply(shortcut.callbackCaller, shortcut.callbackArguments);

        if(shortcut.targetSceneName) {
            const targetScene = new pd.delegate.activeNamespace[shortcut.targetSceneName]();
            var transition = FadeTransition(0.5, targetScene);
            pd.delegate.retain(transition);
            cc.director.runScene(transition);
        }

        cc.log("[pd.Debugger] Carregando shortcut vinculado à tecla: ["+ (id+1) +"]. Redirecionando para a cena: " +
            (shortcut.targetSceneName ? shortcut.targetSceneName : "[MesmaCena]"))
    }
});

/**
 * Obtém a instância singleton do objeto.
 * @returns {pd.Debugger}
 */
pd.Debugger.getInstance = function () {
    if (pd.Debugger.prototype._singleton == null) {
        pd.Debugger.prototype._singleton = new pd.Debugger();
    }
    return pd.Debugger.prototype._singleton;
};

/**
 * @type pd.Debugger
 */
pd.debugger = pd.Debugger.getInstance();
