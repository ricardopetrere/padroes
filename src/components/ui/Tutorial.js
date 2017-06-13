/**
 * Created by ??? on ???.
 *
 * @class {pd.Tutorial}
 * @extends {cc.LayerColor}
 * @classdesc Wrapper responsável por gerenciar a layer de tutorial.
 */
pd.Tutorial = cc.LayerColor.extend({/**@lends pd.Tutorial#*/

    /**
     * Indica se os botões de UI estão liberados para serem clicados.
     * @type {Boolean}
     */
    _isControlEnabled:false,
    /**
     * Armazena o índice da página sendo exibida na tela.
     * @type {Number}
     */
    _currentPage:0,
    /**
     * Armazena uma referência para o node que está manipulando o tutorial.
     * @type {cc.Node}
     */
    _handler:null,
    /**
     * Camadas do background.
     * @type {cc.Sprite[]}
     */
    _bgLayers:null,
    /**
     * Cópia da camada branca do fundo utilizada para a transição entre páginas.
     * @type {cc.Sprite[]}
     */
    _extraBgLayer:null,
    /**
     * Logo de 'Instruções' localizado no topo da tela.
     * @type {cc.Sprite}
     */
    _title:null,
    /**
     * Botão de fechar.
     * @type {pd.Button}
     */
    _btnExit:null,
    /**
     * Botão de avançar.
     * @type {pd.Button}
     */
    _btnRight:null,
    /**
     * Botão de voltar.
     * @type {pd.Button}
     */
    _btnLeft:null,
    /**
     * Texto superior que contém o objetivo do tutorial.
     * @type {cc.Sprite|cc.LabelTTF}
     */
    headerText:null,
    /**
     * Cópia do texto superior utilizada para a transição entre páginas.
     * @type {cc.Sprite[]}
     */
    _extraHeaderText:null,
    /**
     * @type {cc.Sprite|cc.LabelTTF}
     * @deprecated - utilizar a propriedade {@link pd.Tutorial.headerText}.
     */
    texto_objetivo:null,
    /**
     * Bolinhas da parte inferior da tela.
     * @type {pd.Sprite[]}
     */
    _indicators:null,
    /**
     * Apontamento para a página atual.
     * @type {pd.TutorialLayer}
     */
    _activeLayer:null,
    /**
     * Array que armazena uma referência para todos os objetos tweenáveis durante uma transição entre duas páginas.
     * @type {cc.Node[]}
     */
    _tweenableObjects:null,
    /**
     * A direção para onde o slide está acontecendo (-1 ou 1).
     * @type {Number}
     */
    _slideDirection:0,
    /**
     * A coordenada 'x' onde ocorre o clique/toque inicial.
     * @type {Number}
     */
    _swipeInitialX:0,
    /**
     * A distância em 'x' percorrida pelo o cursor durante uma ação de swipe.
     * @type {Number}
     */
    _accumulatedX:0,
    /**
     * Indica se há uma ação de swipe ativa.
     * @type {Boolean}
     */
    _isSwiping:false,
    /**
     * Indica se há uma animação de mudança de página ativa.
     * @type {Boolean}
     */
    _isChangingPage:false,
    /**
     * Vetor local que aponta para o vetor das páginas do tutorial.
     * @type {Array}
     */
    _pages:null,

    /**
     * Construtor padrão - instancia, ativa e adiciona o tutorial ao _handler.
     * @constructs
     * @param _handler {cc.Node}
     * @param shouldPauseHandler {Boolean}
     */
    ctor:function(_handler, shouldPauseHandler) {
        this._super(new cc.Color(255, 255, 255), 1024, 768);
        this.setOpacity(0);
        this.setCascadeOpacityEnabled(true);
        this.setControlEnabled(false);

        this._handler = _handler;
        if(!(this._handler instanceof cc.Scene))
            this._handler = this._handler.getParent();

        if(!shouldPauseHandler)
            this._handler.onPause();

        this._handler.addChild(this, pd.ZOrders.TUTORIAL_LAYER);
        this._buildUI();
        this._performInitialTween();

        if(pd.Tutorial._hasInstance)
            throw new Error("[pd.Tutorial] Não é possível instanciar dois tutoriais ao mesmo tempo!");
        pd.Tutorial._hasInstance = true;

        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_DOWN, this, this._onSwipeBegin);
        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_MOVE, this, this._onSwipeMove);
        pd.inputManager.add(pd.InputManager.EVENT_MOUSE_UP, this, this._onSwipeFinish);
    },

    /**
     * Constrói os elementos de interface.
     * @private
     */
    _buildUI: function() {
        this._tweenableObjects = [];

        this._bgLayers = [
            pd.createSprite('background_01_instrucoes', 512, -500, this, 1),
            pd.createSprite('background_02_instrucoes', 512, -500, this, 2),
            pd.createSprite('layer_instrucoes', 512, -500, this, 3)
        ];
        this._extraBgLayer = pd.createSprite('layer_instrucoes', 512, -500, this, 3);
        this._tweenableObjects.push(this._bgLayers[2]);

        this._title = pd.createSprite('txt_instrucoes', 512, 730, this, 99);
        this._title.setOpacity(0);

        this._btnExit = new pd.Button(1090, 740, this, '_onCloseButton', 'btn_sair_instrucoes.png', 'btp_sair_instrucoes.png');
        this.addChild(this._btnExit, pd.ZOrders.TUTORIAL_CONTROLLER_BUTTON);

        this._btnRight = new pd.Button(987, 360, this, '_onNextPage', "btn_next_instrucoes.png", "btp_next_instrucoes.png");
        this.addChild(this._btnRight, pd.ZOrders.TUTORIAL_CONTROLLER_BUTTON);
        this._btnRight.setFlippedX(true);
        this._btnRight.setOpacity(0);
        this._btnRight.setVisible(pd.delegate.activeNamespace.tutoriais.length > 1);

        this._btnLeft = new pd.Button(37, 360, this, '_onPreviousPage', "btn_next_instrucoes.png", "btp_next_instrucoes.png");
        this.addChild(this._btnLeft, pd.ZOrders.TUTORIAL_CONTROLLER_BUTTON);
        this._btnLeft.setOpacity(0);
        this._btnLeft.setVisible(false);

        this.headerText = pd.createText(512, 660, pd.delegate.activeNamespace.tutoriais.txt_objetivo, "Calibri", 25);
        this.addChild(this.headerText, pd.ZOrders.TUTORIAL_CONTROLLER_BUTTON);
        this.headerText.setOpacity(0);
        this.texto_objetivo = this.headerText; //legado!

        this._extraHeaderText = pd.createText(512, 660, pd.delegate.activeNamespace.tutoriais.txt_objetivo, "Calibri", 25);
        this.addChild(this._extraHeaderText, pd.ZOrders.TUTORIAL_CONTROLLER_BUTTON);
        this._extraHeaderText.setOpacity(0);

        this._initPages();
        this._tweenableObjects.push(this.headerText);
    },

    /**
     * Inicializa as páginas do tutorial.
     * @private
     */
    _initPages: function() {
        this._pages = [];

        var numPages = pd.delegate.activeNamespace.tutoriais.length;
        var iniX = -(numPages/2 - 1) * 30;
        this._indicators = [];

        for(i = 0; i < numPages; i++) {
            var indicator = pd.createSprite("stage_instrucoes", 512 + iniX + i * 30, 30 + pd.delegate.activeNamespace.tutoriais.txtOffSetY, this, 50);
            indicator.setScale(0);
            this._indicators.push(indicator);

            var page = pd.delegate.activeNamespace.tutoriais[i];
            page.pageID = i;
            page.setCascadeOpacityEnabled(true);
            page.setOpacity(0);
            page.setVisible(false);
            this.addChild(page, pd.ZOrders.TUTORIAL_PAGE);
            this._pages.push(page);
        }
    },

    /**
     * Executa a tween de entrada.
     * @private
     */
    _performInitialTween: function() {
        var fadeScene = new cc.FadeIn(0.2);
        var moveBackground01 = new cc.TargetedAction(this._bgLayers[0], new cc.MoveTo(0.25, 512, 364).easing(cc.easeSineOut()));
        var moveBackground02 = new cc.TargetedAction(this._bgLayers[1], new cc.MoveTo(0.45, 512, 364).easing(cc.easeSineOut()));
        var moveBackground03 = new cc.TargetedAction(this._bgLayers[2], new cc.MoveTo(0.65, 512, 350).easing(cc.easeSineOut()));
        var fadeName = new cc.TargetedAction(this._title, new cc.FadeIn(0.1));
        var fadeBtnRight = new cc.TargetedAction(this._btnRight, new cc.FadeIn(0.1));
        var fadeBtnLeft = new cc.TargetedAction(this._btnLeft, new cc.FadeIn(0.1));
        var fadeMainText = new cc.TargetedAction(this.headerText, new cc.FadeIn(0.1));
        var moveBtnExit = new cc.TargetedAction(this._btnExit, new cc.MoveTo(0.1, 980, 740));

        var seq = new cc.Sequence(
            fadeScene,
            pd.delegate.context == pd.Delegate.CONTEXT_PORTAL ? new cc.TintTo(0.2, 225, 105, 10) : new cc.TintTo(0.2, 101, 167, 228),
            new cc.Spawn(moveBackground01, moveBackground02, moveBackground03),
            new cc.Spawn(fadeName, fadeBtnRight, fadeBtnLeft, fadeMainText),
            new cc.CallFunc(this._updateIndicators, this),
            new cc.CallFunc(this._showPage, this),
            moveBtnExit
        );

        this.runAction(seq);
    },

    /**
     * Seta o valor da propriedade _isControlEnabled.
     * @param enabled {Boolean}
     */
    setControlEnabled: function(enabled) {
        this._isControlEnabled = enabled;
    },

    /**
     * Inicializa as posições-base dos objetos tweenáveis.
     * @private
     * @returns {Boolean} - indica se a inicialização já havia sido feita.
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
     * @param tolerance {int=1}
     * @returns {Boolean}
     */
    isInside: function(_button, _x, _y, tolerance) {
        return cc.rectIntersectsRect(cc.rect(_x, _y, tolerance || 1, tolerance || 1), _button.getBoundingBox());
    },

    /**
     * Esconde a página atual e mostra a próxima. <br>
     * @private
     */
    _onPageSwitch:function() {
        this._isChangingPage = true;
        this.setControlEnabled(false);
        this._updateIndicators();

        this._activeLayer.setStatus(false, false);
        this._activeLayer.runAction(this._activeLayer._slideTween = cc.sequence(
            cc.moveTo(0.25, this._activeLayer.x + this._slideDirection*pd.Tutorial.PAGE_SPACING, this._activeLayer.y - 50).easing(cc.easeSineIn()),
            cc.delayTime(0.25),
            cc.callFunc(this._onPageHidden, this, this._activeLayer)
        ));
        pd.retain(this._activeLayer._slideTween);

        this._title.runAction(cc.jumpTo(0.3, this._title.x, this._title.y, 30, 1));

        this._extraBgLayer.cleanup();
        this._extraBgLayer.x = this._bgLayers[2].x;
        this._extraBgLayer.y = this._bgLayers[2].y;
        this._extraHeaderText.cleanup();
        this._extraHeaderText.attr({x: this.headerText.x, y: this.headerText.y, opacity:255});
        this._extraBgLayer.runAction(cc.moveTo(0.25, this._bgLayers[2].displayState.x + this._slideDirection*pd.Tutorial.PAGE_SPACING, this._bgLayers[2].displayState.y).easing(cc.easeSineIn()));
        this._extraHeaderText.runAction(cc.moveTo(0.25, this.headerText.x + this._slideDirection*pd.Tutorial.PAGE_SPACING, this.headerText.y).easing(cc.easeSineIn()));

        this._showPage(this, true);
    },

    /**
     * Desabilita a página anterior após ela ser removida da tela.
     * @param caller {cc.Node}
     * @param oldPage {pd.TutorialLayer}
     * @private
     */
    _onPageHidden: function(caller, oldPage) {
        if(oldPage) {
            oldPage.setStatus(false); //apenas uma segurança a mais!
            oldPage.setVisible(false);
        }
    },

    /**
     * Mostra a página para qual o usuário navegou.
     * @param caller {pd.Tutorial}
     * @param shouldAnimate {Boolean}
     * @private
     */
    _showPage:function(caller, shouldAnimate) {
        this._checkDisplayStates();
        this.setControlEnabled(true);

        this._activeLayer = this._pages[this._currentPage];
        const newLayer = this._activeLayer;

        newLayer.setVisible(true);
        newLayer.setPosition(0, 0);
        if(!newLayer._initialPosition)
            newLayer._initialPosition = {x:this._activeLayer.x, y:this._activeLayer.y};

        newLayer.setStatus(false);
        newLayer.setPosition(newLayer._initialPosition.x, newLayer._initialPosition.y);
        newLayer.attr({opacity:shouldAnimate ? 255 : 0, x:shouldAnimate ? newLayer.x-this._slideDirection*pd.Tutorial.PAGE_SPACING : newLayer.x});
        if (newLayer._slideTween)
            newLayer.stopAction(newLayer._slideTween);
        newLayer.runAction(newLayer._slideTween = cc.sequence(
            cc.spawn(cc.moveTo(0.25, shouldAnimate ? newLayer.x + this._slideDirection*pd.Tutorial.PAGE_SPACING : newLayer.x, newLayer._initialPosition.y), cc.fadeIn(0.2)).easing(cc.easeSineOut()),
            cc.callFunc(this._onPageShown, this))
        );
        pd.retain(newLayer._slideTween);

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
        this._isChangingPage = false;
        this._pages[this._currentPage].setStatus(true);
    },
    
    /**
     * Tweena para a página posterior à página atual.
     * @param caller {cc.Node}
     * @param isCallerPressed {Boolean}
     * @param isSwiping {Boolean}
     * @private
     */
    _onNextPage:function(caller, isCallerPressed, isSwiping){
        if(caller.isVisible() && this._isControlEnabled && !isCallerPressed && (!this._isChangingPage  || isSwiping)){
            pd.audioEngine.playEffect(pd.resLoad.fx_swish);
            var totalPages = this._pages.length -1;
            
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
     * Tweena para a página anterior à página atual.
     * @param caller {cc.Node}
     * @param isCallerPressed {Boolean}
     * @param isSwiping {Boolean}
     * @private
     */
    _onPreviousPage:function(caller,isCallerPressed, isSwiping){
        if(caller.isVisible() && this._isControlEnabled && !isCallerPressed && (!this._isChangingPage || isSwiping)){
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
     * Manipula a inicialização de uma ação de swipe.
     * @param e {Object}
     * @private
     */
    _onSwipeBegin: function(e) {
        if(!this._isControlEnabled || Math.abs(this._activeLayer.x) > 430 || this.isInside(this._btnLeft, e.getLocationX(), e.getLocationY(), 1) || this.isInside(this._btnRight, e.getLocationX(), e.getLocationY(), 1))
            return;

        const x = e.getLocationX();
        this._swipeInitialX = x;
        this._accumulatedX = this._activeLayer.x;

        if (this._activeLayer._slideTween)
            this._activeLayer.stopAction(this._activeLayer._slideTween);
        this._bgLayers[2].cleanup();
        this.headerText.cleanup();

        this._checkDisplayStates();
        this._isSwiping = true;
    },

    /**
     * Manipula a movimentação da ação de swipe em andamento, se houver.
     * @param e {Object}
     * @private
     */
    _onSwipeMove: function(e) {
        if(this._isSwiping) {
            const x = e.getLocationX();

            const dx = x - this._swipeInitialX;
            this._swipeInitialX = x;
            this._accumulatedX += dx;

            var divider = 1;
            if((this._accumulatedX > 0 && this._currentPage == 0) || (this._accumulatedX < 0 && this._currentPage == this._pages.length - 1)) {
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
     * Manipula a finalização da ação de swipe em andamento, se houver.
     * @param e {Object}
     * @private
     */
    _onSwipeFinish: function(e) {
        if(this._isSwiping) {
            this._isSwiping = false;
            if (this._accumulatedX > 100 && this._currentPage > 0) {
                this._onPreviousPage(this, false, true);
            }
            else if (this._accumulatedX < -100 && this._currentPage < this._pages.length - 1) {
                this._onNextPage(this, false, true);
            }
            else {
                this._onSwipeCancel();
            }
        }
    },

    /**
     * Reseta o posicionamento da página atual após o cancelamento de um swipe.
     * @private
     */
    _onSwipeCancel: function() {
        this.setControlEnabled(false);
        this._bgLayers[2].runAction(cc.moveTo(0.1, this._bgLayers[2].displayState.x, this._bgLayers[2].y).easing(cc.easeSineOut()));
        this.headerText.runAction(cc.moveTo(0.1, this.headerText.displayState.x, this.headerText.y).easing(cc.easeSineOut()));
        this._activeLayer.runAction(this._activeLayer._slideTween = cc.sequence(
            cc.moveTo(0.1, 0, this._activeLayer.y).easing(cc.easeSineOut()),
            cc.callFunc(function() {
                this.setControlEnabled(true);
            }, this)
        ));
        pd.retain(this._activeLayer._slideTween);
    },

    /**
     * Atualiza as bolinhas (indicadores de página) após a troca de uma página.
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
     * Fecha o tutorial.
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
            cc.spawn(cc.spawn(destroySequence), cc.sequence(
                cc.delayTime(slideTime - 0.1),
                cc.fadeOut(0.5),
                cc.callFunc(this._onDestroy, this)
            )),
            cc.targetedAction(this, cc.removeSelf())
        );

        this.runAction(cc.sequence(actions));
    },

    /**
     * Finaliza o processo de fechamento do tutorial.
     * @private
     */
    _onDestroy: function() {
        this._activeLayer.setStatus(false);
        for(var i = 0; i < this._pages.length; i++) {
            var page = this._pages[i];
            page.removeFromParent();
        }
        this._handler.onResume();
        pd.Tutorial._hasInstance = false;
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

/**
 * Indica se há uma instância ativa do tutorial.
 * @type {boolean}
 * @private
 */
pd.Tutorial._hasInstance = false;