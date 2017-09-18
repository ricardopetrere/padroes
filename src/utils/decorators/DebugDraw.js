/**
 * Created by Ryan Balieiro on 18/09/17.
 * Implementa a capacidade de um node de desenhar elementos de 'debugging'.
 * @mixin
 */
pd.decorators.DebugDraw = {/** @lends pd.decorators.DebugDraw#*/

    /**
     * @type {cc.LabelTTF}
     */
    _txtCoords: null,

    /**
     * @type {Boolean}
     */
    _showDebugObjects:false,

    /**
     * @type {Array}
     */
    _debugDrawData: null,

    /**
     * @type {Boolean}
     */
    _jsonDebugMode:true,

    /**
     * @type {String}
     */
    _coordsLog:null,

    /**
     * Cria os elementos de debug.
     */
    initDebugDraw: function() {
        if(pd.debugMode) {
            this._txtCoords = pd.createTextWithStandardFont(pd.Fonts.CARTON_SIX, 0, 0, 32, cc.color(0, 0, 0));
            this._txtCoords.enableStroke(cc.color(255, 255, 255), 3);
            this._txtCoords.setAnchorPoint(0, 0);
            this.addChild(this._txtCoords, pd.ZOrders.EDITOR_SCREEN);
            this.setDebugDrawEnabled(true);
        }
    },

    /**
     * Ativa/desativa os comandos de debug.
     */
    setDebugDrawEnabled: function(enabled) {
        if(enabled) {
            pd.inputManager.add(pd.InputManager.Events.MOUSE_HOVER, this, this._onDebugMouseHover, this);
            pd.inputManager.add(pd.InputManager.Events.MOUSE_RIGHT_DOWN, this, this._onDebugRightButton, this);
            pd.inputManager.add(pd.InputManager.Events.MOUSE_DOWN, this, this._onDebugClick, this);
            pd.inputManager.add(pd.InputManager.Events.MOUSE_MIDDLE_DOWN, this, this._onDebugMiddleDown, this);
        }
        else {
            pd.inputManager.remove(pd.InputManager.Events.MOUSE_HOVER, this, this._onDebugMouseHover, this);
            pd.inputManager.remove(pd.InputManager.Events.MOUSE_RIGHT_DOWN, this, this._onDebugRightButton, this);
            pd.inputManager.remove(pd.InputManager.Events.MOUSE_DOWN, this, this._onDebugClick, this);
        }
    },

    /**
     * Adiciona polígonos ao debug draw.
     * @param {*} polygonOrPolygons
     * @param {cc.Color} [color]
     */
    addDebugPolygons: function(polygonOrPolygons, color) {
        if(pd.debugMode) {
            this._debugDrawData = this._debugDrawData || [];
            if (polygonOrPolygons[0]) {
                for (var i in polygonOrPolygons) {
                    this._debugDrawData.push({poly: polygonOrPolygons[i], color: color || cc.color(0, 255, 0, 105)});
                }
            }
            else {
                this._debugDrawData.push({poly: polygonOrPolygons, color: color || cc.color(0, 255, 0, 105)});
            }

            if(this._showDebugObjects)
                this._updateDebugPolygons();
        }
    },

    /**
     * Limpa os polígonos de debug.
     */
    resetDebugDrawData: function() {
        if(pd.debugMode) {
            if (this._drawNode)
                this._drawNode.clear();
            this.removeChild(this._drawNode);
            this._drawNode = null;
            this._debugDrawData = null;
        }
    },

    /**
     * @param {Boolean} showDebugObjects
     */
    setShowDebugObjects: function(showDebugObjects) {
        if(pd.debugMode) {
            this._showDebugObjects = showDebugObjects;
            if (this._showDebugObjects) {
                this._updateDebugPolygons();
                this._txtCoords.visible = true;
            }
            else {
                if(this._drawNode)
                    this._drawNode.clear();
                this._txtCoords.visible = false;
            }
        }
    },

    /**
     * Callback (rightButton).
     * @param event
     * @private
     */
    _onDebugRightButton: function(event) {
        if(pd.debugMode) {
            this.setShowDebugObjects(!this._showDebugObjects);
        }
    },

    /**
     * Callback (mouseHover).
     * @param event
     * @private
     */
    _onDebugMouseHover: function(event) {
        if(pd.debugMode && this._showDebugObjects) {
            const position = this.convertToNodeSpace(event.getLocation());
            this._txtCoords.setString("x: " + position.x.toFixed() + ", y: " + position.y.toFixed());
            this._txtCoords.setPosition(position.x, position.y + 10);
        }
    },

    /**
     * Callback (click).
     * @param event
     * @private
     */
    _onDebugClick: function(event) {
        if(pd.debugMode) {
            const position = this.convertToNodeSpace(event.getLocation());
            if(!this._coordsLog)
                this._coordsLog = "";
            else
                this._coordsLog += ",\n";

            if(this._jsonDebugMode)
                this._coordsLog += ("{\"x\": " + position.x.toFixed() + ", \"y\": " + position.y.toFixed() + "}");
            else
                this._coordsLog += ("{x: " + position.x.toFixed() + ", y: " + position.y.toFixed() + "}");

            cc.log(this._coordsLog);
        }
    },

    /**
     * Callback (middle button click).
     * @param event
     * @private
     */
    _onDebugMiddleDown: function(event) {
        if(pd.debugMode) {
            this._coordsLog = null;
        }
    },

    /**
     * Atualiza os polígonos de debug.
     * @private
     */
    _updateDebugPolygons: function() {
        if(pd.debugMode) {
            if (!this._drawNode) {
                this._drawNode = new cc.DrawNode();
                this.addChild(this._drawNode);
            }
            else {
                this._drawNode.clear();
            }

            for (var i in this._debugDrawData) {
                this._drawNode.drawPoly(this._debugDrawData[i].poly, this._debugDrawData[i].color);
            }
        }
    }
};
