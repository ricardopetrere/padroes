/**
 * Created by Ryan Balieiro on 19/06/17.
 *
 * @class
 * @extends {cc.Sprite}
 * @mixes {pd.decorators.EventDispatcher}
 * @mixes {pd.decorators.ClickableNode}
 * @classdesc Implementação funcional de um joystick virtual analógico.
 */
pd.Joystick = cc.Sprite.extend(pd.decorators.EventDispatcher).extend(pd.decorators.ClickableNode).extend({/** @lends pd.Joystick#**/
    /**
     * A parte 'arrastável' do joystick.
     * @type {cc.Sprite}
     */
    _pad:null,
    /**
     * Indica se o controle está sendo movido.
     * @type {Boolean}
     */
    _isGrabbed: false,
    /**
     * O objeto responsável por controlar o joystick.
     * @type {cc.Node}
     */
    _handler:null,
    /**
     * A função do handler a ser chamada quando o status do joystick mudar (modo explícito).
     * @type {Function|String}
     */
    _handlerFunc:null,
    /**
     * @type {cc.Point}
     */
    _targetPoint:null,
    /**
     * O ID to touch interagindo com o joystick.
     * @type {Number}
     */
    _touchID:-1,
    /**
     * A distância máxima que o pad pode se afastar de sua posição inicial (raio do joystick).
     */
    _radius:0,
    /**
     * @type {cc.Point}
     */
    _delta:null,
    /**
     * @type {cc.Point}
     */
    _power:null,
    /**
     * Indica se o movimento do joystick é analógico (false) ou baseado em direções pré-setadas (true).
     * @type {Boolean}
     */
    _keyboardMode:false,
    /**
     * Variável interna para a lógica do 'modo teclado'.
     * @type {Boolean}
     */
    _allow8Directions:false,
    /**
     * Variável interna para a lógica do 'modo teclado'.
     * @type {Number}
     */
    _threshold:0,
    /**
     * Variável interna para a lógica do 'modo teclado'.
     * @type {{left:Boolean, right:Boolean, up:Boolean, down:Boolean}}
     */
    _keyboardModeMetadata:{left:false, right:false, up:false, down:false},
    /**
     * Indica se o modo follow está ativo.
     * @type {Boolean}
     */
    _followMode:false,
    /**
     * Variável interna para a lógia do 'modo follow'.
     * @type {cc.Rect}
     */
    _followModeTouchArea:null,

    /**
     * @constructs
     * @param attr {{x:Number, y:Number, scaleX:Number, scaleY:Number, opacity:Number, visible:Boolean, rotation:Number}} - as propriedades de exibição do joystick.
     * @param autoEnable {Boolean} - indica se os listeners do joystick devem ser adicionados automaticamente após a sua construção.
     * @param eventBased {Boolean} - indica se o mecanismo de callbacks do joystick será baseado em eventos.
     * @param [handler=null] {*|null} - para o método de callback explícito: o objeto que irá executar a função de callback.
     * @param [handlerFunc=null] {Function|String|null} - para o método de callback explícito: a função de callback a ser executada.
     */
    ctor: function(attr, autoEnable, eventBased, handler, handlerFunc) {
        if(typeof arguments[0] == 'number') {
            throw new Error("[pd.Joystick] Utilizando construtor antigo não mais suportado para instanciar um joystick!")
        }

        this._super(pd.getSpriteFrame("JoystickBackGround.png"));
        this._radius = this.getBoundingBox().width/2;

        this._pad = pd.createSprite("JoystickStick.png", this._radius, this._radius, this);

        this._isGrabbed = false;

        if(attr)
            this.attr(attr);

        if(autoEnable)
            this.enable();

        this.setCallbackMode(eventBased);
        this._handler = handler;
        this._handlerFunc = handlerFunc;
    },

    /**
     * Habilita o joystick.
     */
    enable: function() {
        if(this._isEnabled)
            return;

        pd.inputManager.config(this, true, cc.EventListener.TOUCH_ONE_BY_ONE, 1);

        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_DOWN, this, this._onMouseDown);
        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_MOVE, this, this._onMouseDragged);
        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_UP, this, this._onMouseUp);
        this._isEnabled = true;
    },

    /**
     * Desabilita o joystick.
     */
    disable: function() {
        if(!this._isEnabled)
            return;

        pd.inputManager.remove(pd.InputManager.EVENT_MOUSE_DOWN, this);
        pd.inputManager.remove(pd.InputManager.EVENT_MOUSE_MOVE, this);
        pd.inputManager.remove(pd.InputManager.EVENT_MOUSE_UP, this);
        this._isEnabled = false;
    },

    /**
     * Seta a cor do joystick.
     * @param color {cc.Color}
     */
    setColor: function(color) {
        this._super(color);
        this.setCascadeColorEnabled(true);
    },

    /**
     * Seta o joystick para simular um movimento com direções pré-setadas, simulando um input de teclado.
     * @param keyboardMode {Boolean} - true, para ativar. false, para desativar.
     * @param [allow8Directions=false] {Boolean} - indica se o joystick deverá aceitar 8 direções (up, down, left, right, up+left, up+right, down+left, down+right). Caso false, ele será configurado apenas para 4 direções (up, down, left e right).
     * @param [threshold=0.1] {Number} - um valor entre 0 e 1, que indica a porcentagem da distância que o 'pad' deve estar do centro do joystick para computar o movimento.
     */
    setKeyboardMode: function(keyboardMode, allow8Directions, threshold) {
        this._keyboardMode = keyboardMode;
        if(keyboardMode) {
            this._allow8Directions = allow8Directions;
            this._threshold = threshold || 0.1;
        }
    },

    /**
     * Seta o joystick para 'seguir' o toque do usuário, aparecendo na posição inicial do evento de toque toda a vez que o usuário tocar na área indicada.
     * @param followMode {Boolean} - true, para ativar. false, para desativar.
     * @param [touchArea=null] {cc.Rect} - a área disponível em que o joystick pode aparecer. Caso seja null, a área disponível será a tela inteira.
     */
    setFollowMode: function(followMode, touchArea) {
        this._followMode = followMode;
        if(followMode) {
            this.setVisible(false);
            this._followModeTouchArea = touchArea;
        }
    },

    /**
     * Atualiza as coordenadas do ponto-álvo.
     * @param x {Number}
     * @param y {Number}
     * @private
     */
    _setTargetPoint: function(x, y) {
        if(!this._targetPoint)
            this._targetPoint = cc.p(0, 0);

        this._targetPoint.x = x - this.x + this._radius;
        this._targetPoint.y = y - this.y + this._radius;
    },

    /**
     * Reseta o pad para a posição inicial.
     * @private
     */
    _resetTargetPoint: function() {
        if(!this._targetPoint)
            this._targetPoint = cc.p(0, 0);

        this._targetPoint.x = this._radius;
        this._targetPoint.y = this._radius;
    },

    /**
     * @param eventOrTouch {Object|Array}
     * @private
     */
    _onMouseDown: function(eventOrTouch) {
        if(!this.isGrabbed) {
            if(this._followMode) {
                if(!this._followModeTouchArea || pd.pointInPolygonIntersection(eventOrTouch.getLocation(), pd.rectToPolygon(this._followModeTouchArea))) {
                    this.setPosition(eventOrTouch.getLocationX(), eventOrTouch.getLocationY());
                    this.setVisible(true);
                }
                else {
                    return;
                }
            }

            if (this.isInside(eventOrTouch.getLocationX(), eventOrTouch.getLocationY())) {
                this.isGrabbed = true;
                if (cc.sys.isMobile) {
                    if (this._touchID == -1)
                        this._touchID = eventOrTouch.getID();
                }
                this._setTargetPoint(eventOrTouch.getLocationX(), eventOrTouch.getLocationY());
                this._updatePad();
            }
        }
    },

    /**
     * @param eventOrTouch {Object|Array}
     * @private
     */
    _onMouseDragged: function(eventOrTouch) {
        if(this.isGrabbed == true && (!cc.sys.isMobile || eventOrTouch.getID() == this._touchID)) {
            this._setTargetPoint(eventOrTouch.getLocationX(), eventOrTouch.getLocationY());
            this._updatePad();
        }
    },

    /**
     * @param eventOrTouch {Object|Array}
     * @private
     */
    _onMouseUp: function(eventOrTouch) {
        if(this.isGrabbed == true && (!cc.sys.isMobile || eventOrTouch.getID() == this._touchID)) {
            this._resetTargetPoint();
            this.isGrabbed = false;
            this._updatePad();
            if(this._followMode)
                this.setVisible(false);
            this._touchID = -1;
        }
    },

    /**
     * Atualiza a posição do pad.
     * @private
     */
    _updatePad: function() {
        var offset = this._radius - 15;
        this._pad.x = this._targetPoint.x;
        this._pad.y = this._targetPoint.y;
        
        if (Math.sqrt(Math.pow(this._pad.x - this._radius, 2) + Math.pow(this._pad.y - this._radius, 2)) > offset) {
            var angle = Math.atan2(this._pad.y - this._radius, this._pad.x - this._radius);
            this._pad.x = this._radius + Math.cos(angle) * offset;
            this._pad.y = this._radius + Math.sin(angle) * offset;
        }

        var proportionX = (this._pad.x - this._radius) / offset;
        var proportionY = (this._pad.y - this._radius) / offset;

        if(this._keyboardMode) {
            proportionX = Math.abs(proportionX) > this._threshold && (this._allow8Directions || (Math.abs(proportionX) > Math.abs(proportionY))) ? proportionX/Math.abs(proportionX) : 0;
            proportionY = Math.abs(proportionY) > this._threshold && (this._allow8Directions || (Math.abs(proportionY) > Math.abs(proportionX))) ? proportionY/Math.abs(proportionY) : 0;
            this._handleCallback(proportionX, proportionY, proportionX, proportionY);
        }
        else {
            this._handleCallback(proportionX, proportionY, (Math.exp(Math.abs(proportionX)) - 1) / 1.72, (Math.exp(Math.abs(proportionY)) - 1) / 1.72);
        }
    },

    /**
     * Manipula o mecanismo de callback.
     * @private
     */
    _handleCallback: function(deltaX, deltaY, powerX, powerY) {
        if(!this._delta)
            this._delta = cc.p(0, 0);
        this._delta.x = deltaX;
        this._delta.y = deltaY;

        if(!this._power)
            this._power = cc.p(0, 0);
        this._power.x = powerX;
        this._power.y = powerY;

        if(this._shouldDispatchEvent()) {
            pd.inputManager.setEventMetadata("_joystickMeta", this, this._delta, this._power);
            this._dispatchInputEvent(pd.InputManager.EVENT_JOYSTICK_STATUS, pd.inputManager["_joystickMeta"]);

            if(this._keyboardMode) {
                this._checkKeyboardDirection("left", deltaX == -1, pd.Keys.LEFT);
                this._checkKeyboardDirection("right", deltaX == 1, pd.Keys.RIGHT);
                this._checkKeyboardDirection("up", deltaY == 1, pd.Keys.UP);
                this._checkKeyboardDirection("down", deltaY == -1, pd.Keys.DOWN);
            }
        }
        else if(this._handler && this._handlerFunc) {
            this._performCall(this._handler, this._handlerFunc, [this, this._delta, this._power]);
        }
        else {
            cc.log("[pd.Joystick] Aviso: Não foi registrada uma função de callback para o joystick (modo explícito)!");
        }
    },

    /**
     * Manipula o disparo de eventos de teclado para o keyboardMode.
     * @private
     */
    _checkKeyboardDirection: function(direction, active, keyCode) {
        if(this._keyboardModeMetadata[direction] == false && active) {
            pd.inputManager.setEventMetadata("_keyboardMeta", this, keyCode);
            this._dispatchInputEvent(pd.InputManager.EVENT_KEY_DOWN, pd.inputManager["_keyboardMeta"]);
            this._keyboardModeMetadata[direction] = true;
        }
        else if(this._keyboardModeMetadata[direction] == true && !active) {
            pd.inputManager.setEventMetadata("_keyboardMeta", this, keyCode);
            this._dispatchInputEvent(pd.InputManager.EVENT_KEY_UP, pd.inputManager["_keyboardMeta"]);
            this._keyboardModeMetadata[direction] = false;
        }
    }

});