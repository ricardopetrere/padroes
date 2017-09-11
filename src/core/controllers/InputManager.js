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
     * @type {Number[]}
     */
    pressedKeys: null,

    /**
     * @constructs
     */
    ctor: function() {
        this.pressedKeys = [];
    },

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
     * @param {pd.InputManager.Events} eventType - tipo do evento.
     * @param {*} target - o objeto que dispara o evento.
     * @param {Function|String} handlerFunc - a função a ser invocada pelo objeto que escuta o evento.
     * @param {*} [handler=null] - o objeto que escuta o evento. Caso seja null, o target será utilizado como handler.
     */
    add: function(eventType, target, handlerFunc, handler) {
        if(!target._inputMetadata)
            target._inputMetadata = {};

        const metadata = target._inputMetadata;
        if(metadata[eventType])
            cc.warn("[pd.InputManager] Aviso: tentando attachar dois callbacks a um mesmo tipo de evento para um mesmo target (não recomendado): " + eventType);
        metadata[eventType] = {handler: handler ? handler : target, handlerFunc:handlerFunc};
        this._checkInputSources(target, eventType, true);
    },

    /**
     *
     * @param {pd.InputManager.Sources} sourceType
     * @param {*} target
     * @returns {cc.EventListener}
     */
    getListener: function (sourceType, target) {
        return target._inputMetadata[sourceType];
    },

    /**
     * Verifica se o node possui um listener para o tipo de evento indicado.
     * @param {pd.InputManager.Events} eventType - tipo do evento.
     * @param {*} target - o objeto que dispara o evento.
     * @returns {Boolean}
     */
    hasListener: function(eventType, target) {
        const metadata = target._inputMetadata;
        return metadata[eventType] ? true : false;
    },

    /**
     * Sobrescreve a função de callback de um listener.
     * @param {pd.InputManager.Events} eventType - tipo do evento.
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
     * @param {pd.InputManager.Events} eventType - tipo do evento
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
     * Reseta variáveis do inputManager
     */
    reset: function() {
        this.clearPressedKeys();
    },

    /**
     * Pausa os listeners do objeto
     * @param {*} target
     */
    pauseListeners: function (target) {
        var fnc = function (listener) {
            if (listener) {
                listener.setEnabled(false);
            }
        };
        fnc(target._inputMetadata[pd.InputManager.Sources.MOUSE]);
        fnc(target._inputMetadata[pd.InputManager.Sources.KEYBOARD]);
        fnc(target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER]);
    },
    /**
     * Reativa os listeners do objeto
     * @param {*} target
     */
    resumeListeners: function (target) {
        var fnc = function (listener) {
            if (listener) {
                listener.setEnabled(true);
            }
        };
        fnc(target._inputMetadata[pd.InputManager.Sources.MOUSE]);
        fnc(target._inputMetadata[pd.InputManager.Sources.KEYBOARD]);
        fnc(target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER]);
    },

    /**
     * Adiciona um listener a um cc.Node.
     * @param {*} target
     * @param {cc.EventListener} listener
     */
    _addListener: function(target, listener) {
        cc.eventManager.addListener(listener, target);
        if(target._inputMetadata.priority)
            cc.eventManager.setPriority(listener, target._inputMetadata.priority);
    },

    /**
     * Realiza um callback de um listener.
     * @param {*} target
     * @param {pd.InputManager.Events} eventType
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
     * @param {pd.InputManager.Events} eventType
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
                switch(event.getButton()) {
                    case 0: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_DOWN, pd.inputManager._mouseMeta); break;
                    case 1: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_MIDDLE_DOWN, pd.inputManager._mouseMeta); break;
                    case 2: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_RIGHT_DOWN, pd.inputManager._mouseMeta); break;
                }
                return true;
            },
            onMouseMove: function (event) {
                pd.inputManager.setEventMetadata("_mouseMeta", event);
                switch(event.getButton()) {
                    case null: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_HOVER, pd.inputManager._mouseMeta); break;
                    case 0: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_MOVE, pd.inputManager._mouseMeta); break;
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
                switch(event.getButton()) {
                    case 0: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_UP, pd.inputManager._mouseMeta); break;
                    case 1: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_MIDDLE_UP, pd.inputManager._mouseMeta); break;
                    case 2: pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_RIGHT_UP, pd.inputManager._mouseMeta); break;
                }
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
        if(target._inputMetadata[pd.InputManager.Sources.MOUSE]
        && !target._inputMetadata[pd.InputManager.Events.MOUSE_DOWN]
        && !target._inputMetadata[pd.InputManager.Events.MOUSE_MIDDLE_DOWN]
        && !target._inputMetadata[pd.InputManager.Events.MOUSE_RIGHT_DOWN]
        && !target._inputMetadata[pd.InputManager.Events.MOUSE_HOVER]
        && !target._inputMetadata[pd.InputManager.Events.MOUSE_MOVE]
        && !target._inputMetadata[pd.InputManager.Events.MOUSE_SCROLL]
        && !target._inputMetadata[pd.InputManager.Events.MOUSE_UP]
        && !target._inputMetadata[pd.InputManager.Events.MOUSE_MIDDLE_UP]
        && !target._inputMetadata[pd.InputManager.Events.MOUSE_RIGHT_UP]) {
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

        target._inputMetadata[pd.InputManager.Sources.KEYBOARD] = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event) {
                keyCode = pd.inputManager._parseKeyCode(event.getCurrentTarget(), keyCode);
                pd.inputManager._setKeyPressed(keyCode);
                pd.inputManager.setEventMetadata("_keyboardMeta", keyCode, event);
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.KEY_DOWN, pd.inputManager._keyboardMeta);
                return true;
            },
            onKeyReleased: function(keyCode, event) {
                keyCode = pd.inputManager._parseKeyCode(event.getCurrentTarget(), keyCode);
                pd.inputManager._setKeyReleased(keyCode);
                pd.inputManager.setEventMetadata("_keyboardMeta", keyCode, event);
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.KEY_UP, pd.inputManager._keyboardMeta);
                return true;
            }
        });

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
     * Limpa o vetor de teclas pressionadas
     */
    clearPressedKeys: function() {
        this.pressedKeys = [];
    },

    /**
     * Verifica se a tecla está pressionada no momento
     * @param {Number} keyCode - O código da tecla
     * @returns {boolean}
     */
    isKeyPressed: function(keyCode) {
        return this.pressedKeys.lastIndexOf(keyCode) >= 0;
    },

    /**
     * Registra no vetor de teclas pressionadas o pressionar da tecla
     * @param {Number} keyCode
     * @private
     */
    _setKeyPressed: function(keyCode) {
        if (this.pressedKeys.lastIndexOf(keyCode) < 0) {
            this.pressedKeys.push(keyCode);
        }
    },

    /**
     * Registra no vetor de teclas pressionadas o liberar da tecla
     * @param {Number} keyCode
     * @private
     */
    _setKeyReleased: function(keyCode) {
        var indexTecla = this.pressedKeys.lastIndexOf(keyCode);
        if (indexTecla >= 0) {
            this.pressedKeys.splice(indexTecla, 1);
        }
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
            /**
             *
             * <p>
             *     Estrutura do objeto acc: <br/>
             *     x -> -1 = girando pra esquerda, 1 = girando pra direita (estilo volante) <br/>
             *     y -> -1 = pra trás, 1 = pra frente (estilo manche) <br/>
             *     z -> -1 = de pé, 1 = de ponta-cabeça <br/>
             *     timestamp -> ex: 55740418829585 <br/>
             *     s: sec, m: msec  sssssmmmmmmmmm <br/>
             * </p>
             * @param acc {cc.Acceleration}
             * @param event {cc.EventAcceleration}
             * @returns {boolean}
             */
            callback: function(acc, event) {
                pd.inputManager._parseAcc(acc, this);
                pd.inputManager.setEventMetadata("_accelerometerMeta", acc, event);
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.ACCELEROMETER, pd.inputManager._accelerometerMeta);
                return true;
            }
        });

        this._addListener(target, target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER]);
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
    },

    /**
     * Converte os valores de acc, para casos como os do Android, onde o acelerômetro é absoluto (não inverte ao inverter o aparelho)
     * @param acc {cc.Acceleration}
    */
    _parseAcc: function(acc, listener) {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            if (pd.natives.callNative("getRotation", null, pd.natives.JavaTypes.INT) >= 2) {
                acc.x = -acc.x;
                acc.y = -acc.y;
            }
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
    MOUSE_MIDDLE_DOWN: "eventTypeMiddleDown",
    MOUSE_RIGHT_DOWN: "eventTypeRightDown",
    MOUSE_HOVER: "eventMouseHover",
    MOUSE_MOVE: "eventTypeMouseMove",
    MOUSE_SCROLL: "eventMouseScroll",
    MOUSE_UP: "eventTypeMouseUp",
    MOUSE_MIDDLE_UP: "eventTypeMouseMiddleUp",
    MOUSE_RIGHT_UP: "eventTypeMouseRightUp",
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
