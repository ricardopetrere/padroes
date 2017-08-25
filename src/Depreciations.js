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
pd.cObject = pd.createSprite;

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
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.openURL}.
 */
abreLink = pd.openURL;

/**
 * @deprecated - desde a versão 2.2 - utilizar {@link pd.openURL}.
 */
abreLinkIOS = pd.openURL;

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
 * @deprecated - desde a versão 2.2.
 */
pd.TutorialLayer.prototype.criarTextoInferior = pd.TutorialLayer.prototype.createBottomText;

/**
 * @deprecated - desde a versão 2.2.
 */
pd.TutorialLayer.prototype.createTeclas = pd.TutorialLayer.prototype.createArrowKeys;

/**
 * @deprecated - desde a versão 2.2.
 */
pd.TutorialLayer.prototype.createPonteiro = pd.TutorialLayer.prototype.createPointer;

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
    if (!cc.sys.isNative)
        pd.Editor.add(obj, type, name);
}

/**
 * Executa a animação de vitória.
 * @param {cc.SpriteFrame} circleSpriteFrame
 * @param {cc.SpriteFrame} messageSpriteFrame
 * @param {Boolean} [tiltScreen=true]
 * @deprecated desde a versão 3.0 - Usar {@link pd.delegate.winGame}
 */
pd.GameScene.prototype.winGame = function(circleSpriteFrame, messageSpriteFrame, tiltScreen) {
    pd.delegate.winGame(circleSpriteFrame, messageSpriteFrame, tiltScreen);
}

/**
 * Executa a animação de derrota.
 * @param {cc.SpriteFrame} circleSpriteFrame
 * @param {Boolean} [tiltScreen=true]
 * @deprecated desde a versão 3.0 - Usar {@link pd.delegate.loseGame}
 */
pd.GameScene.prototype.loseGame = function(circleSpriteFrame, tiltScreen) {
    pd.delegate.loseGame(circleSpriteFrame, tiltScreen);
}