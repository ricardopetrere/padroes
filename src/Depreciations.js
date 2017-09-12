/**
 * Created by Ryan Balieiro on 23/05/17.
 * @desc Listagem de propriedades depreciadas durante alterações dos padrões para manter a compatibilidade com versões antigas.
 */

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.activeNamespace}.
 * @type {Object}
 */
activeGameSpace = pd.delegate.activeNamespace;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.isPaused}.
 * @type {boolean}
 */
isPaused = pd.delegate.isPaused;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.createSprite}.
 * A função ainda é a mesma, apenas foi dado um nome mais claro à ela.
 */
pd.cObject = pd.legacyCreateSprite;

/**
 * Cria uma sprite.
 * @param {String} spriteName
 * @param {Number} x
 * @param {Number} y
 * @param {cc.Node} parentNode
 * @param {Number} zOrder
 * @param {String} [name]
 * @param {boolean} [addToEditor]
 * @returns {cc.Sprite}
 */
pd.legacyCreateSprite = function(spriteName, x, y, parentNode, zOrder, name, addToEditor){
    var SF = pd.getSpriteFrame(spriteName);
    if (!SF)
        SF = spriteName;
    const obj = new cc.Sprite(SF);
    obj.setPosition(x, y);
    obj.name = name;
    zOrder = zOrder || 0;

    if(parentNode != undefined && parentNode != null)
        parentNode.addChild(obj, zOrder);

    if(!cc.sys.isNative && pd.debugMode && addToEditor)
        pd.Editor.add(obj);

    return obj;
};

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.createText}.
 */
pd.cText = function(x, y, txt, font, size){
    var text = null;
    if(typeof txt == "string"){
        text = new cc.LabelTTF(txt, font, size);
        text.setFontFillColor(new cc.Color(0, 0, 0));
    }
    else{
        text = new cc.Sprite(txt);
    }
    text.setPosition(x, y);
    text.setAnchorPoint(0.5, 1);
    return text;
};

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.init}.
 */
pd.initGlobals = pd.delegate.init;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.switchScene}.
 * A função ainda é a mesma, apenas foi refatorado o seu nome para enquadrar-se no padrão.
 */
pd.trocaCena = pd.switchScene;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.natives.openURL}.
 */
abreLink = pd.natives.openURL;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.natives.openURL}.
 */
abreLinkIOS = pd.natives.openURL;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.validate}.
 */
registrarValidacao = pd.validate;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.checkValidation}.
 */
checarValidacao = pd.checkValidation;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.pause}.
 */
pd.pausar = pd.delegate.pause;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.resume}.
 */
pd.resumar = pd.delegate.resume;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.retain} ou {@link pd.retain}.
 */
pd.reter = pd.retain;

/**
 * @deprecated - desde a versão 2.2 - não fazer chamadas a essa função - deixar apenas ela para ser manipulada pelo controlador interno.
 */
pd.liberar = pd.delegate.releaseAll;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.delegate.finish}.
 */
pd.finishGame = pd.delegate.finish;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.res}.
 */
pd.resPadrao = pd.res;

/**
 * @deprecated - desde a versão 2.2 - não utilizar mais este recurso! Utilizar {@link pd.debugMode}, e setar o modo debug via project.json.
 * @type {undefined}
 */
DebugMode = undefined;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.Tutorial}.
 */
pd.TutorialScene = pd.Tutorial;

/**
 * @deprecated
 */
