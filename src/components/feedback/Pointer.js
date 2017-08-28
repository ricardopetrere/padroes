/**
 * Created by Ryan Balieiro on 24/08/17.
 * @class {pd.Pointer}
 * @extends {pd.Animation}
 * @mixes {pd.decorators.ResetableNode}
 * @classdesc Implementação de uma seta de mouse para feedbacks de indicação/clique.
 *            O componente é adaptativo, transformando-se em uma 'mão' quando estiver em uma aplicação mobile.
 */
pd.Pointer = pd.Animation.extend(pd.decorators.ResetableNode).extend({/**@lends pd.Pointer#**/

    /**
     * A duração de um feedback de clique.
     * @type {Number}
     */
    _clickDuration:0.1,

    /**
     * @constructs
     */
    ctor: function() {
        this._super();

        const frameName = "mouse" in cc.sys.capabilities ? "seta_" : "dedo_";
        this.addAnimation('normal', 1, 1, frameName);
        this.addAnimation('pressed', 2, 2, frameName);
        this.setAnchorPoint(0,1);
    },

    /**
     * Ativa o feedback de clique do ponteiro.
     */
    setAsPressed: function() {
        this.changeAndStop('pressed');
    },

    /**
     * Libera o feedback de clique do ponteiro.
     */
    setAsReleased: function() {
        this.changeAndStop('normal');
    },

    /**
     * Seta a duração do feedback de clique.
     * @param {Number} clickDuration
     */
    setClickDuration: function(clickDuration) {
        this._clickDuration = clickDuration;
    },

    /**
     * Anima o ponteiro.
     * @param {Number} time - o tempo da animação.
     * @param {pd.Pointer.AnimationTypes} type - o tipo da animação.
     * @param {Number} [x=undefined] - a posição x para o qual a seta deve deslocar-se. se for undefined, não haverá deslocamento em X.
     * @param {Number} [y=undefined] - a posição y para o qual a seta deve deslocar-se. se for undefined, não haverá deslocamento em Y.
     * @param {Boolean} [autoRun=false] - indica se a ação deve ser rodada no momento em que a função for invocada.
     * @param {Function} [easingFunc=null] - função de easing para a animação de escala.
     * @returns {cc.TargetedAction}
     */
    animate: function(time, type, x, y, autoRun, easingFunc) {
        // Estado inicial: pressionado, se for animação de DRAG, solto para as demais animações.
        const sequenceSteps = [];
        sequenceSteps.push(
            cc.callFunc(type == pd.Pointer.AnimationTypes.DRAG ? this.setAsPressed : this.setAsReleased, this)
        );

        // Deslocamento para as coordenadas informadas.
        if(x != undefined && y != undefined) {
            if(time > 0)
                sequenceSteps.push(cc.targetedAction(this, cc.moveTo(time, x, y)).easing(easingFunc || cc.easeSineIn()));
            else
                sequenceSteps.push(cc.targetedAction(this, cc.place(x, y)));
        }
        else if(time > 0) {
            sequenceSteps.push(cc.delayTime(time));
        }

        // Finalização da animação.
        if(type == pd.Pointer.AnimationTypes.CLICK) {
            sequenceSteps.push(cc.sequence(
                cc.callFunc(this.setAsPressed, this),
                cc.delayTime(this._clickDuration),
                cc.callFunc(this.setAsReleased, this)
            ));
        }
        else if(type == pd.Pointer.AnimationTypes.DRAG) {
            sequenceSteps.push(
                cc.callFunc(this.setAsReleased, this)
            );
        }

        this._customTween = cc.sequence(sequenceSteps);
        if(autoRun === true)
            this.runAction(this._customTween);

        return this._customTween;
    },

    /**
     * Anima o ponteiro, de maneira relativa.
     * @param {Number} time - o tempo da animação.
     * @param {pd.Pointer.AnimationTypes} type - o tipo da animação.
     * @param {Number} [x=0] - o deslocamento em 'x'.
     * @param {Number} [y=0] - o deslocamento em 'y'.
     * @param {Boolean} [autoRun=false] - indica se a ação deve ser rodada no momento em que a função for invocada.
     * @param {Function} [easingFunc=null] - função de easing para a animação de escala.
     * @returns {cc.TargetedAction}
     */
    animateBy: function(time, type, x, y, autoRun, easingFunc) {
        x = x || 0;
        y = y || 0;
        return this.animate(time, type, this.x + x, this.y + y, autoRun, easingFunc);
    },

    /**
     * Faz uma animação de drag.
     * Função auxiliar alternativa ao animate apenas para simplicar a chamada.
     * @param {Number} time - o tempo da animação.
     * @param {Number} [x=0] - a coordenada 'x'.
     * @param {Number} [y=0] - a coordenada 'y'.
     * @param {Boolean} [autoRun=false] - indica se a ação deve ser rodada no momento em que a função for invocada.
     * @param {Function} [easingFunc=null] - função de easing para a animação de escala.
     * @returns {cc.TargetedAction}
     */
    dragTo: function(time, x, y, autoRun, easingFunc) {
        x = x || 0;
        y = y || 0;
        return this.animate(time, pd.Pointer.AnimationTypes.DRAG, x, y, autoRun, easingFunc);
    },

    /**
     * Faz uma animação de drag, de maneira relativa.
     * Função auxiliar alternativa ao animateBy apenas para simplicar a chamada.
     * @param {Number} time - o tempo da animação.
     * @param {Number} [x=0] - o deslocamento em 'x'.
     * @param {Number} [y=0] - o deslocamento em 'y'.
     * @param {Boolean} [autoRun=false] - indica se a ação deve ser rodada no momento em que a função for invocada.
     * @param {Function} [easingFunc=null] - função de easing para a animação de escala.
     * @returns {cc.TargetedAction}
     */
    dragBy: function(time, x, y, autoRun, easingFunc) {
        x = x || 0;
        y = y || 0;
        return this.animateBy(time, pd.Pointer.AnimationTypes.DRAG, x, y, autoRun, easingFunc);
    },

    /**
     * Desloca o ponteiro até a coordenada informada e realiza uma animação de clique.
     * Função auxiliar alternativa ao animate apenas para simplicar a chamada.
     * @param {Number} time - o tempo da animação.
     * @param {Number} [x=0] - a coordenada 'x'.
     * @param {Number} [y=0] - a coordenada 'y'.
     * @param {Boolean} [autoRun=false] - indica se a ação deve ser rodada no momento em que a função for invocada.
     * @param {Function} [easingFunc=null] - função de easing para a animação de escala.
     * @returns {cc.TargetedAction}
     */
    moveToAndClick: function(time, x, y, autoRun, easingFunc) {
        x = x || 0;
        y = y || 0;
        return this.animate(time, pd.Pointer.AnimationTypes.CLICK, x, y, autoRun, easingFunc);
    },

    /**
     * Desloca o ponteiro de maneira relativa e realiza uma animalçai de clique.
     * Função auxiliar alternativa ao animateBy apenas para simplicar a chamada.
     * @param {Number} time - o tempo da animação.
     * @param {Number} [x=0] - o deslocamento em 'x'.
     * @param {Number} [y=0] - o deslocamento em 'y'.
     * @param {Boolean} [autoRun=false] - indica se a ação deve ser rodada no momento em que a função for invocada.
     * @param {Function} [easingFunc=null] - função de easing para a animação de escala.
     * @returns {cc.TargetedAction}
     */
    moveByAndClick: function(time, x, y, autoRun, easingFunc) {
        x = x || 0;
        y = y || 0;
        return this.animateBy(time, pd.Pointer.AnimationTypes.CLICK, x, y, autoRun, easingFunc);
    },

    /**
     * Realiza uma animação de clique.
     * Função auxiliar alternativa ao animate apenas para simplicar a chamada.
     * @param {Boolean} [autoRun=false] - indica se a ação deve ser rodada no momento em que a função for invocada.
     * @returns {cc.TargetedAction}
     */
    click: function(autoRun) {
        return this.animate(0, pd.Pointer.AnimationTypes.CLICK, undefined, undefined, autoRun, null);
    }
});

/**
 * Tipos de animação.
 * @enum {String}
 */
pd.Pointer.AnimationTypes = {
    CLICK:"animationTypeClick",
    DRAG:"animationTypeClickAndHold",
    MOVE:"animationTypeMove"
};