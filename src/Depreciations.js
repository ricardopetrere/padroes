/**
 * Created by Ryan Balieiro on 23/05/17.
 * Updated by Ricardo Petrére on 14/06/18. - Criados regions pra facilitar a navegação, e colocados warnings ao usar cada um.
 * @desc Listagem de propriedades depreciadas durante alterações dos padrões para manter a compatibilidade com versões antigas.
 */
//region Globais
/**
 * @type {string}
 * @deprecated Desde a versão 3.0.0, usar {@link pd.padroesPath}
 */
this.__defineGetter__("padroesPath", function() {
    cc.warn("[padroesPath] Utilizar pd.padroesPath");
    return pd.padroesPath;
});

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.activeNamespace}.
 * @type {Object}
 */
this.__defineGetter__("activeGameSpace", function() {
    cc.warn("[activeGameSpace] Utilizar pd.delegate.activeNamespace")
    return pd.delegate.activeNamespace;
});

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.isPaused}.
 * @type {boolean}
 */
this.__defineGetter__("isPaused", function() {
    cc.warn("[isPaused] Utilizar pd.delegate.isPaused")
    return pd.delegate.isPaused;
});

/**
 * @deprecated - desde a versao 2.3.
 * @type {number}
 */
this.__defineGetter__("SingletonId_Animacoes", function () {
    cc.warn("[SingletonId_Animacoes] Não utilizar mais objetos pd.Animado. Trocar para pd.Animation");
    return 0;
});

/**
 * @deprecated - desde a versão 2.2 - não utilizar mais este recurso! Utilizar {@link pd.debugMode}, e setar o modo debug via project.json.
 * @type {undefined}
 */
this.__defineGetter__("DebugMode", function() {
    cc.warn("[DebugMode] Não utilizar mais esse recurso! utilizar pd.debugMode e setar o modo debug via project.json");
    return undefined;
});

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.natives.openURL}.
 */
abreLink = function () {
    cc.warn("[abreLink] utilizar pd.natives.openURL");
    pd.natives.openURL.apply(pd.natives, arguments);
}

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.natives.openURL}.
 */
abreLinkIOS = function () {
    cc.warn("[abreLinkIOS] utilizar pd.natives.openURL");
    pd.natives.openURL.apply(pd.natives, arguments);
}

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.validate}.
 */
registrarValidacao = function () {
    cc.warn("[registrarValidacao] utilizar pd.validate");
    pd.validate();
}

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.checkValidation}.
 */
checarValidacao = function () {
    cc.warn("[checarValidacao] utilizar pd.checkValidation");
    return pd.checkValidation();
}

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.res}.
 */
pd.__defineGetter__("resPadrao", function() {
    cc.warn("[pd.resPadrao] utilizar pd.res");
    return pd.res;
});
//endregion
//region Criação antiga de sprites
/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.createSprite}.
 * A função ainda é a mesma, apenas foi dado um nome mais claro à ela.
 */
pd.cObject = function () {
    cc.warn("[pd.cObject] Utilizar pd.createSprite");
    return pd.createSprite.apply(pd, arguments);
}

/**
 * Cria uma sprite.
 * @param {String} spriteName
 * @param {Number} x
 * @param {Number} y
 * @param {cc.Node} parentNode
 * @param {Number} zOrder
 * @param {String} [name]
 * @param {boolean} [addToEditor]
 * @deprecated - Ajustar código e usar {@link pd.createSprite}
 * @returns {cc.Sprite}
 */
pd.legacyCreateSprite = function() {
    cc.warn("[pd.legacyCreateSprite] Utilizar pd.createSprite");
    return pd.createSprite.apply(pd, arguments);
}

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.createText}.
 */
pd.cText = function(x, y, txt, font, size){
    if(typeof txt == "string") {
        cc.warn("Ajustar código e usar pd.createText");
        var obj = pd.createText(font, font, x, y, size, cc.color.BLACK, txt);
        obj.setAnchorPoint(0.5, 1);
        return obj;
    } else {
        cc.warn("Usar pd.createSprite ao invés dessa função.");
        return pd.createSprite(txt, {x: x, y: y, anchorX: 0.5, anchorY: 1});
    }
};
//endregion
//region delegate
/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.init}.
 */
pd.initGlobals = function () {
    cc.warn("[pd.initGlobals] utilizar pd.delegate.init");
    pd.delegate.init();
}

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.pause}.
 */
pd.pausar = function () {
    cc.warn("[pd.pausar] utilizar pd.delegate.pause");
    return pd.delegate.pause.apply(pd.delegate, arguments);
}

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.resume}.
 */
