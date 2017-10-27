/**
 * Created by Ryan Balieiro on 18/09/17.
 * Implementa a capacidade de um node de desenhar elementos de 'debugging'.
 * @mixin
 */
pd.decorators.DebugDrawNode = {/** @lends pd.decorators.DebugDrawNode#*/

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
     * @type {Array}
     */
    _debugTextData: null,

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
            this._txtCoords.setAnchorPoint(0.5, 0);
            this.addChild(this._txtCoords, pd.ZOrders.EDITOR_SCREEN);
            this.setDebugDrawEnabled(true);
            this._drawNode = new cc.DrawNode();
            this._debugTextData = [];
            this.addChild(this._drawNode,pd.ZOrders.PAUSE_LAYER);
            this._drawNode.update = function (dt) {
                this.getParent()._updateDebugPolygons();
                this.getParent()._updateDebugTexts();
            }
            this._drawNode.scheduleUpdate();
        }
    },

    /**
     * Ativa/desativa os comandos de debug.
     */
    setDebugDrawEnabled: function(enabled) {
        if(enabled) {
            pd.inputManager.add(pd.InputManager.Events.MOUSE_HOVER, this, this._onDebugMouseHover, this);
            pd.inputManager.add(pd.InputManager.Events.MOUSE_MOVE, this, this._onDebugMouseHover, this);
            pd.inputManager.add(pd.InputManager.Events.MOUSE_RIGHT_DOWN, this, this._onDebugRightButton, this);
            pd.inputManager.add(pd.InputManager.Events.MOUSE_DOWN, this, this._onDebugClick, this);
            pd.inputManager.add(pd.InputManager.Events.MOUSE_MIDDLE_DOWN, this, this._onDebugMiddleDown, this);
        }
        else {
            pd.inputManager.remove(pd.InputManager.Events.MOUSE_HOVER, this, this._onDebugMouseHover, this);
            pd.inputManager.remove(pd.InputManager.Events.MOUSE_MOVE, this, this._onDebugMouseHover, this);
            pd.inputManager.remove(pd.InputManager.Events.MOUSE_RIGHT_DOWN, this, this._onDebugRightButton, this);
            pd.inputManager.remove(pd.InputManager.Events.MOUSE_DOWN, this, this._onDebugClick, this);
            pd.inputManager.remove(pd.InputManager.Events.MOUSE_MIDDLE_DOWN, this, this._onDebugMiddleDown, this);
        }
    },

    /**
     * Ajusta a cor informada, e instancia o vetor de polígonos, se não estiver
     * @param {cc.Color} color
     * @returns {cc.Color}
     * @private
     */
    _parseColor: function (color) {
        this._debugDrawData = this._debugDrawData || [];
        if (color != null) {
            color.a = pd.clamp(color.a, 0, 100);
        } else {
            color = cc.color(0, 255, 0, 100);
        }
        return color;
    },

    /**
     * Adiciona nodos ao debug draw
     * @param {cc.Node | cc.Node[]} nodeOrNodes
     * @param {Function} [fnc=getBoundingBox]
     * @param {cc.Color} [color]
     */
    addDebugNodes: function (nodeOrNodes, fnc, color) {
        if (pd.debugMode) {
            color = this._parseColor(color);
            if (nodeOrNodes.length > 0) {
                for (var i in nodeOrNodes) {
                    this.addDebugNodes(nodeOrNodes[i], fnc, color);
                }
            } else {
                this._debugDrawData.push({data: nodeOrNodes, fnc: fnc || nodeOrNodes.getBoundingBox, color: color});
            }
        }
    },

    /**
     * Adiciona polígonos ao debug draw
     * @param {cc.Point[] | cc.Point[][]} polygonOrPolygons
     * @param {cc.Color} [color]
     */
    addDebugPolygons: function(polygonOrPolygons, color) {
        if(pd.debugMode) {
            color = this._parseColor(color);
            if (polygonOrPolygons[0].length > 0) {
                for (var i in polygonOrPolygons) {
                    this.addDebugPolygons(polygonOrPolygons[i], color);
                }
            } else {
                this._debugDrawData.push({data: polygonOrPolygons, color: color});
            }
        }
    },

    addDebugText: function (textOrFunction, thisArg, parent, zOrder, x, y, color) {
        if(pd.debugMode) {
            this._debugTextData = this._debugTextData || [];
            color = this._parseColor(color);
            var label = pd.createTextWithStandardFont(pd.Fonts.DIMBO, x, y, 48, color, "", null, parent, zOrder);
            label.setVisible(this._showDebugObjects);
            if (typeof textOrFunction == 'function') {
                this._debugTextData.push({data: label, color: color, fnc: textOrFunction, thisArg: thisArg});
            } else {
                label.setString(textOrFunction);
                this._debugTextData.push({data: label, color: color});
            }
        }
    },

    /**
     * Limpa os polígonos de debug.
     */
    resetDebugDrawData: function() {
        if(pd.debugMode) {
            if (this._drawNode) {
                this._drawNode.clear();
                //this.removeChild(this._drawNode);
                //this._drawNode = null;
            }
            this._debugDrawData = null;
        }
    },

    /**
     * @param {Boolean} showDebugObjects
     */
    setShowDebugObjects: function(showDebugObjects) {
        if(pd.debugMode) {
            this._showDebugObjects = showDebugObjects;
            for(var i = 0; i < this._debugTextData.length; i++) {
                this._debugTextData[i].data.visible = this._showDebugObjects;
            }
            if (this._showDebugObjects) {
                this._updateDebugPolygons();
                this._updateDebugTexts();
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
            const position = this.convertToNodeSpace(event.getLocation());
            this._txtCoords.setPosition(position.x, position.y + 10);
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
        if(pd.debugMode && this._showDebugObjects) {
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
        if(pd.debugMode && this._showDebugObjects && this._drawNode) {
            this._drawNode.clear();

            for (var i in this._debugDrawData) {
                if (this._debugDrawData[i].data instanceof cc.Node) {
                    var rect = this._debugDrawData[i].fnc.apply(this._debugDrawData[i].data);
                    this._drawNode.drawPoly(pd.rectToPolygon(rect), this._debugDrawData[i].color, 0, cc.color.BLACK);
                } else
                    this._drawNode.drawPoly(this._debugDrawData[i].data, this._debugDrawData[i].color, 0, cc.color.BLACK);
            }
        }
    },

    /**
     * Atualiza os LabelTTF que necessitam de atualização constante
     * @private
     */
    _updateDebugTexts: function () {
        if(pd.debugMode) {
            for(var i = 0; i < this._debugTextData.length; i++) {
                if (this._debugTextData[i].data instanceof cc.LabelTTF) {
                    if (typeof this._debugTextData[i].fnc == 'function')
                        this._debugTextData[i].data.setString(this._debugTextData[i].fnc.call(this._debugTextData[i].thisArg));
                }
            }
        }
    }
};
