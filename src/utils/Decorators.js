/**
 * Created by Ryan Balieiro on 09/06/17.
 * @desc
 * Conjunto de estruturas pré-implementadas que podem ser adicionadas à objetos nativos ou customizados. <br />
 * Decorators podem ser utilizados para extender as funcionalidades de um objeto:
 * - estaticamente: através de sua inserção no protótipo do objeto via {Class}.extend({Decorator}).
 * - dinâmicamente: através de sua injeção no objeto em runtime, via pd.decorate({Object}, {Decorator}). A grande vantagem deste método é que as outras instâncias da classe do objeto extendido não serão afetadas.
 *
 * Método estático (inserindo o decorator pd.Model em um protótipo de um objeto):
 * @example
 * var prototype = cc.Class.extend(pd.Model).extend({...});
 *
 * Método dinâmico (inserindo o decorator pd.Model em uma instância de uma classe qualquer):
 * @example
 * pd.decorate(myObject, pd.Model);
 */

/**
 * 'Package' responsável por encapsular as implementações de objetos decorators.
 */
pd.decorators = {};

//<editor-fold desc="#Node Behaviour">
/**
 * Implementa a capacidade de um node resetar suas propriedades de exibição. <br />
 * Este decorator é útil para objetos de interface e cenário que animam, e eventualmente, precisam resetar-se para seu estado inicial em algum ponto da aplicação.
 * @mixin
 */
pd.decorators.ResetableNode = {/** @lends pd.decorators.ResetableNode#*/
    /**
     * O estado de exibição salvo.
     * @type {Object}
     */
    displayState: null,

    /**
     * Salva o estado de exibição atual.
     */
    saveDisplayState: function() {
        this.displayState = {};

        for(var i in pd.decorators.ResetableNode.DISPLAY_PROPERTIES) {
            var prop = pd.decorators.ResetableNode.DISPLAY_PROPERTIES[i];
            this.displayState[prop] = this[prop];
        }
    },

    /**
     * Carrega o estado de exibição previamente salvo.
     */
    loadDisplayState: function() {
        if(!this.displayState)
            return;

        this.attr(this.displayState);
    },

    /**
     * Obtém a ação de reset, responsável por interpolar o objeto de volta para todos os valores das propriedades do estado inicial.
     * @param time {Number}
     * @param easingFunction {Function}
     * @returns {cc.Action}
     */
    getResetAction: function(time, easingFunction) {
        return cc.spawn(
            cc.moveTo(time, this.displayState.x, this.displayState.y),
            cc.scaleTo(time, this.displayState.scaleX, this.displayState.scaleY),
            cc.fadeTo(time, this.displayState.opacity),
            cc.rotateTo(time, this.displayState.rotation)
        ).easing(easingFunction());
    },

    /**
     * interpola para o estado de exibição salvo.
     * @param time {Number}
     * @param easingFunction {Function}
     * @param [callback=null] {Function}
     * @param [callbackHandler=null] {*}
     */
    tweenBackToDisplayState: function(time, easingFunction, callback, callbackHandler) {
        if(!this.displayState)
            return;

        this.runAction(cc.sequence(
            this.getResetAction(time, easingFunction),
            cc.callFunc(callback, callbackHandler)
        ));
    }
};

/**
 * @constant
 * @type {String[]}
 */
pd.decorators.ResetableNode.DISPLAY_PROPERTIES = ['x', 'y', 'scaleX', 'scaleY', 'rotation', 'opacity', 'visible'];

/**
 * Implementa as capacidades de um node clicável. <br />
 * Este decorator é útil para objetos de interface que interagem de maneira explícita com inputs de mouse/touch.
 * @mixin
 */
