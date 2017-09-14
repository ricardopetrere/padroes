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
 * @namespace
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
     * Altera atributos do estado de exibição salvo do objeto, sem afetar os atributos atuais dele.
     * @param attr
     */
    changeDisplayState: function(attr) {
        if(!this.displayState) {
            cc.warn("[pd.decorators.ResetableNode] Não foi salvo um estado de exibição para o objeto.");
            return;
        }
        pd.parseAttr(attr);
        for(var i in attr) {
            if(pd.decorators.ResetableNode.DISPLAY_PROPERTIES.lastIndexOf(i) != -1)
                this.displayState[i] = attr[i];
        }
    },

    /**
     * Obtém a ação de reset, responsável por interpolar o objeto de volta para todos os valores das propriedades do estado inicial.
     * @param {Number} time
     * @param {Function} easingFunction
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
     * Interpola para o estado de exibição salvo.
     * @param {Number} time
     * @param {Function} easingFunction
     * @param {Function} [callback=null]
     * @param {*} [callbackHandler=null]
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
    /**
     * Os dados de posição pré-cacheados do objeto.
     * @type {{local:cc.Point, global:cc.Point}}
     */
    _positionData: null,

    /**
     * Bounding Box utilizada para a colisão por intersecção.
     * @type {cc.Rect}
     */
    _cachedBoundingBox:null,

    /**
     *
     * @type {cc.Rect}
     */
    _collisionRect: null,

    /**
     * Salva uma cópia dos dados de exibição do objeto. <br >
     * Esse método tem o intuito de reaproveitar objetos geométricos utilizados em colisões, visando otimizar o uso da memória.
     * @private
     */
    cacheCollisionData: function() {
        this._positionData = this._positionData || {local:cc.p(null, null), global:null};

        if(this._positionData.local.x != this.x || this._positionData.local.y != this.y) {
            this._positionData.local.x = this.x;
            this._positionData.local.y = this.y;
            this._positionData.global = this.convertToWorldSpace(this._positionData.local);
            this._cachedBoundingBox = this.getBoundingBoxToWorld();
        }
    },

    /**
     * Atualiza o retângulo de colisão .
     * @param {Number} x
     * @param {Number} y
     * @param {Number} size
     * @private
     */
    _updateCollisionRect: function(x, y, size) {
        this._collisionRect = this._collisionRect || cc.rect(0, 0, 0, 0);
        var rect = this._collisionRect;
        rect.x = x;
        rect.y = y;
        rect.width = size || 1;
        rect.height = size || 1;
    },

    /**
     * Verifica se um ponto local (x,y) está contido dentro da collision box/bounding box do node.
     * @param {Number} _x
     * @param {Number} _y
     * @param {Number} [tolerance = 1]
     * @returns {Boolean}
     */
    isInside: function(_x, _y, tolerance) {
        this._updateCollisionRect(_x, _y, tolerance);
        return cc.rectIntersectsRect(this._cachedBoundingBox || this.getBoundingBoxToWorld(), this._collisionRect);
    },

    /**
     * Calcula a distância entre a sprite e um ponto, para o caso de colisões por distância.
     * @param {Number} _x
     * @param {Number} _y
     * @returns {number}
     */
    getRelativeDistanceTo: function(_x, _y) {
        return pd.pointDistance(_x, _y, this._positionData.global.x, this._positionData.global.y);
    }
};

/**
 * Transforma uma cc.LabelTTF em um display de pontuação animado.
 * @mixin
 */
pd.decorators.UpdateableScoreDisplay = {/** @lends pd.decorators.UpdateableScoreDisplay#*/
    /**
     * @type {Number}
     */
    _currentScore:0,

    /**
     * @type {Number}
     */
    _targetDuration:0,

    /**
     * @type {Number}
     */
    _currentDuration:0,

    /**
     * @type {Number}
     */
    _dScore:0,

    /**
     * Seta o score atual.
     * @param {String|Number} score - a pontuação atual.
     * @param {Number} [duration=0] - a duração da animação.
     */
    setScore: function(score, duration) {
        duration = duration || 0;
        if(duration > 0) {
            var current = parseInt(this.getString());
            if (!current || isNaN(current))
                current = 0;

            this._currentScore = current;
            this._targetDuration = duration;
            this._currentDuration = 0;
            this._dScore = score - current;

            this.scheduleUpdate();
        }
        else {
            this.setString(score.toString());
        }
    },

    /**
     * Atualiza a animação.
     * @param dt
     */
    update: function(dt) {
        this._currentDuration += dt;
        const percentage = pd.clamp(this._currentDuration/this._targetDuration, 0, 1);
        this.setString(Math.round(this._currentScore + this._dScore*percentage).toString());
        if(percentage == 1) {
            this.setString(this._currentScore + this._dScore);
            this.unscheduleUpdate();
        }
    }
};