pd.resumar = function () {
    cc.warn("[pd.resumar] utilizar pd.delegate.resume");
    pd.delegate.resume.apply(pd.delegate, arguments);
}

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.retain} ou {@link pd.retain}.
 */
pd.reter = function () {
    cc.warn("[pd.reter] utilizar pd.delegate.retain ou pd.retain");
    pd.delegate.retain.apply(pd, arguments);
}

/**
 * @deprecated - desde a versão 2.2 - não fazer chamadas a essa função - deixar apenas ela para ser manipulada pelo controlador interno.
 */
pd.liberar = function () {
    cc.warn("[pd.liberar] utilizar pd.delegate.releaseAll");
    pd.delegate.releaseAll();
}

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.finish}.
 */
pd.finishGame = function () {
    cc.warn("[pd.finishGame] utilizar pd.delegate.finish");
    pd.delegate.finish();
}

/**
 * Executa a animação de vitória.
 * @param {cc.SpriteFrame} circleSpriteFrame
 * @param {cc.SpriteFrame} messageSpriteFrame
 * @param {Boolean} [tiltScreen=true]
 * @deprecated desde a versão 3.0 - Usar {@link pd.delegate.winGame}
 */
pd.GameScene.prototype.winGame = function(circleSpriteFrame, messageSpriteFrame, tiltScreen) {
    cc.warn("[pd.GameScene.winGame] utilizar pd.delegate.winGame");
    pd.delegate.winGame(circleSpriteFrame, messageSpriteFrame, tiltScreen);
};

/**
 * Executa a animação de derrota.
 * @param {cc.SpriteFrame} circleSpriteFrame
 * @param {Boolean} [tiltScreen=true]
 * @deprecated desde a versão 3.0 - Usar {@link pd.delegate.loseGame}
 */
pd.GameScene.prototype.loseGame = function(circleSpriteFrame, tiltScreen) {
    cc.warn("[pd.GameScene.loseGame] utilizar pd.delegate.loseGame");
    pd.delegate.loseGame(circleSpriteFrame, tiltScreen);
};
//endregion
//region pd.Tutorial e pd.TutorialLayer
/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.Tutorial}.
 */
pd.__defineGetter__("TutorialScene", function(){
    cc.warn("Utilizar pd.Tutorial");
    return pd.Tutorial;
});

/**
 * @deprecated
 */