pd.LegacyTutorialLayer = cc.Layer.extend({/**@lends pd.TutorialLayer#*/
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
pd.LegacyTutorialLayer.prototype.criarTextoInferior = pd.LegacyTutorialLayer.prototype.createBottomText;

/**
 * @deprecated - desde a versão 2.2.
 */
pd.LegacyTutorialLayer.prototype.createTeclas = pd.LegacyTutorialLayer.prototype.createArrowKeys;

/**
 * @deprecated - desde a versão 2.2.
 */
pd.LegacyTutorialLayer.prototype.createPonteiro = pd.LegacyTutorialLayer.prototype.createPointer;

/**
 * @deprecated - desde a versão 2.6.
 */
pd.LegacyTutorialLayer.prototype.tecla_cima = pd.LegacyTutorialLayer.prototype.btnArrowUp;

/**
 * @deprecated - desde a versão 2.6.
 */
pd.LegacyTutorialLayer.prototype.tecla_baixo = pd.LegacyTutorialLayer.prototype.btnArrowDown;

/**
 * @deprecated - desde a versão 2.6.
 */
pd.LegacyTutorialLayer.prototype.tecla_esquerda = pd.LegacyTutorialLayer.prototype.btnArrowLeft;

/**
 * @deprecated - desde a versão 2.6.
 */
pd.LegacyTutorialLayer.prototype.tecla_direita = pd.LegacyTutorialLayer.prototype.btnArrowRight;

/**
 * @deprecated - desde a versão 2.6.
 */
pd.LegacyTutorialLayer.prototype.vTeclas = pd.LegacyTutorialLayer.prototype.arrowKeys;

/**
 * @deprecated - desde a versão 2.6.
 */
pd.LegacyTutorialLayer.prototype.ponteiro = pd.LegacyTutorialLayer.prototype.pointer;

/**
 * @deprecated - desde a versão 2.3 - utilizar a função {@link pd.debugger.addShortcut}.
 * @param {string} targetSceneName
 * @param {Function} callbackFunction
 * @param {Object} callbackCaller
 * @param {*} callbackArguments
 */
pd.Debugger.prototype.addScene = function(targetSceneName, callbackFunction, callbackCaller, callbackArguments) {
    pd.debugger.addShortcut(targetSceneName, callbackFunction, callbackCaller, callbackArguments);
};

/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.inputManager.add}.
 * @example
 * pd.inputManager.add(pd.InputManager.EVENT_MOUSE_DOWN, this, this.onMouseDown);
 */
pd.setInput = function(layer, eventId, funcToCall, multiTouch) {
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
pd.setInput.MOUSE_DOWN = 0;
/**
 * @deprecated
 * @type {number}
 */
pd.setInput.MOUSE_MOVE = 1;
/**
 * @deprecated
 * @type {number}
 */
pd.setInput.MOUSE_UP = 2;
/**
 * @deprecated
 * @type {number}
 */
pd.setInput.ACCELEROMETER = 3;

/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.inputManager.add}.
 * @example
 * pd.inputManager.add(pd.InputManager.EVENT_KEY_DOWN, this, this.onMouseDown);
 */
pd.setKeyboard = function(layer, funcKeyDown, funcKeyUp) {
    pd.inputManager.add(pd.InputManager.EVENT_KEY_DOWN, layer, funcKeyDown);
    pd.inputManager.add(pd.InputManager.EVENT_KEY_UP, layer, funcKeyUp);
};

/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.inputManager.add}.
 */
pd.setMouse = function(layer, funcMouseDown, funcMouseMove, funcMouseUp, multiTouch) {
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
    pd.inputManager.config(layer, false, cc.EventListener.TOUCH_ALL_AT_ONCE, 1);
    pd.inputManager.add(pd.InputManager.EVENT_MOUSE_DOWN, layer, "onMouseDown");
    pd.inputManager.add(pd.InputManager.EVENT_MOUSE_MOVE, layer, "onMouseDragged");
    pd.inputManager.add(pd.InputManager.EVENT_MOUSE_UP, layer, "onMouseUp");

    pd.inputManager.add(pd.InputManager.EVENT_KEY_DOWN, layer, "keyDown");
    pd.inputManager.add(pd.InputManager.EVENT_KEY_UP, layer, "keyReleased");
};

/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.Animation}.
 */
pd.Animado = pd.Animation;

/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.Animation.changeAndPlay}, {@link pd.Animation.changeAndLoop} ou {@link pd.Animation.changeAndStop}.
 */
pd.Animation.prototype.changeAnimation = function(newAnimation, repeatable, newSpeed, taxaRepeticao, callBack) {
    if(repeatable == true || repeatable == null)
        this.changeAndLoop(newAnimation, newSpeed);
    else
        this.changeAndPlay(newAnimation, taxaRepeticao, newSpeed, callBack, this.getParent());
};

/**
 * @deprecated - desde a versão 2.3 utilizar {@link pd.Button.prototype.setForceMouseUpCall}
 */
pd.Button.prototype.setCallUpEvent = pd.Button.prototype.setForceMouseUpCall;

/**
 * @deprecated - desde a versão 2.3 - utilizar {@link pd.Button.prototype.setKeyCode}
 */
pd.Button.prototype.defineKey = pd.Button.prototype.setKeyCode;

