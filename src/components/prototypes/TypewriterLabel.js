/**
 * Created by Ryan Balieiro on 22/08/17.
 *
 * @class
 * @extends {cc.Node}
 * @classdesc Classe-base para a implementação de caixas de texto atualizáveis, simulando o efeito de uma máquina de escrever.
 */
pd.TypewriterLabel = cc.Node.extend({/** @lends pd.TypewriterLabel#**/

    /**
     * @constructs
     * @param {String} _font
     * @param {Number} _fontSize
     */
    ctor: function(_font, _fontSize) {
        this._super();
        this._labels = [];
        this.setFont(_font, _fontSize);
    },

    /**
     * Seta a fonte do componente.
     * @param {String} _font
     * @param {Number} _fontSize
     */
    setFont: function(_font, _fontSize) {
        this._font = _font;
        this._fontSize = _fontSize;
    },

    /**
     * Seta o modo para ignorar a variável isPaused no update.
     * @param {Boolean} ignorePaused
     */
    setIgnorePaused: function(ignorePaused) {
        this._ignorePaused = ignorePaused;
    },

    /**
     * Limpa o texto sendo exibido.
     */
    cleanText: function() {
        for(var i in this._labels) {
            this.removeChild(this._labels[i]);
        }

        this._labels = [];
    },

    /**
     * Seta a cor do texto.
     * @param {cc.Color} color
     */
    setFontColor: function(color) {
        for(var i = 0; i < this._labels.length; i++) {
            this._labels[i].setFontFillColor(color);
        }
    },

    /**
     * Centraliza o texto do componente
     * @param {Number} customWidth
     * @param {Number} customHeight
     */
    centralize: function(customWidth, customHeight) {
        for(var i = 0; i < this._labels.length; i++) {
            this._labels[i].setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
            this._labels[i].setDimensions(customWidth, customHeight);
        }
    },

    /**
     * Seta a posição e o espaçamento entre os textos.
     * @param {Number} x
     * @param {Number} y
     * @param {Number} _spacingY
     */
    setTextPosition: function(x, y, _spacingY) {
        this._spacingY = _spacingY;
        for(var i = 0; i < this._labels.length; i++) {
            this._labels[i].setPosition(x, y + (_spacingY * i));
        }
    },

    /**
     * Seta o efeito sonoro a ser tocado a cada aparecimento da letra.
     * @param {String} _typeSfx
     */
    setSound: function(_typeSfx) {
        this._typeSfx = _typeSfx;
    },

    /**
     * Configura o componente.
     * @param {Number} _displayingLinesAmount
     * @param {String} [_typeSfx=null]
     * @param {Number} [x=0]
     * @param {Number} [y=0]
     * @param {Number} [_spacingY=-30]
     */
    config: function(_displayingLinesAmount, _typeSfx, x, y, _spacingY) {
        this._displayingLinesAmount = _displayingLinesAmount;
        if(_typeSfx)
            this.setSound(_typeSfx);
        if(x != undefined && y != undefined && _spacingY != undefined)
            this.setTextPosition(x, y, _spacingY || -30);
    },

    /**
     * Adiciona um callback a ser chamado durante a animação do texto.
     * @param _handler {cc.Node}
     * @param callback {String}
     */
    setOnUpdate: function(_handler, callback) {
        this._onUpdateHandler = _handler;
        this._onUpdate = callback;
    },

    /**
     * Adiciona um callback a ser chamado após a animação do texto terminar.
     * @param _handler {cc.Node}
     * @param callback {String}
     */
    setOnComplete: function(_handler, callback) {
        this._onCompleteHandler = _handler;
        this._onComplete = callback;
    },

    /**
     * Adiciona uma linha.
     * @param text {String}
     * @param callback {String}
     * @param _handler {cc.Node}
     */
    addLine: function(text, callback, _handler) {
        var label = new pd.TypewritterInternalLabelTTF('', this._font, this._fontSize);
        label._completedText = text;
        label.callback = callback;
        label._handler = _handler;
        label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        label.setAnchorPoint(0, 0.5);
        this._labels.push(label);
        this.addChild(label);
    },

    /**
     * Inicializa a animação.
     * @param {Number} [timeSpanBetweenEachLetter=0.1]
     */
    start: function(timeSpanBetweenEachLetter) {
        this._currentLine = 0;
        timeSpanBetweenEachLetter = timeSpanBetweenEachLetter || 0.1;
        for(var i = 0; i < this._labels.length; i++) {
            this._labels[i].timeSpanBetweenEachLetter = timeSpanBetweenEachLetter;
            this._labels[i]._handler = this;
        }
        this._labels[this._currentLine]._startUpdate(this);
    },

    /**
     * Reseta a animação.
     */
    reset: function() {
        this._currentLine = 0;
        for(var i = 0; i < this._labels.length; i++) {
            this._labels[i].setString('');
            this._labels[i].isDone = false;
            this._labels[i].setPosition(this.basePosition[0], this.basePosition[1] + (this.basePosition[2] * i));
        }
    },

    /**
     * Para de atualizar e mostra o texto instantaneamente.
     */
    displayTextInstant: function() {
        for(var i = 0 ; i < this._labels.length ; i++) {
            var label = this._labels[i];
            label.displayTextInstant();
        }

        if(this._onComplete) {
            this._onCompleteHandler[this._onComplete]();
        }
    },

    /**
     * Manipula o término de uma animação de uma linha.
     * @private
     */
    _onLineCompleted: function() {
        this._currentLine++;

        if(this._currentLine >= this._displayingLinesAmount && this._currentLine < this._labels.length) {
            for(var i = 0; i < this._labels.length; i++) {
                this._labels[i].runAction(cc.moveBy(0.5, 0, -this._spacingY));
            }
            this._labels[this._currentLine - this._displayingLinesAmount].runAction(cc.fadeOut(0.2));
        }

        if(this._currentLine < this._labels.length) {
            this._labels[this._currentLine]._startUpdate(this);
        }
        else if(this._onComplete) {
            this._onCompleteHandler[this._onComplete]();
        }
    }
});