pd.LegacyTutorialLayer = cc.Layer.extend({/**@lends pd.LegacyTutorialLayer#*/
    accelerometer:null,
    btnArrowUp: null,
    btnArrowDown: null,
    btnArrowLeft:null,
    btnArrowRight:null,
    btnSpace:null,
    arrowKeys:null,
    pointer:null,
    joystick:null,
    isActiveAndRunning:false,
    pageID:-1,

    ctor: function(txt) {
        cc.warn("[pd.LegacyTutorialLayer] Favor ajustar o código e, então, passar a utilizar a nova pd.TutorialLayer");
        this._super();
        this._createBottomText(txt);
    },

    createAccelerometer: function (posX, posY) {
        this.accelerometer = new pd.Animation();
        this.accelerometer.addAnimation('normal', 1, 1, 'accel_lateral');
        this.accelerometer.addAnimation('left', 1, 10, 'accel_lateral');
        this.accelerometer.addAnimation('right', 11, 20, 'accel_lateral');
        this.accelerometer.addAnimation('up', 1, 10, 'accel_vertical');
        this.accelerometer.addAnimation('down', 11, 20, 'accel_vertical');
        this.accelerometer.setPosition(posX, posY);
        this.addChild(this.accelerometer, pd.ZOrders.TUTORIAL_BUTTON);
    },

    createArrowKeys: function(offset) {
        this.btnArrowUp = this._createButton("keyUp", 0, 60);
        this.btnArrowDown = this._createButton("keyDown", 0, 0);
        this.btnArrowLeft = this._createButton("keyLeft", -60, 0);
        this.btnArrowRight = this._createButton("keyRight", 60, 0);

        this.arrowKeys = [this.btnArrowLeft, this.btnArrowUp, this.btnArrowRight, this.btnArrowDown];

        ////////// LEGADO: ///////////////
        this.tecla_cima = this.btnArrowUp;
        this.tecla_esquerda = this.btnArrowLeft;
        this.tecla_baixo = this.btnArrowDown;
        this.tecla_direita = this.btnArrowRight;
        this.vTeclas = this.arrowKeys;
        ///////////////////////////////////

        for(var i = 0; i < this.arrowKeys.length; i++) {
            this.arrowKeys[i].setScale(0.75);
            this.arrowKeys[i].x += offset.x;
            this.arrowKeys[i].y += offset.y;
        }

        return this.arrowKeys;
    },

    createNakedButton: function (posX, posY, sprite) {
        var botao = this._createButton("keyNaked", posX, posY);
        if (sprite) {
            botao.label = sprite;
            botao.label.setPosition(botao.width / 2, botao.height / 2);
            botao.addChild(botao.label, pd.ZOrders.TUTORIAL_BUTTON);
        }
    },

    createPointer:function(initialPosition) {
        var frameName = "mouse" in cc.sys.capabilities ? "seta_" : "dedo_";

        this.pointer = new pd.Animation();
        this.pointer.addAnimation('normal', 1, 1, frameName);
        this.pointer.addAnimation('pressed', 2, 2, frameName);
        this.pointer.setPosition(initialPosition.x, initialPosition.y);
        this.addChild(this.pointer, pd.ZOrders.TUTORIAL_POINTER);
        this.pointer.setAnchorPoint(0,1);
        this.pointer.initialPosition = initialPosition;

        this.ponteiro = this.pointer; //legado
    },

    createSpaceButton: function(posX, posY) {
        this.btnSpace = this._createButton('keySpace', posX, posY);
        this.btnSpace.setScale(0.7);
        return this.btnSpace;
    },

    createJoystick: function(posX, posY) {
        this.joystick = new pd.Joystick({x:posX, y:posY}, false, false, null, null);
        this.addChild(this.joystick);
        return this.joystick;
    },

    _createButton: function(frameName, posX, posY) {
        const btn = new pd.Animation();
        btn.addAnimation('normal', 1, 1, frameName);
        btn.addAnimation('pressed', 2, 2, frameName);
        btn.setPosition(posX, posY);
        this.addChild(btn, pd.ZOrders.TUTORIAL_BUTTON);
        return btn;
    },

    _createBottomText: function(txt) {
        if(!pd.delegate.activeNamespace.tutorialData.txtOffSetY)
            pd.delegate.activeNamespace.tutorialData.txtOffSetY = 0;

        const label = pd.cText(0, 0, txt, "Calibri", 25);
        label.setPosition(512, 140 + pd.delegate.activeNamespace.tutorialData.txtOffSetY);
        this.addChild(label, pd.ZOrders.TUTORIAL_PAGE_BOTTOM_TEXT);
    },

    stop: function() {
        if(this.arrowKeys){
            for(var i = 0; i < 4; i++){
                this.arrowKeys[i].changeAndStop('normal', false);
            }
        }

        if(this.pointer){
            this.pointer.changeAndStop('normal', false);
            this.pointer.x = this.pointer.initialPosition.x;
            this.pointer.y = this.pointer.initialPosition.y;
        }
    },

    run: function() {

    },

    setStatus: function(running, shouldResetAfterStopping) {
        if(running && this.isActiveAndRunning) {
            return;
        }

        this.isActiveAndRunning = running;
        if(!this.isActiveAndRunning) {
            this.cleanup();
            this._cleanAllRunningActions(this);
            this.unscheduleUpdate();
            if(shouldResetAfterStopping != false)
                this.stop();
        }
        else {
            this.run();
        }
    },

    _cleanAllRunningActions: function(node) {
        const children = node.getChildren();

        for(var i = 0; i < children.length ; i++) {
            var child = children[i];
            if(child) {
                child.cleanup();
                this._cleanAllRunningActions(child);
            }
        }
    },

    reset: function() {
        this.setStatus(false);
        this.setStatus(true);
    }
});

/**
 * @deprecated - desde a versão 2.2.
 */
pd.LegacyTutorialLayer.prototype.criarTextoInferior = function (txt) {
    cc.warn("[pd.LegacyTutorialLayer.prototype.criarTextoInferior] Utilizar pd.LegacyTutorialLayer.prototype._createBottomText");
    pd.LegacyTutorialLayer.prototype._createBottomText(txt);
}

/**
 * @deprecated - desde a versão 2.2.
 */
pd.LegacyTutorialLayer.prototype.createTeclas = function (offset) {
    cc.warn("[pd.LegacyTutorialLayer.prototype.createTeclas] Utilizar pd.LegacyTutorialLayer.prototype.createArrowKeys");
    return pd.LegacyTutorialLayer.prototype.createArrowKeys(offset);
}

/**
 * @deprecated - desde a versão 2.2.
 */
