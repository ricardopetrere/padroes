/**
 * Created by Felippe Miguel on 19/07/17.
 *
 * @class
 * @extends {cc.Sprite}
 * @classdesc Classe base para interface de vidas.
 */
pd.LifeHUD = cc.Sprite.extend({/** @lends pd.LifeHUD#**/

    //<editor-fold desc="OBJETOS">

    /**
     * Vetor de sprites que representam as vidas cheias.
     * @type {cc.Sprite[]}
     */
    _lives: null,

    /**
     * Vetor de sprites que representam as vidas vazias.
     * @type {cc.Sprite[]}
     */
    _emptyLives: null,

    /**
     * Nome do spriteFrame de uma vida cheia(pode conter .png ou não).
     * @type {String}
     */
    _fullLifeSpriteFrameName: null,

    /**
     * Nome do spriteFrame de uma meia-vida(pode conter .png ou não).
     * @type {String}
     */
    _halfLifeSpriteFrameName: null,

    /**
     * Nome do spriteFrame de uma vida vazia (pode conter .png ou não).
     * @type {String}
     */
    _emptyLifeSpriteFrameName: null,

    /**
     * Vetor utilizado para armazenar ações ao atualizar o valor de vidas.
     * @type {Array}
     */
    _sequenceActions: null,

    /**
     * Vetor utilizado para armazenar ações da intro.
     * @type {Array}
     */
    _introSequence: null,

    /**
     * Referência para o tipo de ação que será usada na intro.
     * @type {String}
     */
    _introActionType: null,

    /**
     * Referência para o tipo de ação que será usada ao perder vida.
     * @type {String}
     */
    _loseLifeActionType: "standard",

    /**
     * Referência para o tipo de ação que será usada ao ganhar vida.
     * @type {String}
     */
    _gainLifeActionType: "standard",

    /**
     * Referência para o tipo de ação que será usada como idle.
     * @type {String}
     */
    _idleActionType: "standard",

    /**
     * Referência do arquivo de áudio que será usado para intro.
     * @type {String}
     */
    _introSoundEffect: pd.res.fx_button,

    /**
     * Referência do arquivo de áudio que será usado ao perder vida.
     * @type {String}
     */
    _loseLifeSoundEffect: pd.res.fx_button,

    /**
     * Referência do arquivo de áudio que será usado ao ganhar vida.
     * @type {String}
     */
    _gainLifeSoundEffect: pd.res.fx_button,

    //</editor-fold>

    //<editor-fold desc="VARIÁVEIS BOOLEANAS">

    /**
     * Define se o lifeHud utiliza sistema de "meia-vida" ou não.
     * @type {boolean}
     */
    _hasHalfLife: false,

    /**
     * Define se o lifeHud utiliza background.
     * @type {boolean}
     */
    _hasBackground: false,

    //</editor-fold>

    //<editor-fold desc="VARIÁVEIS NUMÉRICAS">

    /**
     * Define o espaçamento entre cada sprite de vida.
     * @type {Number}
     */
    _spacing: 0,

    /**
     * Define o total máximo de vidas.
     * @type {Number}
     */
    _totalLives: 0,

    /**
     * Define o valor restante de vidas.
     * @type {Number}
     */
    _livesRemaining: 0,

    /**
     * Define a largura do background.
     * @type {Number}
     */
    _backgroundWidth: 0,

    /**
     * Define a altura do background.
     * @type {Number}
     */
    _backgroundHeight: 0,

    //</editor-fold>

    /**
     * @constructs
     * @param {Number} totalLives                   - Número total de vidas.
     * @param {Number} livesRemaining               - Número atual de vidas.
     * @param {Number} spacing                      - Espaço entre cada vida.
     * @param {String} spriteFrameName              - Nome do spriteFrame da vida.
     * @param {String} [bgSpriteFrameName = null]   - Nome do spriteFrame do background.
     */
    ctor: function (totalLives, livesRemaining, spacing, spriteFrameName, bgSpriteFrameName) {
        this._super();
        this._lives                     = [];
        this._spacing                   = spacing;
        this._fullLifeSpriteFrameName   = spriteFrameName;

        if(bgSpriteFrameName) {
            this.setSpriteFrame(pd.getSpriteFrame(bgSpriteFrameName));
            this._backgroundWidth   = this.width;
            this._backgroundHeight  = this.height;
            this._hasBackground     = true;
        }

        if(totalLives)
            this.buildUp(totalLives, livesRemaining || 0);
    },

    /**
     * Constrói o Life HUD.
     * @param {Number} totalLives                   - Número total de vidas.
     * @param {Number} livesRemaining               - Número atual de vidas.
     */
    buildUp: function(totalLives, livesRemaining) {
        this._totalLives     = totalLives;
        this._livesRemaining = livesRemaining;

        if(this._lives.length > 0)
            throw new Error("[pd.LifeHUD] O HUD já foi construído!");

        for(var i = 0; i < this._totalLives; i++) {
            var life = new cc.Sprite(pd.getSpriteFrame(this._fullLifeSpriteFrameName));
            life.setPosition((i * this._spacing) + life.width/2, this._hasBackground ? this._backgroundHeight/2 : 0);
            life._value = 1;
            this.addChild(life, 2);

            pd.decorate(life, pd.decorators.ResetableNode);
            life.saveDisplayState();
            this._lives.push(life);
        }

        if(this._introActionType)
            this._hideAllLives();
    },

    /**
     * Recebe o valor atual de vidas e atualiza a HUD.
     * @param {Number} currentLives - Valor das vidas.
     * @param {Function} [callback] - Callback para ser executado após a atualização das vidas.
     */
    updateUI: function (currentLives, callback) {
        this._sequenceActions = [];

        currentLives = pd.clamp(currentLives, 0, this._totalLives);

        if(currentLives > this._livesRemaining) {
            for(var i = 0; i < this._totalLives; i++) {
                this._updateValue(i, currentLives);
            }
        }

        else if(currentLives < this._livesRemaining) {
            for(i = this._totalLives - 1; i >= 0; i--) {
                this._updateValue(i, currentLives);
            }
        }

        if(this._sequenceActions.length > 0) {
            if(callback)
                this._sequenceActions.push(cc.callFunc(callback, this));
            this.runAction(cc.sequence(this._sequenceActions));
        }

        this._livesRemaining = currentLives;
    },

    /**
     * Define o sprite para "meia-vida".
     * @param {String} spriteFrameName  - Nome do spriteFrame de metade da vida.
     */
    setHalfSpriteFrame: function (spriteFrameName) {
        this._halfLifeSpriteFrameName = spriteFrameName;
        this._hasHalfLife = true;
    },

    /**
     * Define o sprite para "vida vazia".
     * @param {String} spriteFrameName  - Nome do spriteFrame de uma vida vazia.
     */
    setEmptySpriteFrame: function (spriteFrameName) {
        this._emptyLifeSpriteFrameName = spriteFrameName;
        this._emptyLives = [];

        for (var i = 0; i < this._lives.length; i++) {
            var emptyLife = null;

            if (this._emptyLifeSpriteFrameName !== null) {
                emptyLife = new cc.Sprite(pd.getSpriteFrame(this._emptyLifeSpriteFrameName));
                emptyLife.setOpacity(255);
            }
            else {
                emptyLife = new cc.Sprite(pd.getSpriteFrame(this._fullLifeSpriteFrameName));
                emptyLife.setOpacity(50);
            }

            emptyLife.setPosition((i * this._spacing) + this._lives[i].width/2, this._backgroundHeight/2);
            this.addChild(emptyLife, 1);
            this._emptyLives[i] = emptyLife;
        }
    },

    /**
     * Retorna o numero atual de vidas sendo exibidas.
     * @returns {Number} - Vidas atuais.
     */
    getDisplayingAmount: function(){
        return this._livesRemaining;
    },

    /**
     * Retorna uma sequence com as actions da intro 
     * @param {Function} [easeFunction = cc.easeSinOut]  - Função de easing;
     * @returns {cc.Action[]} - Sequencia de ações da intro.
     */
    getIntro: function(easeFunction) {
        this._introSequence = [];

        if (Math.floor(this._livesRemaining) < this._livesRemaining) {
            this._setSpriteLife(Math.floor(this._livesRemaining), this._halfLifeSpriteFrameName);
        }

        for (var i = 0; i < this._totalLives; i++) {
            var life = this._lives[i];
            life.setVisible(true);
            if(i < this._livesRemaining) {
                life.setScale(1);
                life.setOpacity(255);
                life._value = 1;

                switch(this._introActionType) {
                    case pd.LifeHUD.IntroActionsTypes.SCALING:
                        life.setScale(0);
                        break;

                    case pd.LifeHUD.IntroActionsTypes.COMING_FROM_THE_LEFT:
                        life.setPosition(0 - this.x - life.width - 100, life.height);
                        break;

                    case pd.LifeHUD.IntroActionsTypes.COMING_FROM_THE_BOTTOM:
                        life.setPosition((i * this._spacing) + life.width, 0 - this.y - life.height - 100);
                        break;

                    case pd.LifeHUD.IntroActionsTypes.COMING_FROM_THE_RIGHT:
                        life.setPosition((1024 - this.x) + life.width + 100, life.height);
                        break;

                    case pd.LifeHUD.IntroActionsTypes.COMING_FROM_THE_TOP:
                        life.setPosition((i * this._spacing) + life.width, (768 - this.y) + life.height + 100);
                        break;
                }
            }
        }

        this._buildIntroSequence(easeFunction);
        return cc.targetedAction(this, cc.sequence(this._introSequence));
    },

    /**
     *Inicia a animação de introdução.
     * @param {Function} [easeFunction = cc.easeSineOut]  - Função de easing;
     */
    startIntro: function (easeFunction) {
        this.runAction(cc.sequence(this.getIntro(easeFunction)));
    },

    /**
     *Inicia a animação de IDLE.
     */
    runIdleAction: function () {
        switch (this._idleActionType) {
            case pd.LifeHUD.IdleActionsTypes.ROTATING:
                for (var i  = 0; i < this._livesRemaining; i++) {
                    var intensity = 3;
                    var time = 0.3;
                    if (i%2 === 0) {
                        this._lives[i].runAction(cc.repeatForever(cc.sequence(
                            cc.rotateTo(time,   intensity,  intensity).easing(cc.easeSineInOut()),
                            cc.rotateTo(time,  -intensity, -intensity).easing(cc.easeSineInOut())
                        )));
                    }
                    else {
                        this._lives[i].runAction(cc.repeatForever(cc.sequence(
                            cc.rotateTo(time,  -intensity, -intensity).easing(cc.easeSineInOut()),
                            cc.rotateTo(time,   intensity,  intensity).easing(cc.easeSineInOut())
                        )));
                    }
                }
                break;

            case pd.LifeHUD.IdleActionsTypes.WAVE:
                var sequence = [];
                for (i  = 0; i < this._livesRemaining; i++) {
                    sequence.push(
                        cc.delayTime(0.05),
                        cc.callFunc(function (e, data) {
                            this._lives[data].runAction(cc.jumpBy(0.3, 0,0, 5, 1));
                        }, this, [i])
                    );
                }
                sequence.push(cc.delayTime(1));
                this.runAction(cc.repeatForever(cc.sequence(sequence)));
                break;
        }
    },

    /**
     *Restaura as vidas para o valor máximo.
     */
    reset: function () {
        this._livesRemaining = this._totalLives;
        this.stopAllActions();

        for (var i = 0; i < this._lives.length; i++) {
            var life = this._lives[i];

            life._value = 1;
            life.stopAllActions();
            life.setScale(1);
            life.setOpacity(255);
            life.setPosition((i * this._spacing) + this.x, this.y);
        }
    },

    /**
     * Esconde todas as vidas.
     * @private
     */
    _hideAllLives: function() {
        if(!this._lives)
            return;

        for(var i in this._lives)
            this._lives[i].attr({visible:false, scaleX:0, scaleY:0, opacity:0, _value:0});
    },

    /**
     *Define o tipo de ação da introdução.
     * @param {String} typeAction   - Tipo da ação da intro.
     * @param {String} (soundEffect = pd.res.fx_button)  - Nome do efeito sonoro.
     */
    setIntroAction: function (typeAction, soundEffect) {
        this._introActionType = typeAction;
        if (soundEffect) this._introSoundEffect = soundEffect;

        this._hideAllLives();
    },

    /**
     *Define o tipo de ação da idle.
     * @param {String} typeAction - Tido da ação de idle.
     */
    setIdleAction: function (typeAction) {
        this._idleActionType = typeAction;
    },

    /**
     *Define o tipo de ação ao ganhar vida.
     * @param {String} typeAction   - Tipo da ação de ganhar vida.
     * @param {String} (soundEffect = pd.res.fx_button)  - Nome do efeito sonoro.
     */
    setGainLifeAction: function (typeAction, soundEffect) {
        this._gainLifeActionType = typeAction;
        if (soundEffect) this._gainLifeSoundEffect = soundEffect;
    },

    /**
     *Define o tipo de ação ao perder vida.
     * @param {String} typeAction   - Tipo da ação de perder vida.
     * @param {String} (soundEffect = pd.res.fx_button)  - Nome do efeito sonoro.
     */
    setLoseLifeAction: function (typeAction, soundEffect) {
        this._loseLifeActionType = typeAction;
        if (soundEffect) this._loseLifeSoundEffect = soundEffect;
    },

    /**
     * Recebe uma vida e seu novo sprite
     * @param {Number} indexLife    - Index da vida que será alterada.
     * @param {String} spriteFrame  - Nome do spriteFrame.
     * @private
     */
    _setSpriteLife: function (indexLife, spriteFrame) {
        if(spriteFrame !== null){
            if (pd.getSpriteFrame(spriteFrame) === pd.getSpriteFrame(this._fullLifeSpriteFrameName)){
                this._lives[indexLife].setSpriteFrame(pd.getSpriteFrame(this._fullLifeSpriteFrameName));
            }
            else if(this._hasHalfLife){
                this._lives[indexLife].setSpriteFrame(pd.getSpriteFrame(this._halfLifeSpriteFrameName));
            }
            else{
                cc.warn("Sprite de meia vida não definido!");
            }
        }
        else{
            cc.warn("Sprite de meia vida não definido!");
        }
    },

    /**
     * Preenche o vetor de ações da introdução
     * @param {Function} easeFunction = [cc.easeSinOut] - Função de easing;
     * @private
     */
    _buildIntroSequence: function (easeFunction) {
        if (easeFunction === null || easeFunction === undefined)
            easeFunction = cc.easeSineOut;

        for (var i = 0; i < this._livesRemaining; i++) {
            this._introSequence.push(
                cc.delayTime(0.1),
                cc.callFunc(function () {
                    this.tweenBackToDisplayState(0.2, easeFunction, function() {
                        pd.audioEngine.playEffect(this.getParent()._introSoundEffect, false);
                    }, this);
                }, this._lives[i])
            );
        }

        this._introSequence.push(
            cc.delayTime(0.2),
            cc.callFunc(function () {
                this.runIdleAction();
            }, this)
        )
    },

    /**
     * Verifica para qual valor será atualizada uma vida e chama o método para troca de valor e sprite.
     * @param {Number} i            - Index da vida a ser atualizada.
     * @param {Number} currentLives - Número atual de vidas.
     */
    _updateValue: function (i, currentLives) {
        if(i < Math.floor(currentLives) && this._lives[i]._value < 1)
            this._tweenLife(i, 1);

        else if(i > currentLives && this._lives[i]._value > 0)
            this._tweenLife(i, 0);

        else if(i === Math.floor(currentLives) && Math.floor(currentLives) < currentLives && this._lives[i]._value !== 0.5)
            this._tweenLife(i, 0.5);

        else if(i === Math.floor(currentLives) && Math.floor(currentLives) === currentLives && this._lives[i]._value !== 0)
            this._tweenLife(i, 0);
    },

    /**
     * Atualiza o valor e o sprite de uma vida.
     * @param {Number} index        - Index da vida a ser atualizada.
     * @param {Number} newValue     - Novo valor da vida.
     */
    _tweenLife: function (index, newValue) {
        var time        = 0.1;
        var oldValue    = this._lives[index]._value;

        var life = this._lives[index];
        life._value = newValue;

        if(newValue === 1) {
            if(oldValue === 0) {
                this._setSpriteLife(index, this._fullLifeSpriteFrameName);
                switch (this._gainLifeActionType) {
                    case pd.LifeHUD.GainLifeActionsTypes.STANDARD:
                        life.loadDisplayState();
                        break;

                    case pd.LifeHUD.GainLifeActionsTypes.SCALING:
                        this._sequenceActions.push(cc.delayTime(time));
                        life.tweenBackToDisplayState(0.2, cc.easeBackOut);
                        break;

                    case pd.LifeHUD.GainLifeActionsTypes.FADE:
                        this._sequenceActions.push(cc.delayTime(time));
                        life.tweenBackToDisplayState(0.4);
                        break;
                }
            }
            else if(oldValue > 0){
                this._sequenceActions.push(
                    cc.callFunc(function (e, data) {
                        this.getParent()._setSpriteLife(data[0], this.getParent()._fullLifeSpriteFrameName);
                    }, life, [index])
                );
            }
        }

        else if(newValue === 0 && (oldValue === 1 || oldValue === 0.5)){
            switch (this._loseLifeActionType) {
                case pd.LifeHUD.LoseLifeActionsTypes.STANDARD:
                    this._sequenceActions.push(
                        cc.callFunc(function () {
                            this.setOpacity(0);
                            this.setScale(0);
                        }, this._lives[index])
                    );
                    break;

                case pd.LifeHUD.LoseLifeActionsTypes.SCALING:
                    this._sequenceActions.push(
                        cc.callFunc(function () {
                            this.runAction(cc.scaleTo(0.2, 0).easing(cc.easeBackIn()));
                        }, this._lives[index])
                    );
                    break;

                case pd.LifeHUD.LoseLifeActionsTypes.FADE:
                    this._sequenceActions.push(
                        cc.callFunc(function () {
                            this.runAction(cc.fadeOut(0.4));
                        }, this._lives[index])
                    );
                    break;
            }

            this._sequenceActions.push(cc.callFunc(function() {
                if(this._loseLifeSoundEffect)
                    pd.audioEngine.playEffect(this._loseLifeSoundEffect);
            }, this));
        }

        else if(newValue === 0.5) {
            this._sequenceActions.push(
                cc.delayTime(time),
                cc.callFunc(function (e, data) {
                    this.getParent()._setSpriteLife(data[0], this.getParent()._halfLifeSpriteFrameName);
                    this.setOpacity(255);
                    this.setScale(1);
                }, this._lives[index], [index])
            );
        }
    }
});

/**
 * Tipos de animação de introdução.
 * @enum {String}
 */
pd.LifeHUD.IntroActionsTypes = {
    STANDARD                : "standard",
    SCALING                 : "scaling",
    FADE                    : "fade",
    COMING_FROM_THE_LEFT    : "comingFromTheLeft",
    COMING_FROM_THE_BOTTOM  : "comingFromTheBottom",
    COMING_FROM_THE_RIGHT   : "comingFromTheRight",
    COMING_FROM_THE_TOP     : "comingFromTheTop"
};

/**
 * Tipos de animação ao ganhar vida.
 * @enum {string}
 */
pd.LifeHUD.GainLifeActionsTypes = {
    STANDARD                : "standard",
    SCALING                 : "scaling",
    FADE                    : "fade"
};

/**
 *Tipos de animação ao perder vida.
 * @enum {string}
 */
pd.LifeHUD.LoseLifeActionsTypes = {
    STANDARD                : "standard",
    SCALING                 : "scaling",
    FADE                    : "fade"
};

/**
 *Tipos de animação de idle.
 * @enum {string}
 */
pd.LifeHUD.IdleActionsTypes = {
    STANDARD    : "standard",
    ROTATING    : "rotating",
    WAVE        : "wave"
};