/**
 * @class
 * @extends {cc.LabelTTF}
 * @classdesc Caixa de texto atualizável (para uso interno).
 */
pd.TypewritterInternalLabelTTF = cc.LabelTTF.extend({/** @lends pd.decorators.UpdateableText#*/
    /** @type {pd.TypewriterLabel} **/
    _handler: null,
    /** @type {String} **/
    _currentText: "",
    /** @type {String} **/
    _targetText: "",
    /** @type {String} **/
    _completedText: "",
    /** @type {Number} **/
    _dt:0,
    /** @type {Boolean} **/
    isDone: false,
    /** @type {Number} **/
    _soundDt:0,

    /**
     * Inicia a atualização do componente.
     * @param _handler {cc.Node}
     * @private
     */
    _startUpdate: function(_handler) {
        this._handler = _handler;
        this._currentText = "";
        this._targetText = this._completedText.split("");
        this.setString("");
        this._dt = 0;
        this.scheduleUpdate();
        this.isDone = false;
    },

    /**
     * Atualiza o componente
     * @param _dt {Number}
     */
    update: function(_dt) {
        if(pd.delegate.isPaused && !this._handler._ignorePaused)
            return;

        this._dt += _dt;
        this._soundDt += _dt;
        if(this._dt >= this.timeSpanBetweenEachLetter) {
            this._dt -= this.timeSpanBetweenEachLetter;
            if(this._targetText[0] != " " && this._soundDt > 0.05 && !pd.delegate.isPaused){
                this._soundDt = 0;
                pd.audioEngine.playEffect(this._handler._typeSfx ? this._handler._typeSfx : pd.res.fx_escrever);
            }
            this._currentText += this._targetText[0];
            this._targetText.splice(0, 1);
            this.setString(this._currentText);

            if(this._targetText.length <= 0){
                this._finish();
            }

            if(this._handler._onUpdate) {
                this._handler._onUpdateHandler[this._handler._onUpdate](this);
            }
        }
    },

    /**
     * Mostra o texto instantaneamente.
     */
    displayTextInstant: function() {
        this.unscheduleUpdate();
        this.isDone = true;
        this._currentText = this._completedText;
        this.setString(this._currentText);

        if(this._handler._onUpdate) {
            this._handler._onUpdateHandler[this._handler._onUpdate](this);
        }
    },

    /**
     * Finaliza a atualização do componente.
     * @private
     */
    _finish: function() {
        this.unscheduleUpdate();
        this.isDone = true;
        this._handler._onLineCompleted();
        if(this.callback){
            this._handler[this.callback](this);
        }
    }
});