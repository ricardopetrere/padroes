/**
 * Created by Ryan Balieiro on 19/09/17.
 * @class
 * @extends {cc.Node}
 * @classdesc Simula feedbacks simples com partículas utilizando objetos do tipo cc.Sprite.
 */
pd.SimpleFeedback = cc.Node.extend({/** @lends pd.SimpleFeedback# **/

    /**
     * @type {Array.<cc.Sprite>} - partículas do feedback.
     */
    _particles:null,

    /**
     * @type {String}
     */
    _type:"",

    /**
     * @constructs
     * @param {String} [type=null]
     */
    ctor: function(type) {
        this._super();
        this._particles = [];
        if(type)
            this.setType(type);
    },

    /**
     * Seta o tipo de feedback.
     * @param {String} type
     */
    setType: function(type) {
        this._type = type;
    },

    /**
     * Configura o feedback.
     * @param {Number} amountOfParticles
     * @param {String} particleSpriteFrameName
     */
    config: function(amountOfParticles, particleSpriteFrameName) {
        for(var i = 0 ; i < amountOfParticles ; i++) {
            const particle = pd.createSprite(particleSpriteFrameName, {x:0, y:0, scaleX: 1, scaleY: 1}, this);
            this._particles.push(particle);
            pd.decorate(particle, pd.decorators.ResetableNode);
            particle.saveDisplayState();
        }
    },

    /**
     * Seta o spriteFrame das partículas.
     * @param particleSpriteFrameName
     */
    setSpriteFrame: function(particleSpriteFrameName) {
        const sf = pd.getSpriteFrame(particleSpriteFrameName);
        for(var i in this._particles) {
            this._particles[i].setSpriteFrame(sf);
        }
    },

    /**
     * @param {Number} time
     * @param {Number} strengthX
     * @param {Number} strengthY
     * @param {Number} [targetScale=1]
     * @param {Function} [easing=null]
     */
    play: function(time, strengthX, strengthY, targetScale, easing) {
        this._time = time;
        this._strengthX = strengthX;
        this._strengthY = strengthY;
        this._targetScale = targetScale == null ? 1 : targetScale;
        this._easing = easing;
        this.setVisible(true);

        for(var i in this._particles) {
            this._particles[i].loadDisplayState();
        }

        switch(this._type) {
            case pd.SimpleFeedback.Types.BURST:
                this._burst();
                break;
            case pd.SimpleFeedback.Types.REVEAL:
                this._reveal();
                break;
        }
    },

    /**
     * Aplica o easing à ação, se houver.
     * @param {cc.Action} action
     * @private
     */
    _applyEasing: function(action) {
        if(this._easing) {
            return action.easing(this._easing());
        }

        return action;
    },

    /**
     * Executa o feedback de burst.
     * @private
     */
    _burst: function() {
        for (var i = 0; i < this._particles.length; i++) {
            const particle = this._particles[i];
            particle.cleanup();
            particle.runAction(cc.spawn(
                this._applyEasing(cc.jumpBy(
                    this._time,
                    particle.x + i * this._strengthX * (i % 2 == 0 ? 1 : -1),
                    particle.y,
                    this._strengthY + Math.random() * (this._strengthY - 30), 1)),
                cc.scaleTo(this._time, this._targetScale),
                cc.fadeOut(this._time),
                cc.rotateBy(this._time, 720)
            ));
        }
    },

    /**
     * Executa o feedback de reveal.
     * @private
     */
    _reveal: function() {
        for (var i = 0; i < this._particles.length; i++) {
            const particle = this._particles[i];
            particle.cleanup();
            particle.runAction(cc.spawn(
                this._applyEasing(cc.moveBy(
                    this._time,
                    particle.x + Math.random() * this._strengthX * (i % 2 == 0 ? 1 : -1),
                    particle.y + Math.random() * this._strengthY * (i % 2 == 0 ? 1 : -1),
                1)),
                cc.scaleTo(this._time, this._targetScale),
                cc.fadeOut(this._time)
            ));
        }
    }
});

/**
 * Tipos de feedback.
 * @enum {String}
 */
pd.SimpleFeedback.Types = {
    BURST: "SimpleFeedbackTypeBurst",
    REVEAL: "SimpleFeedbackTypeReveal"
};