pd.LegacyTutorialLayer.prototype.createPonteiro = function (initialPosition) {
    cc.warn("[pd.LegacyTutorialLayer.prototype.createPonteiro] Utilizar pd.LegacyTutorialLayer.prototype.createPointer");
    pd.LegacyTutorialLayer.prototype.createPointer(initialPosition);
}

/**
 * @deprecated - desde a versão 2.6.
 */
pd.LegacyTutorialLayer.prototype.__defineGetter__("tecla_cima", function () {
    cc.warn("[pd.LegacyTutorialLayer.tecla_cima] Utilizar a propriedade btnArrowUp");
    return pd.LegacyTutorialLayer.prototype.btnArrowUp;
});

/**
 * @deprecated - desde a versão 2.6.
 */
pd.LegacyTutorialLayer.prototype.__defineGetter__("tecla_baixo", function () {
    cc.warn("[pd.LegacyTutorialLayer.tecla_baixo] Utilizar a propriedade btnArrowDown");
    return pd.LegacyTutorialLayer.prototype.btnArrowDown;
});

/**
 * @deprecated - desde a versão 2.6.
 */
pd.LegacyTutorialLayer.prototype.__defineGetter__("tecla_esquerda", function () {
    cc.warn("[pd.LegacyTutorialLayer.tecla_esquerda] Utilizar a propriedade btnArrowLeft");
    return pd.LegacyTutorialLayer.prototype.btnArrowLeft;
});

/**
 * @deprecated - desde a versão 2.6.
 */
pd.LegacyTutorialLayer.prototype.__defineGetter__("tecla_direita", function () {
    cc.warn("[pd.LegacyTutorialLayer.tecla_direita] Utilizar a propriedade btnArrowRight");
    return pd.LegacyTutorialLayer.prototype.btnArrowRight;
});

/**
 * @deprecated - desde a versão 2.6.
 */
pd.LegacyTutorialLayer.prototype.__defineGetter__("vTeclas", function () {
    cc.warn("[pd.LegacyTutorialLayer.vTeclas] Utilizar a propriedade arrowKeys");
    return pd.LegacyTutorialLayer.prototype.arrowKeys;
});

/**
 * @deprecated - desde a versão 2.6.
 */
pd.LegacyTutorialLayer.prototype.__defineGetter__("ponteiro", function () {
    cc.warn("[pd.LegacyTutorialLayer.ponteiro] Utilizar a propriedade pointer");
    return pd.LegacyTutorialLayer.prototype.pointer;
});
//endregion
//region debugger
/**
 * @deprecated - desde a versão 2.3 - utilizar a função {@link pd.debugger.addShortcut}.
 * @param {string} targetSceneName
 * @param {Function} callbackFunction
 * @param {Object} callbackCaller
 * @param {*} callbackArguments
 */
pd.Debugger.prototype.addScene = function(targetSceneName, callbackFunction, callbackCaller, callbackArguments) {
    cc.warn("[pd.Debugger.prototype.addScene] Utilizar pd.debugger.addShortcut");
    pd.debugger.addShortcut(targetSceneName, callbackFunction, callbackCaller, callbackArguments);
};

/**
 * @deprecated - desde a versão 2.5 - utilizar {@link pd.Editor.add}
 */
pd.AddToDebugger = function(obj, type, name) {
    cc.warn("[pd.AddToDebugger] Utilizar pd.Editor.add");
    // if (!cc.sys.isNative && pd.debugMode)
    //     pd.Editor.add(obj, type, name);
};
//endregion
//region inputManager
/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.inputManager.add}.
 * @example
 * pd.inputManager.add(pd.InputManager.EVENT_MOUSE_DOWN, this, this.onMouseDown);
 */
pd.setInput = function(layer, eventId, funcToCall, multiTouch) {
    cc.warn("[pd.setInput] utilizar pd.inputManager.add");
    if(multiTouch)
        pd.inputManager.config(layer, true);

    switch(eventId) {
        case 0:
            pd.inputManager.add(pd.InputManager.EVENT_MOUSE_DOWN, layer, funcToCall);
            return layer._inputMetadata[pd.InputManager.EVENT_MOUSE_DOWN];
        case 1:
            pd.inputManager.add(pd.InputManager.EVENT_MOUSE_MOVE, layer, funcToCall);
            return layer._inputMetadata[pd.InputManager.EVENT_MOUSE_MOVE];
        case 2:
            pd.inputManager.add(pd.InputManager.EVENT_MOUSE_UP, layer, funcToCall);
            return layer._inputMetadata[pd.InputManager.EVENT_MOUSE_UP];
        case 3:
            pd.inputManager.add(pd.InputManager.EVENT_ACCELEROMETER, layer, funcToCall);
            return layer._inputMetadata[pd.InputManager.EVENT_ACCELEROMETER];
    }
};

