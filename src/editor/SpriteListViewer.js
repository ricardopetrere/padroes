/**
 * created by Vinicius Carlos Maschio
 */
pd.Editor.SpriteListView = cc.Sprite.extend({
    ctor:function(){
        this._super(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_LIST));
    },
    init:function(funcCaller, funcToCall, name){
        this.funcCaller = funcCaller;
        this.funcToCall = funcToCall;

        this.isDragging = false;
        this._lastCursorDown = cc.p(0, 0);
        this._willSelectObj = false;
        this._lastSearchIndex = -1;


        pd.inputManager.add(pd.InputManager.Events.MOUSE_SCROLL, this, "onMouseScroll", this);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_DOWN, this, "onMouseDown", this);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_UP, this, "onMouseUp", this);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_MOVE, this, "onMouseMove", this);

        pd.inputManager.add(pd.InputManager.Events.KEY_DOWN, this, "onKeyDown", this);

        this.listController = [];
        this.listController.yOffset = 0;

        //var corpo = new cc.Sprite();
        //corpo.setPosition(0, 0);
        //this.addChild(corpo);
        //this = corpo;

        var clipper = new cc.ClippingNode(new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_LIST)));
        clipper.setPosition(this.getBoundingBox().width/2, this.getBoundingBox().height/2);
        this.addChild(clipper);
        this.listClipper = clipper;

        var listView = new cc.Node();
        this.listClipper.addChild(listView);
        this.listView = listView;
        this.listView.setPosition(-this.getBoundingBox().width/2, this.getBoundingBox().height/2 - 4);
        this.listView.baseY = this.getBoundingBox().height/2 - 4;
        this.listView.maxY = this.getBoundingBox().height/2 - 4;
        this.listView.minY = -110;

        var cabecalho = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(pd.Editor.EDITOR_HEADER));
        cabecalho.setAnchorPoint(0, 0);
        cabecalho.setScaleX(0.5);
        cabecalho.setPosition(0, this.getBoundingBox().height);
        cabecalho.setScale(0.83, 1);
        this.addChild(cabecalho);

        var name = new cc.LabelTTF(name, "Arial", 15);
        name.setPosition(this.getBoundingBox().width/2, 13);
        name.setFontFillColor(new cc.Color(0, 0, 0));
        cabecalho.addChild(name);
        this.cabecalho = cabecalho;

        this.selectedString = pd.Editor.createScale9Sprite(cc.spriteFrameCache.getSpriteFrame(pd.SpriteFrames.EDITOR_BOUNDING_BOX), cc.p(0, 0), 1, 1);
        this.selectedString.setVisible(false);
        this.selectedString.setAnchorPoint(0, 0);
        this.selectedString.setColor(0, 0, 255);
        this.listView.addChild(this.selectedString, 10);

        this.exitButton = new pd.Button(pd.SpriteFrames.EDITOR_BTN_CLOSE, pd.SpriteFrames.EDITOR_BTN_CLOSE, {x:245, y:12}, null, true, false, this, '_onExitButtonCall');
        cabecalho.addChild(this.exitButton, 99);

    },
    _onExitButtonCall:function(){
        this.getParent().removeListViewer();
        this.removeFromParent();
    },
    addStringToList:function(str){
        var nome = str;
        var cor = new cc.Color(50, 50, 50);

        var label = new cc.LabelTTF(nome, "Calibri", 20);
        label.setFontFillColor(cor);
        label.setAnchorPoint(0, 0.5);
        label.setPosition(20, this.listView.getBoundingBox().height - 10 - (this.listController.length * 20));
        label.baseY = this.listView.getBoundingBox().height - 10 - (this.listController.length * 20);
        label.objRef = str;
        this.listController.push(label);
        this.listView.addChild(label);
        this.listView.minY += 20;
    },
    addObjToList:function(obj){
        var nome = "";
        var cor = new cc.Color(50, 50, 50);
        if(obj.name)
            nome = obj.name;
        else
            nome = "objeto_sem_nome";

        if(obj.type == "Animation")
            cor = new cc.Color(255, 0, 0);
        else if(obj.type == "Sprite")
            cor = new cc.Color(0, 255, 0);
        else if(obj.type == "Sound")
            cor = new cc.Color(0, 0, 255);

        var label = new cc.LabelTTF(nome, "Calibri", 20);
        label.setFontFillColor(cor);
        label.setAnchorPoint(0, 0.5);
        label.setPosition(20, this.listView.getBoundingBox().height - 10 - (this.listController.length * 20));
        label.baseY = this.listView.getBoundingBox().height - 10 - (this.listController.length * 20);
        label.objRef = obj;
        this.listController.push(label);
        this.listView.addChild(label);
        this.listView.minY += 20;
    },
    selectObject:function(obj){
        this.selectedString.setPosition(obj.x, obj.y - 11);
        this.selectedString.setContentSize(obj.getBoundingBox().width, obj.getBoundingBox().height - 6);
        this.selectedString.setVisible(true);
        obj = obj.objRef;
        this.funcCaller[this.funcToCall](obj);
    },
    findNextOccurrence:function(key, secondSearch){
        var found = -1;
        var start = secondSearch == true ? 0 : parseInt(this._lastSearchIndex) + 1;
        for(var i = start; i < this.listController.length; i++){
            var firstLetter = this.listController[i].getString().charAt(0).toUpperCase();
            if(firstLetter == key){
                found = i;
                this._lastSearchIndex = i;
                break;
            }
        }
        if(found >= 0){
            this.selectObject(this.listController[found]);
            this.listView.baseY = this.listView.maxY + found * 20 - 100;
            this.updateListPosition(0, true);
        }
        else if(!secondSearch)
            this.findNextOccurrence(key, true);

    },
    updateListPosition:function(diff, released){
        this.listView.y = this.listView.baseY - diff;
        if(released)
            this.listView.baseY = this.listView.y;
        if(this.listView.y < this.listView.maxY || this.listController.length <= 11){
            this.listView.y = this.listView.maxY;
            this.listView.baseY = this.listView.y;
        }
        if(this.listView.y > this.listView.minY){
            this.listView.y = this.listView.minY;
            this.listView.baseY = this.listView.y;
        }

    },
    onMouseScroll:function(e){
        var diff = e.getScrollY() / 10;
        this.updateListPosition(diff, true);
        this.isDragging = false;
    },
    onMouseDown:function(e){
        var clickPosition = e.getLocation();
        var mousePosition = cc.rect(clickPosition.x, clickPosition.y, 1, 1);
        if(cc.rectIntersectsRect(mousePosition, this.getBoundingBoxToWorld())){
            this._willSelectObj = true;
            this._lastCursorDown = clickPosition;
        }
        else
            this._lastCursorDown = null;
        mousePosition = cc.rect(clickPosition.x, clickPosition.y, 1, 1);
        //verifica drag do SpriteViewer
        if(cc.rectIntersectsRect(mousePosition, this.cabecalho.getBoundingBoxToWorld())){
            this.isDragging = true;
            mp = this.getParent().convertToNodeSpace(clickPosition);
            this.mouseOffset = cc.p(this.x - mp.x,
                                    this.y - mp.y);
            this.dragObj = this;
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

        if(this._lastCursorDown == null)
            return;

        var diff = this._lastCursorDown.y - e.getLocation().y;
        this.updateListPosition(diff, false);
        if(Math.abs(diff) > 5)
            this._willSelectObj = false;
    },
    onMouseUp:function(e){
        this.isDragging = false;
        if(this._lastCursorDown == null)
            return;

        var diff = this._lastCursorDown.y - e.getLocation().y;
        this.updateListPosition(diff, true);
        if(this._willSelectObj){
            var mp = e.getLocation();
            mp = this.listView.convertToNodeSpace(mp);
            mp = cc.rect(mp.x, mp.y, 1, 1);
            for(var i in this.listController){
                var obj = this.listController[i];
                if(obj && cc.rectIntersectsRect(mp, obj.getBoundingBox())){
                    this._lastSearchIndex = i;
                    this.selectObject(obj);
                }
            }
        }
    },
    onKeyDown:function(e){
        var key = String.fromCharCode(e);
        this.findNextOccurrence(key);
    },
});
