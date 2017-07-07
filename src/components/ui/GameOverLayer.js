/**
 * Created by Ryan Balieiro on 05/06/2017.
 * @class
 * @extends {cc.Layer}
 * @classdesc Animação de game over (vitória ou derrota). <br />
 *            Por enquanto mantive a estrutura de tweens das classes antigas, mas seria melhor organizar os passos da sequência de uma forma mais intuitiva!
 */
pd.GameOverLayer = cc.Layer.extend({/**@lends pd.GameOverLayer#*/
    /**
     * Armazena uma referência para o node que está manipulando o tutorial.
     * @type {cc.Scene}
     */
    _handler: null,
    /**
     * Spriteframe do círculo laranja.
     * @type {cc.SpriteFrame}
     */
    _circleSpriteFrame:null,
    /**
     * Spriteframe da mensagem de vitória.
     * @type {cc.SpriteFrame}
     */
    _labelSpriteFrame:null,
    /**
     * Indica se a cena deve tremer após o impact da animação.
     * @type {Boolean}
     */
    _shouldTilt:true,
    /**
     * Armazena o tipo da animação.
     * @type {String}
     */
    _type:"",
    /**
     * Velocidade das strips.
     * @type {Number}
     */
    speed:25,
    /**
     * Imagem de background.
     * @type {cc.Node}
     */
    _bg:null,
    /**
     * Faixa indicativa ("você venceu" ou "tente outra vez").
     * @type {cc.Node}
     */
    _strip:null,
    /**
     * Mensagem de vitória.
     * @type {cc.Node}
     */
    _messageBox:null,
    /**
     * Círculo laranja com o gráfico do personagem.
     * @type {cc.Node}
     */
    _circle:null,
    /**
     * @type {cc.Node}
     */
    _leftCorner:null,
    /**
     * @type {cc.Node}
     */
    _rightCorner:null,
    /**
     * @type {cc.Sequence}
     */
    _splashSeq:null,
    /**
     * @type {cc.Node[]}
     */
    _stars:null,
    /**
     * @type {cc.Node}
     */
    _wave:null,

    /**
     * Inicializa a animação, adicionando-a ao handler.
     * @param {cc.Node} handler
     * @param {pd.GameOverLayer.TYPE_WIN|pd.GameOverLayer.TYPE_LOSE} type
     * @param {cc.SpriteFrame} circleSpriteFrame
     * @param {cc.SpriteFrame} labelSpriteFrame
     * @param {Boolean} shouldTilt
     */
    init: function(handler, type, circleSpriteFrame, labelSpriteFrame, shouldTilt) {
        this._super();
        this._handler = handler;
        this._circleSpriteFrame = circleSpriteFrame;
        this._labelSpriteFrame = labelSpriteFrame;

        this._type = type;
        this._shouldTilt = shouldTilt;
        if(this._shouldTilt == null || this._shouldTilt == undefined)
            this._shouldTilt = true;

        if(this._type == pd.GameOverLayer.TYPE_LOSE)
            this.speed = 20;

        if(this._type == pd.GameOverLayer.TYPE_WIN && !labelSpriteFrame)
            throw new Error("[GameOverLayer] Layers de vitória precisam, obrigatóriamente, de uma placa com a mensagem de parabéns!");

        if(pd.GameOverLayer._hasInstance)
            throw new Error("[GameOverLayer] Houve uma tentativa de instânciar mais de uma layer de Game Over!");

        pd.GameOverLayer._hasInstance = true;
        pd.delegate.pause(handler);
        cc.eventManager.removeAllListeners();
        this.getScheduler().unscheduleAll();

        this._buildUp();
    },

    /**
     * Constrói os elementos visuais da layer.
     * @private
     */
    _buildUp: function() {
        this._addBackground();
        if(this._type == pd.GameOverLayer.TYPE_WIN) {
            this._addStrip("faixa.png", 1.1);
            this._addLabel();
            this._addCircle(80);

            //ficou meio vertical, mas está melhor do que o antigo...!
            this._addStar("estrela_grande.png", cc.winSize.width / 2 - 82, cc.winSize.height / 2, cc.p(1,0));
            this._addStar("estrela_grande.png",cc.winSize.width / 2 + 82, cc.winSize.height / 2, cc.p(0,0), true);
            this._addStar("estrela1.png", 760, 270, null, null, 1);
            this._addStar("estrela1.png", 730, 250, null, null, 0.5);
            this._addStar("estrela2.png", 700, 200, null, null, 0.85);
            this._addStar("estrela2.png", 670, 330, null, null, 1.4);
            this._addStar("estrela2.png", 360, 330, null, null, 1);
            this._addStar("estrela2.png", 330, 200, null, null, 1);
            this._addStar("estrela3.png", 255, 240, null, null, 1);
            this._addStar("estrela3.png", 220, 195, null, null, 0.5);
            this._addStar("estrela3.png", 265, 175, null, null, 0.45);

            this._setStars();
            this._setAudioSequence();
            this._setImpact();
            this._run();
        }
        else if(this._type == pd.GameOverLayer.TYPE_LOSE) {
            this._addStrip("faixa_frente.png", 1);
            this._addCorners();
            this._addCircle(30);
            this._setAudioSequence();
            this._setImpact();
            this._run();
        }
        else {
            throw new Error("O tipo informado não é suportado pela GameOverLayer!");
        }
    },

    /**
     * Adiciona o background à layer.
     * @private
     */
    _addBackground: function() {
        this._bg = new cc.Sprite(pd.res.s_fundoPreto);
        this._bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.addChild(this._bg, 0);
    },

    /**
     * Adiciona a faixa que cobre o círculo laranja e configura suas tweens.
     * @param {String} id
     * @param {Number} targetScale
     * @private
     */
    _addStrip: function(id, targetScale) {
        this._strip = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(id));
        this._strip.setPosition(cc.winSize.width / 2, cc.winSize.height / 4 + 30);
        this.addChild(this._strip, 10);

        const textureRect = this._strip.getTextureRect();
        this._strip.rectX = textureRect.x;
        this._strip.rectY = textureRect.y;
        this._strip.rectW = textureRect.width;
        this._strip.rectH = textureRect.height;

        this._strip.maskLeftX = this._strip.rectX + this._strip.rectW/2;
        this._strip.maskRightX = 0;
        this._strip.setTextureRect(
            cc.rect(this._strip.maskLeftX, this._strip.rectY, this._strip.maskRightX, this._strip.rectH)
        );

        this._strip.splashIn = cc.targetedAction(this._strip, cc.scaleTo(0.3, targetScale, 1));
        this._strip.splashOut = cc.targetedAction(this._strip, cc.scaleTo(1, 1, 1).easing(cc.easeBounceOut()));
        pd.delegate.retain(this._strip.splashIn);
        pd.delegate.retain(this._strip.splashOut);
    },

    /**
     * Adiciona a mensagem de vitória e configura suas tweens.
     * @private
     */
    _addLabel: function() {
        this._messageBox = new cc.Sprite(this._labelSpriteFrame);
        this._messageBox.setPosition(cc.winSize.width / 2, cc.winSize.height / 4 + 55);
        this._messageBox.setAnchorPoint(0.5, 1);
        this._messageBox.setScale(1, 0);
        this.addChild(this._messageBox, 8);

        this._messageBox.scaleUp = cc.targetedAction(this._messageBox, new cc.ScaleTo(0.3, 1, 1));
        this._messageBox.splashIn = cc.targetedAction(this._messageBox, new cc.ScaleTo(0.3, 1, 1.2));
        this._messageBox.splashOut = cc.targetedAction(this._messageBox, new cc.EaseBounceOut(new cc.ScaleTo(1, 1, 1)));

        pd.delegate.retain(this._messageBox.scaleUp);
        pd.delegate.retain(this._strip.splashIn);
        pd.delegate.retain(this._strip.splashOut);

        var seqMessageBox = cc.sequence(this._messageBox.scaleUp, this._messageBox.splashIn, cc.delayTime(0.1), this._messageBox.splashOut);
        var scaleMessageBox = cc.callFunc(function(){this.runAction(seqMessageBox)}, this);
        this.splashSeq = cc.sequence(this._strip.splashIn, scaleMessageBox, cc.delayTime(0.1), this._strip.splashOut);

        pd.delegate.retain(this.splashSeq);
        pd.delegate.retain(seqMessageBox);
    },

    /**
     * Adiciona o círculo laranja com o personagem e configura suas tweens.
     * @param {Number} offsetY
     * @private
     */
    _addCircle: function(offsetY) {
        this._circle = new cc.Sprite(this._circleSpriteFrame);
        this._circle.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + offsetY);
        this._circle.setScale(0);
        this.addChild(this._circle, 5);
        this._circle.animate = cc.targetedAction(this._circle, cc.sequence(
            cc.scaleTo(0.2, 1.2).easing(cc.easeSineOut()),
            cc.scaleTo(0.5, 1).easing(cc.easeBounceOut()),
            cc.delayTime(0.15),
            cc.jumpBy(1, 0, 0, this._type == pd.GameOverLayer.TYPE_LOSE ? 20 : 0, 1).easing(cc.easeBackOut())
        ));
        pd.delegate.retain(this._circle.animate);
    },

    /**
     * Cria um 'canto' da faixa de derrota.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} anchorPointX
     * @param {Boolean} flippedX
     * @returns {cc.Sprite}
     * @private
     */
    _createCorner: function(x, y, anchorPointX, flippedX) {
        var corner = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("faixa_aba.png"));
        corner.setPosition(x, y);
        corner.setAnchorPoint(anchorPointX, 0.5);
        this.addChild(corner, 9);
        corner.setScale(0, 1);
        corner.setFlippedX(flippedX);

        corner.scaleUp = cc.targetedAction(corner, cc.scaleTo(0.3, 1).easing(cc.easeBackOut()));

        pd.delegate.retain(corner.scaleUp);
        return corner;
    },

    /**
     * Adiciona os 'cantos' da faixa de derrota.
     * @private
     */
    _addCorners: function() {
        this._leftCorner = this._createCorner(this._strip.x - 165, this._strip.y + 35, 1, false);
        this._rightCorner = this._createCorner(this._strip.x + 165, this._strip.y + 35, 0, true);

        this.scaleUpTimer = cc.sequence(
            cc.delayTime(1),
            cc.callFunc(function() {
                this.runAction(this._leftCorner.scaleUp);
                this.runAction(this._rightCorner.scaleUp);
            }, this)
        );
        pd.delegate.retain(this.scaleUpTimer);
        
        var splashIn = cc.callFunc(function() {
            this.runAction(this._strip.splashIn);
        }, this);

        var splashOut = cc.callFunc(function() {
            this.runAction(this._strip.splashOut);
        }, this);

        this.splashSeq = cc.sequence(splashIn, cc.delayTime(0.1), splashOut, cc.delayTime(0.4));
        pd.delegate.retain(splashIn);
        pd.delegate.retain(splashOut);
        pd.delegate.retain(this.splashSeq);
    },

    /**
     * Adiciona uma estrela à layer.
     * @param {String} id
     * @param {Number} x
     * @param {Number} y
     * @param {cc.Point} anchorPoint
     * @param {Boolean} flippedX
     * @param {Number} maxScale
     * @private
     */
    _addStar: function(id, x, y, anchorPoint, flippedX, maxScale) {
        if(!this._stars)
            this._stars = [];

        var star = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(id));
        star.setPosition(x, y);
        if(anchorPoint)
            star.setAnchorPoint(anchorPoint.x, anchorPoint.y);

        if(flippedX)
            star.setFlippedX(flippedX);

        star.maxEscala = maxScale || 1;
        this._stars.push(star);
    },

    /**
     * Seta o estado inicial das _stars[].
     * @private
     */
    _setStars: function() {
        for(var i in this._stars) {
            this._stars[i].setScale(0);
            if(i <= 1) {
                this.addChild(this._stars[i], 2);
                this._stars[i].scaleUp = cc.scaleTo(2, 1).easing(cc.easeBounceOut());
                this._stars[i].animate = cc.callFunc(function() {this.runAction(this.scaleUp);}, this._stars[i]);
                pd.delegate.retain(this._stars[i].scaleUp);
                pd.delegate.retain(this._stars[i].animate);
            }
            else {
                this.addChild(this._stars[i], 12);
                this._stars[i].scaleUp = cc.repeatForever(new cc.EaseBounceOut(cc.scaleTo(2.5, this._stars[i].maxEscala)));
                this._stars[i].rodar = cc.repeatForever(cc.rotateBy(2.5, 360));
                this._stars[i].animate = cc.callFunc(function(){this.runAction(this.scaleUp);this.runAction(this.rodar);},this._stars[i]);
                pd.delegate.retain(this._stars[i].scaleUp);
                pd.delegate.retain(this._stars[i].animate);
                pd.delegate.retain(this._stars[i].rodar);
            }
        }
    },

    /**
     * Seta a sequência de áudios.
     * @private
     */
    _setAudioSequence: function() {
        var explosion = cc.callFunc(function() {pd.audioEngine.playEffect(pd.res.fx_exp);}, this);

        if(this._type == pd.GameOverLayer.TYPE_WIN) {
            var reveal = cc.callFunc(function() {
                pd.audioEngine.playEffect(pd.res.fx_star);
                for(var i = 0; i < this._stars.length; i++) {
                    this.runAction(this._stars[i].animate);
                }
                this.schedule(this._animate, 1/60);
            }, this);
        }
        else {
            reveal = cc.callFunc(function() {this.schedule(this._animate, 1/60);}, this);
        }

        var audioFlip = cc.callFunc(function() {pd.audioEngine.playEffect(pd.res.fx_flip);}, this);
        this.audioSeq = cc.sequence(cc.delayTime(0.1), explosion, cc.delayTime(0.7), reveal, audioFlip);
        pd.delegate.retain(this.audioSeq);
    },

    /**
     * Seta a animação de impact.
     * @private
     */
    _setImpact: function() {
        this._wave = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("impacto.png"));
        this._wave.setPosition(this._circle.getPosition());
        this.addChild(this._wave, 4);
        this._wave.setScale(0);
        this._wave.setOpacity(50);
        this._wave.scaleUp = cc.targetedAction(this._wave, new cc.ScaleTo(0.5, 3));
        this._wave.sumir = cc.targetedAction(this._wave, new cc.FadeTo(0.5, 0));

        var impact = cc.callFunc(function() {
            this.runAction(this._wave.scaleUp);
            this.runAction(this._wave.sumir);
        }, this);

        pd.delegate.retain(this._wave.scaleUp);
        pd.delegate.retain(this._wave.sumir);
        pd.delegate.retain(impact);

        var bgmStart = cc.callFunc(function() {
            pd.audioEngine.playMusic(this._type == pd.GameOverLayer.TYPE_WIN ? pd.res.fx_BgmWin : pd.res.fx_BgmLose, false);
            pd.audioEngine.setMusicVolume(0.3);
        }, this);
        pd.delegate.retain(bgmStart);

        var tiltIn = cc.targetedAction(this._handler, cc.rotateTo(0.05, 1));
        var tiltOut = cc.targetedAction(this._handler, cc.rotateTo(0.06, -1.7));
        var tiltReset = cc.targetedAction(this._handler, cc.rotateTo(0.05, 0));
        var tiltPart1 = cc.sequence(tiltIn, tiltOut);
        var tiltRepeat = cc.repeat(tiltPart1, 5);
        
        if(this._shouldTilt)
            this.tiltPart2 = cc.sequence(cc.delayTime(0.25), impact, tiltRepeat, tiltReset, cc.delayTime(1), bgmStart);
        else
            this.tiltPart2 = cc.sequence(cc.delayTime(0.25), cc.delayTime(1.5), bgmStart);
        
        pd.delegate.retain(this.tiltPart2);
        pd.audioEngine.stopMusic();
    },

    /**
     * Roda todas as animações.
     * @private
     */
    _run: function() {
        this.runAction(this.audioSeq);
        this.runAction(this._circle.animate);
        this.runAction(this.tiltPart2);
        if(this._type == pd.GameOverLayer.TYPE_LOSE)
            this.runAction(this.scaleUpTimer);
        this.schedule(this._finish, this._type == pd.GameOverLayer.TYPE_WIN ? 9.5 : 6.5);
    },

    /**
     * Realiza as animações assíncronas (chamada via scheduler).
     * @private
     */
    _animate: function() {
        if(this._strip.maskLeftX - this.speed > this._strip.rectX) {
            this._strip.maskLeftX -= this.speed;
            this._strip.maskRightX += this.speed * 2;
        }
        else {
            if(this._type == pd.GameOverLayer.TYPE_WIN) {
                this._strip.maskLeftX = this._strip.rectX;
                this._strip.maskRightX = this._strip.rectW;
            }
            this.runAction(this.splashSeq);
            this.unschedule(this._animate);
        }


        this._strip.setTextureRect(cc.rect(this._strip.maskLeftX, this._strip.rectY, this._strip.maskRightX, this._strip.rectH));
    },

    /**
     * Finaliza a animação.
     * @private
     */
    _finish: function() {
        pd.GameOverLayer._hasInstance = false;
        pd.delegate.finish();
    }
});

/**
 * @constant
 * @type {String}
 */
pd.GameOverLayer.TYPE_WIN = "animationTypeWin";

/**
 * @constant
 * @type {String}
 */
pd.GameOverLayer.TYPE_LOSE = "animationTypeLose";

/**
 * Indica se há uma instância ativa de uma GameOverLayer.
 * @type {Boolean}
 */
pd.GameOverLayer._hasInstance = false;
