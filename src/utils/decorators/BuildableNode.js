/**
 * Created by Ryan Balieiro on 15/09/17.
 *
 * @desc
 * Implementa a capacidade a um node de se construir a partir de um arquivo .json pré-configurado. <br />
 * * Ainda em desenvolvimento
 * @mixin
 */
pd.decorators.BuildableNode = {/** @lends pd.decorators.BuildableNode#*/

    /**
     * @type {String}
     */
    _configFilePath:null,

    /**
     * @type {Array}
     */
    _builtNodes:null,

    /**
     * @type {Boolean}
     */
    _buildVerboseMode: false,

    /**
     * @type {Boolean}
     */
    _injectAllPropertiesIntoRootNode: false,

    /**
     * Constrói o node a partir do arquivo de configuração indicado.
     * @param {String} configFilePath
     * @param {Boolean} [injectAllPropertiesIntoRootNode=false]
     */
    buildUp: function(configFilePath, injectAllPropertiesIntoRootNode) {
        this._configFilePath = configFilePath;
        var data = pd.loader.getCachedJSONData(configFilePath);
        if(this._buildVerboseMode)
            this._dumpInfo(data);

        this._injectAllPropertiesIntoRootNode = injectAllPropertiesIntoRootNode;
        this._builtNodes = [];
        this._iterateThroughNodeChildren(this, data.children);
    },

    /**
     * Ativa/desativa o modo verboso.
     * Com o modo verboso ativo, o componente irá logar, automaticamente, as variáveis criadas de maneira dinâmica em formato JSDOC para que sejam inseridas nas respectivas classes afetadas.
     * @param {Boolean} verbose
     */
    setBuildVerboseMode: function(verbose) {
        this._buildVerboseMode = verbose;
    },

    /**
     * Habilita o modo de reload via addShortcut. O shortcut fica vinculado à tecla 'r'.
     * O modo de reload recarrega o JSON informado, e ao carregar, re-executa o método init() da layer atual.
     * @param {Boolean} [reloadAll=false]
     */
    enableReloadShortcut: function(reloadAll) {
        pd.debugger.addShortcutWithoutScene(function () {
            pd.cleanAllRunningActions(this);
            if(!reloadAll)
                pd.loader.reloadJSON(this._configFilePath, this.build ? this.build : this.init, this);
            else
                pd.loader.preloadJSONList(this.build ? this.build : this.init, this);
        }, this, null, cc.KEY.r);
    },

    /**
     * Varre os filhos do node informado, visitando-os e criando-os na ordem informada no arquivo JSON.
     * @param {Object} target
     * @param {Object} childrenInfo
     * @param {String} [groupInto]
     * @private
     */
    _iterateThroughNodeChildren: function(target, childrenInfo, groupInto) {
        for(var i in childrenInfo) {
            this._visitNode(target, i, childrenInfo[i], groupInto);
        }
    },

    /**
     * Cria o node especificado.
     * @param {*} target
     * @param {String} name
     * @param {Object} nodeInfo
     * @param {String} [groupInto]
     * @private
     */
    _visitNode: function(target, name, nodeInfo, groupInto) {
        if(nodeInfo.type) {
            var node = this._createNode(nodeInfo);
            this._configureNode(node, nodeInfo);

            if (target[name]) // remove se já existir...
                target.removeChild(target[name]);

            var objectWherePropertyIsCreated = this._injectAllPropertiesIntoRootNode ? this : target;
            if(groupInto) {
                objectWherePropertyIsCreated[groupInto] = objectWherePropertyIsCreated[groupInto] || {};
                objectWherePropertyIsCreated[groupInto][name] = node;
            }
            else {
                objectWherePropertyIsCreated[name] = node;
            }

            target.addChild(node);
            node.name = name;
            this._builtNodes.push(node);
            if (nodeInfo.children) // varre os filhos do filho... (recursivo)!
                this._iterateThroughNodeChildren(node, nodeInfo.children);
        }
        else {
            this._iterateThroughNodeChildren(target, nodeInfo, name);
        }
    },

    /**
     * Cria um node e retorna-o.
     * @param {*} nodeInfo
     * @private
     * @returns {*}
     */
    _createNode: function(nodeInfo) {
        switch(nodeInfo.type) {
            case "cc.Sprite":
                var sprite = pd.createSprite(nodeInfo.res ? pd.delegate.activeNamespace.res[nodeInfo.res] : nodeInfo.spriteFrameName);
                if(nodeInfo.rotation)
                    sprite.rotation = nodeInfo.rotation;
                return sprite;

            case "cc.LabelTTF":
                if(nodeInfo.fontType != "custom") {
                    for(var i in pd.Fonts) {
                        if(pd.Fonts[i].name == nodeInfo.fontName)
                            var font = pd.Fonts[i];
                    }
                    var node = pd.createTextWithStandardFont(font, 0, 0);
                }
                else {
                    node = pd.createText(pd.delegate.activeNamespace.res[nodeInfo.res], nodeInfo.fontName, 0, 0);
                }

                node.setFontSize(nodeInfo.fontSize || 30);
                node.setFontFillColor(nodeInfo.color ? cc.color(nodeInfo.color.r, nodeInfo.color.g, nodeInfo.color.b) : cc.color(255, 255, 255));
                node.setString(nodeInfo.defaultText || "cc.LabelTTF");

                if(nodeInfo.strokeSize)
                    node.enableStroke(nodeInfo.strokeColor || cc.color(0, 0, 0), nodeInfo.strokeSize);
                if(nodeInfo.center)
                    node.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                if(nodeInfo.width && nodeInfo.height)
                    node.setDimensions(nodeInfo.width, nodeInfo.height);

                node.setVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                return node;

            case "pd.Animation":
                const animationData = [];
                for(var i in nodeInfo.animationData)
                    animationData.push(new pd.AnimationData(nodeInfo.animationData[i].name, nodeInfo.animationData[i].ini_frame, nodeInfo.animationData[i].last_frame, nodeInfo.animationData[i].speed, nodeInfo.animationData[i].anim_name))
                return pd.createAnimation({x:0, y:0}, animationData);
                break;

            default: // tipos ainda não suportados, apenas instancia um objeto do tipo especificado.
                return eval("new " + nodeInfo.type + "()"); // migué básico... encontrar forma mais elegante de fazer isso.
        }
    },

    /**
     * Configura um node criado.
     * @param {*} node
     * @param {*} nodeInfo
     * @private
     */
    _configureNode: function(node, nodeInfo) {
        if(nodeInfo.attr) {
            for(var i in nodeInfo.attr)
                nodeInfo.attr[i] = Number(nodeInfo.attr[i]); // o json manda todos os numbers como strings!
            node.attr(pd.parseAttr(nodeInfo.attr));
        }

        if(nodeInfo.anchorPoint) {
            node.setAnchorPoint(nodeInfo.anchorPoint);
        }

        pd.decorate(node, pd.decorators.ResetableNode);
        node.saveDisplayState();
    },

    /**
     * Realiza o log customizado de maneira recursiva.
     * @param {Object} data
     * @param {String} [parentName=""]
     * @param {String} str
     * @private
     */
    _dumpInfo: function(data, parentName, str) {
        if(!parentName) { // node-raíz.
            data = data.children;
            parentName = "root";
            str = "";
        }

        if(!this._injectAllPropertiesIntoRootNode)
            str += ("\n------------------- " + parentName + " ---------------------\n");

        for(var i in data) {
            if(i != "children") {
                if(!data[i].type) {
                    var type = "Object";
                    for(var j in data[i]) {
                        var sameType = type == "Object" || data[i][j].type == type;
                        type = data[i][j].type;
                    }

                    type = sameType ? type + "[]" : "Object";
                }
                else {
                    type = data[i].type;
                }

                str += ("/**\n * Variável auto-gerada. \n * @type {" + type + "}\n */\n"+i+":null,\n");
            }
        }

        for(i in data) {
            if(data[i].children) {
                str = this._dumpInfo(data[i].children, i, str);
            }
        }

        if(parentName == "root")
            cc.log(str);

        return str;
    }
};