/**
 * @deprecated
 * @type {number}
 */
pd.setInput.__defineGetter__("MOUSE_DOWN", function() {
    cc.warn("[pd.setInput.MOUSE_DOWN] Ajustar código para utilizar pd.inputManager e então utilizar pd.InputManager.Events.MOUSE_DOWN");
    return 0;
});
/**
 * @deprecated
 * @type {number}
 */
pd.setInput.__defineGetter__("MOUSE_MOVE", function() {
    cc.warn("[pd.setInput.MOUSE_MOVE] Ajustar código para utilizar pd.inputManager e então utilizar pd.InputManager.Events.MOUSE_MOVE");
    return 1;
});
/**
 * @deprecated
 * @type {number}
 */
pd.setInput.__defineGetter__("MOUSE_UP", function() {
    cc.warn("[pd.setInput.MOUSE_UP] Ajustar código para utilizar pd.inputManager e então utilizar pd.InputManager.Events.MOUSE_UP");
    return 2;
});
/**
 * @deprecated
 * @type {number}
 */
pd.setInput.__defineGetter__("ACCELEROMETER", function() {
    cc.warn("[pd.setInput.ACCELEROMETER] Ajustar código para utilizar pd.inputManager e então utilizar pd.InputManager.Events.ACCELEROMETER");
    return 3;
});

/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.inputManager.add}.
 * @example
 * pd.inputManager.add(pd.InputManager.EVENT_KEY_DOWN, this, this.onMouseDown);
 */
pd.setKeyboard = function(layer, funcKeyDown, funcKeyUp) {
    cc.warn("[pd.setKeyboard] utilizar pd.inputManager.add");
    pd.inputManager.add(pd.InputManager.EVENT_KEY_DOWN, layer, funcKeyDown);
    pd.inputManager.add(pd.InputManager.EVENT_KEY_UP, layer, funcKeyUp);
};

/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.inputManager.add}.
 */
pd.setMouse = function(layer, funcMouseDown, funcMouseMove, funcMouseUp, multiTouch) {
    cc.warn("[pd.setMouse] utilizar pd.inputManager.add");
    if(multiTouch)
        pd.inputManager.config(layer, true);
    pd.inputManager.add(pd.InputManager.EVENT_MOUSE_DOWN, layer, funcMouseDown);
    pd.inputManager.add(pd.InputManager.EVENT_MOUSE_MOVE, layer, funcMouseMove);
    pd.inputManager.add(pd.InputManager.EVENT_MOUSE_UP, layer, funcMouseUp);
};

/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.inputManager.add}.
 */
pd.setInputForButton = function(layer) {
    cc.warn("[pd.setInputForButton] utilizar pd.inputManager.add");
    pd.inputManager.config(layer, false, cc.EventListener.TOUCH_ALL_AT_ONCE, 1);
    pd.inputManager.add(pd.InputManager.EVENT_MOUSE_DOWN, layer, "onMouseDown");
    pd.inputManager.add(pd.InputManager.EVENT_MOUSE_MOVE, layer, "onMouseDragged");
    pd.inputManager.add(pd.InputManager.EVENT_MOUSE_UP, layer, "onMouseUp");

    pd.inputManager.add(pd.InputManager.EVENT_KEY_DOWN, layer, "keyDown");
    pd.inputManager.add(pd.InputManager.EVENT_KEY_UP, layer, "keyReleased");
};

/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.Joystick.prototype.enable}
 */
