/**
 * Created by Ryan Balieiro on 24/08/17.
 * @class {pd.TutorialLayer}
 * @extends {cc.Layer}
 * @classdesc Classe base para a implementação de layers de tutorial.
 */
pd.TutorialLayer = cc.Layer.extend({/**@lends pd.TutorialLayer#*/
	/**
	 * @type {pd.ArrowKeys}
	 */
	arrowKeys:null,
	/**
	 * @type {pd.Pointer}
	 */
	pointer:null,
	/**
	 * @type {pd.Joystick}
	 */
	joystick:null,
	/**
	 * @type {pd.Tablet}
	 */
	tablet:null,
	/**
	 * @type {pd.Button}
	 */
	spaceBar:null,
	/**
	 * Indica se a página está sendo exibida pelo tutorial e sua animação respecitva está rodando.
	 * @type {Boolean}
	 */
	isActiveAndRunning:false,
	/**
	 * Índice da página (não setar manualmente!).
	 * @type {Number}
	 */
	pageID:-1,

	/**
	 * Construtor padrao - informar uma string ou um sprite frame para o texto inferior (instrução da página).
	 * @constructs
	 * @param {String|cc.SpriteFrame} txt
	 */
	ctor: function(txt) {
		this._super();
		this._createBottomText(txt);
	},

	/**
	 * Cria, configura e adiciona um feedback de input na layer de tutorial.
	 * @param {pd.TutorialLayer.InputFeedbacks} feedbackType
	 * @param {Number} posX - posição em X.
	 * @param {Number} posY - posição em Y.
	 * @param {cc.Node} [container=null] - o node em que o feedback será adicionado. Se for null, o feedback será adicionado ao 'this'.
	 * @returns {cc.Node}
	 */
	_createInputFeedback: function(feedbackType, posX, posY, container) {
		switch(feedbackType) {
			case pd.TutorialLayer.InputFeedbacks.POINTER:
				this.pointer = new pd.Pointer();
				this.pointer.setPosition(posX, posY);
				this.pointer.saveDisplayState();
				break;
			case pd.TutorialLayer.InputFeedbacks.TABLET:
				this.tablet = new pd.Tablet();
				this.tablet.setPosition(posX, posY);
				break;
			case pd.TutorialLayer.InputFeedbacks.ARROW_KEYS:
				this.arrowKeys = new pd.ArrowKeys(true, true, true, true, {x:posX, y:posY}, false);
				for(var i in this.arrowKeys.keys)
					this.arrowKeys.keys[i].setDisabledOpacity(255);
				break;
			case pd.TutorialLayer.InputFeedbacks.JOYSTICK:
				this.joystick = new pd.Joystick({x:posX, y:posY}, false, false);
				this.joystick.setColor(cc.color(255, 0, 0));
				break;
			case pd.TutorialLayer.InputFeedbacks.SPACE_BAR:
				this.spaceBar = new pd.Button("keySpace0001.png", "keySpace0002.png", {x:posX, y:posY}, 1, false);
				break;
		}

		const node = this[feedbackType];
		container = container || this;
		node.setScale(1/container.scaleX, 1/container.scaleY);
		container.addChild(node);
		return node;
	},

	/**
	 * Cria o ponteiro/mãozinha.
	 * @param {Number} posX - posição em X.
	 * @param {Number} posY - posição em Y.
	 * @param {cc.Node} [container=null] - o node em que o feedback será adicionado. Se for null, o feedback será adicionado ao 'this'.
	 * @returns {pd.Pointer}
	 */
	createPointer: function(posX, posY, container) {
		this._createInputFeedback(pd.TutorialLayer.InputFeedbacks.POINTER, posX, posY, container);
	},

	/**
	 * Cria as arrow keys.
	 * @param {Number} posX - posição em X.
	 * @param {Number} posY - posição em Y.
	 * @param {cc.Node} [container=null] - o node em que o feedback será adicionado. Se for null, o feedback será adicionado ao 'this'.
	 * @returns {pd.ArrowKeys}
	 */
	createArrowKeys: function(posX, posY, container) {
		this._createInputFeedback(pd.TutorialLayer.InputFeedbacks.ARROW_KEYS, posX, posY, container);
	},

	/**
	 * Cria o tablet para feedbacks de acelerômetro.
	 * @param {Number} posX - posição em X.
	 * @param {Number} posY - posição em Y.
	 * @param {cc.Node} [container=null] - o node em que o feedback será adicionado. Se for null, o feedback será adicionado ao 'this'.
	 * @returns {pd.Tablet}
	 */
	createTablet: function(posX, posY, container) {
		this._createInputFeedback(pd.TutorialLayer.InputFeedbacks.TABLET, posX, posY, container);
	},

	/**
	 * Cria o joystick.
	 * @param {Number} posX - posição em X.
	 * @param {Number} posY - posição em Y.
	 * @param {cc.Node} [container=null] - o node em que o feedback será adicionado. Se for null, o feedback será adicionado ao 'this'.
	 * @returns {pd.Joystick}
	 */
	createJoystick: function(posX, posY, container) {
		this._createInputFeedback(pd.TutorialLayer.InputFeedbacks.JOYSTICK, posX, posY, container);
	},

	/**
	 * Cria a barra de espaço.
	 * @param {Number} posX - posição em X.
	 * @param {Number} posY - posição em Y.
	 * @param {cc.Node} [container=null] - o node em que o feedback será adicionado. Se for null, o feedback será adicionado ao 'this'.
	 * @returns {pd.Joystick}
	 */
	createSpaceBar: function(posX, posY, container) {
		this._createInputFeedback(pd.TutorialLayer.InputFeedbacks.SPACE_BAR, posX, posY, container);
	},

	/**
	 * Seta o status da layer.
	 * @param {Boolean} running - indica se a animação deve rodar ou não.
	 * @param {Boolean} [shouldResetAfterStopping=true]
	 */
	setStatus: function(running, shouldResetAfterStopping) {
		if(running && this.isActiveAndRunning) {
			return;
		}

		this.isActiveAndRunning = running;
		if(!this.isActiveAndRunning) {
			this.cleanup();
			pd.cleanAllRunningActions(this);
			this.unscheduleUpdate();
			if(shouldResetAfterStopping != false)
				this.stop();
		}
		else {
			this.run();
		}
	},

	/**
	 * Mata e reseta todas as animaçoes dos componentes internos. <br />
	 * Sobescrever esta função para parar e resetar componentes customizados.
	 * @virtual
	 */
	stop: function() {
		if(this.pointer) {
			this.pointer.cleanup();
			this.pointer.loadDisplayState();
			this.pointer.setAsReleased();
		}

		if(this.arrowKeys) {
			this.arrowKeys.cleanup();
			for(var i in this.arrowKeys.keys) {
				var key = this.arrowKeys.keys[i];
				key.cleanup();
				key.setPressed(false);
			}
		}

		if(this.tablet) {
			this.tablet.cleanup();
			this.tablet.changeAndStop('normal');
		}

		if(this.joystick) {
			this.joystick.resetPad();
		}
	},

	/**
	 * Roda a animação da página.
	 * @virtual.
	 */
	run: function() {},

	/**
	 * Reseta a animação.
	 */
	reset: function() {
		this.setStatus(false);
		this.setStatus(true);
	},

	/**
	 * Cria o texto inferior.
	 * @param {String|cc.SpriteFrame} txt
	 * @private
	 */
	_createBottomText: function(txt) {
		if(!pd.delegate.activeNamespace.tutorialData.txtOffSetY)
			pd.delegate.activeNamespace.tutorialData.txtOffSetY = 0;

		const label = pd.cText(0, 0, txt, "Calibri", 25);
		label.setPosition(512, 140 + pd.delegate.activeNamespace.tutorialData.txtOffSetY);
		this.addChild(label, pd.ZOrders.TUTORIAL_PAGE_BOTTOM_TEXT);
	},

	/**
	 * @param {Number} x
	 * @param {Number} y
	 * @param {String|cc.SpriteFrame} txt
	 * @param {String} font
	 * @param {Number} size
	 * @returns {*}
	 * @private
	 */
	_getText: function(x, y, txt, font, size) {
		if (typeof txt == "string") {
			var text = new cc.LabelTTF(txt, font, size);
			text.setFontFillColor(new cc.Color(0, 0, 0));
		}
		else {
			text = new cc.Sprite(txt);
		}
		text.setPosition(x, y);
		text.setAnchorPoint(0.5, 1);
		return text;
	}
});

/**
 * Nodes que contém feedback de inputs.
 * @enum {String}
 */
pd.TutorialLayer.InputFeedbacks = {
	POINTER		: 	"pointer",
	JOYSTICK	: 	"joystick",
	ARROW_KEYS	: 	"arrowKeys",
	TABLET		: 	"tablet",
	SPACE_BAR	:	"spaceBar"
};