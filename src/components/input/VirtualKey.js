/**
 * Created by Ryan Balieiro on 17/06/17.
 * @desc Este arquivo contem a implementação de componentes de input baseados em teclas virtuais.
 */

/*
 * @class
 * @extends {pd.Button}
 * @classdesc Implementação de uma tecla virtual.
 */
pd.VirtualKey = pd.Button.extend({/** @lends pd.VirtualKey#**/
    /** @type {String} **/
    _labelType:"",

    /** @type {cc.Sprite|cc.LabelTTF} **/
    _label:null,

    /**
     * @constructs
     * @param labelType {pd.VirtualKey.LabelTypes.SPRITE|pd.VirtualKey.LabelTypes.TEXT} - o tipo do botão.
     * @param label {String} - o label do botão. Caso o tipo do botão seja 'SPRITE', passar um dos ícones do enumerador pd.Virtual.Icons. Caso o tipo do botão seja 'TEXT', passar uma string com um caracter.
     * @param attr {{x:Number, y:Number, scaleX:Number, scaleY:Number, opacity:Number, visible:Boolean, rotation:Number}} - as propriedades de exibição do botão.
     * @param autoEnable {Boolean} - indica se os listeners do botão devem ser adicionados automaticamente após a sua construção.
     * @param eventBased {Boolean} - indica se o mecanismo de callbacks do botão será baseado em eventos.
     * @param keyCode {Number=null} - o 'keyCode' da tecla.
     * @param [handler=null] {*|null} - para o método de callback explícito: o objeto que irá executar a função de callback.
     * @param [handlerFunc=null] {Function|String|null} - para o método de callback explícito: a função de callback a ser executada.
     * @param [handlerFuncArgs=null] {Array|null} - para o método de callback explícito: os argumentos a serem passados para a função de callback.
     */
    ctor: function(labelType, label, attr, autoEnable, eventBased, keyCode, handler, handlerFunc, handlerFuncArgs) {
        this._super("keyNaked0001", "keyNaked0002", attr, 1, autoEnable, eventBased, handler, handlerFunc, handlerFuncArgs);

        this._labelType = labelType;
        const boundingBox = this.getBoundingBox();

        if(labelType == pd.VirtualKey.LabelTypes.SPRITE) {
            this._label = new cc.Sprite(pd.getSpriteFrame(label));
            this._label.setPosition(boundingBox.width/1.9, boundingBox.height/2.05);
            this.addChild(this._label);
        }
        else {
            var str = " " + label.charAt(0).toUpperCase() + " ";
            this._label = new pd.createTextWithStandardFont(pd.Fonts.DIMBO, 0, 0, 60, cc.color(255, 255, 255, 255), null, str, cc.TEXT_ALIGNMENT_CENTER);
            this._label.setPosition(boundingBox.width/2, boundingBox.height/2);
            this.addChild(this._label);
        }

        if(keyCode)
            this.setKeyCode(keyCode);
    }
});

/**
 * Tipos de label suportadas pelo botão.
 * @enum {String}
 */
pd.VirtualKey.LabelTypes = {
    SPRITE: "labelTypeSprite",
    TEXT: "labelTypeText"
};

/**
 * Ícones presets.
 * @enum {String}
 */
pd.VirtualKey.Icons = {
    ACTION: "buttonLabelAction",
    BALOON: "buttonLabelBaloon",
    CHECK_MARK: "buttonLabelCheckMark",
    DASH: "buttonLabelDash",
    EXCLAMATION_MARK: "buttonLabelExclamationMark",
    EYE: "buttonLabelEye",
    FLAME: "buttonLabelFlame",
    HAND: "buttonLabelHand",
    PIN: "buttonLabelPin",
    REFRESH: "buttonLabelRefresh",
    SEARCH: "buttonLabelSearch",
    SETTINGS: "buttonLabelSettings",
    STAR: "buttonLabelStar"
};

/**
 * @class
 * @extends {cc.Layer}
 * @classdesc Implementação de um mini teclado de setas, simulando o comportamento de um teclado físico.
 */
pd.ArrowKeys = cc.Layer.extend({
    /**
     * @type {pd.Button}
     */
    leftButton:null,
    /**
     * @type {pd.Button}
     */
    rightButton:null,
    /**
     * @type {pd.Button}
     */
    upButton:null,
    /**
     * @type {pd.Button}
     */
    downButton:null,
    /**
     * @type {Array}
     */
    _buttons: null,

    /**
     * @constructs
     * @param hasLeftButton {Boolean}
     * @param hasRightButton {Boolean}
     * @param hasUpButton {Boolean}
     * @param hasDownButton {Boolean}
     * @param autoEnable {Boolean}
     */
    ctor: function(hasLeftButton, hasRightButton, hasUpButton, hasDownButton, autoEnable) {
        this._super();

        if(hasLeftButton)
            this.leftButton = this._addButton("keyLeft0001", "keyLeft0002", {x: -90, y: 0}, pd.Keys.LEFT);
        if(hasRightButton)
            this.rightButton = this._addButton("keyRight0001", "keyRight0002", {x: 90, y: 0}, pd.Keys.RIGHT);
        if(hasUpButton)
            this.upButton = this._addButton("keyUp0001", "keyUp0002", {x: 0, y: 70}, pd.Keys.UP);
        if(hasDownButton)
            this.downButton = this._addButton("keyDown0001", "keyDown0002", {x: 0, y: -20}, pd.Keys.DOWN);

        if(autoEnable)
            this.enable();
    },

    /**
     * Adiciona um botão de arrow key.
     * @param normalSprite {string}
     * @param pressedSprite {string}
     * @param attr {Object}
     * @param keyCode {Number}
     * @private
     */
    _addButton: function(normalSprite, pressedSprite, attr, keyCode) {
        this._buttons = this._buttons || [];
        var btn = new pd.Button(normalSprite, pressedSprite, attr, 1, false, true);
        this._buttons.push(btn);
        this.addChild(btn);
        btn.setKeyCode(keyCode);
    },

    /**
     * Ativa os botões.
     */
    enable: function() {
        for(var i in this._buttons) {
            this._buttons[i].enable();
        }
    },

    /**
     * Desativa os botões.
     */
    disable: function() {
        for(var i in this._buttons) {
            this._buttons[i].disable();
        }
    }

});