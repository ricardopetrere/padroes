/**
 * Created by Ryan Balieiro on 08/06/17.
 *
 * @class
 * @extends {cc.Sprite}
 * @mixes {pd.decorators.EventDispatcher}
 * @mixes {pd.decorators.ClickableNode}
 * @classdesc Classe base para botões de interface.
 */
pd.Button = cc.Sprite.extend(pd.decorators.EventDispatcher).extend(pd.decorators.ClickableNode).extend({/** @lends pd.Button#**/
    /**
     * O ID do touch que está interagindo com o botão.
     * @type {Number}
     */
    _touchID:-1,
    /**
     * O keyCode da tecla vinculado ao botão.
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
     * O fator de opacidade do botão no status 'idle'.
     * @type {Number}
     */
    _normalOpacity:255,
    /**
     * O fator de escala do botão no status 'pressionado'.
     * @type {Number}
     */
    _disabledOpacity:255,
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
     * @constructs
     * @param {String} normalImage - o sprite frame name do botão quando ele está solto.
     * @param {String|null} [pressedImage=null] - o sprite frame name do botão quando ele está pressionado.
     * @param {Object} [attr=null] - as propriedades de exibição do botão.
     * @param {Number} [pressedScale=1] - o fator de escala do botão ao ser pressionado.
     * @param {Boolean} [autoEnable=false] - indica se os listeners do botão devem ser adicionados automaticamente após a sua construção.
     * @param {Boolean} [eventBased=false] - indica se o mecanismo de callbacks do botão será baseado em eventos.
     * @param {*|null} [handler=null] - para o método de callback explícito: o objeto que irá executar a função de callback.
     * @param {Function|String|null} [handlerFunc=null] - para o método de callback explícito: a função de callback a ser executada.
     * @param {Array|null} [handlerFuncArgs=null] - para o método de callback explícito: os argumentos a serem passados para a função de callback.
     * @returns {pd.Button}
     */
    ctor: function(normalImage, pressedImage, attr, pressedScale, autoEnable, eventBased, handler, handlerFunc, handlerFuncArgs) {
        this._super();

        if(typeof arguments[0] == 'number') { // construtor legado.
            this._legacyCtor.apply(this, arguments);
        }
        else {
            this._normalSpriteFrame = pd.getSpriteFrame(normalImage);
            this._pressedSpriteFrame = pd.getSpriteFrame(pressedImage ? pressedImage : normalImage);
            if (attr)
                this.attr(pd.parseAttr(attr));
            this._pressedScale = pressedScale || 1;
            this.setCallbackMode(eventBased);

            this._handler = handler;
            this._handlerFunc = handlerFunc;
            this._handlerFuncArgs = handlerFuncArgs;

            if(autoEnable)
                this.enable();
        }

        this.setPressed(false);
        this.setSpriteFrame(this._normalSpriteFrame);
        return this;
    },

    /**
     * Construtor antigo - apenas para manter a compatibilidade
     * @deprecated
     */
    _legacyCtor: function(x, y, handler, handlerFunc, normalImage, pressedImage, handlerFuncArgs, pressedScale, forceMouseUpCall, callbackMode) {
        cc.warn("[pd.Button] Construindo botão com o construtor legado - utilizar o novo padrão!");

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
     * Muda o spriteFrame do pd.Button, entre normal e pressionado
     * @param {string|pd.Button.States} sprite
     */
    changeSpriteFrame: function (sprite) {
        if (sprite === pd.Button.States.NORMAL) {
            this.setSpriteFrame(this._normalSpriteFrame);
        } else if (sprite === pd.Button.States.PRESSED) {
            this.setSpriteFrame(this._pressedSpriteFrame);
        }
    },

    /**
     * Determina se o evento de 'release' do botão deve ser disparado quando o usuário soltá-lo fora de sua região.
     * @param {Boolean} forceMouseUpCall
     */
    setForceMouseUpCall: function(forceMouseUpCall) {
        this._forceMouseUpCall = forceMouseUpCall;
    },

    /**
     * Seta o keycode do botão, vinculando-o a uma tecla.
     * @param {Number} keyCode
     */
    setKeyCode: function(keyCode) {
        this._attachedKeyCode = keyCode;
    },

    /**
     * Seta a opacidade do botão de quando ele está desabilitado.
     * @param {Number} disabledOpacity
     */
    setDisabledOpacity: function(disabledOpacity) {
        this._disabledOpacity = disabledOpacity;
        if (!this._isEnabled)
            this.setOpacity(this._disabledOpacity);
    },

    /**
     * Seta a escala para quando o botão for pressionado.<br/>
     * Se estiver pressionado, a função já altera a escala do botão
     * @param {number} pressedScale
     */
    setPressedScale: function (pressedScale) {
        this._pressedScale = pressedScale;
        if (this._isPressed)
            this.setScale(this._pressedScale);
    },

    /**
     * Habilita o botao.
     */
    enable: function() {
        if(this._isEnabled)
            return;

        pd.inputManager.config(this, true, cc.EventListener.TOUCH_ONE_BY_ONE, 1);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_DOWN, this, this._onMouseDown);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_MOVE, this, this._onMouseDragged);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_UP, this, this._onMouseUp);

        pd.inputManager.add(pd.InputManager.Events.KEY_DOWN, this, this._onKeyDown);
        pd.inputManager.add(pd.InputManager.Events.KEY_UP, this, this._onKeyUp);
        this.setOpacity(this._normalOpacity);
        this._isEnabled = true;
    },

    /**
     * Desabilita o botão.
     */
    disable: function() {
        if(!this._isEnabled)
            return;

        this.setOpacity(this._disabledOpacity);
        pd.inputManager.remove(pd.InputManager.Events.MOUSE_DOWN, this);
        pd.inputManager.remove(pd.InputManager.Events.MOUSE_MOVE, this);
        pd.inputManager.remove(pd.InputManager.Events.MOUSE_UP, this);

        pd.inputManager.remove(pd.InputManager.Events.KEY_DOWN, this);
        pd.inputManager.remove(pd.InputManager.Events.KEY_UP, this);
        this._isEnabled = false;
    },

    /**
     * Muda o estado do botão, animando-o para o estado desejado (útil para demonstrações/tutoriais).
     * Apenas disponível se o botão estiver desabilitado para interações com o usuário.
     * @param {Number} time - o tempo da animação de escala.
     * @param {Boolean} pressed - indica se o botão deve ser pressionado (true) ou solto (false).
     * @param {Boolean} [autoRun=false] - indica se a ação deve ser rodada no momento em que a função for invocada.
     * @param {Function} [easingFunc=null] - função de easing para a animação de escala.
     * @returns {cc.TargetedAction|*}
     */
    animate: function(time, pressed, autoRun, easingFunc) {
        if(this._isEnabled)
            cc.warn("[pd.Button] Foi aplicada uma animação à um botão que está ativo para interações com o usuário. Rever!");

        const sequenceSteps = [];
        if(pressed) {
            var targetScale = this._pressedScale - 0.05;
            sequenceSteps.push(cc.callFunc(function() {this.setSpriteFrame(this._pressedSpriteFrame)}, this));
        }
        else {
            targetScale = this._normalScale;
            sequenceSteps.push(cc.callFunc(function() {this.setSpriteFrame(this._normalSpriteFrame)}, this));
        }

        if(time != 0)
            sequenceSteps.push(cc.targetedAction(this, cc.scaleTo(time, targetScale, targetScale).easing(easingFunc || cc.easeSineIn())));
        else
            sequenceSteps.push(cc.targetedAction(this, cc.callFunc(function() {this.setScale(targetScale, targetScale)}, this)));

        this._customTween = cc.sequence(sequenceSteps);
        if(autoRun === true)
            this.runAction(this._customTween);

        return this._customTween;
    },

    /**
     * Seta o status do botão forçadamente.
     * @param {Boolean} pressed
     */
    setPressed: function(pressed) {
        this._isPressed = pressed;
        this.isGrabbed = pressed; // legado.

        if(pressed) {
            this.setSpriteFrame(this._pressedSpriteFrame);
            this._normalScale = this.getScale();
            this._pressedScale = this._pressedScale ? this._pressedScale : this._normalScale;
            this.setScale(this._pressedScale);
        }
        else {
            this.setSpriteFrame(this._normalSpriteFrame);
            this.setScale(this._normalScale);
        }
    },

    /**
     * @param {Object|Array} eventOrTouch
     * @private
     */
    _onMouseDown: function(eventOrTouch) {
        const isColliding = this.isInside(eventOrTouch.getLocationX(), eventOrTouch.getLocationY());
        if(!isColliding)
            return;

        if(cc.sys.isMobile) {
            if(this._touchID == -1)
                this._touchID = eventOrTouch.getID();
            else if(eventOrTouch.getID() != this._touchID)
                return;
        }

        this.setPressed(true);
        this._performCallback(true);
    },

    /**
     * @param {Object|Array} eventOrTouch
     * @private
     */
    _onMouseDragged: function(eventOrTouch) {
        if(cc.sys.isMobile && eventOrTouch.getID() != this._touchID)
            return;

        if(this._isPressed) {
            if(this.isInside(eventOrTouch.getLocationX(), eventOrTouch.getLocationY())) {
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
     * @param {Object|Array} eventOrTouch
     * @private
     */
    _onMouseUp: function(eventOrTouch) {
        if(cc.sys.isMobile && eventOrTouch.getID() != this._touchID)
            return;

        if(this._isPressed) {
            this._touchID = -1;
            this.setPressed(false);
            if(this._shouldDispatchMouseUpCall || this.isInside(eventOrTouch.getLocationX(), eventOrTouch.getLocationY()))
                this._performCallback(false);
        }
    },

    /**
     * @param {Number} keyCode
     * @param {Object} event
     * @private
     */
    _onKeyDown: function(keyCode, event) {
        if(this._attachedKeyCode == keyCode) {
            this.setPressed(true);
            this.setSpriteFrame(this._pressedSpriteFrame);
            this._performCallback(true);
        }
    },

    /**
     * @param {Number} keyCode
     * @param {Object} event
     * @private
     */
    _onKeyUp: function(keyCode, event) {
        if(this._attachedKeyCode == keyCode) {
            this.setPressed(false);
            this.setSpriteFrame(this._normalSpriteFrame);
            this._performCallback(false);
        }
    },

    /**
     * Executa a função de callback.
     * @param {Boolean} pressed
     * @private
     */
    _performCallback: function(pressed) {
        if(this._shouldDispatchEvent()) {
            pd.inputManager.setEventMetadata("_buttonMeta", this._attachedKeyCode, this);
            this._dispatchInputEvent(pressed ? pd.InputManager.Events.BUTTON_PRESSED : pd.InputManager.Events.BUTTON_RELEASED, pd.inputManager["_buttonMeta"]);
        }
        else if(this._handler && this._handlerFunc) {
            this._performCall(this._handler, this._handlerFunc, [this, pressed, this._handlerFuncArgs]);
        }
        else {
            cc.warn("[pd.Button] Aviso: Não foi registrada uma função de callback para um botão em modo explícito!");
        }
    }
});

/**
 * Estados do botão.
 * @enum {string}
 */
pd.Button.States = {
    NORMAL: "normal",
    PRESSED: "pressed"
};