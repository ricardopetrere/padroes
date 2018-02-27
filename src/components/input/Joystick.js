/**
 * Created by Ryan Balieiro on 19/06/17.
 *
 * @class
 * @extends {cc.Sprite}
 * @mixes {pd.decorators.EventDispatcher}
 * @mixes {pd.decorators.ClickableNode}
 * @classdesc Implementação de um joystick virtual analógico.
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
     * O objeto responsável por gerenciar o joystick.
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
     * O ID do touch interagindo com o joystick.
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
     * @type {Number}
     */
    _angle:0,
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
     */
    _thresholdPercentage: 0.383,
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
     * @type {cc.Point[]}
     */
    _followModeTouchArea:null,

    /**
     * @constructs
     * @param {Object} [attr=] - as propriedades de exibição do joystick.
     * @param {Boolean} [autoEnable=false] - indica se os listeners do joystick devem ser adicionados automaticamente após a sua construção.
     * @param {Boolean} [eventBased=false] - indica se o mecanismo de callbacks do joystick será baseado em eventos.
     * @param [handler=null] {*|null} - para o método de callback explícito: o objeto que irá executar a função de callback.
     * @param [handlerFunc=null] {Function|String|null} - para o método de callback explícito: a função de callback a ser executada.
     */
    ctor: function(attr, autoEnable, eventBased, handler, handlerFunc) {
        if(typeof arguments[0] == 'number') { // não teremos suporte ao legado.
            throw new Error("[pd.Joystick] Utilizando construtor antigo não mais suportado para instanciar um joystick!")
        }

        this._super(pd.getSpriteFrame(pd.SpriteFrames.JOYSTICK_BACKGROUND));
        this._radius = this.getBoundingBox().width/2;
        this._pad = pd.createSprite(pd.SpriteFrames.JOYSTICK_PAD, this._radius, this._radius, this);
        pd.decorate(this._pad, pd.decorators.ResetableNode);
        this._pad.saveDisplayState();
        this._isGrabbed = false;

        if(attr)
            this.attr(pd.parseAttr(attr));

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

        pd.inputManager.add(pd.InputManager.Events.MOUSE_DOWN, this, this._onMouseDown);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_MOVE, this, this._onMouseDragged);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_UP, this, this._onMouseUp);
        this._isEnabled = true;
    },

    /**
     * Desabilita o joystick.
     */
    disable: function() {
        if(!this._isEnabled)
            return;

        pd.inputManager.remove(pd.InputManager.Events.MOUSE_DOWN, this);
        pd.inputManager.remove(pd.InputManager.Events.MOUSE_MOVE, this);
        pd.inputManager.remove(pd.InputManager.Events.MOUSE_UP, this);
        this._isEnabled = false;
    },

    /**
     * Seta a cor do joystick.
     * @param {cc.Color} color
     */
    setColor: function(color) {
        this._super(color);
        this.setCascadeColorEnabled(true);
    },

    /**
     * Seta o joystick para simular um movimento com direções pré-setadas, simulando um input de teclado.
     * @param {Boolean} keyboardMode - true, para ativar. false, para desativar.
     * @param {Boolean} [allow8Directions=false] - indica se o joystick deverá aceitar 8 direções (up, down, left, right, up+left, up+right, down+left, down+right). Caso false, ele será configurado apenas para 4 direções (up, down, left e right).
     * @param {Number} [threshold=0.1] - um valor entre 0 e 1, que indica a porcentagem da distância que o 'pad' deve estar do centro do joystick para computar o movimento.
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
     * @param {Boolean} followMode - true, para ativar. false, para desativar.
     * @param {cc.Rect | cc.Point[]} [touchArea=null] - a área disponível em que o joystick pode aparecer. Caso seja null, a área disponível será a tela inteira.
     */
    setFollowMode: function(followMode, touchArea) {
        this._followMode = followMode;
        if(followMode) {
            this.setVisible(false);
            this._followModeTouchArea = touchArea != null && touchArea.width != null ? pd.rectToPolygon(touchArea) : touchArea;
        }
    },

    /**
     * Anima o 'pad' do joystick, tweenando-o para uma posição customizada (útil para demonstrações/tutoriais).
     * Apenas disponível se o joystick estiver desabilitado para interações com o usuário.
     * @param {Number} time - o tempo da animação.
     * @param {Number} dX - um valor entre -1 e 1. Se for 1, o pad irá tweenar para a extremidade direita do joystick, se for -1 irá tweenar para a extremidade esquerda do joystick.
     * @param {Number} dY  - um valor entre -1 e 1.
     * @param {Boolean} [autoRun=false] - indica se a ação deve ser rodada no momento em que a função for invocada.
     * @param {Function} [easingFunc=null] - função de easing para a animação.
     * @returns {cc.TargetedAction}
     */
    animate: function(time, dX, dY, autoRun, easingFunc) {
        if(this._isEnabled)
            cc.warn("[pd.Joystick] Foi aplicada uma animação à um joystick que está ativo para interações com o usuário. Rever!");

        var offset = this._radius - 30;
        const targetX = (dX || 0)*offset;
        const targetY = (dY || 0)*offset;

        this.resetPad();
        if(time != 0)
            this._customTween = cc.targetedAction(this._pad, cc.moveTo(time, this._pad.x + targetX, this._pad.y + targetY).easing(easingFunc || cc.easeSineIn()));
        else
            this._customTween = cc.targetedAction(this._pad, cc.place(this._pad.x + targetX, this._pad.y + targetY));

        if(autoRun === true)
            this.runAction(this._customTween);

        return this._customTween;
    },

    /**
     * Reseta a posição do 'pad' para o centro.
     */
    resetPad: function() {
        this._pad.cleanup();
        this._pad.loadDisplayState();
    },

    /**
     * Atualiza as coordenadas do ponto-álvo.
     * @param {Number} x
     * @param {Number} y
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
     * @param {Object} eventOrTouch
     * @private
     */
    _onMouseDown: function(eventOrTouch) {
        if(!this.isGrabbed) {
            if(this._followMode) {
                if(
                    (!this._followModeTouchArea || pd.pointInPolygonIntersection(eventOrTouch.getLocation(), this._followModeTouchArea))
                    && !pd.isCollidingWithUIButton(eventOrTouch)
                ) {
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
     * @param {Object} eventOrTouch
     * @private
     */
    _onMouseDragged: function(eventOrTouch) {
        if(this.isGrabbed == true && (!cc.sys.isMobile || eventOrTouch.getID() == this._touchID)) {
            this._setTargetPoint(eventOrTouch.getLocationX(), eventOrTouch.getLocationY());
            this._updatePad();
        }
    },

    /**
     * @param {Object} eventOrTouch
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
        var distance = Math.sqrt(Math.pow(this._pad.x - this._radius, 2) + Math.pow(this._pad.y - this._radius, 2));
        var angle = Math.atan2(this._pad.y - this._radius, this._pad.x - this._radius);
        if (distance > offset) {
            this._pad.x = this._radius + Math.cos(angle) * offset;
            this._pad.y = this._radius + Math.sin(angle) * offset;
        }

        var percentageX = (this._pad.x - this._radius) / offset;
        var percentageY = (this._pad.y - this._radius) / offset;

        if(this._keyboardMode) {
            percentageX = this._getKeyboardModePercentage(percentageX, percentageY);
            percentageY = this._getKeyboardModePercentage(percentageY, percentageX);
        }
        this._handleCallback(percentageX, percentageY, cc.radiansToDegrees(angle));
    },

    /**
     * Retorna a porcentagem de deslocamento do stick, no modo de teclado (-1, 0 ou 1)
     * @param {Number} percentageA
     * @param {Number} percentageB
     * @returns {Number}
     * @private
     */
    _getKeyboardModePercentage: function (percentageA, percentageB) {
        if (Math.abs(percentageA) > this._thresholdPercentage && (this._allow8Directions || (Math.abs(percentageA) > Math.abs(percentageB)))) {
            return pd.roundToExtreme(percentageA, 1);
        } else {
            return 0;
        }
    },

    /**
     * Manipula o mecanismo de callback.
     * @private
     */
    _handleCallback: function(deltaX, deltaY, angle) {
        if(!this._delta)
            this._delta = cc.p(0, 0);
        this._delta.x = deltaX;
        this._delta.y = deltaY;

        this._angle = angle;

        if(this._shouldDispatchEvent()) {
            pd.inputManager.setEventMetadata("_joystickMeta", this, this._delta, this._angle);
            this._dispatchInputEvent(pd.InputManager.Events.JOYSTICK_STATUS, pd.inputManager["_joystickMeta"]);

            if(this._keyboardMode) {
                this._checkKeyboardDirection("left", deltaX == -1, pd.Keys.LEFT);
                this._checkKeyboardDirection("right", deltaX == 1, pd.Keys.RIGHT);
                this._checkKeyboardDirection("up", deltaY == 1, pd.Keys.UP);
                this._checkKeyboardDirection("down", deltaY == -1, pd.Keys.DOWN);
            }
        }
        else if(this._handler && this._handlerFunc) {
            this._performCall(this._handler, this._handlerFunc, [this, this._delta, this._angle]);
        }
        else {
            cc.warn("[pd.Joystick] Aviso: Não foi registrada uma função de callback para o joystick (modo explícito)!");
        }
    },

    /**
     * Manipula o disparo de eventos de teclado para o keyboardMode.
     * @private
     */
    _checkKeyboardDirection: function(direction, active, keyCode) {
        if(this._keyboardModeMetadata[direction] == false && active) {
            pd.inputManager._setKeyPressed(keyCode);
            pd.inputManager.setEventMetadata("_keyboardMeta", keyCode, this);
            this._dispatchInputEvent(pd.InputManager.Events.KEY_DOWN, pd.inputManager["_keyboardMeta"]);
            this._keyboardModeMetadata[direction] = true;
        }
        else if(this._keyboardModeMetadata[direction] == true && !active) {
            pd.inputManager._setKeyReleased(keyCode);
            pd.inputManager.setEventMetadata("_keyboardMeta", keyCode, this);
            this._dispatchInputEvent(pd.InputManager.Events.KEY_UP, pd.inputManager["_keyboardMeta"]);
            this._keyboardModeMetadata[direction] = false;
        }
    }

});