pd.setInputForJoystick = function() {
    cc.warn("[pd] Uso de função depreciada: 'setInputForJoystick'. Utilizar a função 'enable()' da instância de seu joystick.");
};

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.__defineGetter__("EVENT_MOUSE_DOWN", function () {
    cc.warn("[pd.InputManager.EVENT_MOUSE_DOWN] Utilizar a referência enumerador pd.InputManager.Events");
    return pd.InputManager.Events.MOUSE_DOWN;
});

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.__defineGetter__("EVENT_MOUSE_HOVER", function () {
    cc.warn("[pd.InputManager.EVENT_MOUSE_HOVER] Utilizar a referência enumerador pd.InputManager.Events");
    return pd.InputManager.Events.MOUSE_HOVER;
});

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.__defineGetter__("EVENT_MOUSE_PAN", function () {
    cc.warn("[pd.InputManager.EVENT_MOUSE_PAN] Esse tipo de evento não existe");
    return null;
});

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.__defineGetter__("EVENT_MOUSE_MOVE", function () {
    cc.warn("[pd.InputManager.EVENT_MOUSE_MOVE] Utilizar a referência enumerador pd.InputManager.Events");
    return pd.InputManager.Events.MOUSE_MOVE;
});

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.__defineGetter__("EVENT_MOUSE_SCROLL", function () {
    cc.warn("[pd.InputManager.EVENT_MOUSE_SCROLL] Utilizar a referência enumerador pd.InputManager.Events");
    return pd.InputManager.Events.MOUSE_SCROLL;
});

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.__defineGetter__("EVENT_MOUSE_UP", function () {
    cc.warn("[pd.InputManager.EVENT_MOUSE_UP] Utilizar a referência enumerador pd.InputManager.Events");
    return pd.InputManager.Events.MOUSE_UP;
});

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.__defineGetter__("EVENT_KEY_DOWN", function () {
    cc.warn("[pd.InputManager.EVENT_KEY_DOWN] Utilizar a referência enumerador pd.InputManager.Events");
    return pd.InputManager.Events.KEY_DOWN;
});

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.__defineGetter__("EVENT_KEY_UP", function () {
    cc.warn("[pd.InputManager.EVENT_KEY_UP] Utilizar a referência enumerador pd.InputManager.Events");
    return pd.InputManager.Events.KEY_UP;
});

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.__defineGetter__("EVENT_ACCELEROMETER", function () {
    cc.warn("[pd.InputManager.EVENT_ACCELEROMETER] Utilizar a referência enumerador pd.InputManager.Events");
    return pd.InputManager.Events.ACCELEROMETER;
});

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.__defineGetter__("EVENT_BUTTON_PRESSED", function () {
    cc.warn("[pd.InputManager.EVENT_BUTTON_PRESSED] Utilizar a referência enumerador pd.InputManager.Events");
    return pd.InputManager.Events.BUTTON_PRESSED;
});

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.__defineGetter__("EVENT_BUTTON_RELEASED", function () {
    cc.warn("[pd.InputManager.EVENT_BUTTON_RELEASED] Utilizar a referência enumerador pd.InputManager.Events");
    return pd.InputManager.Events.BUTTON_RELEASED;
});

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.__defineGetter__("EVENT_JOYSTICK_STATUS", function () {
    cc.warn("[pd.InputManager.EVENT_JOYSTICK_STATUS] Utilizar a referência enumerador pd.InputManager.Events");
    return pd.InputManager.Events.JOYSTICK_STATUS;
});
//endregion
//region pd.Animation
/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.Animation}.
 */
pd.__defineGetter__("Animado", function(){
    cc.warn("Utilizar pd.Animation");
    return pd.Animation;
});

/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.Animation.changeAndPlay}, {@link pd.Animation.changeAndLoop} ou {@link pd.Animation.changeAndStop}.
 */
pd.Animation.prototype.changeAnimation = function(newAnimation, repeatable, newSpeed, taxaRepeticao, callBack) {
    cc.warn("[pd.Animation.changeAnimation] utilizar pd.Animation.changeAndPlay, pd.Animation.changeAndLoop ou pd.Animation.changeAndStop");
    if(repeatable == true || repeatable == null)
        this.changeAndLoop(newAnimation, newSpeed);
    else
        this.changeAndPlay(newAnimation, taxaRepeticao, newSpeed, callBack, this.getParent());
};
//endregion
//region pd.Button
/**
 * @deprecated - desde a versão 2.3 utilizar {@link pd.Button.prototype.setForceMouseUpCall}
 */
pd.Button.prototype.setCallUpEvent = function (forceMouseUpCall) {
    cc.warn("[pd.Button.setCallUpEvent] utilizar pd.Button.setForceMouseUpCall");
    pd.Button.prototype.setForceMouseUpCall(forceMouseUpCall);
}

/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.Button.prototype.setKeyCode}
 */
pd.Button.prototype.defineKey = function (keyCode) {
    cc.warn("[pd.Button.defineKey] utilizar pd.Button.setKeyCode");
    pd.Button.prototype.setKeyCode(keyCode);
}

/**
 * @deprecated - desde a versão 2.6 - utilizar {@link pd.Button.States.NORMAL}
 */
pd.Button.States.__defineGetter__("SPRITEFRAME_NORMAL", function () {
    cc.warn("[pd.Button.States.SPRITEFRAME_NORMAL] utilizar pd.Button.States.NORMAL");
    return pd.Button.States.NORMAL;
});