/**
 * Implementa as funcionalidades básicas de um objeto que realiza parallax. <br/>
 * Ao contrário de {@link cc.ParallaxNode}, neste caso é o objeto-filho que possui as configurações de parallax, assim fica mais versátil <br/>
 * O comportamento normal ao se usar esse decorator é de aplicá-lo a um objeto filho da layer principal, que esteja com uma ação {@link cc.Follow} rodando
 * @mixin
 */
pd.decorators.ParallaxObject = {/** @lends pd.decorators.ParallaxObject#*/
    /**
     * A posição default do objeto, para quando o {@link parallaxParent} estiver em cc.p(0,0)
     * @type {cc.Point}
     */
    parallaxOffset: null,
    /**
     * O objeto-pai no parallax. Não necessariamente o pai do objeto, mas normalmente é a layer na qual o objeto está
     * @type {cc.Node}
     */
    parallaxParent: null,
    /**
     * Taxa de correspondência de parallax com {@link parallaxParent}, em X e Y. Quanto mais próximos de 1, menos o objeto se movimentará na tela
     * @type {cc.Point}
     */
    parallaxRatio: null,
    /**
     *
     * @param {cc.Point} ratio
     * @param {cc.Point} [offset]
     */
    parallaxConfigure: function (ratio, offset) {
        this.parallaxParent = this.getParent();
        this.parallaxOffset = cc.p(offset || this.getPosition());
        this.parallaxRatio = cc.p(ratio || cc.p(1, 1));
    },
    /**
     *
     * @param {number} dt
     */
    parallaxMove: function (dt) {
        this.x = this.parallaxOffset.x - (this.parallaxRatio.x * this.parallaxParent.x);
        this.y = this.parallaxOffset.y - (this.parallaxRatio.y * this.parallaxParent.y);
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
     * @param {Boolean} eventBased
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
     * @param {*} handler
     * @param {Function|String} handlerFunc
     * @param {Array} handlerArgs
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
     * @param {String} eventType
     * @param {Array} eventMetadata - metadados pré-setados (utilizar o mecanismo de cache do pd.InputManager}
     * @protected
     */
    _dispatchInputEvent: function(eventType, eventMetadata) {
        if(this._callbackMode == pd.decorators.EventDispatcher.CALLBACK_MODE_EXPLICIT)
            throw new Error("[pd.decorators.EventDispatcher] O modo de callback do componente é baseado em chamadas explícitas!");

        pd.inputManager.call(this, eventType, eventMetadata);
    }
};

/**
 * Modo de callback explícito: as funções de callback são definidas no construtor do objeto, e são invocadas de maneira explícita.
 * @constant
 * @type {string}
 */
pd.decorators.EventDispatcher.CALLBACK_MODE_EVENT_BASED = "callbackModeEventBased";

/**
 * Modo de callback baseado em eventos: os objetos disparam notificações, permitindo que as funções de callback sejam injetadas por um controlador externo.
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
     * @param {pd.decorators.ViewController} controller
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
     * @param {Boolean} verbose
     */
    setVerbose: function(verbose) {
        this.verbose = verbose;
    },

    /**
     * Dá o controle do 'update' ao objeto controlador.
     * @param {Number} dt
     */
    update: function(dt) {
        if(this.controller)
            this.controller.update(dt);
    },

    /**
     * Notifica o controlador acerca de um evento, se houver um controlador.
     * @param {String} eventID
     * @param {*} [eventData=null]
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
     * @param {Object} view
     */
    setTargetView: function(view) {
        view.bind(this);
        this.view = view;
    },

    /**
     * Define o método a ser executado mediante o recebimento de uma notificação.
     * @param {String} eventID
     * @param {Function} handlingFunc
     */
    observe: function(eventID, handlingFunc) {
        this._handlingMap = this._handlingMap || {};
        this._handlingMap[eventID] = handlingFunc;
    },

    /**
     * Manipula notificações provenientes de um objeto observável.
     * @param {String} eventID
     * @param {*} eventData
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
     * @param {String} eventID
     * @param {*} [eventData=null]
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
