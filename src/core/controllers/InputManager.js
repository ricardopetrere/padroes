/**
 * Created by Ryan Balieiro on 05/06/17.
 *
 * @class
 * @extends {cc.Class}
 * @classdesc Objeto singleton responsável por gerenciar os listeners de inputs da aplicação.
 *
 * Pendência: transformar os tipos de evento em um enumerador.
 */
pd.InputManager = cc.Class.extend({/**@lends pd.InputManager#*/
    /**
     * Apontamento singleton para a instância única do objeto.
     * @type {pd.InputManager}
     */
    _singleton:null,

    /**
     * Altera as configurações de input do 'target'. <br />
     * Chamar este método antes de atribuir eventos ao node!
     * @param target {*} - o node a ser configurado.
     * @param allowMultiTouch {Boolean} - indica se os eventos de toque do node aceitam o recurso de multitouch.
     * @param touchEventTypeCode {cc.EventListener.TOUCH_ALL_AT_ONCE|cc.EventListener.TOUCH_ONE_BY_ONE} - indica o tipo de evento que os eventos de toque do node devem possuir.
     * @param priority {Number} - a prioridade que os listeners do node devem assumir.
     */
    config: function(target, allowMultiTouch, touchEventTypeCode, priority) {
        if(!target._inputMetadata)
            target._inputMetadata = {};

        const metadata = target._inputMetadata;
        metadata.allowMultiTouch = allowMultiTouch;
        metadata.touchEventTypeCode = touchEventTypeCode;
        metadata.priority = priority;
    },

    /**
     * Seta um listener de evento para o àlvo informado.
     * @param eventType {String} - tipo do evento.
     * @param target {*} - o objeto que dispara o evento.
     * @param handlerFunc {Function|String} - a função a ser invocada pelo objeto que escuta o evento.
     * @param [handler=null] {*} - o objeto que escuta o evento. Caso seja null, o target será utilizado como handler.
     */
    add: function(eventType, target, handlerFunc, handler) {
        if(!target._inputMetadata)
            target._inputMetadata = {};

        const metadata = target._inputMetadata;
        if(metadata[eventType])
            cc.log("[pd.InputManager] Warning: tentando attachar dois callbacks a um mesmo tipo de evento para um mesmo target (não recomendado): " + eventType);
        metadata[eventType] = {handler: handler ? handler : target, handlerFunc:handlerFunc};
        this._checkInputSources(target, eventType, true);
    },

    /**
     * Verifica se o node possui um listener para o tipo de evento indicado.
     * @param eventType {String} - tipo do evento.
     * @param target {*} - o objeto que dispara o evento.
     * @returns {Boolean}
     */
    hasListener: function(eventType, target) {
        const metadata = target._inputMetadata;
        return metadata[eventType] ? true : false;
    },

    /**
     * Sobrescreve a função de callback de um listener.
     * @param eventType {String} - tipo do evento.
     * @param target {*} - o objeto que dispara o evento.
     * @param newHandlerFunc {Function|String} - a função a ser invocada pelo objeto que escuta o evento.
     * @param [newHandler=null] {*} - o objeto que escuta o evento. Caso seja null, o target será utilizado como handler.
     */
    overrideCallback: function(eventType, target, newHandlerFunc, newHandler) {
        const metadata = target._inputMetadata;
        if(metadata[eventType]) {
            metadata[eventType].handlerFunc = newHandlerFunc ? newHandlerFunc : metadata[eventType].handlerFunc;
            metadata[eventType].handler = newHandler ? newHandler : metadata[eventType].handler;
        }
        else {
            throw new Error("[pd.InputManager] Tentando sobescrever callback inexistente!");
        }
    },

    /**
     * Remove um listener de evento.
     * @param eventType {String} - tipo do evento
     * @param target {*} - o objeto que dispara o evento.
     */
    remove: function(eventType, target) {
        if(!target._inputMetadata)
            return;

        const metadata = target._inputMetadata;
        if(metadata[eventType]) {
            delete metadata[eventType];
            this._checkInputSources(target, eventType, false)
        }
    },

    /**
     * Remove todos os listeners do node informado.
     * @param target {*}
     */
    clean: function(target) {
        const metadata = target._inputMetadata;
        for(var i in metadata) {
            if(metadata[i].hasOwnProperty("handler")) {
                this.remove(i, target);
            }
        }
    },

    /**
     * Adiciona um listener a um cc.Node.
     * @param target {cc.Node}
     * @param listener {cc.EventListener}
     */
    _addListener: function(target, listener) {
        cc.eventManager.addListener(listener, target);
        if(target._inputMetadata.priority)
            cc.eventManager.setPriority(listener, target._inputMetadata.priority)
    },

    /**
     * Realiza um callback de um listener.
     * @param target {*}
     * @param eventType {String}
     * @param args
     */
    call: function(target, eventType, args) {
        if(!target._inputMetadata[eventType])
            return;

        const metadata = target._inputMetadata[eventType];
        if(typeof metadata.handlerFunc == "string") {
            metadata.handler[metadata.handlerFunc].apply(metadata.handler, args);
        }
        else {
            metadata.handlerFunc.apply(metadata.handler, args);
        }
    },

    /**
     * Adiciona/remove um listener ao objeto, dependendo do tipo do evento informado.
     * @param target {*}
     * @param eventType {String}
     * @param didAddCallback {Boolean}
     * @private
     */
    _checkInputSources: function(target, eventType, didAddCallback) {
        if(eventType.lastIndexOf("Mouse") != -1) {
            if(!target._inputMetadata[pd.InputManager.Sources.MOUSE]) {
                this[didAddCallback ? "_activateMouse" : "_deactivateMouse"](target);
            }
        }
        else if(eventType.lastIndexOf("Key") != -1) {
            if(!target._inputMetadata[pd.InputManager.Sources.KEYBOARD]) {
                this[didAddCallback ? "_activateKeyboard" : "_deactivateKeyboard"](target);
            }
        }
        else if(eventType.lastIndexOf("Accelerometer" != -1)) {
            if(!target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER]) {
                this[didAddCallback ? "_activateAccelerometer" : "_deactivateAccelerometer"](target);
            }
        }
    },

    /**
     * Recicla o array de metadados pré-alocado de um evento anterior para economizar memória.
     * @param {String} arr
     * @param {...*} argv
     */
    setEventMetadata: function(arr, argv) {
        if(!this[arr])
            this[arr] = [];

        for(var i = 1 ; i < arguments.length ; i++) {
            this[arr][i - 1] = arguments[i];
        }
    },

    /**
     * Ativa o mouse.
     * @param target {*}
     * @private
     */
    _activateMouse: function(target) {
        if(target._inputMetadata[pd.InputManager.Sources.MOUSE])
            return;

        if(cc.sys.isMobile) {
            if(target._inputMetadata.touchEventTypeCode != cc.EventListener.TOUCH_ALL_AT_ONCE)
                this._setMouseAsTouchOneByOne(target);
            else
                this._setMouseAsTouchAllAtOnce(target)
        }
        else {
            this._setMouse(target);
        }

        this._addListener(target, target._inputMetadata[pd.InputManager.Sources.MOUSE]);
    },

    /**
     * Cria um evento de mouse para o mobile - touch sem o recurso multitouch.
     * @private {*} target
     */
    _setMouseAsTouchOneByOne: function(target) {
        target._inputMetadata[pd.InputManager.Sources.MOUSE] = cc.EventListener.create({
            event: target._inputMetadata.touchEventTypeCode ? target._inputMetadata.touchEventTypeCode : cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touch, event);
                if(target._inputMetadata.allowMultiTouch || touch.getID() == 0)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_MOUSE_DOWN, pd.inputManager._mouseMeta);
                return true;
            },
            onTouchMoved: function (touch, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touch, event);
                if(target._inputMetadata.allowMultiTouch || touch.getID() == 0)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_MOUSE_MOVE, pd.inputManager._mouseMeta);
                return true;
            },
            onTouchEnded: function (touch, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touch, event);
                if(target._inputMetadata.allowMultiTouch || touch.getID() == 0)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_MOUSE_UP, pd.inputManager._mouseMeta);
                return true;
            }
        });
    },

    /**
     * Cria um evento de mouse para o mobile - touch com o recurso multitouch.
     * @private
     */
    _setMouseAsTouchAllAtOnce: function(target) {
        target._inputMetadata[pd.InputManager.Sources.MOUSE] = cc.EventListener.create({
            event: target._inputMetadata.touchEventTypeCode ? target._inputMetadata.touchEventTypeCode : cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchesBegan: function (touches, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touches, event);
                if(target._inputMetadata.allowMultiTouch || touches.length == 1)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_MOUSE_DOWN, pd.inputManager._mouseMeta);
                return true;
            },
            onTouchesMoved: function (touches, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touches, event);
                if(target._inputMetadata.allowMultiTouch || touches.length == 1)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_MOUSE_MOVE, pd.inputManager._mouseMeta);
                return true;
            },
            onTouchesEnded: function (touches, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touches, event);
                if(target._inputMetadata.allowMultiTouch || touches.length == 1)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_MOUSE_UP, pd.inputManager._mouseMeta);
                return true;
            }
        });
    },

    /**
     * Cria um evento de mouse para o desktop.
     * @param {*} target
     * @private
     */
    _setMouse: function(target) {
        target._inputMetadata[pd.InputManager.Sources.MOUSE] = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseDown: function (event) {
                pd.inputManager.setEventMetadata("_mouseMeta", event);
                if (event.getButton() == 0)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_MOUSE_DOWN, pd.inputManager._mouseMeta);
                return true;
            },
            onMouseMove: function (event) {
                pd.inputManager.setEventMetadata("_mouseMeta", event);
                const btn = event.getButton();
                switch(btn) {
                    case null: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_MOUSE_HOVER, pd.inputManager._mouseMeta); break;
                    case 0: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_MOUSE_MOVE, pd.inputManager._mouseMeta); break;
                    case 1: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_MOUSE_PAN, pd.inputManager._mouseMeta); break;
                }
                return true;
            },
            onMouseScroll: function(event) {
                pd.inputManager.setEventMetadata("_mouseMeta", event);
                if (cc.sys.os === cc.sys.OS_OSX) { // rolagem natural.
                    event.setScrollData(event.getScrollX(), -event.getScrollY());
                }
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_MOUSE_SCROLL, pd.inputManager._mouseMeta);
                return true;
            },
            onMouseUp: function (event) {
                pd.inputManager.setEventMetadata("_mouseMeta", event);
                if (event.getButton() == 0)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_MOUSE_UP, pd.inputManager._mouseMeta);
                return true;
            }
        });
    },

    /**
     * Desativa o mouse.
     * @param target {*}
     * @private
     */
    _deactivateMouse: function(target) {
        if(target._inputMetadata[pd.InputManager.Sources.MOUSE] && !target._inputMetadata[pd.InputManager.EVENT_MOUSE_DOWN] && !target._inputMetadata[pd.InputManager.EVENT_MOUSE_MOVE] && !target._inputMetadata[pd.InputManager.EVENT_MOUSE_SCROLL] && !target._inputMetadata[pd.InputManager.EVENT_MOUSE_UP] && !target._inputMetadata[pd.InputManager.EVENT_MOUSE_HOVER] && !target._inputMetadata[pd.InputManager.EVENT_MOUSE_PAN]) {
            cc.eventManager.removeListener(target._inputMetadata[pd.InputManager.Sources.MOUSE]);
            delete target._inputMetadata[pd.InputManager.Sources.MOUSE];
        }
    },

    /**
     * Ativa o teclado.
     * @param target {*}
     * @private
     */
    _activateKeyboard: function(target) {
        if(cc.sys.isMobile || target._inputMetadata[pd.InputManager.Sources.KEYBOARD])
            return;

        target._inputMetadata[pd.InputManager.Sources.KEYBOARD] = {
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event) {
                pd.inputManager.setEventMetadata("_keyboardMeta", keyCode, event);
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_KEY_DOWN, pd.inputManager._keyboardMeta);
                return true;
            },
            onKeyReleased: function(keyCode, event) {
                pd.inputManager.setEventMetadata("_keyboardMeta", keyCode, event);
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_KEY_UP, pd.inputManager._keyboardMeta);
                return true;
            }
        };

        this._addListener(target, target._inputMetadata[pd.InputManager.Sources.KEYBOARD]);
    },

    /**
     * Verifica se o target não possui mais callbacks à eventos de teclado e, caso isso se confirme, remove o evento.
     * @param target {*}
     * @private
     */
    _deactivateKeyboard: function(target) {
        if(target._inputMetadata[pd.InputManager.Sources.KEYBOARD] && !target._inputMetadata[pd.InputManager.EVENT_KEY_DOWN] && !target._inputMetadata[pd.InputManager.EVENT_KEY_UP]) {
            cc.eventManager.removeListener(target._inputMetadata[pd.InputManager.Sources.KEYBOARD]);
            delete target._inputMetadata[pd.InputManager.Sources.KEYBOARD];
        }
    },

    /**
     * Ativa o acelerômetro.
     * @param target {cc.Node}
     * @private
     */
    _activateAccelerometer: function(target) {
        if(!cc.sys.isMobile || target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER])
            return;

        cc.inputManager.setAccelerometerInterval(1/10);
        cc.inputManager.setAccelerometerEnabled(true);

        target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER] = cc.EventListener.create({
            event:cc.EventListener.ACCELERATION,

            callback: function(acc, event) {
                pd.inputManager.setEventMetadata("_accelerometerMeta", acc, event);
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.EVENT_ACCELEROMETER, pd.inputManager._accelerometerMeta);
                return true;
            }
        });

        this._addListener(target, target._inputMetadata[pd.InputManager.Sources.KEYBOARD]);
    },

    /**
     * Desativa o acelerômetro.
     * @param target {cc.Node}
     * @private
     */
    _deactivateAccelerometer: function(target) {
        if(target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER] && !target._inputMetadata[pd.InputManager.EVENT_ACCELEROMETER]) {
            cc.eventManager.removeListener(target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER]);
            delete target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER];
        }
    }
});