/**
 * @deprecated - desde a versão 2.6 - utilizar {@link pd.Button.States.PRESSED}
 */
pd.Button.States.__defineGetter__("SPRITEFRAME_PRESSED", function () {
    cc.warn("[pd.Button.States.SPRITEFRAME_PRESSED] utilizar pd.Button.States.PRESSED");
    return pd.Button.States.PRESSED;
});
//endregion
//region TypewriterLabel
/**
 * @deprecated - desde a versão 2.6 - utilizar {@link pd.TypewriterLabel}
 */
pd.__defineGetter__("TextCreator", function(){
    cc.warn("Utilizar pd.TypewriterLabel");
    return pd.TypewriterLabel;
});

/**
 * @deprecated - desde a versão 2.6 - utilizar {@link pd.TypewriterLabel.prototype.setOnComplete}
 */
pd.TypewriterLabel.prototype.addFinishCallback = function() {
    cc.warn("[pd.TypewriterLabel.addFinishCallback] utilizar pd.TypewriterLabel.setOnComplete");
    pd.TypewriterLabel.prototype.setOnComplete.apply(pd.TypewriterLabel.prototype, arguments);
};

/**
 * @deprecated - desde a versão 2.6 - utilizar {@link pd.TypewriterLabel.prototype.addLine}
 */
pd.TypewriterLabel.prototype.addTextLine = function() {
    cc.warn("[pd.TypewriterLabel.addTextLine] utilizar pd.TypewriterLabel.addLine");
    pd.TypewriterLabel.prototype.addLine.apply(pd.TypewriterLabel.prototype, arguments);
};

/**
 * @deprecated - desde a versão 2.6 - utilizar {@link pd.TypewriterLabel.prototype.start}
 */
pd.TypewriterLabel.prototype.startUpdate = function() {
    cc.warn("[pd.TypewriterLabel.startUpdate] utilizar pd.TypewriterLabel.start");
    pd.TypewriterLabel.prototype.start.apply(pd.TypewriterLabel.prototype, arguments);
};

/**
 * @deprecated - desde a versão 2.6 utilizar {@link pd.TypewriterLabel.prototype.config}
 * @param {pd.TypewriterLabel} target
 * @param {number} displayingLinesAmount
 */
pd.TextCreator.setFadeType = function(target, displayingLinesAmount){
    cc.warn("[pd.TextCreator.setFadeType] utilizar pd.TypewriterLabel.config");
    target.config(displayingLinesAmount);
};
//endregion
//region Navegação de cenas
/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.switchScene}.
 * A função ainda é a mesma, apenas foi refatorado o seu nome para enquadrar-se no padrão.
 */
pd.trocaCena = function () {
    cc.warn("[pd.trocaCena] utilizar pd.switchScene");
    pd.switchScene.apply(pd, arguments);
}

/**
 * Troca a cena atual para a cena informada (antigo pd.trocaCena()).
 * @type {Function}
 * @param {cc.Class} transition
 * @param {cc.Node} layer
 * @param {Number} [delay=0.5]
 * @deprecated Usar {@link pd.changeScene}
 */
