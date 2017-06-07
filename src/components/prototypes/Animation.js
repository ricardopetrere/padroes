/**
 * Created by Ryan Balieiro on 07/06/17.
 *
 * @class
 * @extends cc.Sprite
 * @classdesc Protótipo base para componentes animados.
 */

pd.Animation = cc.Sprite.extend({/** @lends jogo4av3por2.Animation#**/
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
     * @type {Array[]}
     */
    animations:null,
    /**
     * Ação responsável por animar o componente.
     * @type {cc.Action}
     */
    animAction:null,
    /**
     * Apontamento para os metadados da animação rodando.
     * @type {Object}
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
     * @param {Number} numFrames - a quantidade de frames a partir do frame inicial que a animação irá possuir.
     * @param {String} spriteFrameNamePattern - o padrão de nome da animação no spriteFrameCache.
     * @param {Number} speed - a velocidade da animação em frames/segundo.
     */
    addAnimation: function(name, firstFrame, numFrames, spriteFrameNamePattern, speed) {
        const frames = [];

        for(var i = firstFrame ; i <= numFrames ; i++) {
            frames.push(cc.spriteFrameCache.getSpriteFrame(spriteFrameNamePattern + this._insertZeroes(i, 3) + ".png"));
        }
        this.speed = speed || 24;
        var animation = new cc.Animation(frames, 1/this.speed);
        pd.delegate.retain(animation);

        this.animations.push({name: name || this.animations.length + 1, animation: animation});
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
            frames.push(cc.spriteFrameCache.getSpriteFrame(spriteFrameNamePattern + this._insertZeroes(vFrames[i], 3) + ".png"));
        }

        var animation = new cc.Animation(frames, 1/24);
        this.animations.push({name: name || this.animations.length + 1, animation: animation});
    },

    /**
     * Muda a velocidade da animação.
     * @param animationSpeed {Number}
     */
    changeAnimationSpeed:function(animationSpeed) {
        this.speed = animationSpeed;
        this.currentAnimation.setDelayPerUnit(1/this.speed);
    },

    /**
     * Procura uma animação na lista e seta ela como animação atual.
     * @param name {String|Number}
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
     * Procura os metadados de uma animação, dado o seu nome ou id.
     * @param name {String|Number}
     * @returns {Object}
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
     * @returns {number}
     */
    getCurrentFrameId: function() {
        return this.animations.lastIndexOf(this.currentAnimation);
    },

    /**
     * Roda a animação atual.
     * @param isRepeatable {Boolean}
     * @param speed {Number}
     * @param repeatTimes {Number}
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
     * Muda e dá play em uma nova animação.
     * @param frame {Number|String} - o índice ou o nome da animação.
     * @param onComplete {String|Function=} - a função de callback.
     * @param onCompleteHandler {cc.Node=} - o caller da função de callback.
     * @param repeatable {Boolean=false}
     * @param repeatTimes {Number=0}
     * @param speed {Number=}
     */
    changeAndPlay: function(frame, onComplete, onCompleteHandler, repeatable, repeatTimes, speed) {
        this._displayAnimation(frame, repeatable, speed, repeatTimes);
        this.onComplete = onComplete;
        this.onCompleteHandler = onCompleteHandler || this.getParent();
    },

    /**
     * Muda e dá play em loop em uma nova animação.
     * @param frame {Number|String} - o índice ou o nome da animação.
     * @param speed {Number=}
     */
    changeAndLoop: function(frame, speed) {
        this._displayAnimation(frame, true, speed || this.speed);
    },

    /**
     * Muda a animação atual, sem dar play na nova animação.
     * @param frame {Number|String} - o índice ou o nome da animação.
     * @param innerFrame {Number=1} - frame interno (frame da nova animação a ser exibido pelo objeto).
     */
    changeAndStop: function(frame, innerFrame) {
        this._displayAnimationFrame(frame, innerFrame || 0);
    },

    /**
     * Transforma um número em padrão numérico para o padrão do nome da animação (ex. 12 --> "0012").
     * @param number {number}
     * @param maxLength {number}
     * @returns {string|*}
     * @private
     */
    _insertZeroes: function(number, maxLength) {
        var amount = maxLength - Math.floor(Math.log(number) / Math.log(10));
        number = String(number);
        var str = "";
        for(var i = 0 ; i < amount ; i++)
            str += "0";
        return str += number;
    },

    /**
     * Muda o status da animação (rodando ou parada).
     * @param isCurrentAnimationRunning {Boolean}
     */
    _setRunning: function(isCurrentAnimationRunning) {
        this.isCurrentAnimationRunning = isCurrentAnimationRunning;
        this.running = this.isCurrentAnimationRunning; //legado.
    },

    /**
     * Roda a animação.
     * @param isRepeatable {Boolean}
     * @param repeatTimes {Boolean}
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
            this.animAction = new cc.Sequence([
                this.animAction,
                new cc.CallFunc(this._onAnimCompleted, this)
            ]);
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
     * @param targetFrame {Number}
     * @param isRepeatable {Boolean=false}
     * @param speed {Number=60}
     * @param repeatTimes {Number=0}
     * @private
     */
    _displayAnimation: function(targetFrame, isRepeatable, speed, repeatTimes) {
        this.stop();
        this.setAnimation(targetFrame);
        this.speed = speed || this.speed;
        this._run(Boolean(isRepeatable), repeatTimes);
    },

    /**
     * Exibe um frame de uma animação.
     * @param targetFrame {Number}
     * @param targetInnerFrame {Number=0}
     * @private
     */
    _displayAnimationFrame: function(targetFrame, targetInnerFrame) {
        this.stop();
        const staticImg = this.getAnimation(targetFrame).getFrames()[targetInnerFrame || 0].getSpriteFrame();
        this.setSpriteFrame(staticImg);
    }
});