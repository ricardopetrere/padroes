/**
 * created by Vinicius Carlos Maschio
 */
pd.Editor.PrintArray = [];
pd.Editor.Printer = cc.Scale9Sprite.extend({
    ctor:function(){
        this._super(cc.spriteFrameCache.getSpriteFrame('editor_interface.png'));
    },
    init:function(){
        this.setAnchorPoint(0, 1);
        this.setContentSize(570, 170);

        var cabecalho = pd.Editor.createScale9Sprite(cc.spriteFrameCache.getSpriteFrame('editor_cabecalho.png'), cc.p(0, 170), 570, 26);
        cabecalho.setAnchorPoint(0, 0);
        this.addChild(cabecalho);


        var name = new cc.LabelTTF("Printer", "Arial", 20);
        name.setPosition(570/2, 11);
        name.setFontFillColor(new cc.Color(0, 0, 0));
        cabecalho.addChild(name);
        this.cabecalho = cabecalho;

        pd.Editor.activePrinter = this;
        this.isDragging = false;
        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_DOWN, this, "onMouseDown", this);
        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_UP, this, "onMouseUp", this);
        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_MOVE, this, "onMouseMove", this);

        //this = pd.Editor.createView("Printer", cc.p(512, 384), cc.size(260, 290));
        //this.addChild(this, 50);

        this.selectedInfos = [];

        //Campo do Name
        this.selectedInfos.parent = pd.Editor.createCheckBox(this, {txt:"ParentName:", size:20}, cc.p(15, 145), ["unchecked.png", "checked.png"]);
        this.selectedInfos.spriteName = pd.Editor.createCheckBox(this, {txt:"SpriteName: ", size:20}, cc.p(180, 145), ["unchecked.png", "checked.png"]);
        this.selectedInfos.name = pd.Editor.createCheckBox(this, {txt:"Name:", size:20}, cc.p(350, 145), ["unchecked.png", "checked.png"]);

        this.selectedInfos.position = pd.Editor.createCheckBox(this, {txt:"Position: ", size:18}, cc.p(15, 115), ["unchecked.png", "checked.png"]);
        this.selectedInfos.scale = pd.Editor.createCheckBox(this, {txt:"Scale:", size:18}, cc.p(135, 115), ["unchecked.png", "checked.png"]);
        this.selectedInfos.rotation = pd.Editor.createCheckBox(this, {txt:"Rotation:", size:18}, cc.p(235, 115), ["unchecked.png", "checked.png"]);
        this.selectedInfos.color = pd.Editor.createCheckBox(this, {txt:"Color: ", size:18}, cc.p(355, 115), ["unchecked.png", "checked.png"]);

        this.selectedInfos.zOrder = pd.Editor.createCheckBox(this, {txt:"Z-Order: ", size:18}, cc.p(440, 115), ["unchecked.png", "checked.png"]);

        var explanationText = new cc.LabelTTF("Campos adicionais. Separar com 'virgula' cada argumento a ser printado.", "Arial", 17);
        this.addChild(explanationText, 1);
        explanationText.setAnchorPoint(0, 0.5);
        explanationText.setFontFillColor(new cc.Color(0, 0, 0));
        explanationText.setPosition(14, 88);
        this.selectedInfos.adicional =  pd.Editor.createEditBox(this, {txt:"", size:14}, cc.p(15, 63), cc.size(540, 20), cc.EDITBOX_INPUT_MODE_ANY);

        this.exitButton = new pd.Button('btn_fechar.png', 'btn_fechar.png', {x:550, y:12}, null, true, false, this, '_onExitButtonCall');
        this.cabecalho.addChild(this.exitButton, 99);

        this.createButton = new pd.Button('btn_printar.png', 'btn_printar.png', {x: 280, y: 30}, null, true, false, this, 'onPrintButtonCall');
        this.addChild(this.createButton, 99);
    },
    _onExitButtonCall: function () {
        this.getParent().initPrinter();
    },
    onExitButtonCall:function(){
        pd.Editor.activePrinter = null;
        this.removeFromParent();
    },
    onPrintButtonCall:function(caller, arg, isDown){
        if(!arg)
            return;
        var text = "Printed Infos:\n[";
        this.tempVector = [];
        for(var i = 0; i < pd.Editor.NodeList.length; i++){
            if(pd.Editor.NodeList[i].willPrint)
                this.tempVector.push(pd.Editor.NodeList[i]);
        }
        for(var i in this.tempVector){
            text += "{";
            if(this.selectedInfos.parent.isPressed && this.tempVector[i].getParent().debugName){
                text += "parent:'" + this.tempVector[i].getParent().debugName.toString() + "',";
            }
            if(this.selectedInfos.spriteName.isPressed && this.tempVector[i].spriteName){
                text += "spriteName:'" + this.tempVector[i].spriteName.toString() + "',";
            }
            if(this.selectedInfos.name.isPressed && this.tempVector[i].debugName){
                text += "name:'" + this.tempVector[i].debugName.toString() + "',";
            }
            if(this.selectedInfos.position.isPressed){
                text += "x:" + parseInt(this.tempVector[i].x).toString() + ",";
                text += "y:" + parseInt(this.tempVector[i].y).toString() + ",";
            }
            if(this.selectedInfos.scale.isPressed){
                if(this.tempVector[i].getScaleX() == this.tempVector[i].getScaleY()){
                    text += "scale:" + this.tempVector[i].getScaleX().toString() + ",";
                }
                else{
                    text += "scaleX:" + this.tempVector[i].getScaleX().toString() + ",";
                    text += "scaleY:" + this.tempVector[i].getScaleY().toString() + ",";
                }
            }
            if(this.selectedInfos.rotation.isPressed){
                if(this.tempVector[i].getRotationX() == this.tempVector[i].getRotationY()){
                    text += "rotation:" + this.tempVector[i].getRotationX().toString() + ",";
                }
                else{
                    text += "rotationX:" + this.tempVector[i].getRotationX().toString() + ",";
                    text += "rotationY:" + this.tempVector[i].getRotationY().toString() + ",";
                }
            }
            if(this.selectedInfos.color.isPressed){
                var cor = this.tempVector[i].getColor();
                if(this.tempVector[i].getOpacity() != 255){
                    text += "opacity:" + parseInt(this.tempVector[i].getOpacity()).toString() + ",";
                }
                if(cor.r != 255 || cor.g != 255 || cor.b != 255){
                    text += "color: {" + parseInt(cor.r).toString() + "," + parseInt(cor.g).toString() + "," + parseInt(cor.b).toString() + "},";
                }
            }
            if(this.selectedInfos.zOrder.isPressed){
                text += "zOrder:" + this.tempVector[i].getLocalZOrder().toString() + ",";
            }
            if(this.selectedInfos.adicional.getString() != ""){
                var params = this.selectedInfos.adicional.getString().split(",");
                cc.log(params)
                for(var j in params){
                    params[j] = params[j].trim();
                    cc.log(this.tempVector[i][params[j]]);
                    if(this.tempVector[i][params[j]]){
                        text += params[j].toString() + ":" + this.tempVector[i][params[j]].toString() + ",";
                    }
                }
            }


            text = text.slice(0, text.lastIndexOf(","));
            text += "}";
            if(i < this.tempVector.length - 1)
                text += ",\n";
        }
        text += "]";
        cc.log(text);
        this.tempVector = [];
    },
    toggleCheckBox:function(obj){
        obj.isPressed = !obj.isPressed;
        if(obj.isPressed){
            obj.setSpriteFrame(obj.pressedImage);
        }
        else{
            obj.setSpriteFrame(obj.unpressedImage);
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
        else {
            for(var i in this.selectedInfos)
            if(cc.rectIntersectsRect(mousePosition, this.selectedInfos[i].getBoundingBoxToWorld())
                && this.selectedInfos[i] != this.selectedInfos.adicional){
                this.toggleCheckBox(this.selectedInfos[i]);
            }
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