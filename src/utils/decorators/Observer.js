/**
 * Created by Ryan Balieiro on 15/09/17.
 * Implementa a capacidade a um objeto de 'observar' outro objeto que seja observável.
 * Ao usar decorate, ele seta a propriedade _handlingMap para nulo, então tomar esse cuidado ao utilizar esse decorator
 * @mixin
 */
pd.decorators.Observer = {/** @lends pd.decorators.Observer#*/

    /**
     * @type {Object} - tabela hash que armazena os metadados da manipulação de notificações da interação sendo observada.
     */
    _handlingMap: null,

    /**
     * Define o método a ser executado mediante o recebimento de uma notificação.
     * @param {String} eventID
     * @param {pd.decorators.cbObserver} handlingFunc
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
 @callback pd.decorators.cbObserver
 @param {string} eventID - eventID
 @param {*} eventData - eventData
 */