/**
 * Obtém a instância singleton da classe.
 * @function
 * @public
 * @static
 * @returns {pd.InputManager}
 */
pd.InputManager.getInstance = function () {
    if (pd.InputManager.prototype._singleton == null) {
        pd.InputManager.prototype._singleton = new pd.InputManager();
    }
    else {
        throw new Error("[pd.InputManager] Tentando instanciar um objeto singleton mais de uma vez!");
    }
    return pd.InputManager.prototype._singleton;
};

/**
 * @type pd.InputManager
 */
pd.inputManager = pd.InputManager.getInstance();

/**
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_MOUSE_DOWN = "eventTypeMouseDown";

/**
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_MOUSE_HOVER = "eventMouseHover";

/**
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_MOUSE_PAN = "eventMousePan";

/**
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_MOUSE_MOVE = "eventTypeMouseMove";

/**
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_MOUSE_SCROLL = "eventMouseScroll";

/**
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_MOUSE_UP = "eventTypeMouseUp";

/**
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_KEY_DOWN = "eventTypeKeyDown";

/**
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_KEY_UP = "eventTypeKeyUp";

/**
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_ACCELEROMETER = "eventTypeAccelerometer";

/**
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_BUTTON_PRESSED = "eventButtonPress";

/**
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_BUTTON_RELEASED = "eventButtonReleased";

/**
 * Fontes de input disponíveis.
 * @enum {String}
 */
pd.InputManager.Sources = {
    MOUSE: "inputSourceMouse",
    KEYBOARD: "inputSourceKeyboard",
    ACCELEROMETER: "inputSourceAccelerometer",
    BUTTON: "inputSourceButton"
};

