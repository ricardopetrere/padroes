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
    /**
     * O tipo do label da tecla virtual (imagem ou texto).
     * @type {String}
     **/
    _labelType:"",

    /**
     * @type {cc.Sprite|cc.LabelTTF}
     **/
    _label:null,


    /**
     * @constructs
     * @param {pd.VirtualKey.LabelTypes} labelType - o tipo do botão.
     * @param {pd.VirtualKey.Icons|String} label - o label do botão. Caso o tipo da label do botão seja 'SPRITE', passar um dos ícones do enumerador pd.Virtual.Icons ou um sprite frame name. Caso o tipo do botão seja 'TEXT', passar uma string com um caracter.
     * @param {Object} [attr=null] - as propriedades de exibição do botão.
     * @param {Boolean} [autoEnable=false] - indica se os listeners do botão devem ser adicionados automaticamente após a sua construção.
     * @param {Boolean} [eventBased=false] - indica se o mecanismo de callbacks do botão será baseado em eventos.
     * @param {Number} [keyCode=null] - o 'keyCode' da tecla.
     * @param {*|null} [handler=null] - para o método de callback explícito: o objeto que irá executar a função de callback.
     * @param {Function|String|null} [handlerFunc=null] - para o método de callback explícito: a função de callback a ser executada.
     * @param {Array|null} [handlerFuncArgs=null] - para o método de callback explícito: os argumentos a serem passados para a função de callback.
     */
    ctor: function(labelType, label, attr, autoEnable, eventBased, keyCode, handler, handlerFunc, handlerFuncArgs) {
        this._super("keyNaked0001", "keyNaked0002", attr, 1, autoEnable, eventBased, handler, handlerFunc, handlerFuncArgs);
        this.setCascadeOpacityEnabled(true);
        this._labelType = labelType;
        const boundingBox = this.getBoundingBox();

        if(labelType == pd.VirtualKey.LabelTypes.SPRITE) {
            this._label = new cc.Sprite(pd.getSpriteFrame(label));
            this._label.setPosition(boundingBox.width/1.9, boundingBox.height/2.05);
            this.addChild(this._label);
        }
        else {
            var str = " " + label.charAt(0).toUpperCase() + " ";
            this._label = new pd.createTextWithStandardFont(pd.Fonts.DIMBO, 0, 0, 60, cc.color(255, 255, 255, 255), str, cc.TEXT_ALIGNMENT_CENTER, null);
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
 * Ícones pré-setados.
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
pd.ArrowKeys = cc.Layer.extend({/** @lends pd.ArrowKeys#**/
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
     * Array com apontamentos para todos os botões para facilitar o acesso em massa.
     * @type {Array}
     */
    _buttons: null,

    /**
     * @constructs
     * @param {Boolean} [hasLeftButton=false]
     * @param {Boolean} [hasRightButton=false]
     * @param {Boolean} [hasUpButton=false]
     * @param {Boolean} [hasDownButton=false]
     * @param {Boolean} [autoEnable=false]
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
     * @param {String} normalSprite
     * @param {String} pressedSprite
     * @param {Number} attr
     * @param {Number} keyCode
     * @private
     */
    _addButton: function(normalSprite, pressedSprite, attr, keyCode) {
        this._buttons = this._buttons || [];
        var btn = new pd.Button(normalSprite, pressedSprite, attr, 1, false, true);
        btn.setDisabledOpacity(155);
        this._buttons.push(btn);
        this.addChild(btn);
        btn.setKeyCode(keyCode);
        return btn;
    },

    /**
     * Ativa os botões do teclado.
     */
    enable: function() {
        for(var i in this._buttons) {
            this._buttons[i].enable();
        }
    },

    /**
     * Desativa os botões do teclado.
     */
    disable: function() {
        for(var i in this._buttons) {
            this._buttons[i].disable();
        }
    },

    /**
     * Seta as funções de callback do componente.
     * @param {keyboardCallback} [onKeyDown=null] - função de callback para eventos de onKeyDown.
     * @param {keyboardCallback} [onKeyUp=null] - função de callback para eventos de onKeyUp.
     * @param {Object} [handler=null] - handler da função. Caso não seja fornecido, o próprio teclado virtual será registrado como handler.
     */
    setCallbacks: function(onKeyDown, onKeyUp, handler) {
        for(var i in this._buttons) {
            var btn = this._buttons[i];
            if(onKeyDown)
                pd.inputManager.add(pd.InputManager.EVENT_BUTTON_PRESSED, btn, onKeyDown, handler || this);
            if(onKeyUp)
                pd.inputManager.add(pd.InputManager.EVENT_BUTTON_RELEASED, btn, onKeyUp, handler || this);
        }
    }
});