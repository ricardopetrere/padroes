/**
 * Created by ??? on ???.
 *
 * @class {pd.Tutorial}
 * @extends {cc.LayerColor}
 * @classdesc Wrapper responsável por gerenciar a layer de tutorial.
 */
pd.Tutorial = cc.LayerColor.extend({/**@lends pd.Tutorial#*/

    /**
     * Indica se os botões de UI estão liberados.
     * @type {Boolean}
     */
    _isControlEnabled:false,
    /**
     * Indica o índica da página atual (sendo exibida).
     * @type {Number}
     */
    _currentPage:0,
    /**
     * Apontamento para a cena que está manipulando o componente.
     * @type {cc.Node}
     */
    _handler:null,
    /**
     * @type {cc.Sprite[]}
     */
    _bgLayers:null,
    /**
     * @type {cc.Sprite[]}
     */
    _extraBgLayer:null,
    /**
     * @type {cc.Sprite}
     */
    _title:null,
    /**
     * @type {pd.Button}
     */
    _btnExit:null,
    /**
     * @type {pd.Button}
     */
    _btnRight:null,
    /**
     * @type {pd.Button}
     */
    _btnLeft:null,
    /**
     * @type {cc.Sprite|cc.LabelTTF}
     */
    headerText:null,
    /**
     * @type {cc.Sprite|cc.LabelTTF}
     * @deprecated - utilizar a propriedade 'headerText'.
     */
    texto_objetivo:null,
    /**
     * @type {pd.Sprite[]}
     */
    _indicators:null,
    /**
     * @type {pd.TutorialLayer}
     */
    _activeLayer:null,
    /**
     * @type {cc.Node[]}
     */
    _tweenableObjects:null,
    /**
     * @type {Number}
     */
    _slideDirection:0,

    /**
     * @constructs
     * @param _handler {cc.Node}
     * @param shouldPauseHandler {Boolean}
     */
    ctor:function(_handler, shouldPauseHandler) {
        this._super(new cc.Color(255, 255, 255), 1024, 768);
        this.setOpacity(0);
        this.setCascadeOpacityEnabled(true);
        this._currentPage = 0;
        this.setControlEnabled(false);

        this._handler = _handler;
        if(!(this._handler instanceof cc.Scene))
            this._handler = this._handler.getParent();

        if(!shouldPauseHandler)
            this._handler.onPause();

        this._handler.addChild(this, 99999);
        this._buildUI();
        this._performInitialTween();

        pd.setMouse(this, "_onSwipeBegin", "_onSwipeMove", "_onSwipeFinish");
    },

    /**
     * Constrói os elementos de interface.
     * @private
     */
    _buildUI: function() {
        this._bgLayers = [
            pd.createSprite('background_01_instrucoes', 512, -500, this, 1),
            pd.createSprite('background_02_instrucoes', 512, -500, this, 2),
            pd.createSprite('layer_instrucoes', 512, -500, this, 3)
        ];

        this._extraBgLayer = pd.createSprite('layer_instrucoes', 512, -500, this, 3);

        this._tweenableObjects = [];
        for(var i in this._bgLayers)
            this._tweenableObjects.push(this._bgLayers[2]);

        this._title = pd.createSprite('txt_instrucoes', 512, 730, this, 99);
        this._title.setOpacity(0);

        this._btnExit = new pd.Button(1090, 740, this, '_onCloseButton', 'btn_sair_instrucoes.png', 'btp_sair_instrucoes.png');
        this.addChild(this._btnExit, 99);

        this._btnRight = new pd.Button(987, 360, this, '_onNextPage', "btn_next_instrucoes.png", "btp_next_instrucoes.png");
        this.addChild(this._btnRight, 99);
        this._btnRight.setFlippedX(true);
        this._btnRight.setOpacity(0);
        this._btnRight.setVisible(pd.delegate.activeNamespace.tutoriais.length > 1);

        this._btnLeft = new pd.Button(37, 360, this, '_onPreviousPage', "btn_next_instrucoes.png", "btp_next_instrucoes.png");
        this.addChild(this._btnLeft, 99);
        this._btnLeft.setOpacity(0);
        this._btnLeft.setVisible(false);

        this.headerText = pd.createText(512, 660, pd.delegate.activeNamespace.tutoriais.txt_objetivo, "Calibri", 25);
        this.addChild(this.headerText, 99);
        this.headerText.setOpacity(0);
        this.texto_objetivo = this.headerText; //legado!

        var numPages = pd.delegate.activeNamespace.tutoriais.length;
        var iniX = -(numPages/2 - 1) * 30;
        this._indicators = [];
        for(var i = 0; i < numPages; i++){
            var indicator = pd.createSprite("stage_instrucoes", 512 + iniX + i * 30, 30 + pd.delegate.activeNamespace.tutoriais.txtOffSetY, this, 50);
            indicator.setScale(0);
            this._indicators.push(indicator);
        }

        for(i = 0; i < pd.delegate.activeNamespace.tutoriais.length - 1; i++) {
            pd.delegate.activeNamespace.tutoriais[i].setCascadeOpacityEnabled(true);
            pd.delegate.activeNamespace.tutoriais[i].setOpacity(0);
        }

        //this._setClippingNode();
        this._tweenableObjects.push(this.headerText);
    },

    /**
     * Executa a tween inicial.
     * @private
     */
    _performInitialTween: function() {
        var fadeScene = new cc.FadeIn(0.2);
        var moveBackground01 = new cc.TargetedAction(this._bgLayers[0], new cc.MoveTo(0.35, 512, 364).easing(cc.easeSineOut()));
        var moveBackground02 = new cc.TargetedAction(this._bgLayers[1], new cc.MoveTo(0.55, 512, 364).easing(cc.easeSineOut()));
        var moveBackground03 = new cc.TargetedAction(this._bgLayers[2], new cc.MoveTo(0.75, 512, 350).easing(cc.easeSineOut()));
        var fadeName = new cc.TargetedAction(this._title, new cc.FadeIn(0.1));
        var fadeBtnRight = new cc.TargetedAction(this._btnRight, new cc.FadeIn(0.1));
        var fadeBtnLeft = new cc.TargetedAction(this._btnLeft, new cc.FadeIn(0.1));
        var fadeMainText = new cc.TargetedAction(this.headerText, new cc.FadeIn(0.1));
        var moveBtnExit = new cc.TargetedAction(this._btnExit, new cc.MoveTo(0.1, 980, 740));

        var seq = new cc.Sequence(
            fadeScene,
            pd.delegate.context == pd.Delegate.CONTEXT_PORTAL ? new cc.TintTo(0.3, 225, 105, 10) : new cc.TintTo(0.3, 101, 167, 228),
            new cc.Spawn(moveBackground01, moveBackground02, moveBackground03),
            new cc.Spawn(fadeName, fadeBtnRight, fadeBtnLeft, fadeMainText),
            new cc.CallFunc(this._updateIndicators, this),
            moveBtnExit,
            new cc.CallFunc(this._showPage, this)
        );

        this.runAction(seq);
    },

    /**
     * Atualiza os componentes da interface após a setagem da variável _isControlEnabled
     * @param enabled
     */
    setControlEnabled: function(enabled) {
        this._isControlEnabled = enabled;
    },

    /**
     * Inicializa as posições-base dos objetos tweenáveis.
     * @private
     * @returns {Boolean} - indica se o status já estava atualizado.
     */
    _checkDisplayStates: function() {
        if(this._tweenableObjects[0].displayState)
            return false;

        for(var i in this._tweenableObjects) {
            this._tweenableObjects[i].displayState = {x: this._tweenableObjects[i].x, y: this._tweenableObjects[i].y};
        }
        return true;
    },

    /**
     * Verifica se um ponto (x,y) está contido dentro do bounding box de um botão.
     * @param _x {int}
     * @param _y {int}
     * @param tolerance {int=}
     * @returns {Boolean}
     */
    isInside: function(_button, _x, _y, tolerance) {
        return cc.rectIntersectsRect(cc.rect(_x, _y, tolerance || 1, tolerance || 1), _button.getBoundingBox());
    },

    /**
     * Manipula a inicialização do swipe.
     * @param e {Object}
     * @private
     */
    _onSwipeBegin: function(e) {
        if(!this._isControlEnabled || this.isInside(this._btnLeft, e.getLocation().x, e.getLocation().y, 1) || this.isInside(this._btnRight, e.getLocation().x, e.getLocation().y, 1))
            return;

        const x = e.getLocation().x;
        this._swipeInitialX = x;
        this._accumulatedX = 0;
        this._checkDisplayStates();
        this._isSwiping = true;
    },

    /**
     * Manipula a movimentação do swipe.
     * @param e {Object}
     * @private
     */
    _onSwipeMove: function(e) {
        if(this._isSwiping) {
            const x = e.getLocation().x;

            const dx = x - this._swipeInitialX;
            this._swipeInitialX = x;
            this._accumulatedX += dx;

            var divider = 1;
            if((this._accumulatedX > 0 && this._currentPage == 0) || (this._accumulatedX < 0 && this._currentPage == pd.delegate.activeNamespace.tutoriais.length - 1)) {
                divider = 2;
            }

            this._bgLayers[2].x = this._bgLayers[2].displayState.x + this._accumulatedX/divider;
            this.headerText.x = this.headerText.displayState.x + this._accumulatedX/divider;
            this._activeLayer.x = this._accumulatedX/divider;

            if(Math.abs(this._accumulatedX) > 430 && divider == 1)
                this._onSwipeFinish();
        }
    },

    /**
     * Manipula a finalização do swipe.
     * @param e {Object}
     * @private
     */
    _onSwipeFinish: function(e) {
        if(this._isSwiping) {
            this._isSwiping = false;
            if (this._accumulatedX > 100 && this._currentPage > 0) {
                this._onPreviousPage(this, false);
            }
            else if (this._accumulatedX < -100 && this._currentPage < pd.delegate.activeNamespace.tutoriais.length - 1) {
                this._onNextPage(this, false);
            }
            else {
                this._onSwipeCancel();
            }
        }
    },

    /**
     * Reseta a página atual após o cancelamento de um swipe.
     * @private
     */
    _onSwipeCancel: function() {
        this.setControlEnabled(false);
        this._bgLayers[2].runAction(cc.moveTo(0.1, this._bgLayers[2].displayState.x, this._bgLayers[2].y).easing(cc.easeSineOut()));
        this.headerText.runAction(cc.moveTo(0.1, this.headerText.displayState.x, this.headerText.y).easing(cc.easeSineOut()));
        this._activeLayer.runAction(cc.sequence(
            cc.moveTo(0.1, 0, this._activeLayer.y).easing(cc.easeSineOut()),
            cc.callFunc(function() {
                this.setControlEnabled(true);
            }, this)
        ));
    },

    /**
     * Esconde a página atual e mostra a próxima.
     * @private
     */
    _onPageSwitch:function() {
        this.setControlEnabled(false);
        this._updateIndicators();

        this._activeLayer.stopAllActions();
        this._activeLayer.runAction(cc.sequence(
            cc.moveTo(0.25, this._activeLayer.x + this._slideDirection*pd.Tutorial.PAGE_SPACING, this._activeLayer.y - 50).easing(cc.easeSineIn()),
            cc.delayTime(0.25),
            cc.callFunc(this._onPageHidden, this, this._activeLayer)
        ));

        this._title.runAction(cc.jumpTo(0.3, this._title.x, this._title.y, 30, 1));
        this._extraBgLayer.x = this._bgLayers[2].x;
        this._extraBgLayer.y = this._bgLayers[2].y;

        this._extraBgLayer.runAction(cc.moveTo(
            0.25,
            this._bgLayers[2].displayState.x + this._slideDirection*pd.Tutorial.PAGE_SPACING,
            this._bgLayers[2].displayState.y
        ).easing(cc.easeSineIn()));

        this._showPage(this, true);
    },

    /**
     * Deleta a layer anterior após ela ser removida da tela.
     * @param caller {cc.Node}
     * @param oldLayer {pd.TutorialLayer}
     * @private
     */
    _onPageHidden: function(caller, oldLayer) {
        if(oldLayer) {
            oldLayer.setStatus(false);
            oldLayer.removeFromParent();
        }
    },

    /**
     * Mostra a próxima página.
     * @param caller {pd.Tutorial}
     * @param shouldAnimate {Boolean}
     * @private
     */
    _showPage:function(caller, shouldAnimate) {
        this._checkDisplayStates();
        this.setControlEnabled(true);

        this._activeLayer = pd.delegate.activeNamespace.tutoriais[this._currentPage];
        const newLayer = this._activeLayer;

        if(!newLayer._initialPosition)
            newLayer._initialPosition = {x:this._activeLayer.x, y:this._activeLayer.y};

        if(newLayer.getParent() != this)
            this.addChild(newLayer, 5);

        newLayer.cleanup();
        newLayer.setStatus(false);
        newLayer.setPosition(newLayer._initialPosition.x, newLayer._initialPosition.y);
        newLayer.attr({opacity:shouldAnimate ? 255 : 0, x:shouldAnimate ? newLayer.x-this._slideDirection*pd.Tutorial.PAGE_SPACING : newLayer.x});
        newLayer.runAction(cc.sequence(
            cc.spawn(cc.moveTo(0.25, shouldAnimate ? newLayer.x + this._slideDirection*pd.Tutorial.PAGE_SPACING : newLayer.x, newLayer._initialPosition.y), cc.fadeIn(0.2)).easing(cc.easeSineOut()),
            cc.callFunc(this._onPageShown, this))
        );

        for(var i in this._tweenableObjects) {
            var node = this._tweenableObjects[i];
            node.cleanup();
            node.x = node.displayState.x - this._slideDirection*pd.Tutorial.PAGE_SPACING;
            node.y = node.displayState.y;
            node.runAction(cc.moveTo(0.25, node.displayState.x, node.y).easing(cc.easeSineOut()));
        }
    },

    /**
     * Finaliza o processo de exibição da página atual.
     * @private
     */
    _onPageShown:function() {
        this._activeLayer.setStatus(true);
    },
    
    /**
     * Exibe a próxima página.
     * @param caller {cc.Node}
     * @param isCallerPressed {Boolean}
     * @private
     */
    _onNextPage:function(caller, isCallerPressed){
        if(caller.isVisible() && this._isControlEnabled && !isCallerPressed){
            pd.audioEngine.playEffect(pd.resLoad.fx_swish);
            var totalPages = pd.delegate.activeNamespace.tutoriais.length -1;
            
            if(this._currentPage >= totalPages)
                return;
            
            this._currentPage++;
            this._btnLeft.setVisible(true);
            if(this._currentPage == totalPages)
                this._btnRight.setVisible(false);
            this._slideDirection = -1;
            this._onPageSwitch();
        }
    },

    /**
     * Exibe a página anterior.
     * @param caller {cc.Node}
     * @param isCallerPressed {Boolean}
     * @private
     */
    _onPreviousPage:function(caller,isCallerPressed){
        if(caller.isVisible() && this._isControlEnabled && !isCallerPressed){
            pd.audioEngine.playEffect(pd.resLoad.fx_swish);

            if(this._currentPage <= 0)
                return;

            this._currentPage--;
            this._btnRight.setVisible(true);
            if(this._currentPage == 0)
                this._btnLeft.setVisible(false);
            this._slideDirection = 1;
            this._onPageSwitch();
        }
    },

    /**
     * Atualiza as bolinhas da UI.
     * @private
     */
    _updateIndicators:function(){
        for(var i = 0; i < this._indicators.length; i++) {
            this._indicators[i].cleanup();
            this._indicators[i].setScale(1);
            this._indicators[i].setOpacity(200);

            if(i == this._currentPage) {
                this._indicators[i].runAction(cc.sequence(
                    cc.scaleTo(0.2, 2, 2).easing(cc.easeSineIn()),
                    cc.spawn(cc.scaleTo(0.2, 1.5, 1.5).easing(cc.easeBackOut()), cc.fadeIn(0.1))
                ));
            }
        }
    },

    /**
     * Fecha a janela.
     * @param caller {cc.Node}
     * @param isCallerPressed {Boolean}
     * @private
     */
    _onCloseButton:function(caller, isCallerPressed){
        if (isCallerPressed == true) 
            return;

        caller.cleanup();
        pd.audioEngine.playEffect(pd.res.fx_escrever);
        this.setControlEnabled(false);

        const destroySequence = [];
        const slideTime = 0.3;

        for (var n = 0; n < this.getChildrenCount(); n++) {
            var extraTime = 0;
            if(this._bgLayers.lastIndexOf(this.children[n]) != -1)
                extraTime = (2 - this._bgLayers.lastIndexOf(this.children[n]))*0.05 + 0.1;

            destroySequence.push(cc.targetedAction(this.children[n], cc.moveBy(slideTime + extraTime, 0, -800).easing(new cc.easeSineIn())));
        }

        const actions = [];

        actions.push(
            cc.spawn(
                cc.spawn(destroySequence),
                cc.sequence(
                    cc.delayTime(slideTime - 0.1),
                    cc.fadeOut(0.5),
                    cc.callFunc(function() {
                        this._activeLayer.setStatus(false);
                        this._activeLayer.removeFromParent();
                        this._handler.onResume();
                    }, this)
                )
            ),
            cc.targetedAction(this, cc.removeSelf())
        );

        this.runAction(cc.sequence(actions));
    }
});

/**
 * Seta o offset em Y adicionado à posiçao dos textos inferiores.
 * @static
 * @function
 * @param {Number} offset
 */
pd.Tutorial.setBottomTextOffset = function(offset) {
    pd.delegate.activeNamespace.tutoriais.txtOffSetY = offset;
};

/**
 * Seta a imagem ou texto do objetivo do tutorial
 * @param headerSpriteFrameOrText {cc.SpriteFrame|cc.LabelTTF}
 */
pd.Tutorial.setHeader = function(headerSpriteFrameOrText) {
    pd.delegate.activeNamespace.tutoriais.txt_objetivo = headerSpriteFrameOrText;
};

/**
 * @constant
 * @type {number}
 */
pd.Tutorial.PAGE_SPACING = 1800;