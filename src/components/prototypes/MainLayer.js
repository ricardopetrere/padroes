/**
 * Created by Ryan Balieiro on 12/09/17.
 * @class
 * @extends {cc.Layer}
 * @classdesc Classe-base para implementar layers de Main Menu.
 */
pd.MainLayer = cc.Layer.extend({/**@lends pd.MainLayer#**/

    /**
     * Botão de jogar.
     * @type {*}
     */
    _playBtn:null,

    /**
     * Botão de instruções.
     * @type {*}
     */
    _tutorialBtn:null,

    /**
     * Indica se a interação com o mouse está liberada.
     * @type {Boolean}
     */
    _mouseEnabled:true,

    /**
     * Protótipo do objeto de cena a ser criado e navegado para ao pressionar o botão de jogar.
     */
    _gameScenePrototype:null,

    /**
     * A função de transição a ser executada para a navegação à Game Scene.
     */
    _gameSceneTransitionFunction: null,

    /**
     * Aponta para o botão apertado.
     * @type {*}
     */
    _pressedButton:null,

    /**
     * Indica o delay, em segundos, ao abrir a opção do botão Play após ele ser clicado.
     * @type {Number}
     */
    _delayBeforeOpeningPlayOption:0,

    /**
     * Indica o delay, em segundos, ao abrir a opção do botão Tutorial após ele ser clicado.
     * @type {Number}
     */
    _delayBeforeOpeningTutorialOption:0,

    /**
     * Indica a duração da transição.
     * @type {Number}
     */
    _transitionDuration:0,

    /**
     * Seta os botões do menu.
     * @param {*} playBtn - Botão de jogar.
     * @param {*} tutorialBtn - Botão de instruções.
     * @param {Object} gameScenePrototype - Protótipo do objeto de cena a ser criado e navegado para ao pressionar o botão de jogar.
     * @param {Function} [gameSceneTransitionFunction=FadeTransition] - A função de transição a ser executada para a navegação à Game Scene. Utilizar as funções pré-setadas do Transitions.js.
     * @param {Number} [transitionDuration=0.5] - Indica o delay, em segundos, ao abrir a opção do botão após ele ser clicado.
     */
    config: function(playBtn, tutorialBtn, gameScenePrototype, gameSceneTransitionFunction, transitionDuration) {
        this._playBtn = playBtn;
        this._tutorialBtn = tutorialBtn;
        this._transitionDuration = transitionDuration || 0.5;
        this._gameSceneTransitionFunction = gameSceneTransitionFunction;
        this._decorateButton(this._playBtn);
        this._decorateButton(this._tutorialBtn);
        this._gameScenePrototype = gameScenePrototype;
        this.activate();
    },

    /**
     * @param {Number} delayBeforeOpeningPlayOption - Indica o delay, em segundos, ao abrir a opção do botão Play após ele ser clicado.
     * @param {Number} [delayBeforeOpeningTutorialOption] - Indica o delay, em segundos, ao abrir a opção do botão Tutorial após ele ser clicado.
     */
    setDelayBeforeOpeningButtonOption: function(delayBeforeOpeningPlayOption, delayBeforeOpeningTutorialOption) {
        this._delayBeforeOpeningPlayOption = delayBeforeOpeningPlayOption;
        this._delayBeforeOpeningTutorialOption = delayBeforeOpeningTutorialOption || delayBeforeOpeningPlayOption;
    },

    /**
     * Adiciona os decorators necessários aos botões.
     * @param button
     * @private
     */
    _decorateButton: function(button) {
        pd.decorate(button, pd.decorators.ClickableNode);
        pd.decorate(button, pd.decorators.ResetableNode);
        button.saveDisplayState();
        button.cacheCollisionData();
    },

    /**
     * Ativa o menu.
     */
    activate: function() {
        if(!this._playBtn || !this._tutorialBtn)
            throw new Error("Defina os botões de jogar e tutorial antes de ativar a layer!");
        pd.inputManager.add(pd.InputManager.Events.MOUSE_DOWN, this, this._onMouseDown);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_MOVE, this, this._onMouseMove);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_UP, this, this._onMouseUp);
    },

    /**
     * Desativa o menu.
     */
    deactivate: function() {
        pd.inputManager.remove(pd.InputManager.Events.MOUSE_DOWN, this, this._onMouseDown);
        pd.inputManager.remove(pd.InputManager.Events.MOUSE_MOVE, this, this._onMouseMove);
        pd.inputManager.remove(pd.InputManager.Events.MOUSE_UP, this, this._onMouseUp);
    },

    /**
     * @param {Object} event
     * @private
     */
    _onMouseDown: function(event) {
        if(this._pressedButton || !this._mouseEnabled)
            return;

        const locationX = event.getLocationX();
        const locationY = event.getLocationY();

        if(this._playBtn.isInside(locationX, locationY, 1) == true) {
            this._pressedButton = this._playBtn;
        }
        else if(this._tutorialBtn.isInside(locationX, locationY, 1) == true) {
            this._pressedButton = this._tutorialBtn;
        }

        if(this._pressedButton) {
            this.onButtonDown(this._pressedButton);
            this._pressedButton._isInsideMouseLocation = true;
        }
    },

    /**
     * @param {Object} event
     * @private
     */
    _onMouseMove: function(event) {
        if(!this._pressedButton || !this._mouseEnabled)
            return;

        const locationX = event.getLocationX();
        const locationY = event.getLocationY();
        const isInside = this._pressedButton.isInside(locationX, locationY, 1);

        if(isInside && !this._pressedButton._isInsideMouseLocation) {
            this.onButtonDown(this._pressedButton);
            this._pressedButton._isInsideMouseLocation = true;
        }
        else if(!isInside && this._pressedButton._isInsideMouseLocation) {
            this.onButtonUp(this._pressedButton);
            this._pressedButton._isInsideMouseLocation = false;
        }
    },

    /**
     * @param {Object} event
     * @private
     */
    _onMouseUp: function(event) {
        if(!this._pressedButton || !this._mouseEnabled)
            return;

        const locationX = event.getLocationX();
        const locationY = event.getLocationY();

        if(this._pressedButton.isInside(locationX, locationY, 1)) {
            this.onButtonPress(this._pressedButton);
            this._onSelect(this._pressedButton);
        }
        else {
            this.onButtonUp(this._pressedButton);
            this._pressedButton = null;
        }
    },

    /**
     * @private
     */
    _onSelect: function() {
        const sequenceSteps = [];
        var delay = (this._pressedButton == this._playBtn ? this._delayBeforeOpeningPlayOption : this._delayBeforeOpeningTutorialOption);
        if(delay)
            sequenceSteps.push(cc.delayTime(delay));
        sequenceSteps.push(cc.callFunc(this._onSelectionReady, this));
        this.runAction(new cc.Sequence(sequenceSteps));
        this._mouseEnabled = false;
    },

    /**
     * Finaliza a seleção de um botão.
     * @private
     */
    _onSelectionReady: function() {
        if(this._pressedButton == this._playBtn && this._gameScenePrototype) {
            if(!this._gameSceneTransitionFunction)
                this._transitionDuration = 0;

            pd.changeScene(new this._gameScenePrototype(), this._transitionDuration, this._gameSceneTransitionFunction);
        }
        else if(this._pressedButton == this._tutorialBtn) {
            const tutorial = new pd.Tutorial(this.getParent());
        }

        this._mouseEnabled = true;
        this._pressedButton = null;
    },

    /**
     * Recebe um botão e muda seu status para pressionado.
     * Sobescrever esta função para alterar o comportamento do feedback de seleção de um botão.
     * @param {*} button
     */
    onButtonDown: function(button) {
        button.setScale(button.displayState.scaleX * 0.85, button.displayState.scaleY * 0.85);
    },

    /**
     * Recebe um botão e muda seu status para solto.
     * Sobescrever esta função para alterar o comportamento do feedback de desseleção de um botão.
     * @param {*} button
     */
    onButtonUp: function(button) {
        button.tweenBackToDisplayState(0.1, cc.easeSineIn);
    },

    /**
     * Recebe um botão e executa o feedback de 'aperto'.
     * Sobescrever esta função para alterar o comportamento do feedback indicado acima.
     * @param {*} button
     */
    onButtonPress: function(button) {
        pd.audioEngine.playEffect(pd.res.fx_button);
        this.onButtonUp(button);
    }
});