pd.switchScene = function(transition, layer, delay) {
    cc.warn("[pd.switchScene] Usar pd.changeScene");
    if(!layer._didGetDestroyed) {
        layer._didGetDestroyed = true;
        var delayTime = new cc.DelayTime(delay || 0.5);
        var funcChange = new cc.CallFunc(function(){
            cc.director.runScene(transition);
        }, layer);
        var switchSequence = cc.sequence(delayTime, funcChange);
        pd.delegate.retain(transition);
        pd.delegate.retain(switchSequence);
        layer.runAction(switchSequence);
    }
};
//endregion
//region Transitions
/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @param {cc.Layer} layer
 * @param {Number} z
 * @param {Number} x
 * @param {Number} y
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var ZoomTo = function (t, s, layer, z, x, y) {
    cc.warn("Transição [ZoomTo] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.ZoomTo(t, s, layer, z, x, y);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var JumpZoomTransition = function (t, s) {
    cc.warn("Transição [JumpZoomTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.JumpZoomTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var FadeTransition = function (t, s) {
    cc.warn("Transição [FadeTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.FadeTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var FadeWhiteTransition = function (t, s) {
    cc.warn("Transição [FadeWhiteTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.FadeWhiteTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var FlipXLeftOver = function (t, s) {
    cc.warn("Transição [FlipXLeftOver] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.FlipXLeftOver(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var FlipXRightOver = function (t, s) {
    cc.warn("Transição [FlipXRightOver] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.FlipXRightOver(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var FlipYUpOver = function (t, s) {
    cc.warn("Transição [FlipYUpOver] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.FlipYUpOver(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var FlipYDownOver = function (t, s) {
    cc.warn("Transição [FlipYDownOver] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.FlipYDownOver(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var FlipAngularLeftOver = function (t, s) {
    cc.warn("Transição [FlipAngularLeftOver] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.FlipAngularLeftOver(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var FlipAngularRightOver = function (t, s) {
    cc.warn("Transição [FlipAngularRightOver] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.FlipAngularRightOver(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var ZoomFlipXLeftOver = function (t, s) {
    cc.warn("Transição [ZoomFlipXLeftOver] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.ZoomFlipXLeftOver(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var ZoomFlipXRightOver = function (t, s) {
    cc.warn("Transição [ZoomFlipXRightOver] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.ZoomFlipXRightOver(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var ZoomFlipYUpOver = function (t, s) {
    cc.warn("Transição [ZoomFlipYUpOver] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.ZoomFlipYUpOver(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var ZoomFlipYDownOver = function (t, s) {
    cc.warn("Transição [ZoomFlipYDownOver] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.ZoomFlipYDownOver(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var ZoomFlipAngularLeftOver = function (t, s) {
    cc.warn("Transição [ZoomFlipAngularLeftOver] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.ZoomFlipAngularLeftOver(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var ZoomFlipAngularRightOver = function (t, s) {
    cc.warn("Transição [ZoomFlipAngularRightOver] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.ZoomFlipAngularRightOver(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var ShrinkGrowTransition = function (t, s) {
    cc.warn("Transição [ShrinkGrowTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.ShrinkGrowTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var RotoZoomTransition = function (t, s) {
    cc.warn("Transição [RotoZoomTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.RotoZoomTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var MoveInLTransition = function (t, s) {
    cc.warn("Transição [MoveInLTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.MoveInLTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var MoveInRTransition = function (t, s) {
    cc.warn("Transição [MoveInRTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.MoveInRTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var MoveInTTransition = function (t, s) {
    cc.warn("Transição [MoveInTTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.MoveInTTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var MoveInBTransition = function (t, s) {
    cc.warn("Transição [MoveInBTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.MoveInBTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var SlideInLTransition = function (t, s) {
    cc.warn("Transição [SlideInLTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.SlideInLTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var SlideInRTransition = function (t, s) {
    cc.warn("Transição [SlideInRTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.SlideInRTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var SlideInTTransition = function (t, s) {
    cc.warn("Transição [SlideInTTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.SlideInTTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var SlideInBTransition = function (t, s) {
    cc.warn("Transição [SlideInBTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.SlideInBTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var CCTransitionCrossFade = function (t, s) {
    cc.warn("Transição [CCTransitionCrossFade] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.CCTransitionCrossFade(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var CCTransitionRadialCCW = function (t, s) {
    cc.warn("Transição [CCTransitionRadialCCW] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.CCTransitionRadialCCW(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var CCTransitionRadialCW = function (t, s) {
    cc.warn("Transição [CCTransitionRadialCW] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.CCTransitionRadialCW(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var PageTransitionForward = function (t, s) {
    cc.warn("Transição [PageTransitionForward] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.PageTransitionForward(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var PageTransitionBackward = function (t, s) {
    cc.warn("Transição [PageTransitionBackward] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.PageTransitionBackward(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var FadeTRTransition = function (t, s) {
    cc.warn("Transição [FadeTRTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.FadeTRTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var FadeBLTransition = function (t, s) {
    cc.warn("Transição [FadeBLTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.FadeBLTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var FadeUpTransition = function (t, s) {
    cc.warn("Transição [FadeUpTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.FadeUpTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var FadeDownTransition = function (t, s) {
    cc.warn("Transição [FadeDownTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.FadeDownTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var TurnOffTilesTransition = function (t, s) {
    cc.warn("Transição [TurnOffTilesTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.TurnOffTilesTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var SplitRowsTransition = function (t, s) {
    cc.warn("Transição [SplitRowsTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.SplitRowsTransition(t, s);
};

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @returns {cc.TransitionScene}
 * @deprecated Transição foi movida para o namespace pd
 */
var SplitColsTransition = function (t, s) {
    cc.warn("Transição [SplitColsTransition] foi movida para o namespace pd. Corrigir chamada da transição");
    return pd.SplitColsTransition(t, s);
};
//endregion