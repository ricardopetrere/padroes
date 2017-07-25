/**
 * Created by Ryan Balieiro on 17/06/17.
 * @desc Este arquivo contem a implementação de componentes de input customizados baseados em botões e teclas virtuais.
 *       Pendência: transformar as ArrowKeys em pd.StandardButton's, passando os ícones das setas como parâmetro, permitindo que a cor delas seja customizada também.
 */

/*
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
        this._super(this._getLabel(shape, color, false), this._getLabel(shape, color, true), attr, 1, autoEnable, eventBased, handler, handlerFunc, handlerFuncArgs);

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
            this._background = pd.createSprite("roundButtonBody.png", boundingBox.width/2 + 3, boundingBox.height/2, this, -1);
            this._label.setPosition(this._label.x + 6.5, this._label.y - 4);
        }
        else if(shape == pd.StandardButton.Shapes.SQUARED) {
            this._background = pd.createSprite("squareButtonBody.png", boundingBox.width/2 + 3, boundingBox.height/2, this, -1);
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
                return pressed ? "pd_btn_naked_pressed" : "pd_btn_naked_normal";
            }
            else {
                return pressed ? "keyNaked0002" : "keyNaked0001";
            }
        }
        else {
            if(shape == pd.StandardButton.Shapes.ROUNDED) {
                return pressed ? "roundButtonTransparent0002" : "roundButtonTransparent0001";
            }
            else {
                return pressed ? "squareButtonTransparent0002" : "squareButtonTransparent0001";
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
    PIN: "buttonLabelPin",
    REFRESH: "buttonLabelRefresh",
    SEARCH: "buttonLabelSearch",
    SETTINGS: "buttonLabelSettings",
    STAR: "buttonLabelStar",
    TIP: "buttonLabelTip"
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
     * @type {number}
     */
    spacing: 90,

    /**
     * @constructs
     * @param {Boolean} [hasLeftButton=false]
     * @param {Boolean} [hasRightButton=false]
     * @param {Boolean} [hasUpButton=false]
     * @param {Boolean} [hasDownButton=false]
     * @param {Object} [attr=null]
     * @param {Boolean} [autoEnable=false]
     */
    ctor: function(hasLeftButton, hasRightButton, hasUpButton, hasDownButton, attr, autoEnable) {
        this._super();

        if(hasLeftButton)
            this.leftButton = this._addButton("keyLeft0001", "keyLeft0002", {x: -this.spacing, y: 0}, pd.Keys.LEFT);
        if(hasRightButton)
            this.rightButton = this._addButton("keyRight0001", "keyRight0002", {x: this.spacing, y: 0}, pd.Keys.RIGHT);
        if(hasUpButton)
            this.upButton = this._addButton("keyUp0001", "keyUp0002", {x: 0, y: this.spacing - 20}, pd.Keys.UP);
        if(hasDownButton)
            this.downButton = this._addButton("keyDown0001", "keyDown0002", {x: 0, y: -20}, pd.Keys.DOWN);

        if (!hasDownButton && !hasUpButton) {
            this.leftButton.x += (this.spacing / 2);
            this.rightButton.x -= (this.spacing / 2);
        }

        if(autoEnable)
            this.enable();

        if(attr)
            this.attr(pd.parseAttr(attr));
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
     * @param {Function | string} [onKeyDown=null] - função de callback para eventos de onKeyDown.
     * @param {Function | string} [onKeyUp=null] - função de callback para eventos de onKeyUp.
     * @param {Object} [handler=null] - handler da função. Caso não seja fornecido, o próprio teclado virtual será registrado como handler.
     */
    setCallbacks: function(onKeyDown, onKeyUp, handler) {
        for(var i in this._buttons) {
            var btn = this._buttons[i];
            if(onKeyDown)
                pd.inputManager.add(pd.InputManager.Events.BUTTON_PRESSED, btn, onKeyDown, handler || this);
            if(onKeyUp)
                pd.inputManager.add(pd.InputManager.Events.BUTTON_RELEASED, btn, onKeyUp, handler || this);
        }
    }
});