pd.decorators.ClickableNode = {/** @lends pd.decorators.ClickableNode#*/
    /** @type {cc.Rect} **/
    _preCachedRect:null,

    /** @type {cc.Rect} **/
    _collisionBox:null,

    /**
     * @param _x {Number}
     * @param _y {Number}
     * @param _width {Number}
     * @param _height {Number}
     * @private
     */
    _setPreCachedCollisionRect: function(_x, _y, _width, _height) {
        if(!this._preCachedRect)
            this._preCachedRect = cc.rect();
        this._preCachedRect.x = _x;
        this._preCachedRect.y = _y;
        this._preCachedRect.width = _width || 1;
        this._preCachedRect.height = _height || 1;
    },

    /**
     * Seta uma caixa de colisão customizada.
     * @param _xOrRect {Number|cc.Rect}
     * @param [_y=null] {Number}
     * @param [_width=null] {Number}
     * @param [_height=null] {Number}
     */
    setCollisionBox: function(_xOrRect, _y, _width, _height) {
        if(typeof _xOrRect != 'number') {
            this._collisionBox = _xOrRect;
            return;
        }

        if(!this._collisionBox)
            this._collisionBox = cc.rect();

        this._collisionBox.x = _x;
        this._collisionBox.y = _y;
        this._collisionBox.width = _width;
        this._collisionBox.height = _height;
    },

    /**
     * Cacheia a boundingBox to objeto atual.
     * @param toWorld {Boolean}
     */
    cacheBoundingBoxAsCollisionBox: function(toWorld) {
        this._collisionBox = toWorld == true ? this.getBoundingBoxToWorld() : this.getBoundingBox();
    },

    /**
     * Verifica se um ponto local (x,y) está contido dentro da collision box/bounding box do node.
     * @param _x {Number}
     * @param _y {Number}
     * @param [tolerance = 1] {Number}
     * @returns {Boolean}
     */
    isInside: function(_x, _y, tolerance) {
        this._setPreCachedCollisionRect(_x, _y, tolerance, tolerance);
        return cc.rectIntersectsRect(this._preCachedRect, this._collisionBox ? this._collisionBox : this.getBoundingBox());
    },

    /**
     * Calcula a distância entre a sprite e um ponto, para o caso de colisões por distância.
     * @param _x {Number}
     * @param _y {Number}
     * @returns {number}
     */
    getRelativeDistanceTo: function(_x, _y) {
        return Math.sqrt(Math.pow(_x - this.x, 2) + Math.pow(_y - this.y, 2));
    }
};
//</editor-fold">
//<editor-fold desc="#Event Dispatching">
/**
 * Implementa a capacidade de um componente de disparar eventos via pd.InputManager.
 * @mixin
 */
pd.decorators.EventDispatcher = { /** @lends pd.decorators.EventDispatcher#*/
    /**
     * O mecanismo de callback utilizado pelo botão.
     * @type {pd.decorators.EventDispatcher.CALLBACK_MODE_EXPLICIT|pd.decorators.EventDispatcher.CALLBACK_MODE_EVENT_BASED}
     */
    _callbackMode:"",
    
    /**
     * Seta o mecanismo de callback do componente.
     * @function
     * @param eventBased {Boolean}
     */
    setCallbackMode: function(eventBased) {
        this._callbackMode = eventBased ? pd.decorators.EventDispatcher.CALLBACK_MODE_EVENT_BASED : pd.decorators.EventDispatcher.CALLBACK_MODE_EXPLICIT;
    },

    /**
     * Indica se o componente deve disparar eventos.
     * @returns {Boolean}
     */
    _shouldDispatchEvent: function() {
        return this._callbackMode == pd.decorators.EventDispatcher.CALLBACK_MODE_EVENT_BASED;
    },

    /**
     * Realiza uma chamada explícia ao método de callback.
     * @param handler {*}
     * @param handlerFunc {Function|String}
     * @param handlerArgs {Array}
     */
    _performCall: function(handler, handlerFunc, handlerArgs) {
        if(this._callbackMode == pd.decorators.EventDispatcher.CALLBACK_MODE_EVENT_BASED)
            throw new Error("[pd.decorators.EventDispatcher] O modo de callback do componente é baseado em eventos!");

        if (typeof(handlerFunc) == "function") {
            handlerFunc.apply(handler, handlerArgs);
        }
        else {
            handler[handlerFunc].apply(handler, handlerArgs);
        }
    },

    /**
     * Dispara um evento.
     * @param eventType {String}
     * @param eventMetadata {Array} - metadados pré-setados (utilizar o mecanismo de cache do pd.InputManager}
     * @protected
     */
    _dispatchInputEvent: function(eventType, eventMetadata) {
        if(this._callbackMode == pd.decorators.EventDispatcher.CALLBACK_MODE_EXPLICIT)
            throw new Error("[pd.decorators.EventDispatcher] O modo de callback do componente é baseado em chamadas explícitas!");

        pd.inputManager.call(this, eventType, eventMetadata);
    }
};

/**
 * @constant
 * @type {string}
 */
pd.decorators.EventDispatcher.CALLBACK_MODE_EVENT_BASED = "callbackModeEventBased";

/**
 * @constant
 * @type {string}
 */
pd.decorators.EventDispatcher.CALLBACK_MODE_EXPLICIT = "callbackModeExplicit";
//</editor-fold>
//<editor-fold desc="#MVC Components">
/**
 * Implementa as funcionalidades básicas de uma view principal da aplicação. <br />
 * A implementação é baseada no paradigma do observador, onde a view atua como um objeto observável em uma relaçāo one-to-one com um controlador (observador).
 * @mixin
 */
