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
 * A função ainda é a mesma, apenas foi dado um nome mais claro à ela.
 */
pd.cText = pd.createText;

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
 */
pd.Debugger.prototype.addScene = function() {
    cc.log("[pd] Uso de função depreciada: 'addScene'. Utilizar 'addShortcut' a partir de agora.");
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
    cc.log("[pd] Uso de função depreciada: 'setInputForJoystick'. Utilizar a função 'enable()' da instância de seu joystick.");
};
