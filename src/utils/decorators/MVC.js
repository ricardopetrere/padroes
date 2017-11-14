/**
 * Created by Ryan Balieiro on 15/09/17.
 *
 * @desc
 * Implementacao de componentes MVC utilizando o paradigma do observador.
 */

/**
 * Implementa as funcionalidades básicas de uma view principal da aplicação. <br />
 * A implementação é baseada no paradigma do observador, onde a view atua como um objeto observável em uma relaçāo one-to-one com um controlador (observador).
 * @mixin
 */
pd.decorators.ObservableView = {/** @lends pd.decorators.ObservableView#*/
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
    },

    /**
     * Notifica o controlador que um som deve ser tocado.
     * @param {String} soundEffect
     * @param {Number} [volume=1]
     */
    notifySoundEvent: function(soundEffect, volume) {
        this._soundEventMetadata = {soundEffect:soundEffect, volume:volume || 1}
        this.notify(pd.decorators.ObservableView.Events.SOUND, this._soundEventMetadata);
    }
};

/**
 * @enum {String}
 */
pd.decorators.ObservableView.Events = {
    SOUND: "viewEventSound",
    VIEW_DID_INIT: "viewDidInit",
    VIEW_DID_GET_READY: "viewDidGetReady",
    VIEW_DID_FINISH_INTRO: "viewDidFinishIntro",
    VIEW_DID_DESTROY: "viewDidDestroy"
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
     * Seta a view a ser controlada.
     * @param {Object} view
     */
    setTargetView: function(view) {
        view.bind(this);
        this.view = view;
        if(!this._handlingMap)
            pd.decorate(this, pd.decorators.Observer);
        this.setSoundObserver();
    },

    /**
     * Ativa o observador de eventos de som padrão.
     */
    setSoundObserver: function() {
        this.observe(pd.decorators.ObservableView.Events.SOUND, this.onSoundEffect);
    },

    /**
     * Toca um som notificado pela view.
     * @param {String} eventID
     * @param {{soundEffect:String, volume:1}} eventData
     */
    onSoundEffect: function(eventID, eventData) {
        pd.audioEngine.playEffect(eventData.soundEffect, false, eventData.volume);
    }
};

/**
 * Implementa as funcionalidades básicas de um objeto do model que responde a um controlador de uma view.
 * @borrows pd.decorators.ObservableView.notify as notify
 * @borrows pd.decorators.ObservableView.setVerbose as setVerbose
 * @mixin
 */
pd.decorators.ObservableModel = {/** @lends pd.decorators.ObservableModel#*/
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
    setVerbose:pd.decorators.ObservableView.setVerbose,

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
     * @param {*} [eventData=null] Um objeto contendo dados a serem passados
     */
    notify: function(eventID, eventData) {
        if(this.controller)
            this.controller.handleNotification(eventID, eventData);

        if(this.verbose)
            cc.log("[ModelEvent " + eventID + "] fired. Metadata sent: " +
                (eventData !== undefined ? "[" + JSON.stringify(eventData) + "]" : "[]"));
    }
};

/**
 * Decorator responsável por encapsular a lógica intrínsica de um objeto cc.Scene dentro da arquitetura MVC.
 * O objeto cc.Scene é um objeto híbrido que, dentro do contexto do jogo, representa tanto o ponto de entrada da:
 * - view: pois é a viewport raíz dentro da arquitetura interna do framework.
 * - controller: pois uma mudança de cena acarreta em uma mudança no estado da aplicação.
 * Ou seja, os objetos cc.Scene são tanto controladores, como views.
 * A idéia deste componente é parametrizar a forma como o processo de criação da View principal (MainLayer) da cena é feito, assim como a criação e injeção de seu controlador. Ao implementar este decorator, a cena age como um 'delegate' dentro da arquitetura.
 * @mixin
 */
pd.decorators.MVCSceneCapabilities = {/** @lends pd.decorators.MVCSceneCapabilities#**/

    /**
     * Seta a view principal da cena e seu respectivo controlador.
     * @param {*} viewPrototype Um objeto que implemente o decorator {@link pd.decorators.ObservableView}
     * @param {*} controllerPrototype Um objeto que implemente o decorator {@link pd.decorators.ViewController}
     */
    setup: function(viewPrototype, controllerPrototype) {
        this.mainLayer = new viewPrototype();
        this.addChild(this.mainLayer);
        const controller = new controllerPrototype();
        controller.setTargetView(this.mainLayer);
        controller.init();
        this.mainLayer.init();
    }
};
//</editor-fold>
