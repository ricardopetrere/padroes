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
 * @type {Object}
 */
pd.decorators = {};

//<editor-fold desc="#Node Behaviour">
/**
 * Implementa a capacidade de um node resetar suas propriedades de exibição. <br />
 * Este decorator é útil para objetos de Numbererface e cenário que animam, e eventualmente, precisam resetar-se para seu estado inicial em algum ponto da aplicação.
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
     * Obtém a ação de reset, responsável por Numbererpolar o objeto de volta para todos os valores das propriedades do estado inicial.
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
     * Numbererpola para o estado de exibição salvo.
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

    /**
     * @param _x {Number}
     * @param _y {Number}
     * @param _width {Number}
     * @param _height {Number}
     * @private
     */
    _setPreCachedRect: function(_x, _y, _width, _height) {
        if(!this._preCachedRect)
            this._preCachedRect = cc.rect();
        this._preCachedRect.x = _x;
        this._preCachedRect.y = _y;
        this._preCachedRect.width = _width;
        this._preCachedRect.height = _height;
    },

    /**
     * Verifica se um ponto local (x,y) está contido dentro do bounding box do node.
     * @param _x {Number}
     * @param _y {Number}
     * @param [tolerance = 1] {Number}
     * @returns {Boolean}
     */
    isInsideLocal: function(_x, _y, tolerance) {
        this._setPreCachedRect(_x, _y, tolerance, tolerance);
        return cc.rectIntersectsRect(cc.rect(this._preCachedRect, this.getBoundingBox()));
    },

    /**
     * Verifica se um ponto global (x,y) está contido dentro do bounding box do node.
     * @param _x {Number}
     * @param _y {Number}
     * @param [tolerance = 1] {Number}
     * @returns {Boolean}
     */
    isInsideGlobal: function(_x, _y, tolerance) {
        this._setPreCachedRect(_x, _y, tolerance, tolerance);
        return cc.rectIntersectsRect(this._preCachedRect, this.getBoundingBoxToWorld());
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
            cc.log("[ViewEvent " + eventID + "] fired. Metadata received: " +
                (eventData !== undefined ? "[" + JSON.stringify(eventData) + "]" : "[]"));
    }
};

/**
 * Implementa as funcionalidades básicas de um controlador de uma view. <br />
 * O objeto controlador é o único observador dentro da arquitetura. Sua Numbereração com o 'model' e a 'view' da aplicação ocorre: <br />
 * - de maneira explícita: quando é ele quem está Numbereragindo com um componente. <br />
 * - via notificações: quando um componente Numbererage com ele. <br />
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
     * Diferentemente da Numbereração controller-view, nāo ocorre o processo de databinding, pois o objeto model pertence à arquitetura, e não ao controlador, permitindo que o objeto para qual ele responda seja redefinido. <br >
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
            cc.log("[ModelEvent " + eventID + "] fired. Metadata received: " +
                (eventData !== undefined ? "[" + JSON.stringify(eventData) + "]" : "[]"));
    }
};
//</editor-fold>