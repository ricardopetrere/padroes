/**
 * Created by Ryan Balieiro on 05/06/17.
 *
 * @class
 * @extends {cc.Class}
 * @classdesc Objeto singleton responsável por gerenciar os listeners de inputs da aplicação. <br >
 *            Pendência: transformar os tipos de evento em um enumerador.
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
     * @param {*} target - o node a ser configurado.
     * @param {Boolean} [allowMultiTouch=false] - indica se os eventos de toque do node aceitam o recurso de multitouch.
     * @param {cc.EventListener.TOUCH_ALL_AT_ONCE|cc.EventListener.TOUCH_ONE_BY_ONE} [touchEventTypeCode] - indica o tipo de evento que os eventos de toque do node devem possuir.
     * @param {Number} [priority=0] - a prioridade que os listeners do node devem assumir.
     * @param {Boolean} [autoConvertWASDToArrowKeys=false] - indica se os eventos de teclado do objeto devem converter automaticamente as teclas WASD para Arrow Keys.
     */
    config: function(target, allowMultiTouch, touchEventTypeCode, priority, autoConvertWASDToArrowKeys) {
        if(!target._inputMetadata)
            target._inputMetadata = {};

        const metadata = target._inputMetadata;
        metadata.allowMultiTouch = allowMultiTouch;
        metadata.touchEventTypeCode = touchEventTypeCode;
        metadata.priority = priority;
        metadata.autoConvertWASDToArrowKeys = autoConvertWASDToArrowKeys;
    },

    /**
     * Configura o input de teclado do objeto informado.
     * @param {*} target - o node a ser configurado.
     * @param {Boolean} autoConvertWASDToArrowKeys - indica se os eventos de teclado do objeto devem converter automaticamente as teclas WASD para Arrow Keys.
     */
    setAutoConvertWASDToArrowKeys: function(target, autoConvertWASDToArrowKeys) {
        if(!target._inputMetadata)
            target._inputMetadata = {};

        target._inputMetadata.autoConvertWASDToArrowKeys = autoConvertWASDToArrowKeys;
    },

    /**
     * Seta um listener de evento para o álvo informado.
     * @param {String} eventType - tipo do evento.
     * @param {*} target - o objeto que dispara o evento.
     * @param {Function|String} handlerFunc - a função a ser invocada pelo objeto que escuta o evento.
     * @param {*} [handler=null] - o objeto que escuta o evento. Caso seja null, o target será utilizado como handler.
     */
    add: function(eventType, target, handlerFunc, handler) {
        if(!target._inputMetadata)
            target._inputMetadata = {};

        const metadata = target._inputMetadata;
        if(metadata[eventType])
            cc.log("[pd.InputManager] Aviso: tentando attachar dois callbacks a um mesmo tipo de evento para um mesmo target (não recomendado): " + eventType);
        metadata[eventType] = {handler: handler ? handler : target, handlerFunc:handlerFunc};
        this._checkInputSources(target, eventType, true);
    },

    /**
     * Verifica se o node possui um listener para o tipo de evento indicado.
     * @param {String} eventType - tipo do evento.
     * @param {*} target - o objeto que dispara o evento.
     * @returns {Boolean}
     */
    hasListener: function(eventType, target) {
        const metadata = target._inputMetadata;
        return metadata[eventType] ? true : false;
    },

    /**
     * Sobrescreve a função de callback de um listener.
     * @param {String} eventType - tipo do evento.
     * @param {*} target - o objeto que dispara o evento.
     * @param {Function|String} newHandlerFunc - a função a ser invocada pelo objeto que escuta o evento.
     * @param {*} [newHandler=null] - o objeto que escuta o evento. Caso seja null, o target será utilizado como handler.
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
     * @param {String} eventType - tipo do evento
     * @param {*} target - o objeto que dispara o evento.
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
     * @param {*} target
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
     * @param {cc.Node} target
     * @param {cc.EventListener} listener
     */
    _addListener: function(target, listener) {
        cc.eventManager.addListener(listener, target);
        if(target._inputMetadata.priority)
            cc.eventManager.setPriority(listener, target._inputMetadata.priority)
    },

    /**
     * Realiza um callback de um listener.
     * @param {*} target
     * @param {String} eventType
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
     * @param {*} target
     * @param {String} eventType
     * @param {Boolean} didAddCallback
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
        else if(eventType.lastIndexOf("Accelerometer") != -1) {
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
     * @param {*} target
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
     * Cria um evento de mouse para o mobile na configuração touch one by one.
     * @param {*} target
     * @private
     */
    _setMouseAsTouchOneByOne: function(target) {
        target._inputMetadata[pd.InputManager.Sources.MOUSE] = cc.EventListener.create({
            event: target._inputMetadata.touchEventTypeCode ? target._inputMetadata.touchEventTypeCode : cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touch, event);
                if(target._inputMetadata.allowMultiTouch || touch.getID() == 0)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_DOWN, pd.inputManager._mouseMeta);
                return true;
            },
            onTouchMoved: function (touch, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touch, event);
                if(target._inputMetadata.allowMultiTouch || touch.getID() == 0)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_MOVE, pd.inputManager._mouseMeta);
                return true;
            },
            onTouchEnded: function (touch, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touch, event);
                if(target._inputMetadata.allowMultiTouch || touch.getID() == 0)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_UP, pd.inputManager._mouseMeta);
                return true;
            }
        });
    },

    /**
     * Cria um evento de mouse para o mobile na configuração touch all at once.
     * @param {*} target
     * @private
     */
    _setMouseAsTouchAllAtOnce: function(target) {
        target._inputMetadata[pd.InputManager.Sources.MOUSE] = cc.EventListener.create({
            event: target._inputMetadata.touchEventTypeCode ? target._inputMetadata.touchEventTypeCode : cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchesBegan: function (touches, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touches, event);
                if(target._inputMetadata.allowMultiTouch || touches.length == 1)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_DOWN, pd.inputManager._mouseMeta);
                return true;
            },
            onTouchesMoved: function (touches, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touches, event);
                if(target._inputMetadata.allowMultiTouch || touches.length == 1)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_MOVE, pd.inputManager._mouseMeta);
                return true;
            },
            onTouchesEnded: function (touches, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touches, event);
                if(target._inputMetadata.allowMultiTouch || touches.length == 1)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_UP, pd.inputManager._mouseMeta);
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
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_DOWN, pd.inputManager._mouseMeta);
                return true;
            },
            onMouseMove: function (event) {
                pd.inputManager.setEventMetadata("_mouseMeta", event);
                const btn = event.getButton();
                switch(btn) {
                    case null: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_HOVER, pd.inputManager._mouseMeta); break;
                    case 0: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_MOVE, pd.inputManager._mouseMeta); break;
                    case 1: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_PAN, pd.inputManager._mouseMeta); break;
                }
                return true;
            },
            onMouseScroll: function(event) {
                pd.inputManager.setEventMetadata("_mouseMeta", event);
                if (cc.sys.os === cc.sys.OS_OSX) { // rolagem natural.
                    event.setScrollData(event.getScrollX(), -event.getScrollY());
                }
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_SCROLL, pd.inputManager._mouseMeta);
                return true;
            },
            onMouseUp: function (event) {
                pd.inputManager.setEventMetadata("_mouseMeta", event);
                if (event.getButton() == 0)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_UP, pd.inputManager._mouseMeta);
                return true;
            }
        });
    },

    /**
     * Desativa o mouse.
     * @param {*} target
     * @private
     */
    _deactivateMouse: function(target) {
        if(target._inputMetadata[pd.InputManager.Sources.MOUSE] && !target._inputMetadata[pd.InputManager.Events.MOUSE_DOWN] && !target._inputMetadata[pd.InputManager.Events.MOUSE_MOVE] && !target._inputMetadata[pd.InputManager.Events.MOUSE_SCROLL] && !target._inputMetadata[pd.InputManager.Events.MOUSE_UP]) {
            cc.eventManager.removeListener(target._inputMetadata[pd.InputManager.Sources.MOUSE]);
            delete target._inputMetadata[pd.InputManager.Sources.MOUSE];
        }
    },

    /**
     * Ativa o teclado.
     * @param {*} target
     * @private
     */
    _activateKeyboard: function(target) {
        if(cc.sys.isMobile || target._inputMetadata[pd.InputManager.Sources.KEYBOARD])
            return;

        target._inputMetadata[pd.InputManager.Sources.KEYBOARD] = {
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event) {
                keyCode = pd.inputManager._parseKeyCode(event.getCurrentTarget(), keyCode);
                pd.inputManager.setEventMetadata("_keyboardMeta", keyCode, event);
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.KEY_DOWN, pd.inputManager._keyboardMeta);
                return true;
            },
            onKeyReleased: function(keyCode, event) {
                keyCode = pd.inputManager._parseKeyCode(event.getCurrentTarget(), keyCode);
                pd.inputManager.setEventMetadata("_keyboardMeta", keyCode, event);
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.KEY_UP, pd.inputManager._keyboardMeta);
                return true;
            }
        };

        this._addListener(target, target._inputMetadata[pd.InputManager.Sources.KEYBOARD]);
    },

    /**
     * Parseia um keyCode proveniente de um evento de teclado.
     * @param keyCode {Number}
     * @private
     */
    _parseKeyCode: function(target, keyCode) {
        if(!target._inputMetadata.autoConvertWASDToArrowKeys)
            return keyCode;

        switch(keyCode) {
            case cc.KEY.a: return pd.Keys.LEFT;
            case cc.KEY.s: return pd.Keys.DOWN;
            case cc.KEY.d: return pd.Keys.RIGHT;
            case cc.KEY.w: return pd.Keys.UP;
        }

        return keyCode;
    },

    /**
     * Verifica se o target não possui mais callbacks à eventos de teclado e, caso isso se confirme, remove o evento.
     * @param {*} target
     * @private
     */
    _deactivateKeyboard: function(target) {
        if(target._inputMetadata[pd.InputManager.Sources.KEYBOARD] && !target._inputMetadata[pd.InputManager.Events.KEY_DOWN] && !target._inputMetadata[pd.InputManager.Events.KEY_UP]) {
            cc.eventManager.removeListener(target._inputMetadata[pd.InputManager.Sources.KEYBOARD]);
            delete target._inputMetadata[pd.InputManager.Sources.KEYBOARD];
        }
    },

    /**
     * Ativa o acelerômetro.
     * @param {cc.Node} target
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
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.ACCELEROMETER, pd.inputManager._accelerometerMeta);
                return true;
            }
        });

        this._addListener(target, target._inputMetadata[pd.InputManager.Sources.KEYBOARD]);
    },

    /**
     * Desativa o acelerômetro.
     * @param {cc.Node} target
     * @private
     */
    _deactivateAccelerometer: function(target) {
        if(target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER] && !target._inputMetadata[pd.InputManager.Events.ACCELEROMETER]) {
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
 * Atalho para facilitar a chamada ao método.
 * @param {String} eventType - tipo do evento.
 * @param {*} target - o objeto que dispara o evento.
 * @param {Function|String} handlerFunc - a função a ser invocada pelo objeto que escuta o evento.
 * @param {*} [handler=null] - o objeto que escuta o evento. Caso seja null, o target será utilizado como handler.
 */
pd.addInput = function(eventType, target, handlerFunc, handler) {
    pd.inputManager.add(eventType, target, handlerFunc, handler);
};

/**
 * @enum {String}
 */
pd.InputManager.Events = {
    MOUSE_DOWN: "eventTypeMouseDown",
    MOUSE_HOVER: "eventMouseHover",
    MOUSE_PAN: "eventMousePan",
    MOUSE_MOVE: "eventTypeMouseMove",
    MOUSE_SCROLL: "eventMouseScroll",
    MOUSE_UP: "eventTypeMouseUp",
    KEY_DOWN: "eventTypeKeyDown",
    KEY_UP: "eventTypeKeyUp",
    ACCELEROMETER: "eventTypeAccelerometer",
    BUTTON_PRESSED: "eventButtonPress",
    BUTTON_RELEASED: "eventButtonReleased",
    JOYSTICK_STATUS: "eventJoystickStatus"
};

/**
 * Fontes de input disponíveis.
 * @enum {String}
 */
pd.InputManager.Sources = {
    MOUSE: "inputSourceMouse",
    KEYBOARD: "inputSourceKeyboard",
    ACCELEROMETER: "inputSourceAccelerometer",
    BUTTON: "inputSourceButton",
    JOYSTICK: "inputSourceJoystick"
};
