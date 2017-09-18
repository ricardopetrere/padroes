/**
 * Created by Ryan Balieiro on 15/09/17.
 *
 * @desc
 * Implementa a capacidade de um componente de disparar eventos via pd.InputManager.
 * @mixin
 */
pd.decorators.EventDispatcher = { /** @lends pd.decorators.EventDispatcher#*/
    /**
     * O mecanismo de callback utilizado pelo botão.
     * @type {pd.decorators.EventDispatcher.CALLBACK_MODE_EXPLICIT|pd.decorators.EventDispatcher.CALLBACK_MODE_EVENT_BASED}
     */
    _callbackMode:"",

    /**
     * Seta o mecanismo de callback do componente.
     * @function
     * @param {Boolean} eventBased
     */
    setCallbackMode: function(eventBased) {
        this._callbackMode = eventBased ? pd.decorators.EventDispatcher.CALLBACK_MODE_EVENT_BASED : pd.decorators.EventDispatcher.CALLBACK_MODE_EXPLICIT;
    },

    /**
     * Indica se o componente deve disparar eventos.
     * @returns {Boolean}
     */
    _shouldDispatchEvent: function() {
        return this._callbackMode == pd.decorators.EventDispatcher.CALLBACK_MODE_EVENT_BASED;
    },

    /**
     * Realiza uma chamada explícia ao método de callback.
     * @param {*} handler
     * @param {Function|String} handlerFunc
     * @param {Array} handlerArgs
     */
    _performCall: function(handler, handlerFunc, handlerArgs) {
        if(this._callbackMode == pd.decorators.EventDispatcher.CALLBACK_MODE_EVENT_BASED)
            throw new Error("[pd.decorators.EventDispatcher] O modo de callback do componente é baseado em eventos!");

        if (typeof(handlerFunc) == "function") {
            handlerFunc.apply(handler, handlerArgs);
        }
        else {
            handler[handlerFunc].apply(handler, handlerArgs);
        }
    },

    /**
     * Dispara um evento.
     * @param {String} eventType
     * @param {Array} eventMetadata - metadados pré-setados (utilizar o mecanismo de cache do pd.InputManager}
     * @protected
     */
    _dispatchInputEvent: function(eventType, eventMetadata) {
        if(this._callbackMode == pd.decorators.EventDispatcher.CALLBACK_MODE_EXPLICIT)
            throw new Error("[pd.decorators.EventDispatcher] O modo de callback do componente é baseado em chamadas explícitas!");

        pd.inputManager.call(this, eventType, eventMetadata);
    }
};

/**
 * Modo de callback explícito: as funções de callback são definidas no construtor do objeto, e são invocadas de maneira explícita.
 * @constant
 * @type {string}
 */
pd.decorators.EventDispatcher.CALLBACK_MODE_EVENT_BASED = "callbackModeEventBased";

/**
 * Modo de callback baseado em eventos: os objetos disparam notificações, permitindo que as funções de callback sejam injetadas por um controlador externo.
 * @constant
 * @type {string}
 */
pd.decorators.EventDispatcher.CALLBACK_MODE_EXPLICIT = "callbackModeExplicit";