/**
 * @deprecated - desde a versao 2.3.
 * @type {number}
 */
SingletonId_Animacoes = 0;

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
pd.InputManager.EVENT_MOUSE_DOWN = "eventTypeMouseDown";

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_MOUSE_HOVER = "eventMouseHover";

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_MOUSE_PAN = "eventMousePan";

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_MOUSE_MOVE = "eventTypeMouseMove";

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_MOUSE_SCROLL = "eventMouseScroll";

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_MOUSE_UP = "eventTypeMouseUp";

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_KEY_DOWN = "eventTypeKeyDown";

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_KEY_UP = "eventTypeKeyUp";

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_ACCELEROMETER = "eventTypeAccelerometer";

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_BUTTON_PRESSED = "eventButtonPress";

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_BUTTON_RELEASED = "eventButtonReleased";

/**
 * @deprecated - desde a versão 2.4 - utilizar a referência enumerador {@link pd.InputManager.Events}
 * @constant
 * @type {string}
 */
pd.InputManager.EVENT_JOYSTICK_STATUS = "eventJoystickStatus";

/**
 * @deprecated - desde a versão 2.5 - utilizar {@link pd.Editor.add}
 */
pd.AddToDebugger = function(obj, type, name) {
    // if (!cc.sys.isNative && pd.debugMode)
    //     pd.Editor.add(obj, type, name);
};

/**
 * Executa a animação de vitória.
 * @param {cc.SpriteFrame} circleSpriteFrame
 * @param {cc.SpriteFrame} messageSpriteFrame
 * @param {Boolean} [tiltScreen=true]
 * @deprecated desde a versão 3.0 - Usar {@link pd.delegate.winGame}
 */
pd.GameScene.prototype.winGame = function(circleSpriteFrame, messageSpriteFrame, tiltScreen) {
    pd.delegate.winGame(circleSpriteFrame, messageSpriteFrame, tiltScreen);
};

/**
 * Executa a animação de derrota.
 * @param {cc.SpriteFrame} circleSpriteFrame
 * @param {Boolean} [tiltScreen=true]
 * @deprecated desde a versão 3.0 - Usar {@link pd.delegate.loseGame}
 */
pd.GameScene.prototype.loseGame = function(circleSpriteFrame, tiltScreen) {
    pd.delegate.loseGame(circleSpriteFrame, tiltScreen);
};

/**
 * @deprecated - desde a versão 2.6 - utilizar {@link pd.TypewriterLabel}
 */
pd.TextCreator = pd.TypewriterLabel;

/**
 * @deprecated - desde a versão 2.6 - utilizar {@link pd.TypewriterLabel.prototype.setOnComplete}
 */
pd.TypewriterLabel.prototype.addFinishCallback = pd.TypewriterLabel.prototype.setOnComplete;

/**
 * @deprecated - desde a versão 2.6 - utilizar {@link pd.TypewriterLabel.prototype.setOnComplete}
 */
pd.TypewriterLabel.prototype.addTextLine = pd.TypewriterLabel.prototype.addLine;

/**
 * @deprecated - desde a versão 2.6 - utilizar {@link pd.TypewriterLabel.prototype.setOnComplete}
 */
pd.TypewriterLabel.prototype.startUpdate = pd.TypewriterLabel.prototype.start;

/**
 * @deprecated - desde a versão 2.6 utilizat {@link pd.TypewriterLabel.prototype.config}
 * @param target
 * @param displayingLinesAmount
 */
pd.TextCreator.setFadeType = function(target, displayingLinesAmount){
    target.config(displayingLinesAmount);
};

/**
 * @deprecated - desde a versão 2.6 - utilizar {@link pd.Button.States.NORMAL}
 */
pd.Button.States.SPRITEFRAME_NORMAL = "normal";

/**
 * @deprecated - desde a versão 2.6 - utilizar {@link pd.Button.States.PRESSED}
 */
pd.Button.States.SPRITEFRAME_PRESSED = "pressed";

/**
 * Troca a cena atual para a cena informada (antigo pd.trocaCena()).
 * @type {Function}
 * @param {cc.Class} transition
 * @param {cc.Node} layer
 * @param {Number} [delay=0.5]
 * @deprecated Usar {@link pd.changeScene}
 */
pd.switchScene = function(transition, layer, delay) {
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