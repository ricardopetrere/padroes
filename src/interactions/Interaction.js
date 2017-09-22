/**
 * Created by ryanbalieiro on 15/09/17.
 * @class
 * @extends {cc.Class}
 * @classdesc Classe base para a implementação de interações utilizando o paradigma do observador.
 */
pd.Interaction = cc.Class.extend({/** @lends pd.Interaction# **/

    /**
     * O node principal onde ocorre a interação.
     * Todos os listeners da interação serão adicionados neste node.
     */
    _handler:null,

    /**
     * O objeto 'observando' a interação.
     * @type {*}
     */
    _observer: null,

    /**
     * Os objetos involvidos na interação.
     * @type {Array}
     */
    _actors:null,

    /**
     * Indica se o modo verboso está ativo.
     * @type {Boolean}
     */
    _verbose:false,

    /**
     * Indica se a interação está ativa.
     */
    _enabled:false,

    /**
     * @type {String}
     */
    _className:"Interaction",

    /**
     * @constructs
     * @param {*} handler - O node principal onde ocorre a interação.
     */
    ctor: function(handler) {
        this._handler = handler;
    },

    /**
     * Seta o observador da interação (por enquanto apenas suportando um, mas a idéia é suportar múltiplos observadores).
     * @param {*} observer
     */
    setObserver: function(observer) {
        this._observer = observer;
    },

    /**
     * Dispara uma notificação ao observador, se houver.
     * @param {String} eventID
     * @param {*} eventData
     */
    notifyObserver: function(eventID, eventData) {
        if(this._observer)
            this._observer.handleNotification(eventID, eventData);

        if(this._verbose)
            cc.log("[" + this._className + "Event" + eventID + "] fired. Metadata sent: " +
                (eventData !== undefined ? "[" + JSON.stringify(eventData) + "]" : "[]"));
    },

    /**
     * Adiciona um objeto atuante à interação.
     * @param {*} actor
     */
    addActor: function(actor) {
        if(!this._actors)
            this._actors = [];
        if (this._actors.lastIndexOf(actor) < 0)
            this._actors.push(actor);
    },

    /**
     * Adiciona vários objetos atuantes de uma vez.
     * @param {...*} actors
     */
    addBundle: function(actors) {
        if(arguments.length > 2)
            actors = arguments;

        for(var i in actors)
            this.addActor(actors[i]);
    },

    /**
     * Remove um objeto atuante da interação.
     * @param {*} actor
     */
    removeActor: function(actor) {
        if(!this._actors)
            return;

        const index = this._actors.lastIndexOf(actor);
        if(index != -1)
            this._actors.splice(index, 1);
    },

    /**
     * Ativa a interação.
     */
    enable: function() {
        this._enabled = true;
    },

    /**
     * Desativa a interação.
     */
    disable: function() {
        this._enabled = false;
    },

    /**
     * Seta o modo 'verboso' (emitir logs mediante notificações enviadas).
     * @param {Boolean} verbose
     */
    setVerbose: function(verbose) {
        this._verbose = verbose;
    }
});