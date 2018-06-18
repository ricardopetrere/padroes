/**
 * created by Vinicius Carlos Maschio
 * Editor base usado para abrir os editores necessarios.
 * @class
 * @extends {cc.LayerColor}
 * @classdesc Gerencia os outros editores.
 */
pd.Editor = cc.LayerColor.extend({
    ctor:function(){
        this._super(new cc.Color(190, 190, 190), 576, 768);
    },
    init:function(){
        //inicializa a posição e reseta as variaveis necessarias do editor.
        this.viewList = [];

        cc.view.setDesignResolutionSize(1600, 768, cc.ResolutionPolicy.SHOW_ALL);
        this.setPosition(1024, 0);
        pd.Editor.activeGeneralEditor = null;
        pd.Editor.activeSpriteCreator = null;
        pd.Editor.activePrinter = null;

        //adiciona o listener de mouse para verificar colisão com os botoes de seleção de editor.
        pd.inputManager.add(pd.InputManager.Events.MOUSE_DOWN, this, "onMouseDown", this);

        //inicializa os botões do editor.
        this.btn_editor = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_BTN));
        this.btn_editor.setPosition(45, 752);
        this.addChild(this.btn_editor);
        this.btn_spriteCreator = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_BTN_SPRITE_CREATOR));
        this.btn_spriteCreator.setPosition(160,752);
        this.addChild(this.btn_spriteCreator);
        this.btn_printer = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_BTN_PRINTER));
        this.btn_printer.setPosition(278,752);
        this.addChild(this.btn_printer);

        var drawNode = new cc.DrawNode();
        this.addChild(drawNode);
        drawNode.drawRect(cc.p(0, 735), cc.p(576, 735), cc.color(180, 180, 180), 4, cc.color(0, 0, 0));

    },
    _onExitButtonCall:function(){
        if(this.editScreen){
            pd.Editor.activeGeneralEditor = null;
            this.editScreen.removeFromParent();
            this.editScreen = null;
        }
        if(this.activeSpriteCreator){
            pd.Editor.activeGeneralEditor = null;
            this.spriteCreatorScreen.removeFromParent();
            this.spriteCreatorScreen = null;
        }
        if(this.activePrinter){
            pd.Editor.activePrinter = null;
            this.printer.removeFromParent();
            this.printer = null;
        }
        this.viewList = null;
        cc.view.setDesignResolutionSize(1024, 768, cc.ResolutionPolicy.SHOW_ALL);
        this.removeFromParent();
    },
    initGeneralEditor:function(){
        //se o general editor ainda não estiver aberto ele inicia o general editor.
        if(!pd.Editor.activeGeneralEditor){
            var editScreen = new pd.Editor.GeneralEditor();
            editScreen.init();
            this.addChild(editScreen, 99);
            this.editScreen = editScreen;
            this.viewList.push(this.editScreen);
        }
        //caso contrario ele destroi o general editor atual.
        else{
            this.viewList.splice(this.viewList.indexOf(this.editScreen), 1);
            pd.Editor.activeGeneralEditor = null;
            this.editScreen.removeFromParent();
            this.editScreen = null;
        }
        this.organizeViewListPosition();
        //this.removeFromParent();
    },
    initSpriteCreator:function(){
        //se o sprite editor ainda não estiver aberto ele inicia o sprite editor.
        if(!pd.Editor.activeSpriteCreator){
            var spriteCreator = new pd.Editor.SpriteCreator();
            spriteCreator.init();
            this.spriteCreatorScreen = spriteCreator;
            this.addChild(this.spriteCreatorScreen, 99);
            this.viewList.push(this.spriteCreatorScreen);
        }
        else{
        //caso contrario ele destroi o sprite editor atual.
            this.viewList.splice(this.viewList.indexOf(this.spriteCreatorScreen), 1);
            pd.Editor.activeSpriteCreator = null;
            this.spriteCreatorScreen.removeFromParent();
            this.spriteCreatorScreen = null;
        }
        this.organizeViewListPosition();
        //this.removeFromParent();
    },
    initPrinter:function(){
        //se o printer ainda não estiver aberto ele inicia o printer.
        if(!pd.Editor.activePrinter){
            var printer = new pd.Editor.Printer();
            printer.init();
            this.printer = printer;
            this.addChild(this.printer, 99);
            this.viewList.push(this.printer);
        }
        else{
        //caso contrario ele destroi o printer atual.
            this.viewList.splice(this.viewList.indexOf(this.printer), 1);
            pd.Editor.activePrinter = null;
            this.printer.removeFromParent();
            this.printer = null;
        }
        this.organizeViewListPosition();
        //this.removeFromParent();
    },
    organizeViewListPosition:function(){
        var alturaAcumulada = 0;
        for(var i = 0; i < this.viewList.length; i++){
            this.viewList[i].setPosition(0, 710 - alturaAcumulada);
            alturaAcumulada += this.viewList[i].getBoundingBox().height + 25;
        }
    },
    onMouseDown:function (event) {
        loc = event.getLocation();
        loc = this.convertToNodeSpace(loc);
        mouseRect = new cc.rect(loc.x, loc.y, 3, 3);
        if(cc.rectIntersectsRect(mouseRect, this.btn_editor.getBoundingBox())){
            this.initGeneralEditor();
        }
        else if(cc.rectIntersectsRect(mouseRect, this.btn_spriteCreator.getBoundingBox())){
            this.initSpriteCreator();
        }
        else if(cc.rectIntersectsRect(mouseRect, this.btn_printer.getBoundingBox())){
            this.initPrinter();
        }
    },
});

