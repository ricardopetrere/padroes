/**
 * Created by Ryan Balieiro on 08/06/17.
 *
 * @class
 * @extends {cc.Sprite}
 * @mixes {pd.EventDispatcher}
 * @classdesc Classe base para botões de interface.
 */
pd.Button = cc.Sprite.extend({/** @lends pd.Button#**/
    /**
     * O ID do touch que está interagindo com o botão.
     * @type {Number}
     */
    _touchID:-1,
    /**
     * O KeyCode da tecla vinculado ao botão.
     * @type {Number}
     */
    _attachedKeyCode:-1,
    /**
     * O objeto responsável por controlar o botão.
     * @type {cc.Node}
     */
    _handler:null,
    /**
     * A função do handler a ser chamada quando o status do botão mudar (modo explícito).
     * @type {Function|String}
     */
    _handlerFunc:null,
    /**
     * Os argumentos a serem passados para a função de interação com o botão.
     * @type {Array}
     */
    _handlerFuncArgs:null,
    /**
     * O fator de escala do botão no status 'idle'.
     * @type {Number}
     */
    _normalScale:1,
    /**
     * O fator de escala do botão no status 'pressionado'.
     * @type {Number}
     */
    _pressedScale:1,
    /**
     * Flag que indica se o evento de Mouse Up deve ser disparado mesmo quando o usuário tirar o cursor/dedo da área do botão (mouse out).
     * @type {Boolean}
     */
    _forceMouseUpCall:false,
    /**
     * Flag que indica se os listeners do botão estão ativos (uso interno).
     * @type {Boolean}
     */
    _isEnabled:false,
    /**
     * Flag que indica se o botão está apertado (uso interno).
     * @type {Boolean}
     */
    _isPressed:false,
    /**
     * Spriteframe do botão quando ele está 'solto'.
     * @type {cc.SpriteFrame}
     */
    _normalSpriteFrame:null,
    /**
     * Spriteframe do botão quando ele está apertado.
     * @type {cc.SpriteFrame}
     */
    _pressedSpriteFrame:null,
    /**
     * O mecanismo de callback utilizado pelo botão.
     * @type {pd.Button.CALLBACK_MODE_EXPLICIT|pd.Button.CALLBACK_MODE_EVENT_BASED}
     */
    _callbackMode:"",

    /**
     * @constructs
     * @param normalImage {cc.SpriteFrame} - o sprite frame do botão quando ele está solto.
     * @param [pressedImage=null] {cc.SpriteFrame|null} - o sprite frame do botão quando ele está pressionado.
     * @param attr {{x:Number, y:Number, scaleX:Number, scaleY:Number, opacity:Number, visible:Boolean, rotation:Number}} - as propriedades de exibição do botão.
     * @param pressedScale {Number} - o fator de escala do botão ao ser pressionado.
     * @param autoEnable {Boolean} - indica se os listeners do botão devem ser adicionados automaticamente após a sua construção.
     * @param eventBased {Boolean} - indica se o mecanismo de callbacks do botão será baseado em eventos.
     * @param [handler=null] {*|null} - para o método de callback explícito: o objeto que irá executar a função de callback.
     * @param [handlerFunc=null] {Function|String|null} - para o método de callback explícito: a função de callback a ser executada.
     * @param [handlerFuncArgs=null] {Array|null} - para o método de callback explícito: os argumentos a serem passados para a função de callback.
     * @returns {pd.Button}
     */
    ctor: function(normalImage, pressedImage, attr, pressedScale, autoEnable, eventBased, handler, handlerFunc, handlerFuncArgs) {
        this._super();
        this._setPressed(false);

        if(typeof arguments[0] == 'number') { // construtor legado.
            this._legacyCtor.apply(this, arguments);
        }
        else {
            this._normalSpriteFrame = cc.spriteFrameCache.getSpriteFrame(normalImage);
            this._pressedSpriteFrame = cc.spriteFrameCache.getSpriteFrame(pressedImage ? pressedImage : normalImage);
            this.attr(attr);
            this._pressedScale = pressedScale;
            this._callbackMode = eventBased ? pd.Button.CALLBACK_MODE_EVENT_BASED : pd.Button.CALLBACK_MODE_EXPLICIT;

            this._handler = handler;
            this._handlerFunc = handlerFunc;
            this._handlerFuncArgs = handlerFuncArgs;

            if(autoEnable)
                this.enable();
        }

        this.setSpriteFrame(this._normalSpriteFrame);
        return this;
    },

    /**
     * Construtor antigo - apenas para manter a compatibilidade
     * @deprecated
     * @param x {Number}
     * @param y {Number}
     * @param handler {*}
     * @param handlerFunc {Function|String}
     * @param normalImage {String}
     * @param pressedImage {String}
     * @param handlerFuncArgs {Array}
     * @param pressedScale {Number}
     * @param forceMouseUpCall {Boolean}
     * @param callbackMode {pd.Button.CALLBACK_MODE_EXPLICIT|pd.Button.CALLBACK_MODE_EVENT_BASED}
     */
    _legacyCtor: function(x, y, handler, handlerFunc, normalImage, pressedImage, handlerFuncArgs, pressedScale, forceMouseUpCall, callbackMode) {
        cc.log("[pd.Button] Construindo botão com o construtor legado - utilizar o novo padrão!");

        this._handler = handler;
        this._handlerFunc = handlerFunc;
        this._handlerFuncArgs = handlerFuncArgs;
        this._pressedScale = pressedScale;
        this._forceMouseUpCall = forceMouseUpCall;

        this._normalSpriteFrame = cc.spriteFrameCache.getSpriteFrame(normalImage);
        this._pressedSpriteFrame = cc.spriteFrameCache.getSpriteFrame(pressedImage);
        this._callbackMode = callbackMode || pd.Button.CALLBACK_MODE_EXPLICIT;

        this.setPosition(x, y);
        this.enable();
    },

    /**
     * Altera a sensibilidade do botão.
     * @param forceMouseUpCall {Boolean}
     */
    setForceMouseUpCall: function(forceMouseUpCall) {
        this._forceMouseUpCall = forceMouseUpCall;
    },

    /**
     * Seta o keycode do botão.
     * @param keyCode {Number}
     */
    setKeyCode: function(keyCode) {
        this._attachedKeyCode = keyCode;
    },

    /**
     * Habilita o botao.
     */
    enable: function() {
        if(this._isEnabled)
           return;

        pd.inputManager.config(this, true, cc.EventListener.TOUCH_ONE_BY_ONE, 1);
        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_DOWN, this, this._onMouseDown);
        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_MOVE, this, this._onMouseDragged);
        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_UP, this, this._onMouseUp);

        pd.inputManager.add(pd.InputManager.EVENT_KEY_DOWN, this, this._onKeyDown);
        pd.inputManager.add(pd.InputManager.EVENT_KEY_UP, this, this._onKeyUp);
        this._isEnabled = true;
    },

    /**
     * Desabilita o botão.
     */
    disable: function() {
        if(!this._isEnabled)
            return;

        pd.inputManager.clean(this);
        this._isEnabled = false;
    },

    /**
     * Altera o indicador do status do botão.
     * @param isPressed {Boolean}
     * @private
     */
    _setPressed: function(isPressed) {
        this._isPressed = isPressed;
        this.isGrabbed = isPressed; // legado.
    },

    /**
     * Verifica se as coordenadas do evento estão dentro do bounding box do botão.
     * @param event {Object}
     * @private
     */
    _isColliding: function(event) {
        if(!event)
            return false;

        const location = event.getLocation();
        const collisionBox = cc.rect(location.x, location.y, 1, 1);
        return cc.rectIntersectsRect(this.getBoundingBox(), collisionBox);
    },

    /**
     * @param eventOrTouch {Object|Array}
     * @private
     */
    _onMouseDown: function(eventOrTouch) {
        const isColliding = this._isColliding(eventOrTouch);
        if(!isColliding)
            return;

        if(cc.sys.isMobile) {
            if(this._touchID == -1)
                this._touchID = eventOrTouch.getID();
            else if(eventOrTouch.getID() != this._touchID)
                return;
        }

        this.setSpriteFrame(this._pressedSpriteFrame);
        this._setPressed(true);
        this._normalScale = this.getScale();
        this._pressedScale = this._pressedScale ? this._pressedScale : this._normalScale;
        this.setScale(this._pressedScale);
        this._performCallback(true);
    },

    /**
     * @param eventOrTouch {Object|Array}
     * @private
     */
    _onMouseDragged: function(eventOrTouch) {
        if(cc.sys.isMobile && eventOrTouch.getID() != this._touchID)
            return;

        if(this._isPressed) {
            if(this._isColliding(eventOrTouch)) {
                this.setSpriteFrame(this._pressedSpriteFrame);
                this.setScale(this._pressedScale);
                this._shouldDispatchMouseUpCall = false;
            }
            else {
                this.setSpriteFrame(this._normalSpriteFrame);
                this.setScale(this._normalScale);
                this._shouldDispatchMouseUpCall = this._forceMouseUpCall;
            }
        }
    },

    /**
     * @param eventOrTouch {Object|Array}
     * @private
     */
    _onMouseUp: function(eventOrTouch) {
        if(cc.sys.isMobile && eventOrTouch.getID() != this._touchID)
            return;

        if(this._isPressed) {
            this._touchID = -1;
            this.setSpriteFrame(this._normalSpriteFrame);
            this.setScale(this._normalScale);
            this._setPressed(false);
            if(this._shouldDispatchMouseUpCall || this._isColliding(eventOrTouch))
                this._performCallback(false);
        }
    },

    /**
     * @param keyCode {Number}
     * @param event {Object}
     * @private
     */
    _onKeyDown: function(keyCode, event) {
        if(this._attachedKeyCode == keyCode) {
            this._setPressed(true);
            this.setSpriteFrame(this._pressedSpriteFrame);
            this._performCallback(true);
        }
    },

    /**
     * @param keyCode {Number}
     * @param event {Object}
     * @private
     */
    _onKeyUp: function(keyCode, event) {
        if(this._attachedKeyCode == keyCode) {
            this._setPressed(false);
            this.setSpriteFrame(this._normalSpriteFrame);
            this._performCallback(false);
        }
    },

    /**
     * Executa a função de callback.
     * @param pressed {Boolean}
     * @private
     */
    _performCallback: function(pressed) {
        if(this._callbackMode == pd.Button.CALLBACK_MODE_EXPLICIT) {
            if (typeof(this._handlerFunc) == "function") {
                this._handlerFunc.apply(this._handler, [this, pressed, this._handlerFuncArgs]);
            }
            else {
                this._handler[this._handlerFunc].apply(this._handler, [this, pressed, this._handlerFuncArgs]);
            }
        }
        else {
            pd.inputManager.setEventMetadata("_buttonMeta", this);
            pd.inputManager.call(this, pressed ? pd.InputManager.EVENT_BUTTON_PRESSED : pd.InputManager.EVENT_BUTTON_RELEASED, pd.inputManager._buttonMeta);
        }
    }
});

/**
 * Modo de callback explícito: as funções de callback são definidas no construtor do botão, e são invocadas de maneira explícita.
 * @constant
 * @type {string}
 */
pd.Button.CALLBACK_MODE_EXPLICIT = "buttonCallbackModeExplicit";

/**
 * Modo de callback baseado em eventos: os botões disparam notificações, permitindo que as funções de callback sejam injetadas por um controlador externo.
 * @type {string}
 */
pd.Button.CALLBACK_MODE_EVENT_BASED = "buttonCallbackModeEventBased";