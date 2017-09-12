/**
 * Created by Ryan Balieiro on 17/06/17.
 * @class
 * @extends {pd.Button}
 * @classdesc Implementação de um botão com uma skin padrão.
 */
pd.StandardButton = pd.Button.extend({/** @lends pd.StandardButton#**/
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
     * @type {cc.Sprite}
     */
    _background:null,

    /**
     * @constructs
     * @param {pd.StandardButton.Shapes} shape - o formato do botão.
     * @param {pd.StandardButton.Icons|String} label - o label do botão. Caso o tipo da label do botão seja 'SPRITE', passar um dos ícones do enumerador pd.Virtual.Icons ou um sprite frame name. Caso o tipo do botão seja 'TEXT', passar uma string com APENAS um caracter.
     * @param {Object} [attr=null] - as propriedades de exibição do botão.
     * @param {Boolean} [autoEnable=false] - indica se os listeners do botão devem ser adicionados automaticamente após a sua construção.
     * @param {Boolean} [eventBased=false] - indica se o mecanismo de callbacks do botão será baseado em eventos.
     * @param {Number} [keyCode=null] - o 'keyCode' da tecla.
     * @param {cc.Color} [color=null] - uma cor customizada para o botão. Se não for especificado, o botão irá possuir a cor padrão.
     * @param {*|null} [handler=null] - para o método de callback explícito: o objeto que irá executar a função de callback.
     * @param {Function|String|null} [handlerFunc=null] - para o método de callback explícito: a função de callback a ser executada.
     * @param {Array|null} [handlerFuncArgs=null] - para o método de callback explícito: os argumentos a serem passados para a função de callback.
     */
    ctor: function(shape, label, attr, autoEnable, eventBased, keyCode, color, handler, handlerFunc, handlerFuncArgs) {
        this._super(this._getLabel(shape, color, false), this._getLabel(shape, color, true), null, null, autoEnable, eventBased, handler, handlerFunc, handlerFuncArgs);

        this.setCascadeOpacityEnabled(true);
        if(pd.getSpriteFrame(label)) {
            this._setSpriteButton(shape, label, color);
        }
        else {
            this._setTextButton(shape, label, color);
        }

        this._addColorBackground(shape, color);
        this.addChild(this._label);
        if(keyCode)
            this.setKeyCode(keyCode);

        if(color)
            this.setColor(color);

        if (attr)
            this.attr(pd.parseAttr(attr));
    },

    /**
     * Seta um botão com uma label de sprite.
     * @param {pd.StandardButton.Shapes} shape
     * @param {pd.StandardButton.Icons|String} label
     * @param {cc.Color} color
     * @private
     */
    _setSpriteButton: function(shape, label, color) {
        const boundingBox = this.getBoundingBox();

        this._label = new cc.Sprite(pd.getSpriteFrame(label));
        if(shape == pd.StandardButton.Shapes.ROUNDED) {
            this._label.setPosition(boundingBox.width / 2.13, boundingBox.height / 1.9);
        }
        else {
            this._label.setPosition(boundingBox.width / 1.9, boundingBox.height / 2.05);
        }

        if(label == pd.StandardButton.Icons.TIP)
            this._label.attr({scaleX:0.88, scaleY:0.88, x:this._label.x - 2, y:this._label.y + 3});
    },

    /**
     * Seta um botão com uma label de caixa de texto.
     * @param {pd.StandardButton.Shapes} shape
     * @param {pd.StandardButton.Icons|String} label
     * @param {cc.Color} color
     * @private
     */
    _setTextButton: function(shape, label, color) {
        const boundingBox = this.getBoundingBox();

        var str = " " + label.charAt(0).toUpperCase() + " ";
        this._label = new pd.createTextWithStandardFont(pd.Fonts.DIMBO, 0, 0, 60, cc.color(255, 255, 255, 255), str, cc.TEXT_ALIGNMENT_CENTER, null);
        if(shape == pd.StandardButton.Shapes.ROUNDED) {
            this._label.setPosition(boundingBox.width / 2.18, boundingBox.height / 1.8);
        }
        else {
            this._label.setPosition(boundingBox.width / 2, boundingBox.height / 2);
        }
    },

    /**
     * Adiciona o background com uma cor chapada 'colorível'.
     * @param {pd.StandardButton.Shapes} shape
     * @param {cc.Color} color
     * @private
     */
    _addColorBackground: function(shape, color) {
        if(!color)
            return;

        const boundingBox = this.getBoundingBox();
        if(shape == pd.StandardButton.Shapes.ROUNDED) {
            this._background = pd.createSprite(pd.SpriteFrames.ROUND_BUTTON_BODY, boundingBox.width/2 + 3, boundingBox.height/2, this, -1);
            this._label.setPosition(this._label.x + 6.5, this._label.y - 4);
        }
        else if(shape == pd.StandardButton.Shapes.SQUARED) {
            this._background = pd.createSprite(pd.SpriteFrames.SQUARE_BUTTON_BODY, boundingBox.width/2 + 3, boundingBox.height/2, this, -1);
        }
    },

    /**
     * @param {pd.StandardButton.Shapes} shape
     * @param {cc.Color} color
     * @param {Boolean} pressed
     * @private
     */
    _getLabel: function(shape, color, pressed) {
        if(!color) {
            if (shape == pd.StandardButton.Shapes.ROUNDED) {
                return pressed ? pd.SpriteFrames.BTN_NAKED_PRESSED : pd.SpriteFrames.BTN_NAKED;
            }
            else {
                return pressed ? pd.SpriteFrames.KEY_NAKED_PRESSED : pd.SpriteFrames.KEY_NAKED;
            }
        }
        else {
            if(shape == pd.StandardButton.Shapes.ROUNDED) {
                return pressed ? pd.SpriteFrames.ROUND_BUTTON_TRANSPARENT_PRESSED : pd.SpriteFrames.ROUND_BUTTON_TRANSPARENT;
            }
            else {
                return pressed ? pd.SpriteFrames.SQUARE_BUTTON_TRANSPARENT_PRESSED : pd.SpriteFrames.SQUARE_BUTTON_TRANSPARENT;
            }
        }
    },

    /**
     * Seta a cor do botão
     * @param {cc.Color} color
     */
    setColor: function(color) {
        if(this._background) {
            this._background.setColor(color);
        }
        else {
            this._super(color);
        }
    },

    /**
     * Faz um ajuste fino na posição da label do botão.
     * @param {Number} dx
     * @param {Number} dy
     */
    adjustLabel: function (dx, dy) {
        this._label.x += dx;
        this._label.y += dy;
    }
});

/**
 * Formatos do botão.
 * @enum {String}
 */
pd.StandardButton.Shapes = {
    SQUARED: "btnShapeSquared",
    ROUNDED: "btnShapeRounded"
};

/**
 * Ícones pré-setados.
 * @enum {String}
 */
pd.StandardButton.Icons = {
    ACTION: "buttonLabelAction",
    BALOON: "buttonLabelBaloon",
    CHECK_MARK: "buttonLabelCheckMark",
    DASH: "buttonLabelDash",
    EXCLAMATION_MARK: "buttonLabelExclamationMark",
    EYE: "buttonLabelEye",
    FLAME: "buttonLabelFlame",
    HAND: "buttonLabelHand",
    NONE: "",
    PIN: "buttonLabelPin",
    REFRESH: "buttonLabelRefresh",
    SEARCH: "buttonLabelSearch",
    SETTINGS: "buttonLabelSettings",
    STAR: "buttonLabelStar",
    TIP: "buttonLabelTip"
};