pd.decorators.View = {/** @lends pd.decorators.View#*/
    /**
     * @type {Object}
     */
    controller:null,
    /**
     * @type {Boolean}
     */
    verbose:false,

    /**
     * Injeta um controlador na view, registrando-o como seu observador. <br />
     * @param controller {pd.decorators.ViewController}
     */
    bind: function(controller) {
        if(!this.controller) {
            this.controller = controller;
        }
        else if(controller != this.controller) {
            throw new Error("[pd.decorators.view] Tentativa de vincular a view a dois controladores!");
        }
    },

    /**
     * Seta o modo 'verboso' (emitir logs mediante notificações enviadas).
     * @param verbose
     */
    setVerbose: function(verbose) {
        this.verbose = verbose;
    },

    /**
     * Dá o controle do 'update' ao objeto controlador.
     * @param dt
     */
    update: function(dt) {
        if(this.controller)
            this.controller.update(dt);
    },

    /**
     * Notifica o controlador acerca de um evento, se houver um controlador.
     * @param eventID {String}
     * @param [eventData=null] {*}
     */
    notify: function(eventID, eventData) {
        if(this.controller)
            this.controller.handleNotification(eventID, eventData);

        if(this.verbose)
            cc.log("[ViewEvent " + eventID + "] fired. Metadata sent: " +
                (eventData !== undefined ? "[" + JSON.stringify(eventData) + "]" : "[]"));
    }
};

/**
 * Implementa as funcionalidades básicas de um controlador de uma view. <br />
 * O objeto controlador é o único observador dentro da arquitetura. Sua interação com o 'model' e a 'view' da aplicação ocorre: <br />
 * - de maneira explícita: quando é ele quem está interagindo com um componente. <br />
 * - via notificações: quando um componente interage com ele. <br />
 * Um controlador de uma view precisa estar vinculado obrigatóriamente a um objeto de view. <br />
 * @mixin
 */
pd.decorators.ViewController = {/** @lends pd.decorators.ViewController#*/
    /**
     * @type {Object}
     */
    view: null,

    /**
     * @type {Object} - tabela hash que armazena os metadados da manipulação de notificações do controlador.
     */
    _handlingMap: null,

    /**
     * Seta a view a ser controlada.
     * @param view {Object}
     */
    setTargetView: function(view) {
        view.bind(this);
        this.view = view;
    },

    /**
     * Define o método a ser executado mediante o recebimento de uma notificação.
     * @param eventID {String}
     * @param handlingFunc {Function}
     */
    observe: function(eventID, handlingFunc) {
        this._handlingMap = this._handlingMap || {};
        this._handlingMap[eventID] = handlingFunc;
    },

    /**
     * Manipula notificações provenientes de um objeto observável.
     * @param eventID {String}
     * @param eventData {*}
     */
    handleNotification: function(eventID, eventData) {
        if(!this._handlingMap || !this._handlingMap[eventID])
            return;

        this._handlingMap[eventID].apply(this, [eventID, eventData]);
    }
};

/**
 * Implementa as funcionalidades básicas de um objeto do model que responde a um controlador de uma view.
 * @borrows pd.decorators.View.notify as notify
 * @borrows pd.decorators.View.setVerbose as setVerbose
 * @mixin
 */
pd.decorators.Model = {/** @lends pd.decorators.Model#*/
    /**
     * @type {pd.decorators.ViewController}
     */
    controller:null,
    /**
     * @type {Boolean}
     */
    verbose:false,

    /**
     * Seta o modo 'verboso' (emitir logs mediante notificações enviadas).
     */
    setVerbose:pd.decorators.View.setVerbose,

    /**
     * Seta o controlador-álvo. <br >
     * Diferentemente da interação controller-view, nāo ocorre o processo de databinding, pois o objeto model pertence à arquitetura, e não ao controlador, permitindo que o objeto para qual ele responda seja redefinido. <br >
     */
    setTargetController: function(controller) {
        this.controller = controller;
    },

    /**
     * Notifica o controlador acerca de um evento, se houver um controlador.
     * @param eventID {String}
     * @param [eventData=null] {*}
     */
    notify: function(eventID, eventData) {
        if(this.controller)
            this.controller.handleNotification(eventID, eventData);

        if(this.verbose)
            cc.log("[ModelEvent " + eventID + "] fired. Metadata sent: " +
                (eventData !== undefined ? "[" + JSON.stringify(eventData) + "]" : "[]"));
    }
};
//</editor-fold>