/**
 * Editor padrão
 * @class
 * @extends {cc.Layer}
 * @classdesc Gerencia a posição, escala, rotação e cor dos objetos.
 */
pd.Editor.GeneralEditor = cc.Scale9Sprite.extend({
    ctor:function(){
        this._super(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_INTERFACE));
    },
    init:function(){
        this.setAnchorPoint(0, 1);
        this.setContentSize(570, 250);

        var cabecalho = pd.Editor.createScale9Sprite(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_HEADER), cc.p(0, 250), 570, 26);
        cabecalho.setAnchorPoint(0, 0);
        this.addChild(cabecalho);

        var name = new cc.LabelTTF("Editor", "Arial", 20);
        name.setPosition(570/2, 11);
        name.setFontFillColor(new cc.Color(0, 0, 0));
        cabecalho.addChild(name);
        this.cabecalho = cabecalho;

        this._super();
        this.isDragging = false;
        this.mouseOffset = cc.p(0, 0);
        this.dragObj = null;

        //Organiza a lista de nodes em ordem alfabetica
        pd.Editor.activeGeneralEditor = this;
        pd.Editor.sortEditorArrayByName();

        //Listener manual para suportar o click do botão direito do mouse
        var listener = cc.EventListener.create({
            event: cc.EventListener.MOUSE,
            onMouseDown: function (event) {
                var target = event.getCurrentTarget();
                target["_onMouseDown"](event);
            }
        });
        cc.eventManager.addListener(listener, this);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_UP, this, "_onMouseUp", this);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_MOVE, this, "_onMouseMove", this);

        pd.inputManager.add(pd.InputManager.Events.KEY_DOWN, this, "onKeyDown", this);


        //Cria a interface principal do Editor
        //this = pd.Editor.createView("General Editor", cc.p(512, 384), cc.size(570, 250));
        //this.addChild(this, 50);

        //Adiciona o botão de fechar
        this.exitButton = new pd.Button(pd.SpriteFrames.EDITOR_BTN_CLOSE, pd.SpriteFrames.EDITOR_BTN_CLOSE, {x:550, y:12}, null, true, false, this, '_onExitButtonCall');
        this.cabecalho.addChild(this.exitButton, 99);
        //Adiciona o botão de lista, para abrir a lista de sprites presentes no NodeList e permite selecionar a sprite para o general editor
        this.listButton = new pd.Button(pd.SpriteFrames.EDITOR_BTN_LIST, pd.SpriteFrames.EDITOR_BTN_LIST, {x:20, y:225}, null, true, false, this, '_onListButtonCall');
        this.addChild(this.listButton, 99);

        //Array para organizar todos os campos de texto em um unico objeto
        this.selectedInfos = [];

        //Delegate para repassar os eventos de texto para o editor
        this.editBoxDelegate = new pd.Editor.EditBoxDelegate();

        //Campo do Name
        var nameTxt = pd.createText("Arial", null, 35, 225, 18, null, 'Name:');
        nameTxt.setAnchorPoint(0, 0.5);
        this.addChild(nameTxt);
        this.selectedInfos.name = pd.createText("Arial", null, 95, 225, 18, null, " ");
        this.selectedInfos.name.setAnchorPoint(0, 0.5);
        this.addChild(this.selectedInfos.name);

        //Região que controla a posição
        var positionString = pd.createText("Arial", null, 285, 200, 12, null, "/ / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / Position / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / /");
        positionString.setAnchorPoint(0.5, 0.5);
        this.addChild(positionString);
        this.selectedInfos.x = pd.Editor.createEditBox(this, {txt:"Position X:", size:20}, cc.p(10, 180), cc.size(80, 20), cc.EDITBOX_INPUT_MODE_NUMERIC, this, "_updatePosition");
        this.selectedInfos.y = pd.Editor.createEditBox(this, {txt:"PositionY:", size:20}, cc.p(225, 180), cc.size(80, 20), cc.EDITBOX_INPUT_MODE_NUMERIC, this, "_updatePosition");

        //Região que controla a scala
        this.selectedInfos.scaleX = pd.Editor.createEditBox(this, {txt:"ScaleX:", size:16}, cc.p(10, 140), cc.size(60, 20), cc.EDITBOX_INPUT_MODE_NUMERIC, this, "_updateScale");
        this.selectedInfos.scaleY = pd.Editor.createEditBox(this, {txt:"ScaleY:", size:16}, cc.p(155, 140), cc.size(60, 20), cc.EDITBOX_INPUT_MODE_NUMERIC, this, "_updateScale");
        //Botão para associar a escala X e Y
        this.selectedInfos.scaleChain = pd.Editor.createCheckBox(this, {txt:"", size:0}, cc.p(133, 140), [pd.SpriteFrames.EDITOR_UNCHAINED, pd.SpriteFrames.EDITOR_CHAINED]);

        //Região que controla a rotação
        var rotationString = pd.createText("Arial", null, 285, 160, 12, null, "/ / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / Scale & Rotation / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / /");
        rotationString.setAnchorPoint(0.5, 0.5);
        this.addChild(rotationString);
        this.selectedInfos.rotationX = pd.Editor.createEditBox(this, {txt:"RotX:", size:16}, cc.p(320, 140), cc.size(60, 20), cc.EDITBOX_INPUT_MODE_NUMERIC, this, "_updateRotation");
        this.selectedInfos.rotationY = pd.Editor.createEditBox(this, {txt:"RotY:", size:16}, cc.p(455, 140), cc.size(60, 20), cc.EDITBOX_INPUT_MODE_NUMERIC, this, "_updateRotation");
        //Botão para associar a rotação X e Y
        this.selectedInfos.rotationChain = pd.Editor.createCheckBox(this, {txt:"", size:0}, cc.p(430, 140), ["unchained.png", "chained.png"]);

        //Região que controla a cor e opacidade
        var colorString = pd.createText("Arial", null, 285, 120, 12, null, "/ / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / Color & Opacity / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / /");
        colorString.setAnchorPoint(0.5, 0.5);
        this.addChild(colorString);
        this.selectedInfos.colorR = pd.Editor.createEditBox(this, {txt:"Color R:", size:18}, cc.p(40, 100), cc.size(38, 20), cc.EDITBOX_INPUT_MODE_NUMERIC, this, "_updateColor");
        this.selectedInfos.colorG = pd.Editor.createEditBox(this, {txt:"Color G:", size:18}, cc.p(160, 100), cc.size(38, 20), cc.EDITBOX_INPUT_MODE_NUMERIC, this, "_updateColor");
        this.selectedInfos.colorB = pd.Editor.createEditBox(this, {txt:"Color B:", size:18}, cc.p(280, 100), cc.size(38, 20), cc.EDITBOX_INPUT_MODE_NUMERIC, this, "_updateColor");
        this.selectedInfos.colorA = pd.Editor.createEditBox(this, {txt:"Opacity:", size:18}, cc.p(400, 100), cc.size(38, 20), cc.EDITBOX_INPUT_MODE_NUMERIC, this, "_updateColor");

        //Região que controla ZOrder & boundingBox
        var zOrderString = pd.createText("Arial", null, 285, 80, 12, null, "/ / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / Outros / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / / ");
        zOrderString.setAnchorPoint(0.5, 0.5);
        this.addChild(zOrderString);
        this.selectedInfos.zOrder = pd.Editor.createEditBox(this, {txt:"Z-Order:", size:17}, cc.p(10, 60), cc.size(60, 20), cc.EDITBOX_INPUT_MODE_NUMERIC, this, "_updateZOrder");

        this.selectedInfos.showBoundingBox = pd.Editor.createCheckBox(this, {txt:"Show bounding box - ", size:17}, cc.p(155, 60), [pd.SpriteFrames.EDITOR_UNCHECKED, pd.SpriteFrames.EDITOR_CHECKED]);

        this.selectedInfos.willAddToPrinter = pd.Editor.createCheckBox(this, {txt:"Adicionar ao Printer - ", size:17}, cc.p(365, 60), [pd.SpriteFrames.EDITOR_UNCHECKED, pd.SpriteFrames.EDITOR_CHECKED]);

        //bounding box para mostrar a area de colisão da img
        this.boundingBoxImage = pd.Editor.createScale9Sprite(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_BOUNDING_BOX), cc.p(0, 0), 1, 1);
        this.boundingBoxImage.setVisible(false);
        this.boundingBoxImage.setAnchorPoint(0, 0);
        this.addChild(this.boundingBoxImage, 10);
    },
    _onExitButtonCall:function(){
        this.getParent().initGeneralEditor();
    },
    removeListViewer:function(){
        this.spriteViewer = null;
    },
    _onListButtonCall:function(caller, isDown){
        if(isDown){
            if(!this.spriteViewer){
                this.spriteViewer = new pd.Editor.SpriteListView();
                this.spriteViewer.init(this, 'onListButtonCallBack', "Sprite List");
                this.spriteViewer.setPosition(- 105, 115);
                this.addChild(this.spriteViewer, 999);

                for(var i in pd.Editor.NodeList){
                    this.spriteViewer.addObjToList(pd.Editor.NodeList[i]);
                }
            }
            else{
                this.spriteViewer.removeFromParent();
                this.spriteViewer = null;
            }
        }
    },
    onListButtonCallBack:function(obj){
        this._changeSelectedSprite(obj);
        this._updateBoundingBoxImage();
    },
    deleteObject:function(){
        var obj = this.selectedSprite;
        pd.Editor.NodeList.splice(pd.Editor.NodeList.indexOf(obj), 1);
        this.selectedSprite = null;
        this.boundingBoxImage.setVisible(false);
        obj.removeFromParent();
    },
    _changeSelectedSprite:function(newSprite){
        this.selectedSprite = newSprite;
        this.selectedInfos.name.setString(this.selectedSprite.debugName);
        this._updateEditBoxes("All");

        this.boundingBoxImage.setVisible(false);
        var button = this.selectedInfos.showBoundingBox;
        button.setSpriteFrame(button.unpressedImage);
        button.isPressed = false;
        if(newSprite.willPrint){
            this.selectedInfos.willAddToPrinter.setSpriteFrame(this.selectedInfos.willAddToPrinter.pressedImage);
            this.selectedInfos.willAddToPrinter.isPressed = true;
        }
        else{
            this.selectedInfos.willAddToPrinter.setSpriteFrame(this.selectedInfos.willAddToPrinter.unpressedImage);
            this.selectedInfos.willAddToPrinter.isPressed = false;
        }
    },
    _updateEditBoxes:function(type){
        if(type == "All"){
            this.selectedInfos.x.setString(parseInt(this.selectedSprite.x).toString());
            this.selectedInfos.y.setString(parseInt(this.selectedSprite.y).toString());
            this.selectedInfos.scaleX.setString(this.selectedSprite.getScaleX().toString());
            this.selectedInfos.scaleY.setString(this.selectedSprite.getScaleY().toString());
            this.selectedInfos.rotationX.setString(this.selectedSprite.getRotationX().toString());
            this.selectedInfos.rotationY.setString(this.selectedSprite.getRotationY().toString());
            this.selectedInfos.zOrder.setString(this.selectedSprite.getLocalZOrder().toString());
            this.selectedInfos.colorR.setString(this.selectedSprite.getColor().r.toString());
            this.selectedInfos.colorG.setString(this.selectedSprite.getColor().g.toString());
            this.selectedInfos.colorB.setString(this.selectedSprite.getColor().b.toString());
            this.selectedInfos.colorA.setString(this.selectedSprite.getOpacity().toString());
        }
        else if(type == "Position"){
            this.selectedInfos.x.setString(parseInt(this.selectedSprite.x).toString());
            this.selectedInfos.y.setString(parseInt(this.selectedSprite.y).toString());
        }
    },
    _updatePosition:function(){
        if(!this.selectedSprite)
            return;
        if(this.selectedSprite.setPosition){
            this.selectedSprite.setPosition(this.selectedInfos.x.getString(), this.selectedInfos.y.getString());
            this._updateBoundingBoxImagePosition();
        }
    },
    _updateScale:function(sender){
        if(!this.selectedSprite)
            return;
        if(this.selectedSprite.setScale){
            if(this.selectedInfos.scaleChain.isPressed){
                this.selectedSprite.setScale(sender.getString(), sender.getString());
                if(this.selectedInfos.scaleX != sender)
                    this.selectedInfos.scaleX.setString(sender.getString());
                else
                    this.selectedInfos.scaleY.setString(sender.getString());
            }
            else
                this.selectedSprite.setScale(this.selectedInfos.scaleX.getString(), this.selectedInfos.scaleY.getString());
            this._updateBoundingBoxImagePosition();
        }
    },
    _updateRotation:function(sender){
        if(!this.selectedSprite)
            return;
        if(this.selectedSprite.setRotation){
            if(this.selectedInfos.rotationChain.isPressed){
                this.selectedSprite.setRotation(sender.getString());
                if(this.selectedInfos.rotationX != sender)
                    this.selectedInfos.rotationX.setString(sender.getString());
                else
                    this.selectedInfos.rotationY.setString(sender.getString());
            }
            else{
                this.selectedSprite.setRotationX(this.selectedInfos.rotationX.getString());
                this.selectedSprite.setRotationY(this.selectedInfos.rotationY.getString());
            }
            this._updateBoundingBoxImagePosition();
        }
    },
    _updateColor:function(){
        if(!this.selectedSprite)
            return;
        var cor = new cc.Color(this.selectedInfos.colorR.getString(), this.selectedInfos.colorG.getString(), this.selectedInfos.colorB.getString());
        if(this.selectedSprite.setColor)
            this.selectedSprite.setColor(cor);
        if(this.selectedSprite.setOpacity)
            this.selectedSprite.setOpacity(this.selectedInfos.colorA.getString());
    },
    _updateZOrder:function(){
        if(!this.selectedSprite)
            return;
        if(this.selectedSprite.setLocalZOrder)
            this.selectedSprite.setLocalZOrder(this.selectedInfos.zOrder.getString());
    },
    _updateBoundingBoxImage:function(update){
        if(!this.selectedSprite)
            return

        var box = this.selectedInfos.showBoundingBox;
        box.isPressed = !box.isPressed;
        if(box.isPressed && this.selectedSprite && this.selectedSprite.getBoundingBox){
            this.boundingBoxImage.setContentSize(this.selectedSprite.getBoundingBox().width, this.selectedSprite.getBoundingBox().height);
            this._updateBoundingBoxImagePosition();
            this.boundingBoxImage.setVisible(true);
            box.setSpriteFrame(box.pressedImage);
        }
        else{
            this.boundingBoxImage.setVisible(false);
            box.setSpriteFrame(box.unpressedImage);
        }
    },
    _togglePrint:function(){
        if(!this.selectedSprite)
            return;

        var box = this.selectedInfos.willAddToPrinter;
        box.isPressed = !box.isPressed;
        if(box.isPressed && this.selectedSprite){
            this.selectedSprite.willPrint = true;
            this.selectedInfos.willAddToPrinter.setSpriteFrame(this.selectedInfos.willAddToPrinter.pressedImage);
        }
        else{
            this.selectedSprite.willPrint = false;
            this.selectedInfos.willAddToPrinter.setSpriteFrame(this.selectedInfos.willAddToPrinter.unpressedImage);
        }
    },
    _updateBoundingBoxImagePosition:function(){
        var position = this.convertToNodeSpace(cc.p(this.selectedSprite.getBoundingBoxToWorld().x, this.selectedSprite.getBoundingBoxToWorld().y))
        this.boundingBoxImage.setPosition(position);
        this.boundingBoxImage.setContentSize(this.selectedSprite.getBoundingBoxToWorld().width, this.selectedSprite.getBoundingBoxToWorld().height);
    },
    _toggleChained:function(icon){
        icon.isPressed = !icon.isPressed;
        if(icon.isPressed)
            icon.setSpriteFrame(icon.pressedImage);
        else
            icon.setSpriteFrame(icon.unpressedImage);
    },
    _onMouseDown:function(e){
        var clickPosition = e.getLocation();
        var mousePosition = cc.rect(clickPosition.x, clickPosition.y, 1, 1);
        //loc = this.convertToNodeSpace(clickPosition);
        if(e.getButton() == 0){
            //verifica drag do Editor
            if(cc.rectIntersectsRect(mousePosition, this.cabecalho.getBoundingBoxToWorld())){
                this.isDragging = true;
                this.mouseOffset = cc.p(clickPosition.x - this.getBoundingBoxToWorld().x - this.getBoundingBoxToWorld().width/2,
                                        clickPosition.y - this.getBoundingBoxToWorld().y - this.getBoundingBoxToWorld().height/2 + 13);
                this.dragObj = this;
            }
            //verifica colisão com a box de mostrar o boundingBox
            else if(cc.rectIntersectsRect(mousePosition, this.selectedInfos.showBoundingBox.getBoundingBoxToWorld())){
                this._updateBoundingBoxImage();
            }
            else if(cc.rectIntersectsRect(mousePosition, this.selectedInfos.willAddToPrinter.getBoundingBoxToWorld())){
                this._togglePrint();
            }
            else if(cc.rectIntersectsRect(mousePosition, this.selectedInfos.scaleChain.getBoundingBoxToWorld())){
                this._toggleChained(this.selectedInfos.scaleChain);
            }else if(cc.rectIntersectsRect(mousePosition, this.selectedInfos.rotationChain.getBoundingBoxToWorld())){
                this._toggleChained(this.selectedInfos.rotationChain);
            }
            else if(this.selectedSprite && cc.rectIntersectsRect(mousePosition, this.selectedSprite.getBoundingBoxToWorld())){
                this.isDragging = true;
                this.mouseOffset = cc.p(clickPosition.x - this.selectedSprite.getBoundingBoxToWorld().x - this.selectedSprite.getBoundingBox().width/2,
                                        clickPosition.y - this.selectedSprite.getBoundingBoxToWorld().y - this.selectedSprite.getBoundingBox().height/2);

                this.dragObj = this.selectedSprite;
            }
        }
        else{
            //seleciona sprite no cenario
            for(var i in pd.Editor.NodeList)
                if(pd.Editor.NodeList[i] != null)
                    if(cc.rectIntersectsRect(mousePosition, pd.Editor.NodeList[i].getBoundingBoxToWorld()) && this.selectedSprite != pd.Editor.NodeList[i])
                        this._changeSelectedSprite(pd.Editor.NodeList[i]);
        }
    },
    _onMouseMove:function(e){
        if(this.isDragging){
            if(this.dragObj == this){
                //var mp = e.getLocation();
                //mp = this.getParent().convertToNodeSpace(mp);
                //this.setPosition(mp.x - this.mouseOffset.x, mp.y - this.mouseOffset.y);
            }
            else {
                var mp = e.getLocation(); mp.x -= this.mouseOffset.x; mp.y -= this.mouseOffset.y;
                mp = this.dragObj.getParent().convertToNodeSpace(mp);
                this.dragObj.setPosition(mp);
                this._updateBoundingBoxImagePosition();
            }
        }
    },
    _onMouseUp:function(e){
        this.isDragging = false;
        if(this.selectedSprite && this.dragObj == this.selectedSprite){
            this._updateEditBoxes("Position");
            this._updateBoundingBoxImagePosition();
        }

        this.dragObj = null;
    },
    onKeyDown:function(e){
        if(this.selectedSprite){
            if(e == 37){
                this.selectedSprite.x -= 1;
                this._updateEditBoxes("Position");
                this._updateBoundingBoxImagePosition();
            }
            if(e == 38){
                this.selectedSprite.y += 1;
                this._updateEditBoxes("Position");
                this._updateBoundingBoxImagePosition();
            }
            if(e == 39){
                this.selectedSprite.x += 1;
                this._updateEditBoxes("Position");
                this._updateBoundingBoxImagePosition();
            }
            if(e == 40){
                this.selectedSprite.y -= 1;
                this._updateEditBoxes("Position");
                this._updateBoundingBoxImagePosition();
            }
            if(e == 46){
                this.deleteObject();
            }
        }
    },
});

