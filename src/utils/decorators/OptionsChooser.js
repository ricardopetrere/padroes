/**
 * Created by rcardoso on 24/10/17.
 * @desc
 * Implementa a funcionalidade de escolha entre múltiplas opções com mouse / toque, com indicador de opção selecionada.
 * No modo desktop, o posicionamento do indicador é automático ao passar o mouse por cima
 * @mixin
 */
pd.decorators.OptionsChooser = {
    /**
     * @type {cc.Sprite}
     */
    chooser: null,
    /**
     * @type {cc.Point}
     */
    chooserDefaultPos: cc.p(-100, -100),
    /**
     * @type {{data: cc.Sprite | cc.Point[], attr: Object, type: pd.decorators.OptionsChooser.OptionTypes, func: Function, handler: Object, args: Object[]}[]}
     */
    chooserOptions: null,
    /**
     * @type {cc.Point}
     */
    chooserPosMouse: null,

    /**
     * @function
     * Função com dados de inicialização do decorator.
     * @private
     */
    __initDecorator__: function () {
        this.chooserOptions = [];
        this.chooserPosMouse = cc.p();
        if(this._inputMetadata == null)
            this._inputMetadata = {};
        if(!this._alreadyHasListener("chooserMouseUp", pd.InputManager.Events.MOUSE_UP, this))
            pd.inputManager.add(pd.InputManager.Events.MOUSE_UP, this, "chooserMouseUp");
        if(!this._alreadyHasListener("chooserMouseMove", pd.InputManager.Events.MOUSE_MOVE, this))
            pd.inputManager.add(pd.InputManager.Events.MOUSE_MOVE, this, "chooserMouseMove");
        if(cc.sys.isMobile) {
            if (!this._alreadyHasListener("chooserMouseDown", pd.InputManager.Events.MOUSE_DOWN, this))
                pd.inputManager.add(pd.InputManager.Events.MOUSE_DOWN, this, "chooserMouseDown");
        } else {
            if(!this._alreadyHasListener("chooserMouseMove", pd.InputManager.Events.MOUSE_HOVER, this))
                pd.inputManager.add(pd.InputManager.Events.MOUSE_HOVER, this, "chooserMouseMove");
        }
    },
    /**
     *
     * @function
     * @param {string} fnc
     * @param {pd.InputManager.Events} eventType
     * @param {*} target
     * @private
     * @returns {boolean}
     */
    _alreadyHasListener: function (fnc, eventType, target) {
        /**
         *
         * @type {Array}
         */
        var listeners = pd.inputManager.hasListener(eventType, target);
        return !(listeners == null || !listeners.some(function (value, index, array) { return value.handlerFunc === fnc; }))
    },
    /**
     *
     * @function
     * @param {cc.Point[] | string | cc.SpriteFrame | cc.Sprite} option
     * @param {cc.Point | *} chooserAttr
     * @param {function} cb
     * @param {Object} [cbHandler]
     * @param {Array} [argsArray]
     * @returns {cc.Sprite|cc.Point[]}
     */
    addChooserItem: function (option, chooserAttr, cb, cbHandler, argsArray) {
        var obj;
        var isSprite = option instanceof cc.Sprite;
        var isSpriteFrame = option instanceof cc.SpriteFrame || typeof option === 'string';
        this.chooserOptions.push(obj = {
            data: (
                isSprite ?
                    option : (
                        isSpriteFrame ?
                            pd.createSprite(option) :
                            option
                    )
            ),
            attr: pd.parseAttr(chooserAttr),
            type: (
                isSprite ||
                isSpriteFrame
            ) ? pd.decorators.OptionsChooser.OptionTypes.SPRITE : pd.decorators.OptionsChooser.OptionTypes.POLYGON,
            func: cb || function () { },
            handler: cbHandler,
            args: argsArray
        });
        return obj.data;
    },
    /**
     *
     * @function
     * @param {cc.EventMouse | cc.Touch} e
     * @param {Function} func
     */
    chooserBasicLogic: function (e, func) {
        this.chooserFillPosMouse(e);
        for(var n = 0; n < this.chooserOptions.length; n++) {
            var option = this.chooserOptions[n];
            if(option.type === pd.decorators.OptionsChooser.OptionTypes.SPRITE) {
                if(this.chooserPosMouse.x < option.data.x + (1 - option.data.anchorX) * option.data.width &&
                    this.chooserPosMouse.x > option.data.x - option.data.anchorX * option.data.width &&
                    this.chooserPosMouse.y < option.data.y + (1 - option.data.anchorY) * option.data.height &&
                    this.chooserPosMouse.y > option.data.y - option.data.anchorY * option.data.height) {
                    func.call(this, option);
                    return;
                }
            } else {
                if(pd.pointInPolygonIntersection(this.chooserPosMouse, option.data)) {
                    func.call(this, option);
                    return;
                }
            }
        }
        this.chooser.setPosition(this.chooserDefaultPos);
    },
    /**
     *
     * @function
     * @param {cc.EventMouse | cc.Touch} e
     */
    chooserFillPosMouse: function (e) {
        this.chooserPosMouse.x = e.getLocationX();
        this.chooserPosMouse.y = e.getLocationY();
    },
    /**
     *
     * @function
     * @param {cc.EventMouse | cc.Touch} e
     */
    chooserMouseDown: function (e) {
        this.chooserBasicLogic(e, function (option) {
            this.chooser.attr(option.attr);
        });
    },
    /**
     *
     * @function
     * @param {cc.EventMouse | cc.Touch} e
     */
    chooserMouseMove: function (e) {
        this.chooserBasicLogic(e, function (option) {
            this.chooser.attr(option.attr);
        });
    },
    /**
     *
     * @function
     * @param {cc.EventMouse | cc.Touch} e
     */
    chooserMouseUp: function (e) {
        if(this.chooser.x < 0)
            return;

        this.chooserBasicLogic(e, function(option) {
            option.func.apply(option.handler, option.args);
        });
    },
    /**
     *
     * @function
     * @param {string | cc.SpriteFrame | cc.Sprite} spriteObj
     * @param {number} [zOrder]
     * @returns {cc.Sprite}
     */
    setChooser: function (spriteObj, zOrder) {
        if(typeof spriteObj === 'string' || spriteObj instanceof cc.SpriteFrame)
            this.chooser = pd.createSprite(spriteObj, null, this, zOrder || 0);
        else
            this.chooser = spriteObj;
        return this.chooser;
    }
};

/**
 *
 * @enum {string}
 */
pd.decorators.OptionsChooser.OptionTypes = {
    POLYGON: "Polygon",
    SPRITE: "Sprite"
};