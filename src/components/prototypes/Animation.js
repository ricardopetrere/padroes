/**
 * Created by Ryan Balieiro on 07/06/17.
 *
 * @class
 * @extends cc.Sprite
 * @classdesc Protótipo base para componentes com animação.
 */

pd.Animation = cc.Sprite.extend({/** @lends pd.Animation#**/
    /**
     * Indica se a animação atual está rodando.
     * @type {Boolean}
     */
    isCurrentAnimationRunning:false,
    /**
     * Velocidade em frames/segundo da animação.
     * @type {Number}
     */
    speed:24,
    /**
     * Vetor com os metadados dos 'estados' do componente animado.
     * @type {{name:String, animation:cc.Animation, numFrames:Number}[]}
     */
    animations:null,
    /**
     * Ação responsável por animar o componente.
     * @type {cc.Action}
     */
    animAction:null,
    /**
     * Apontamento para os metadados da animação rodando.
     * @type {{name:String, animation:cc.Animation, numFrames:Number}}
     */
    currentAnimation:null,
    /**
     * Função de callback.
     * @type {Function|String}
     */
    onComplete:null,
    /**
     * Caller da função de callback.
     * @type {cc.Node}
     */
    onCompleteHandler:null,

    ///////////////////////////////////////////////////////////////////////
    /////////////////// -------- DEPRECIATIONS -------- ///////////////////
    ///////////////////////////////////////////////////////////////////////
    /**
     * @deprecated
     */
    acao: null,
    /**
     * @deprecated
     */
    Animations:null,
    /**
     * @deprecated
     */
    running: null,
    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    /**
     * @constructs
     */
    ctor: function() {
        this._super();
        this.animations = [];
        this.speed = 24;
        this._setRunning(false);
        this.Animations = this.animations; // legado.
    },

    /**
     * Adiciona uma animação à lista.
     * @param {String} name - um nome customizado para a animação.
     * @param {Number} firstFrame - o frame inicial da animação.
     * @param {Number} lastFrame - o último frame da animação.
     * @param {String} spriteFrameNamePattern - o padrão de nome da animação no spriteFrameCache.
     * @param {Number} speed - a velocidade da animação em frames/segundo.
     */
    addAnimation: function(name, firstFrame, lastFrame, spriteFrameNamePattern, speed) {
        const frames = [];

        for(var i = firstFrame ; i <= lastFrame ; i++) {
            frames.push(cc.spriteFrameCache.getSpriteFrame(spriteFrameNamePattern + pd.numberToString(i, 4) + ".png"));
        }
        this.speed = speed || this.speed;
        var animation = new cc.Animation(frames, 1/this.speed);
        pd.delegate.retain(animation);

        this.animations.push({name: name || this.animations.length + 1, animation: animation, numFrames: lastFrame - firstFrame + 1});
        if(this.animations.length == 1)
            this.changeAndStop(name);
    },

    /**
     * Adiciona uma animação a partir de frames específicos.
     * @param {String} name - um nome customizado para a animação.
     * @param {Number[]} vFrames - o vetor com o id dos frames desejados.
     * @param {String} spriteFrameNamePattern - o padrão de nome da animação no spriteFrameCache.
     */
    addAnimationWithFrames: function(name, vFrames, spriteFrameNamePattern) {
        const frames = [];

        for(var i = firstFrame ; i <= numFrames ; i++) {
            frames.push(cc.spriteFrameCache.getSpriteFrame(spriteFrameNamePattern + pd.numberToString(vFrames[i], 4) + ".png"));
        }

        var animation = new cc.Animation(frames, 1/24);
        this.animations.push({name: name || this.animations.length + 1, animation: animation, numFrames: vFrames.length});
    },

    /**
     * Muda a velocidade da animação.
     * @param {Number} animationSpeed
     */
    changeAnimationSpeed:function(animationSpeed) {
        this.speed = animationSpeed;
        this.currentAnimation.setDelayPerUnit(1/this.speed);
    },

    /**
     * Procura uma animação na lista e seta ela como animação atual.
     * @param {String|Number} name
     * @private
     */
    setAnimation: function(name) {
        for(var i = 0; i < this.animations.length; i++){
            if(this.animations[i].name == name || i == parseInt(name) - 1){
                this.currentAnimation = this.animations[i];
            }
        }
    },

    /**
     * Procura os metadados de uma animação, dado o seu nome ou seu id.
     * @param {String|Number} name
     * @returns {{name:String, animation:cc.Animation, numFrames:Number}}
     * @private
     */
    getAnimation: function(name) {
        for(var i = 0; i < this.animations.length; i++){
            if(this.animations[i].name == name || i == parseInt(name) - 1) {
                return this.animations[i].animation;
            }
        }
    },

    /**
     * Retorna o label da animação vigente.
     * @returns {String}
     */
    getCurrentFrameLabel: function() {
        return this.currentAnimation.name;
    },

    /**
     * Retorna o id da animação vigente.
     * @returns {Number}
     */
    getCurrentFrameId: function() {
        return this.animations.lastIndexOf(this.currentAnimation);
    },

    /**
     * Roda a animação atual.
     * @param {Boolean} isRepeatable
     * @param {Number} speed
     * @param {Number} repeatTimes
     * @private
     */
    play: function(isRepeatable, speed, repeatTimes) {
        this._displayAnimation(this.currentAnimation.name, isRepeatable || false, speed || this.speed, repeatTimes || -1);
    },

    /**
     * Para a animação atual
     */
    stop: function() {
        this.currentAnimation = this.animations[0];
        this._stopAnimation();
    },

    /**
     * Muda a animação atual.
     * @param {Number|String} frame - o índice ou o nome da animação.
     * @param {Boolean} [repeatForever=true]
     * @param {Number} [repeatTimes=0]
     * @param {Number} speed
     * @param {String|Function} onComplete - a função de callback.
     * @param {cc.Node} onCompleteHandler - o caller da função de callback.
     */
    change: function (frame, repeatForever, repeatTimes, speed, onComplete, onCompleteHandler) {
        if (repeatForever) {
            this.changeAndLoop(frame, speed);
        } else if (this.getAnimation(frame).numFrames > 1) {
            this.changeAndPlay(frame, repeatTimes, speed, onComplete, onCompleteHandler);
        } else {
            this.changeAndStop(frame);
        }
    },

    /**
     * Muda e dá play em uma nova animação.
     * @param {Number|String} frame - o índice ou o nome da animação.
     * @param {Number} [repeatTimes=0]
     * @param {Number} speed
     * @param {String|Function} onComplete - a função de callback.
     * @param {cc.Node} onCompleteHandler - o caller da função de callback.
     */
    changeAndPlay: function(frame, repeatTimes, speed, onComplete, onCompleteHandler) {
        this._displayAnimation(frame, repeatTimes ? true : false, speed, repeatTimes);
        this.onComplete = onComplete;
        this.onCompleteHandler = onCompleteHandler || this.getParent();
    },

    /**
     * Muda e dá play em loop em uma nova animação.
     * @param {Number|String} frame - o índice ou o nome da animação.
     * @param {Number} [speed=null]
     */
    changeAndLoop: function(frame, speed) {
        this._displayAnimation(frame, true, speed || this.speed);
    },

    /**
     * Muda a animação atual, sem dar play na nova animação.
     * @param {Number|String} frame - o índice ou o nome da animação.
     * @param {Number} [innerFrame=0] - frame interno (frame da nova animação a ser exibido pelo objeto).
     */
    changeAndStop: function(frame, innerFrame) {
        this._displayAnimationFrame(frame, innerFrame || 0);
    },

    /**
     * Muda o status da animação (rodando ou parada).
     * @param {Boolean} isCurrentAnimationRunning
     */
    _setRunning: function(isCurrentAnimationRunning) {
        this.isCurrentAnimationRunning = isCurrentAnimationRunning;
        this.running = this.isCurrentAnimationRunning; //legado.
    },

    /**
     * Roda a animação.
     * @param {Boolean} isRepeatable
     * @param {Boolean} repeatTimes
     * @private
     */
    _run: function(isRepeatable, repeatTimes) {
        this._disposeAnimAction();
        this.currentAnimation.animation.setDelayPerUnit(1/this.speed);
        this.animAction = new cc.Animate(this.currentAnimation.animation);

        if(isRepeatable == true) {
            this.animAction = (repeatTimes == null || repeatTimes == -1) ? new cc.RepeatForever(this.animAction) : new cc.Repeat(this.animAction, repeatTimes);
        }
        else {
            this.animAction = new cc.Sequence([this.animAction, new cc.CallFunc(this._onAnimCompleted, this)]);
        }
        pd.delegate.retain(this.animAction);
        this.runAction(this.animAction);
        this._setRunning(true);
    },

    /**
     * Manipula o término da animação.
     * @private
     */
    _onAnimCompleted: function() {
        if(this.onComplete != null) {
            if(typeof this.onComplete == 'string') {
                this.onCompleteHandler[this.onComplete]();
            }
            else {
                this.onComplete.apply(this.onCompleteHandler);
            }
        }
        this._disposeAnimAction();
    },

    /**
     * Para a animação atual.
     * @private
     */
    _stopAnimation: function() {
        if(this.isCurrentAnimationRunning == true)
            this.stopAction(this.animAction);
        this._setRunning(false);
    },

    /**
     * Destrói a ação que anima o objeto.
     * @private
     */
    _disposeAnimAction: function() {
        if(this.animAction != null) {
            this._stopAnimation();
            this.animAction = null;
        }
    },

    /**
     * Exibe uma animação.
     * @param {Number} targetFrame
     * @param {Boolean} [isRepeatable=false]
     * @param {Number} [speed=60]
     * @param {Number} [repeatTimes=0]
     * @private
     */
    _displayAnimation: function(targetFrame, isRepeatable, speed, repeatTimes) {
        this.stop();
        this.setAnimation(targetFrame);
        this.speed = speed || this.speed;
        this._run(Boolean(isRepeatable), repeatTimes);
    },

    /**
     * Exibe um frame específico de uma animação.
     * @param {Number} targetFrame
     * @param {Number} [targetInnerFrame=0]
     * @private
     */
    _displayAnimationFrame: function(targetFrame, targetInnerFrame) {
        this.stop();
        const staticImg = this.getAnimation(targetFrame).getFrames()[targetInnerFrame || 0].getSpriteFrame();
        this.setSpriteFrame(staticImg);
    }
});