/**
 * created by Vinicius Carlos Maschio
 */
pd.Editor.SpriteCreator = cc.Scale9Sprite.extend({
    ctor:function(){
        this._super(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_INTERFACE));
    },
    init:function(){

        this.editBoxDelegate = new pd.Editor.EditBoxDelegate();

        this.setAnchorPoint(0, 1);
        this.setContentSize(570, 250);

        var cabecalho = pd.Editor.createScale9Sprite(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_HEADER), cc.p(0, 250), 570, 26);
        cabecalho.setAnchorPoint(0, 0);
        this.addChild(cabecalho);

        var name = new cc.LabelTTF("Sprite Creator", "Arial", 20);
        name.setPosition(570/2, 11);
        name.setFontFillColor(new cc.Color(0, 0, 0));
        cabecalho.addChild(name);
        this.cabecalho = cabecalho;

        pd.Editor.activeSpriteCreator = this;
        this.isDragging = false;
        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_DOWN, this, "onMouseDown", this);
        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_UP, this, "onMouseUp", this);
        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_MOVE, this, "onMouseMove", this);


        this.selectedInfos = [];

        //Campo do Name
        this.selectedInfos.parent =  pd.Editor.createEditBox(this, {txt:"ParentByName:", size:14}, cc.p(15, 225), cc.size(135, 20), cc.EDITBOX_INPUT_MODE_ANY);
        this.listParentButton = new pd.Button(pd.SpriteFrames.EDITOR_BTN_LIST, pd.SpriteFrames.EDITOR_BTN_LIST, {x:265, y:225}, null, true, false, this, '_onParentListButtonCall');
        this.addChild(this.listParentButton, 99);

        this.selectedInfos.spriteName =  pd.Editor.createEditBox(this, {txt:"SpriteName:", size:14}, cc.p(15, 200), cc.size(155, 20), cc.EDITBOX_INPUT_MODE_ANY, this, "onSpriteFrameTextChange");
        this.listSpriteFrameButton = new pd.Button(pd.SpriteFrames.EDITOR_BTN_LIST, pd.SpriteFrames.EDITOR_BTN_LIST, {x:265, y:200}, null, true, false, this, '_onSpriteFrameListButtonCall');
        this.addChild(this.listSpriteFrameButton, 99);

        this.selectedInfos.name =  pd.Editor.createEditBox(this, {txt:"Name:", size:14}, cc.p(15, 175), cc.size(192, 20), cc.EDITBOX_INPUT_MODE_ANY);

        //Região que controla a posição
        this.selectedInfos.x = pd.Editor.createEditBox(this, {txt:"PosX:", size:20}, cc.p(15, 130), cc.size(60, 20), cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.selectedInfos.y = pd.Editor.createEditBox(this, {txt:"PosY:", size:20}, cc.p(135, 130), cc.size(60, 20), cc.EDITBOX_INPUT_MODE_NUMERIC);

        //Região que controla ZOrder & boundingBox
        this.selectedInfos.zOrder = pd.Editor.createEditBox(this, {txt:"Z-Order:", size:17}, cc.p(15, 100), cc.size(60, 20), cc.EDITBOX_INPUT_MODE_NUMERIC);

        this.selectedInfos.willAddToPrinter = pd.Editor.createCheckBox(this, {txt:"Adicionar ao Printer - ", size:17}, cc.p(15, 70), [pd.SpriteFrames.EDITOR_UNCHECKED, pd.SpriteFrames.EDITOR_CHECKED]);

        this.exitButton = new pd.Button(pd.SpriteFrames.EDITOR_BTN_CLOSE, pd.SpriteFrames.EDITOR_BTN_CLOSE, {x:550, y:12}, null, true, false, this, '_onExitButtonCall');
        this.cabecalho.addChild(this.exitButton, 99);


        this.createButton = new pd.Button(pd.SpriteFrames.EDITOR_BTN_CREATE, pd.SpriteFrames.EDITOR_BTN_CREATE, {x:130, y:30}, null, true, false, this, 'onCreateButtonCall');
        this.addChild(this.createButton, 99);

        var PreviewString = pd.createText("Arial", null, 350, 225, 20, null, "PREVIEW:");
        PreviewString.setAnchorPoint(0.5, 0.5);
        this.addChild(PreviewString);

        var drawNode = new cc.DrawNode();
        this.addChild(drawNode);
        drawNode.drawRect(cc.p(300, 20), cc.p(485, 205), cc.color(180, 180, 180), 4, cc.color(0, 0, 0));


        ///largura e altura maxima 185
    },
    removeListViewer:function(){
        this.spriteFrameViewer = null;
        this.parentViewer = null;
    },
    _onParentListButtonCall:function(caller, isDown){
        if(isDown){
            if(!this.parentViewer){
                if(this.spriteFrameViewer){
                    this.spriteFrameViewer.removeFromParent();
                    this.spriteFrameViewer = null;
                }
                this.parentViewer = new pd.Editor.SpriteListView();
                this.parentViewer.init(this, 'onParentListButtonCallBack', "Parent List");
                this.addChild(this.parentViewer, 999);
                this.parentViewer.setPosition(- 105, 115);

                for(var i in pd.Editor.NodeList){
                    this.parentViewer.addObjToList(pd.Editor.NodeList[i]);
                }
            }
            else{
                this.parentViewer.removeFromParent();
                this.parentViewer = null;
            }
        }
    },
    _onSpriteFrameListButtonCall:function(caller, isDown){
        if(isDown){
            if(!this.spriteFrameViewer){
                if(this.parentViewer){
                    this.parentViewer.removeFromParent();
                    this.parentViewer = null;
                }
                this.spriteFrameViewer = new pd.Editor.SpriteListView();
                this.spriteFrameViewer.init(this, 'onSpriteFrameListButtonCallBack', "SpriteFrame List");
                this.spriteFrameViewer.setPosition(- 105, 115);
                this.addChild(this.spriteFrameViewer, 999);

                var list = this.generateFrameList();


                for(var i in list){
                    this.spriteFrameViewer.addStringToList(list[i]);
                }
            }
            else{
                this.spriteFrameViewer.removeFromParent();
                this.spriteFrameViewer = null;
            }
        }
    },
    onSpriteFrameTextChange:function(sender){
        this.createPreview(sender.getString());
    },

    onParentListButtonCallBack:function(obj){
        this.selectedInfos.parent.setString(obj.name.toString());
    },
    onSpriteFrameListButtonCallBack:function(obj){
        this.selectedInfos.spriteName.setString(obj.toString());
        this.createPreview(obj);
    },
    createPreview:function(obj){        
        if(this.previewSprite){
            this.previewSprite.removeFromParent();
            this.previewSprite = null;
        }
        var spriteFrame = pd.getSpriteFrame(obj);
        if(!spriteFrame)
            return;
        
        this.previewSprite = new cc.Sprite(spriteFrame);
        this.previewSprite.setPosition(392, 112);
        this.addChild(this.previewSprite);

        var size = cc.p(this.previewSprite.getBoundingBoxToWorld().width, this.previewSprite.getBoundingBoxToWorld().height);
        var scale = cc.p(184/ size.x, 184/ size.y);
        if(scale.x > scale.y)
            scale.x = scale.y;
        if(scale.x > 1)
            scale.x = 1;
        this.previewSprite.setScale(scale.x);
    },

    generateFrameList:function(){
        var tempList = cc.spriteFrameCache._spriteFrames;
        var list = [];
        for(var i in tempList)
            list.push(i.toString());
        for(var i in pd.resLoad){
            if(pd.resLoad[i].lastIndexOf(".plist") != -1){
                var frames = cc.spriteFrameCache._frameConfigCache[pd.resLoad[i]].frames;
                for(var f in frames){
                    list.splice(list.indexOf(f.toString()), 1);
                }
            }
        }
        for(var i in pd.res){
            if(pd.res[i].lastIndexOf(".plist") != -1){
                var frames = cc.spriteFrameCache._frameConfigCache[pd.res[i]].frames;
                for(var f in frames){
                    list.splice(list.indexOf(f.toString()), 1);
                }
            }
        }
        for(var i in list){
            list[i] = list[i].slice(0, list[i].lastIndexOf(".png"));
        }

        return list;
    },
    _onExitButtonCall:function(){
        this.getParent().initSpriteCreator();
    },
    onCreateButtonCall:function(caller, arg, isDown){
        if(!arg)
            return;
        if(this.selectedInfos.spriteName.getString().length > 0){
            var father = this.selectedInfos.parent.getString();
            var parentNode = null;
            cc.log(father)
            for(var i in pd.Editor.NodeList){
                if(father == pd.Editor.NodeList[i].debugName){
                    parentNode = pd.Editor.NodeList[i];
                    break;
                }
            }
            if(parentNode == null){
                cc.log('parent node invalido.')
                return;
            }

            var spriteName = this.selectedInfos.spriteName.getString();
            var oldSpriteName = spriteName.toString();
            if(spriteName.indexOf('.png') == -1){
                spriteName += ".png";
            }
            cc.log(spriteName)
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(spriteName);
            if((spriteFrame == null || spriteFrame == undefined) || spriteName.indexOf(activeGameSpace.resPath) != -1){
                cc.log('sprite frame invalida.');
                return;
            }
            if(this.selectedInfos.name)
                var spriteID = this.selectedInfos.name.getString();
            
            if(this.selectedInfos.x.getString() && this.selectedInfos.y.getString())
                var position = cc.p(parseInt(this.selectedInfos.x.getString()), parseInt(this.selectedInfos.y.getString()));
            else{
                var p = cc.p(512, 384);
                var p = parentNode.convertToNodeSpace(p);
                var position = cc.p(p.x, p.y);
                cc.log(p);
            }
            var zOrder = parseInt(this.selectedInfos.zOrder.getString());
            var addToPrinter = this.selectedInfos.willAddToPrinter.isPressed;
            var newSprite = new cc.Sprite(spriteFrame);
            newSprite.spriteName = oldSpriteName;
            newSprite.setPosition(position);
            newSprite.willPrint = addToPrinter;
            newSprite.name = spriteID;
            parentNode.addChild(newSprite, zOrder);
            pd.Editor.add(newSprite);
            if(pd.Editor.activeGeneralEditor){
                pd.Editor.activeGeneralEditor._changeSelectedSprite(newSprite);
                pd.Editor.activeGeneralEditor._updateBoundingBoxImage();
            }
            //quem é o alvo do addSprite
        }
    },
    togglePrint:function(){

        var box = this.selectedInfos.willAddToPrinter;
        box.isPressed = !box.isPressed;
        if(box.isPressed){
            box.setSpriteFrame(box.pressedImage);
        }
        else{
            box.setSpriteFrame(box.unpressedImage);
        }
    },
    onMouseDown:function(e){
        var clickPosition = e.getLocation();
        mousePosition = cc.rect(clickPosition.x, clickPosition.y, 1, 1);
        //verifica drag do SpriteViewer
        if(cc.rectIntersectsRect(mousePosition, this.cabecalho.getBoundingBoxToWorld())){
            this.isDragging = true;
            mp = this.getParent().convertToNodeSpace(clickPosition);
            this.mouseOffset = cc.p(this.x - mp.x,
                                    this.y - mp.y);
            this.dragObj = this;
        }
        else if(cc.rectIntersectsRect(mousePosition, this.selectedInfos.willAddToPrinter.getBoundingBoxToWorld())){
            this.togglePrint();
        }
    },
    onMouseMove:function(e){
        if(this.isDragging){
            if(this.dragObj == this){
                var mp = e.getLocation();
                mp = cc.p(mp.x + this.mouseOffset.x, mp.y + this.mouseOffset.y);
                mp = this.getParent().convertToNodeSpace(mp);
                this.x = mp.x; this.y = mp.y;
            }
        }

    },
    onMouseUp:function(e){
        this.isDragging = false;
    },

});




pd.Editor.frameIgnoreList = [
    "p_loader",
    "editorSpriteSheet_p",
    "p_input",
    "p_menus",
    "p_Padroes",
]