/**
 * Created by Ryan Balieiro on 22/08/17.
 *
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
    keys: null,
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
            this.leftButton = this._addButton(pd.SpriteFrames.KEY_LEFT, pd.SpriteFrames.KEY_LEFT_PRESSED, {x: 0, y: 0}, pd.Keys.LEFT);
        if(hasRightButton)
            this.rightButton = this._addButton(pd.SpriteFrames.KEY_RIGHT, pd.SpriteFrames.KEY_RIGHT_PRESSED, {x: 0, y: 0}, pd.Keys.RIGHT);
        if(hasUpButton)
            this.upButton = this._addButton(pd.SpriteFrames.KEY_UP, pd.SpriteFrames.KEY_UP_PRESSED, {x: 0, y: 0 }, pd.Keys.UP);
        if(hasDownButton)
            this.downButton = this._addButton(pd.SpriteFrames.KEY_DOWN, pd.SpriteFrames.KEY_DOWN_PRESSED, {x: 0, y: 0}, pd.Keys.DOWN);

        if(autoEnable)
            this.enable();

        if(attr)
            this.attr(pd.parseAttr(attr));

        this.updateKeyPositions();
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
        this.keys = this.keys || [];
        var btn = new pd.Button(normalSprite, pressedSprite, attr, 1, false, true);
        btn.setForceMouseUpCall(true);
        btn.setDisabledOpacity(155);
        this.keys.push(btn);
        this.addChild(btn);
        btn.setKeyCode(keyCode);
        return btn;
    },

    /**
     * Ativa os botões do teclado.
     */
    enable: function() {
        for(var i in this.keys) {
            this.keys[i].enable();
        }
    },

    /**
     * Desativa os botões do teclado.
     */
    disable: function() {
        for(var i in this.keys) {
            this.keys[i].disable();
        }
    },

    /**
     * Retorna a tecla que está vinculada ao keyCode informado.
     * @param keyCode {Number}
     * @returns {pd.Button}
     */
    getKey: function(keyCode) {
        switch(keyCode) {
            case pd.Keys.LEFT: return this.leftButton;
            case pd.Keys.RIGHT: return this.rightButton;
            case pd.Keys.UP: return this.upButton;
            case pd.Keys.DOWN: return this.downButton;
        }

        return null;
    },

    /**
     * Seta as funções de callback do componente.
     * @param {Function | string} [onKeyDown=null] - função de callback para eventos de onKeyDown.
     * @param {Function | string} [onKeyUp=null] - função de callback para eventos de onKeyUp.
     * @param {Object} [handler=null] - handler da função. Caso não seja fornecido, o próprio teclado virtual será registrado como handler.
     */
    setCallbacks: function(onKeyDown, onKeyUp, handler) {
        for(var i in this.keys) {
            var btn = this.keys[i];
            if(onKeyDown)
                pd.inputManager.add(pd.InputManager.Events.BUTTON_PRESSED, btn, onKeyDown, handler || this);
            if(onKeyUp)
                pd.inputManager.add(pd.InputManager.Events.BUTTON_RELEASED, btn, onKeyUp, handler || this);
        }
    },

    getSpacing: function () {
        return this.spacing;
    },

    setSpacing: function (spacing) {
        this.spacing = spacing;
        this.updateKeyPositions();
    },

    updateKeyPositions: function () {
        this.leftButton && (this.leftButton.x = -this.spacing);
        this.rightButton && (this.rightButton.x = this.spacing);
        this.upButton && (this.upButton.y = this.spacing);
        if (!this.downButton && !this.upButton && this.leftButton && this.rightButton) {
            this.leftButton.x += (this.spacing / 2);
            this.rightButton.x -= (this.spacing / 2);
        }
    }
});
