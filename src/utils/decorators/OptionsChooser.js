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
     * @type {cc.Point | {z: number}}
     */
    chooserDefaultPos: null,
    /**
     * @type {pd.decorators.OptionsChooser.ChooserItem[]}
     */
    chooserOptions: null,
    /**
     * @type {cc.Point}
     */
    chooserPosMouse: null,
    /**
     * @type {boolean}
     */
    chooserEnabledListeners: false,

    /**
     * @function
     * Função com dados de inicialização do decorator.
     * @private
     */
    __initDecorator__: function () {
        this.chooserDefaultPos = cc.p(-100, -100);
        this.chooserOptions = [];
        this.chooserPosMouse = cc.p();
        if (this._inputMetadata == null)
            this._inputMetadata = {};
        this.setChooserEnabledListeners(true);
        if (!this._alreadyHasListener("chooserMouseUp", pd.InputManager.Events.MOUSE_UP, this))
            pd.inputManager.add(pd.InputManager.Events.MOUSE_UP, this, "chooserMouseUp");
        if (!this._alreadyHasListener("chooserMouseMove", pd.InputManager.Events.MOUSE_MOVE, this))
            pd.inputManager.add(pd.InputManager.Events.MOUSE_MOVE, this, "chooserMouseMove");
        if (cc.sys.isMobile) {
            if (!this._alreadyHasListener("chooserMouseDown", pd.InputManager.Events.MOUSE_DOWN, this))
                pd.inputManager.add(pd.InputManager.Events.MOUSE_DOWN, this, "chooserMouseDown");
        } else {
            if (!this._alreadyHasListener("chooserMouseMove", pd.InputManager.Events.MOUSE_HOVER, this))
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
        return !(listeners == null || !listeners.some(function (value, index, array) {
            return value.handlerFunc === fnc;
        }))
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
        var isPolygon = cc.isArray(option) && option[0].hasOwnProperty("x");
        this.chooserOptions.push(obj = new pd.decorators.OptionsChooser.ChooserItem(
            (
                isSprite ?
                    option : (
                    isSpriteFrame ?
                        pd.createSprite(option) :
                        option
                )
            ),
            pd.parseAttr(chooserAttr),
            isPolygon ? pd.decorators.OptionsChooser.OptionTypes.POLYGON : pd.decorators.OptionsChooser.OptionTypes.SPRITE,
            cb || function () {
            },
            cbHandler,
            argsArray
        ));
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
        for (var n = 0; n < this.chooserOptions.length; n++) {
            var option = this.chooserOptions[n];
            if (option.type === pd.decorators.OptionsChooser.OptionTypes.SPRITE) {
                if (this.chooserPosMouse.x < option.data.x + (1 - option.data.anchorX) * option.data.width * option.data.scaleX &&
                    this.chooserPosMouse.x > option.data.x - option.data.anchorX * option.data.width * option.data.scaleX &&
                    this.chooserPosMouse.y < option.data.y + (1 - option.data.anchorY) * option.data.height * option.data.scaleY &&
                    this.chooserPosMouse.y > option.data.y - option.data.anchorY * option.data.height * option.data.scaleY) {
                    func.call(this, option);
                    return;
                }
            } else {
                if (pd.pointInPolygonIntersection(this.chooserPosMouse, option.data)) {
                    func.call(this, option);
                    return;
                }
            }
        }
        this.resetChooserPosition();
    },
    /**
     *
     * @function
     * @param {cc.EventMouse | cc.Touch} e
     */
    chooserFillPosMouse: function (e) {
        this.chooserPosMouse.x = e.getLocationX();
        this.chooserPosMouse.y = e.getLocationY();
        this.chooserPosMouse = this.convertToNodeSpace(this.chooserPosMouse);
    },
    /**
     *
     * @function
     * @param {cc.EventMouse | cc.Touch} e
     */
    chooserMouseDown: function (e) {
        if (!this.chooserEnabledListeners)
            return;
        this.chooserBasicLogic(e,
            /**
             *
             * @param {pd.decorators.OptionsChooser.ChooserItem} option
             */
            function (option) {
                this.chooser.attr(option.attr);
            });
    },
    /**
     *
     * @function
     * @param {cc.EventMouse | cc.Touch} e
     */
    chooserMouseMove: function (e) {
        if (!this.chooserEnabledListeners)
            return;
        this.chooserBasicLogic(e,
            /**
             *
             * @param {pd.decorators.OptionsChooser.ChooserItem} option
             */
            function (option) {
                this.chooser.attr(option.attr);
            });
    },
    /**
     *
     * @function
     * @param {cc.EventMouse | cc.Touch} e
     */
    chooserMouseUp: function (e) {
        if (!this.chooserEnabledListeners)
            return;
        if (cc.pointEqualToPoint(this.chooser, this.chooserDefaultPos))
            return;

        this.chooserBasicLogic(e,
            /**
             *
             * @param {pd.decorators.OptionsChooser.ChooserItem} option
             */
            function (option) {
                option.func.apply(option.handler, option.args);
            });
    },
    /**
     *
     * @returns {cc.Point}
     */
    getChooserDefaultPos: function () {
        return this.chooserDefaultPos;
    },
    resetChooserPosition: function () {
        this.chooser.setPosition(this.chooserDefaultPos);
        this.chooser.setLocalZOrder(this.chooserDefaultPos.z);
    },
    /**
     *
     * @function
     * @param {string | cc.SpriteFrame | cc.Sprite} spriteObj
     * @param {number} [zOrder]
     * @returns {cc.Sprite}
     */
    setChooser: function (spriteObj, zOrder) {
        if (typeof spriteObj === 'string' || spriteObj instanceof cc.SpriteFrame)
            this.chooser = pd.createSprite(spriteObj, null, this, zOrder || 0);
        else {
            this.chooser = spriteObj;
            if (this.chooser.getParent() == null)
                this.addChild(this.chooser, zOrder != null ? zOrder : 1);
        }
        this.chooserDefaultPos.z = this.chooser.getLocalZOrder();
        return this.chooser;
    },
    /**
     *
     * @param {number | cc.Point} xOrPoint
     * @param {number} y
     */
    setChooserDefaultPos: function (xOrPoint, y) {
        if (xOrPoint.x !== undefined) {
            this.chooserDefaultPos.x = xOrPoint.x;
            this.chooserDefaultPos.y = xOrPoint.y;
        } else {
            this.chooserDefaultPos.x = xOrPoint;
            this.chooserDefaultPos.y = y;
        }
    },
    setChooserEnabledListeners: function (enabled) {
        if (enabled === true) {
            this.chooserEnabledListeners = enabled;
        } else if (enabled === false) {
            this.chooserEnabledListeners = enabled;
        }
    }
};

/**
 * @class
 * @lends {pd.decorators.OptionsChooser.ChooserItem}
 * @param {cc.Sprite | cc.Point[]} data - Sprite ou polígono do item
 * @param {Object} attr - Dados de como deve se comportar o indicador de escolha ao se posicionar nesse item (posição, orientação, etc.)
 * @param {pd.decorators.OptionsChooser.OptionTypes} type - Tipo de item (Sprite ou polígono)
 * @param {Function} func - Função a ser executada quando o item for selecionado
 * @param {Object} handler - Quem será o 'this' na função
 * @param {Object[]} args - argumentos, em formato de vetor, a serem passados para a função
 * @constructor
 */
pd.decorators.OptionsChooser.ChooserItem = function (data, attr, type, func, handler, args) {
    this.data = data;
    this.attr = attr;
    this.type = type;
    this.func = func;
    this.handler = handler;
    this.args = args;
};
/**
 *
 * @enum {string}
 */
pd.decorators.OptionsChooser.OptionTypes = {
    POLYGON: "Polygon",
    SPRITE: "Sprite"
};