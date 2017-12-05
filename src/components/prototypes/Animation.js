/**
 * Created by Ryan Balieiro on 07/06/17.
 *
 * @class
 * @extends cc.Sprite
 * @classdesc Protótipo base para componentes com animação.
 */
pd.Animation = cc.Sprite.extend({/** @lends pd.Animation#**/
    /**
     * Ação de troca de frames do pd.Animation
     * @type {cc.Animate}
     */
    animateAction: null,
    /**
     * Indica se a animação atual está rodando.
     * @type {Boolean}
     */
    isCurrentAnimationRunning:false,
    /**
     * Velocidade em frames/segundo da animação.
     * @type {Number}
     */
    defaultSpeed:24,
    /**
     * Vetor com os metadados dos 'estados' do componente animado.
     * @type {{name:String, animation:cc.Animation, numFrames:Number, speed: Number}[]}
     */
    animations:null,
    /**
     * Ação responsável por animar o componente.
     * @type {cc.Action}
     */
    animAction:null,
    /**
     * Apontamento para os metadados da animação rodando.
     * @type {{name:String, animation:cc.Animation, numFrames:Number, speed: Number}}
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
    /**
     * Indica se deve resetar a animação, caso seja requisitada uma troca para a mesma animação da atual
     * @type {boolean}
     */
    _shouldResetAnimation: false,

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
        this.defaultSpeed = 24;
        this.speed = this.defaultSpeed;// legado
        this._setRunning(false);
        this.Animations = this.animations; // legado.
    },

    /**
     * Adiciona uma animação à lista.
     * @param {String|pd.AnimationData} nameOrAnimationData - um nome customizado para a animação, ou um objeto contendo todas as informações da animação.
     * @param {Number} firstFrame - o frame inicial da animação.
     * @param {Number} lastFrame - o último frame da animação.
     * @param {String} spriteFrameNamePattern - o padrão de nome da animação no spriteFrameCache.
     * @param {Number} speed - a velocidade da animação em frames/segundo.
     */
    addAnimation: function(nameOrAnimationData, firstFrame, lastFrame, spriteFrameNamePattern, speed) {
        if (nameOrAnimationData instanceof pd.AnimationData) {
            this.addAnimation(nameOrAnimationData.name, nameOrAnimationData.ini_frame, nameOrAnimationData.last_frame, nameOrAnimationData.anim_name, nameOrAnimationData.speed);
            return;
        }
        const frames = [];

        for(var i = firstFrame ; i <= lastFrame ; i++) {
            frames.push(cc.spriteFrameCache.getSpriteFrame(spriteFrameNamePattern + pd.numberToString(i, 4) + ".png"));
        }
        // this.defaultSpeed = speed || this.defaultSpeed;
        var animation = new cc.Animation(frames, 1/this.defaultSpeed);
        pd.delegate.retain(animation);

        this.animations.push({
            name: nameOrAnimationData || this.animations.length + 1,
            animation: animation, 
            numFrames: lastFrame - firstFrame + 1, 
            speed: speed || this.defaultSpeed
        });
        
        if(this.animations.length == 1)
            this.changeAndStop(nameOrAnimationData);
    },

    /**
     * Adiciona uma animação a partir de frames específicos.
     * @param {String} name - um nome customizado para a animação.
     * @param {Number[]} frameIDs - o vetor com o id dos frames desejados.
     * @param {String} spriteFrameNamePattern - o padrão de nome da animação no spriteFrameCache.
     * @param {Number} [speed=24] - a velocidade da animação.
     */
    addAnimationWithFrames: function(name, frameIDs, spriteFrameNamePattern, speed) {
        const frames = [];

        for(var i = 0 ; i < frameIDs.length ; i++) {
            frames.push(cc.spriteFrameCache.getSpriteFrame(spriteFrameNamePattern + pd.numberToString(frameIDs[i], 4) + ".png"));
        }

        var animation = new cc.Animation(frames, 1/24);
        this.animations.push({
            name: name || this.animations.length + 1,
            animation: animation,
            numFrames: frames.length,
            speed: speed
        });
        pd.delegate.retain(animation);
    },

    /**
     * Muda a velocidade da animação.
     * @param {Number} animationSpeed
     */
    changeCurrentAnimationSpeed:function(animationSpeed) {
        // this.defaultSpeed = animationSpeed;
        this.currentAnimation.speed = animationSpeed;
        this.currentAnimation.animation.setDelayPerUnit(1/this.currentAnimation.speed);
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
                return;
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
     * Retorna o id (começando em 0) do quadro atual da animação vigente
     * @returns {number}
     */
    getCurrentFrameIndex: function () {
        return this.animateAction.getCurrentFrameIndex();
    },

    /**
     * Roda a animação atual.
     * @param {Boolean} isRepeatable
     * @param {Number} speed
     * @param {Number} repeatTimes
     * @param {boolean} [reversed=false]
     * @private
     */
    play: function(isRepeatable, speed, repeatTimes, reversed) {
        this._displayAnimation(this.currentAnimation.name, isRepeatable || false, speed, repeatTimes || 0, reversed);
    },

    /**
     * Para a animação atual
     */
    stop: function() {
        // this.currentAnimation = this.animations[0];
        this._stopAnimation();
    },

    /**
     * Para todas as ações do objeto, inclusive a animação
     * A sobrescrita foi para resetar o estado de execução da animação
     */
    stopAllActions: function () {
        this._super();
        //cc.warn("[pd.Animation] A animação foi parada forçadamente devido a uma chamada à função stopAllActions");
        this._stopAnimation();
    },

    /**
     * Muda a animação atual.
     * @param {Number|String} frame - o índice ou o nome da animação.
     * @param {Boolean} [repeatForever=true]
     * @param {Number} [repeatTimes=0]
     * @param {Number} [speed]
     * @param {String|Function} [onComplete] - a função de callback.
     * @param {cc.Node} [onCompleteHandler] - o caller da função de callback.
     * @param {boolean} [reversed=false]
     */
    change: function (frame, repeatForever, repeatTimes, speed, onComplete, onCompleteHandler, reversed) {
        if (repeatForever) {
            this.changeAndLoop(frame, speed, reversed);
        } else if (this.getAnimation(frame).getFrames().length > 1) {
            this.changeAndPlay(frame, repeatTimes, speed, onComplete, onCompleteHandler, reversed);
        } else {
            this.changeAndStop(frame);
        }
    },

    /**
     * Muda e dá play em uma nova animação.
     * @param {Number|String} frame - o índice ou o nome da animação.
     * @param {Number} [repeatTimes=0]
     * @param {Number} [speed]
     * @param {String|Function} [onComplete] - a função de callback.
     * @param {cc.Node} [onCompleteHandler] - o caller da função de callback.
     * @param {Object} [easing] - Função de easing a ser aplicada na troca de frames
     * @param {boolean} [reversed=false]
     */
    changeAndPlay: function(frame, repeatTimes, speed, onComplete, onCompleteHandler, reversed, easing) {
        this._displayAnimation(frame, repeatTimes ? true : false, speed, repeatTimes, reversed, easing);
        this.onComplete = onComplete;
        this.onCompleteHandler = onCompleteHandler || this.getParent();
    },

    /**
     * Muda e dá play em loop em uma nova animação.
     * @param {Number|String} frame - o índice ou o nome da animação.
     * @param {Number} [speed=null]
     * @param {boolean} [reversed=false]
     * @param {Object} [easing] - Função de easing a ser aplicada na troca de frames
     */
    changeAndLoop: function(frame, speed, reversed, easing) {
        this._displayAnimation(frame, true, speed, 0, reversed, easing);
    },

    /**
     * Muda a animação atual, sem dar play na nova animação.
     * @param {Number|String} frame - o índice ou o nome da animação.
     * @param {Number} [innerFrame=0] - número do frame interno (frame da nova animação a ser exibido pelo objeto).
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
     * Configura se o objeto deve resetar a animação atual em toda chamada da função _run,
     * ou apenas quando for para uma animação diferente da atual
     * @param {boolean} value
     */
    setShouldResetAnimation: function (value) {
        this._shouldResetAnimation = value;
    },

    /**
     * Roda a animação.
     * @param {Boolean} isRepeatable
     * @param {Boolean} repeatTimes
     * @param {boolean} [reversed=false]
     * @param {Object} [easing] - Função de easing a ser aplicada na troca de frames
     * @private
     */
    _run: function(isRepeatable, repeatTimes, reversed, easing) {
        this._disposeAnimAction();
        this.currentAnimation.animation.setDelayPerUnit(1/this.currentAnimation.speed);
        var action = new cc.Animate(this.currentAnimation.animation);
        if (reversed === true) {
            action = action.reverse();
        }
        if (easing != null) {
            action = action.easing(easing);
        }
        this.animateAction = action;

        if(isRepeatable == true) {
            this.animAction = repeatTimes ? new cc.Repeat(action, repeatTimes) : new cc.RepeatForever(action);
        }
        else {
            this.animAction = new cc.Sequence([action, new cc.CallFunc(this._onAnimCompleted, this)]);
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
        this._disposeAnimAction();
        if(this.onComplete != null) {
            if(typeof this.onComplete == 'string') {
                this.onCompleteHandler[this.onComplete]();
            }
            else {
                this.onComplete.apply(this.onCompleteHandler);
            }
        }
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
     * @param {boolean} [reversed=false]
     * @param {Object} [easing] - Função de easing a ser aplicada na troca de frames
     * @private
     */
    _displayAnimation: function(targetFrame, isRepeatable, speed, repeatTimes, reversed, easing) {
        if (this._shouldResetAnimation || !this.isCurrentAnimationRunning || this.currentAnimation.animation !== this.getAnimation(targetFrame)) {
            this.stop();
            this.setAnimation(targetFrame);
            if (speed && speed !== this.currentAnimation.speed) {
                this.currentAnimation.speed = speed;
            }
            this._run(Boolean(isRepeatable), repeatTimes, reversed, easing);
        }
    },

    /**
     * Exibe um frame específico de uma animação.
     * @param {Number} targetFrame
     * @param {Number} [targetInnerFrame=0]
     * @private
     */
    _displayAnimationFrame: function(targetFrame, targetInnerFrame) {
        this.stop();
        if (targetInnerFrame > 0) {
            targetInnerFrame--;
        }
        const staticImg = this.getAnimation(targetFrame).getFrames()[targetInnerFrame || 0].getSpriteFrame();
        this.setSpriteFrame(staticImg);
    }
});

/**
 * @class
 * @param {String} name
 * @param {Number} ini_frame
 * @param {Number} last_frame
 * @param {Number} [speed]
 * @param {String} [anim_name]
 * @extends cc.Class
 * @classdesc Estrutura-esqueleto de uma animação a ser usada.
 */
pd.AnimationData = cc.Class.extend({
    /**
     * Nome da animação a ser informada em {@link pd.Animation.change}
     * @type {String}
     */
    name: "",
    /**
     * Frame inicial da animação (index do primeiro arquivo de imagem da animação. <br/>
     * Ex: no arquivo 'imagem0005.png', o index é 5
     * @type {Number}
     */
    ini_frame: 0,
    /**
     * Frame final da animação (index do último arquivo de imagem da animação. <br/>
     * Ex: no arquivo 'imagem0005.png', o index é 5
     * @type {Number}
     */
    last_frame: 0,
    /**
     * Taxa de quadros por segundo desta animação
     * @type {Number}
     */
    speed: 24,
    /**
     * Padrão de nome dos arquivos de imagem da animação <br/>
     * Ex: no arquivo 'imagem0005.png', o padrão de nome é 'imagem'
     * @type {String}
     */
    anim_name: "",
    /**
     * @constructs
     * @param {String} name
     * @param {Number} ini_frame
     * @param {Number} last_frame
     * @param {Number} [speed]
     * @param {String} [spriteFramePattern]
     */
    ctor: function (name, ini_frame, last_frame, speed, spriteFramePattern) {
        this.name = name;
        this.ini_frame = ini_frame;
        this.last_frame = last_frame;
        this.speed = speed || 24;
        this.anim_name = spriteFramePattern || name;
    },

    /**
     * @param frame {Number}
     * @returns {null|String}
     */
    getAnimationFrameName: function (frame) {
        if (frame === 0)
            return this.anim_name + ".png";
        if (frame < this.ini_frame || frame > this.last_frame)
            return null;
        return this.anim_name + pd.numberToString(frame) + ".png";
    }
});