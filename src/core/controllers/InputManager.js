/**
 * Created by Ryan Balieiro on 05/06/17.
 *
 * @class
 * @extends {cc.Class}
 * @classdesc Objeto singleton responsável por gerenciar os listeners de inputs da aplicação. <br >
 */
pd.InputManager = cc.Class.extend({/**@lends pd.InputManager#*/
    /**
     * Apontamento singleton para a instância única do objeto.
     * @type {pd.InputManager}
     */
    _singleton: null,

    /**
     * @type {Number[]}
     */
    pressedKeys: null,

    /**
     * @constructs
     */
    ctor: function () {
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
    config: function (target, allowMultiTouch, touchEventTypeCode, priority, autoConvertWASDToArrowKeys) {
        if (!target._inputMetadata)
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
    setAutoConvertWASDToArrowKeys: function (target, autoConvertWASDToArrowKeys) {
        if (!target._inputMetadata)
            target._inputMetadata = {};

        target._inputMetadata.autoConvertWASDToArrowKeys = autoConvertWASDToArrowKeys;
    },

    /**
     * Seta um listener de evento para o alvo informado.
     * @param {pd.InputManager.Events} eventType - tipo do evento.
     * @param {*} target - o objeto que dispara o evento.
     * @param {Function|String} [handlerFunc] - a função a ser invocada pelo objeto que escuta o evento.
     * @param {*} [handler=null] - o objeto que escuta o evento. Caso seja null, o target será utilizado como handler.
     * @returns {cc.EventListener} - O listener criado
     */
    add: function (eventType, target, handlerFunc, handler) {
        if (!target._inputMetadata)
            target._inputMetadata = {};

        const metadata = target._inputMetadata;
        if (!metadata[eventType])
            metadata[eventType] = [];
        metadata[eventType].push({handler: handler ? handler : target, handlerFunc:handlerFunc || function() {}});
        return this._checkInputSources(target, eventType, true);
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
    hasListener: function (eventType, target) {
        const metadata = target._inputMetadata;
        return metadata[eventType];
    },

    /**
     * Remove um listener de evento.
     * @param {pd.InputManager.Events} eventType - tipo do evento
     * @param {*} target - o objeto que dispara o evento.
     * @param {Function|String} [handlerFunc] - a função sendo invocada pelo objeto que escuta o evento.
     */
    remove: function (eventType, target, handlerFunc) {
        if (!target._inputMetadata)
            return;

        const metadata = target._inputMetadata;
        if (metadata[eventType]) {
            if (handlerFunc) {
                for (var i in metadata[eventType]) {
                    if (metadata[eventType][i].handlerFunc == handlerFunc)
                        delete metadata[eventType][i];
                }
            }
            else {
                delete metadata[eventType];
            }
            this._checkInputSources(target, eventType, false)
        }
    },

    /**
     * Remove todos os listeners do node informado.
     * @param {*} target
     */
    clean: function (target) {
        const metadata = target._inputMetadata;
        for (var i in metadata) {
            if (metadata[i].hasOwnProperty("length") && metadata[i][0] && metadata[i][0].hasOwnProperty("handler")) {
                this.remove(i, target);
            }
        }

        target._inputMetadata = null;
    },

    /**
     * Reseta variáveis do inputManager
     */
    reset: function () {
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
     * @returns {cc.EventListener} - O listener criado
     */
    _addListener: function (target, listener) {
        cc.eventManager.addListener(listener, target);
        if (target._inputMetadata.priority)
            cc.eventManager.setPriority(listener, target._inputMetadata.priority);
        return listener;
    },

    /**
     * Realiza um callback de um listener.
     * @param {*} target
     * @param {pd.InputManager.Events} eventType
     * @param args
     */
    call: function (target, eventType, args) {
        if (!target._inputMetadata[eventType])
            return;

        const metadata = target._inputMetadata[eventType];
        for (var i in metadata) {
            if (typeof metadata[i].handlerFunc == "string") {
                metadata[i].handler[metadata[i].handlerFunc].apply(metadata[i].handler, args);
            }
            else {
                metadata[i].handlerFunc.apply(metadata[i].handler, args);
            }
        }
    },

    /**
     * Adiciona/remove um listener ao objeto, dependendo do tipo do evento informado.
     * @param {*} target
     * @param {pd.InputManager.Events} eventType
     * @param {Boolean} didAddCallback
     * @returns {* | cc.EventListener} - O listener criado (apenas para criação)
     * @private
     */
    _checkInputSources: function (target, eventType, didAddCallback) {
        if (eventType.lastIndexOf("Mouse") != -1) {
            if (!target._inputMetadata[pd.InputManager.Sources.MOUSE]) {
                return this[didAddCallback ? "_activateMouse" : "_deactivateMouse"](target);
            }
        }
        else if (eventType.lastIndexOf("Key") != -1) {
            if (!target._inputMetadata[pd.InputManager.Sources.KEYBOARD]) {
                return this[didAddCallback ? "_activateKeyboard" : "_deactivateKeyboard"](target);
            }
        }
        else if (eventType.lastIndexOf("Accelerometer") != -1) {
            if (!target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER]) {
                return this[didAddCallback ? "_activateAccelerometer" : "_deactivateAccelerometer"](target);
            }
        }
    },

    /**
     * Recicla o array de metadados pré-alocado de um evento anterior para economizar memória.
     * @param {String} arr
     * @param {...*} argv
     */
    setEventMetadata: function (arr, argv) {
        if (!this[arr])
            this[arr] = [];

        for (var i = 1; i < arguments.length; i++) {
            this[arr][i - 1] = arguments[i];
        }
    },

    /**
     * Ativa o mouse.
     * @param {*} target
     * @private
     * @returns {cc.EventListener | cc._EventListenerMouse | cc._EventListenerTouchOneByOne | cc._EventListenerTouchAllAtOnce} - O listener criado
     */
    _activateMouse: function (target) {
        if (target._inputMetadata[pd.InputManager.Sources.MOUSE])
            return target._inputMetadata[pd.InputManager.Sources.MOUSE];

        if (cc.sys.isMobile) {
            if (target._inputMetadata.touchEventTypeCode != cc.EventListener.TOUCH_ALL_AT_ONCE)
                this._setMouseAsTouchOneByOne(target);
            else
                this._setMouseAsTouchAllAtOnce(target)
        }
        else {
            this._setMouse(target);
        }

        return this._addListener(target, target._inputMetadata[pd.InputManager.Sources.MOUSE]);
    },

    /**
     * Cria um evento de mouse para o mobile na configuração touch one by one.
     * @param {*} target
     * @private
     */
    _setMouseAsTouchOneByOne: function (target) {
        target._inputMetadata[pd.InputManager.Sources.MOUSE] = cc.EventListener.create({
            event: target._inputMetadata.touchEventTypeCode ? target._inputMetadata.touchEventTypeCode : cc.EventListener.TOUCH_ONE_BY_ONE,
            /**
             *
             * @param {cc.Touch} touch
             * @param {cc.EventTouch} event
             * @returns {boolean}
             */
            onTouchBegan: function (touch, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touch, event);
                if (target._inputMetadata.allowMultiTouch || touch.getID() == 0)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_DOWN, pd.inputManager._mouseMeta);
                return true;
            },
            /**
             *
             * @param {cc.Touch} touch
             * @param {cc.EventTouch} event
             * @returns {boolean}
             */
            onTouchMoved: function (touch, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touch, event);
                if (target._inputMetadata.allowMultiTouch || touch.getID() == 0)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_MOVE, pd.inputManager._mouseMeta);
                return true;
            },
            /**
             *
             * @param {cc.Touch} touch
             * @param {cc.EventTouch} event
             * @returns {boolean}
             */
            onTouchEnded: function (touch, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touch, event);
                if (target._inputMetadata.allowMultiTouch || touch.getID() == 0)
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
    _setMouseAsTouchAllAtOnce: function (target) {
        target._inputMetadata[pd.InputManager.Sources.MOUSE] = cc.EventListener.create({
            event: target._inputMetadata.touchEventTypeCode ? target._inputMetadata.touchEventTypeCode : cc.EventListener.TOUCH_ONE_BY_ONE,
            /**
             *
             * @param {cc.Touch[]} touches
             * @param {cc.EventTouch} event
             * @returns {boolean}
             */
            onTouchesBegan: function (touches, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touches, event);
                if (target._inputMetadata.allowMultiTouch || touches.length == 1)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_DOWN, pd.inputManager._mouseMeta);
                return true;
            },
            /**
             *
             * @param {cc.Touch[]} touches
             * @param {cc.EventTouch} event
             * @returns {boolean}
             */
            onTouchesMoved: function (touches, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touches, event);
                if (target._inputMetadata.allowMultiTouch || touches.length == 1)
                    pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_MOVE, pd.inputManager._mouseMeta);
                return true;
            },
            /**
             *
             * @param {cc.Touch[]} touches
             * @param {cc.EventTouch} event
             * @returns {boolean}
             */
            onTouchesEnded: function (touches, event) {
                pd.inputManager.setEventMetadata("_mouseMeta", touches, event);
                if (target._inputMetadata.allowMultiTouch || touches.length == 1)
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
    _setMouse: function (target) {
        target._inputMetadata[pd.InputManager.Sources.MOUSE] = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            /**
             *
             * @param {cc.EventMouse} event
             * @returns {boolean}
             */
            onMouseDown: function (event) {
                pd.inputManager.setEventMetadata("_mouseMeta", event);
                switch (event.getButton()) {
                    case 0:
                        pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_DOWN, pd.inputManager._mouseMeta);
                        break;
                    case 1:
                        pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_MIDDLE_DOWN, pd.inputManager._mouseMeta);
                        break;
                    case 2:
                        pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_RIGHT_DOWN, pd.inputManager._mouseMeta);
                        break;
                }
                return true;
            },
            /**
             *
             * @param {cc.EventMouse} event
             * @returns {boolean}
             */
            onMouseMove: function (event) {
                pd.inputManager.setEventMetadata("_mouseMeta", event);
                switch (event.getButton()) {
                    case null:
                        pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_HOVER, pd.inputManager._mouseMeta);
                        break;
                    case 0:
                        pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_MOVE, pd.inputManager._mouseMeta);
                        break;
                }
                return true;
            },
            /**
             *
             * @param {cc.EventMouse} event
             * @returns {boolean}
             */
            onMouseScroll: function (event) {
                pd.inputManager.setEventMetadata("_mouseMeta", event);
                if (cc.sys.os === cc.sys.OS_OSX) { // rolagem natural.
                    event.setScrollData(event.getScrollX(), -event.getScrollY());
                }
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_SCROLL, pd.inputManager._mouseMeta);
                return true;
            },
            /**
             *
             * @param {cc.EventMouse} event
             * @returns {boolean}
             */
            onMouseUp: function (event) {
                pd.inputManager.setEventMetadata("_mouseMeta", event);
                switch (event.getButton()) {
                    case 0:
                        pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_UP, pd.inputManager._mouseMeta);
                        break;
                    case 1:
                        pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_MIDDLE_UP, pd.inputManager._mouseMeta);
                        break;
                    case 2:
                        pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.MOUSE_RIGHT_UP, pd.inputManager._mouseMeta);
                        break;
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
    _deactivateMouse: function (target) {
        if (target._inputMetadata[pd.InputManager.Sources.MOUSE]
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
     * @returns {cc.EventListener | cc._EventListenerKeyboard} - O listener criado
     */
    _activateKeyboard: function (target) {
        if (cc.sys.isMobile || target._inputMetadata[pd.InputManager.Sources.KEYBOARD])
            return target._inputMetadata[pd.InputManager.Sources.KEYBOARD];

        target._inputMetadata[pd.InputManager.Sources.KEYBOARD] = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            /**
             *
             * @param {number} keyCode
             * @param {cc.EventKeyboard} event
             * @returns {boolean}
             */
            onKeyPressed: function (keyCode, event) {
                keyCode = pd.inputManager._parseKeyCode(event.getCurrentTarget(), keyCode);
                pd.inputManager._setKeyPressed(keyCode);
                pd.inputManager.setEventMetadata("_keyboardMeta", keyCode, event);
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.KEY_DOWN, pd.inputManager._keyboardMeta);
                return true;
            },
            /**
             *
             * @param {number} keyCode
             * @param {cc.EventKeyboard} event
             * @returns {boolean}
             */
            onKeyReleased: function (keyCode, event) {
                keyCode = pd.inputManager._parseKeyCode(event.getCurrentTarget(), keyCode);
                pd.inputManager._setKeyReleased(keyCode);
                pd.inputManager.setEventMetadata("_keyboardMeta", keyCode, event);
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.KEY_UP, pd.inputManager._keyboardMeta);
                return true;
            }
        });

        return this._addListener(target, target._inputMetadata[pd.InputManager.Sources.KEYBOARD]);
    },

    /**
     * Parseia um keyCode proveniente de um evento de teclado.
     * @param target {Object}
     * @param keyCode {Number}
     * @private
     */
    _parseKeyCode: function (target, keyCode) {
        if (!target._inputMetadata.autoConvertWASDToArrowKeys)
            return keyCode;

        switch (keyCode) {
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
    clearPressedKeys: function () {
        this.pressedKeys = [];
    },

    /**
     * Verifica se a tecla está pressionada no momento
     * @param {Number} keyCode - O código da tecla
     * @returns {boolean}
     */
    isKeyPressed: function (keyCode) {
        return this.pressedKeys.lastIndexOf(keyCode) >= 0;
    },

    /**
     * Força o estado de 'pressionado' da tecla para true ou false.
     * @param {Number} keyCode - o key code da tecla.
     * @param {Boolean} pressed
     */
    forceToggleKeyStatus: function (keyCode, pressed) {
        if (pressed)
            this._setKeyPressed(keyCode)
        else
            this._setKeyReleased(keyCode);
    },

    /**
     * Registra no vetor de teclas pressionadas o pressionar da tecla
     * @param {Number} keyCode
     * @private
     */
    _setKeyPressed: function (keyCode) {
        if (this.pressedKeys.lastIndexOf(keyCode) < 0) {
            this.pressedKeys.push(keyCode);
        }
    },

    /**
     * Registra no vetor de teclas pressionadas o liberar da tecla
     * @param {Number} keyCode
     * @private
     */
    _setKeyReleased: function (keyCode) {
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
    _deactivateKeyboard: function (target) {
        if (target._inputMetadata[pd.InputManager.Sources.KEYBOARD] && !target._inputMetadata[pd.InputManager.Events.KEY_DOWN] && !target._inputMetadata[pd.InputManager.Events.KEY_UP]) {
            cc.eventManager.removeListener(target._inputMetadata[pd.InputManager.Sources.KEYBOARD]);
            delete target._inputMetadata[pd.InputManager.Sources.KEYBOARD];
        }
    },

    /**
     * Ativa o acelerômetro.
     * @param {cc.Node} target
     * @private
     * @returns {cc.EventListener | cc._EventListenerAcceleration} - O listener criado
     */
    _activateAccelerometer: function (target) {
        if (!cc.sys.isMobile || target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER])
            return target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER];

        cc.inputManager.setAccelerometerInterval(1 / 10);
        cc.inputManager.setAccelerometerEnabled(true);

        target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER] = cc.EventListener.create({
            event: cc.EventListener.ACCELERATION,
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
            callback: function (acc, event) {
                pd.inputManager._parseAcc(acc, this);
                pd.inputManager.setEventMetadata("_accelerometerMeta", acc, event);
                pd.inputManager.call(event.getCurrentTarget(), pd.InputManager.Events.ACCELEROMETER, pd.inputManager._accelerometerMeta);
                return true;
            }
        });

        return this._addListener(target, target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER]);
    },

    /**
     * Desativa o acelerômetro.
     * @param {cc.Node} target
     * @private
     */
    _deactivateAccelerometer: function (target) {
        if (target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER] && !target._inputMetadata[pd.InputManager.Events.ACCELEROMETER]) {
            cc.eventManager.removeListener(target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER]);
            delete target._inputMetadata[pd.InputManager.Sources.ACCELEROMETER];
        }
    },

    /**
     * Converte os valores de acc, para casos como os do Android, onde o acelerômetro é absoluto (não inverte ao inverter o aparelho)
     * @param acc {cc.Acceleration}
     */
    _parseAcc: function (acc, listener) {
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            if (cc.ENGINE_VERSION.lastIndexOf("3.17") < 0 && //commit 09d73ae da cocos2d-x realizou essa correção
                pd.natives.callNative("getRotation", null, pd.natives.JavaTypes.INT) >= 2) {
                acc.x = -acc.x;
                acc.y = -acc.y;
            }
        }
    }
});

/**
 * @type {pd.InputManager}
 */
pd.inputManager = pd.generateSingleton(pd.InputManager);

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