pd.Editor.createScale9Sprite = function(img, position, scaleX, scaleY){
    var sprite = new cc.Scale9Sprite(img);
    sprite.setPosition(position.x, position.y);
    sprite.setContentSize(scaleX, scaleY || scaleX);
    return sprite;
}
pd.Editor.createView = function(name, position, size){
    var body = pd.Editor.createScale9Sprite(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_INTERFACE), position, size.width, size.height);
    //this.addChild(body);
    var cabecalho = pd.Editor.createScale9Sprite(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_HEADER), cc.p(0, size.height), size.width, 26);
    cabecalho.setAnchorPoint(0, 0);
    body.addChild(cabecalho);

    var name = new cc.LabelTTF(name, "Arial", 15);
    name.setPosition(size.width/2, 13);
    name.setFontFillColor(new cc.Color(0, 0, 0));
    cabecalho.addChild(name);
    body.cabecalho = cabecalho;

    return body;
}
pd.Editor.createEditBox = function(layer, textInfo, position, size, type, funcCaller, funcToCall){
    var name = new cc.LabelTTF(textInfo.txt, "Arial", textInfo.size);
    name.setAnchorPoint(0, 0.5);
    name.setPosition(position.x, position.y);
    name.setFontFillColor(new cc.Color(0, 0, 0));
    layer.addChild(name);

    var editBox = new cc.EditBox(size, new cc.Scale9Sprite(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_TEXT_BOX)));
    if(type) {editBox.setInputMode(type);}
    else {editBox.setInputMode(cc.EDITBOX_INPUT_MODE_ANY);}
    editBox.setFontColor(new cc.color(0,0,0,255));
    editBox.setAnchorPoint(0, 0.5);
    editBox.setPosition(position.x + name.getBoundingBox().width, position.y);
    layer.addChild(editBox);

    if(funcCaller && funcToCall){
        editBox.funcCaller = funcCaller;
        editBox.funcToCall = funcToCall
        editBox.setDelegate(layer.editBoxDelegate);
    }

    return editBox;
}
pd.Editor.createCheckBox = function(layer, textInfo, position, textureInfos){
    var name = new cc.LabelTTF(textInfo.txt, "Arial", textInfo.size);
    name.setAnchorPoint(0, 0.5);
    name.setPosition(position.x, position.y);
    name.setFontFillColor(new cc.Color(0, 0, 0));
    layer.addChild(name);
    var checkBox = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(textureInfos[0]));
    checkBox.unpressedImage = cc.spriteFrameCache.getSpriteFrame(textureInfos[0]);
    checkBox.pressedImage = cc.spriteFrameCache.getSpriteFrame(textureInfos[1]);
    checkBox.isPressed = false;
    checkBox.setAnchorPoint(0, 0.5);
    checkBox.setPosition(position.x + name.getBoundingBox().width, position.y);
    layer.addChild(checkBox);

    return checkBox;
}
pd.Editor.EditBoxDelegate = cc.EditBoxDelegate.extend({
    editBoxEditingDidBegin: function (sender) {
        sender.funcCaller[sender.funcToCall]();
    },
    editBoxEditingDidEnd: function (sender) {
        sender.funcCaller[sender.funcToCall]();
    },

    editBoxTextChanged: function (sender, text) {
        sender.funcCaller[sender.funcToCall](sender);
    },

    editBoxReturn: function (sender) {
        sender.funcCaller[sender.funcToCall]();
    }
});
pd.Editor.sortEditorArrayByName = function(){
    var swapped;
    var a = pd.Editor.NodeList;
    do {
        swapped = false;
        for (var i = 0; i < a.length - 1; i++) {
            if (a[i]["name"] > a[i + 1]["name"]) {
                var temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
};

pd.Editor.NodeList = [];


pd.Editor.add = function(obj, name){
    if(!name)
        name = "objSemNome";
    obj.debugName = name || obj.name;
    pd.Editor.NodeList.push(obj);

    if(!pd.debugMode)
        cc.warn("[pd.Editor] Editor sendo utilizado em modo produção. Remover todas as chamadas para o pd.Editor no seu jogo.");
}