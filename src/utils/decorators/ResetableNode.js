/**
 * Created by Ryan Balieiro on 15/09/17.
 *
 * @desc
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
     * O zOrder original do objeto.
     */
    originalZOrder:null,

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
     * Retorna um pd.perfectCallFunc que reseta o objeto.
     * @param {Number} time
     * @param {Function} [ease]
     */
    getResetCallFunc: function(time, ease) {
        return pd.perfectCallFunc(this.tweenBackToDisplayState, this, time, ease)
    },

    /**
     * Interpola para o estado de exibição salvo.
     * @param {Number} time
     * @param {Function} [easingFunction]
     * @param {Function} [callback=null]
     * @param {*} [callbackHandler=null]
     */
    tweenBackToDisplayState: function(time, easingFunction, callback, callbackHandler) {
        if(!this.displayState)
            return;

        easingFunction = easingFunction || cc.easeQuadraticActionOut;
        this.runAction(cc.sequence(
            this.getResetAction(time, easingFunction),
            cc.callFunc(callback, callbackHandler)
        ));
    },

    /**
     * Muda o zOrder do objeto, salvando o zOrder antigo.
     * @param customZOrder
     */
    moveForward: function(customZOrder) {
        if(!this.originalZOrder) {
            this.originalZOrder = this.getLocalZOrder();
            this.setLocalZOrder(customZOrder);
        }
    },

    /**
     * Reseta o zOrder do objeto.
     */
    resetZOrder: function() {
        if(this.originalZOrder) {
            this.setLocalZOrder(this.originalZOrder);
            this.originalZOrder = null;
        }
    }
};

/**
 * @constant
 * @type {String[]}
 */
pd.decorators.ResetableNode.DISPLAY_PROPERTIES = ['x', 'y', 'scaleX', 'scaleY', 'rotation', 'opacity', 'visible'];