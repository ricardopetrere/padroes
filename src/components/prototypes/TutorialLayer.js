/**
 * Created by ??? on ???.
 *
 * @class {pd.TutorialLayer}
 * @extends {cc.Layer}
 * @classdesc Classe base para a implementação de layers de tutorial.
 */
pd.TutorialLayer = cc.Layer.extend({/**@lends pd.TutorialLayer#*/
    /**
     * @type {pd.Animation}
     */
    accelerometer:null,
    /**
	 * @type {pd.Animation}
     */
	btnArrowUp: null,
    /**
     * @type {pd.Animation}
     */
	btnArrowDown: null,
    /**
     * @type {pd.Animation}
     */
	btnArrowLeft:null,
    /**
     * @type {pd.Animation}
     */
	btnArrowRight:null,
    /**
     * @type {pd.Animation}
     */
    btnSpace:null,
    /**
	 * Vetor com referências para todas as teclas descritas acima.
     * @type {pd.Animation[]}
     */
	arrowKeys:null,
    /**
	 * Setinha do mouse (ou dedo, se for mobile).
	 * @type {pd.Animation}
     */
	pointer:null,
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

	/////////////////// DEPRECIATIONS //////////////////////
    /**
	 * @deprecated - utilizar {@link pd.TutorialLayer.btnArrowUp}.
     */
	tecla_cima:null,
    /**
	 * @deprecated - utilizar {@link pd.TutorialLayer.btnArrowDown}.
     */
	tecla_baixo:null,
    /**
	 * @deprecated - utilizar {@link pd.TutorialLayer.btnArrowLeft}.
     */
	tecla_esquerda:null,
    /**
	 * @deprecated - utilizar {@link pd.TutorialLayer.btnArrowRight}.
     */
	tecla_direita:null,
    /**
	 * @deprecated - utilizar {@link pd.TutorialLayer.arrowKeys}.
     */
	vTeclas:null,
    /**
	 * @deprecated - utilizar {@link pd.TutorialLayer.pointer}.
     */
	ponteiro:null,
	///////////////////////////////////////////////////////////

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
     * Cria a animação do acelerômetro e adiciona-a à layer
     * @param {Number} posX
     * @param {Number} posY
     */
    createAccelerometer: function (posX, posY) {
        this.accelerometer = new pd.Animation();
        this.accelerometer.addAnimation('normal', 1, 1, 'accel_lateral');
        this.accelerometer.addAnimation('left', 1, 10, 'accel_lateral');
        this.accelerometer.addAnimation('right', 11, 20, 'accel_lateral');
        this.accelerometer.addAnimation('up', 1, 10, 'accel_vertical');
        this.accelerometer.addAnimation('down', 11, 20, 'accel_vertical');
        this.accelerometer.setPosition(posX, posY);
        this.addChild(this.accelerometer, pd.ZOrders.TUTORIAL_BUTTON);
    },

    /**
	 * Cria as setas do teclado e adiciona-as à layer.
     * @param offset {cc.Point} - ajuste relativo da posição das teclas.
     * @returns {Array}
     */
	createArrowKeys: function(offset) {
		this.btnArrowUp = this._createButton("keyUp", 0, 60);
		this.btnArrowDown = this._createButton("keyDown", 0, 0);
		this.btnArrowLeft = this._createButton("keyLeft", -60, 0);
		this.btnArrowRight = this._createButton("keyRight", 60, 0);

		this.arrowKeys = [this.btnArrowLeft, this.btnArrowUp, this.btnArrowRight, this.btnArrowDown];

		////////// LEGADO: ///////////////
		this.tecla_cima = this.btnArrowUp;
		this.tecla_esquerda = this.btnArrowLeft;
		this.tecla_baixo = this.btnArrowDown;
		this.tecla_direita = this.btnArrowRight;
		this.vTeclas = this.arrowKeys;
		///////////////////////////////////

		for(var i = 0; i < this.arrowKeys.length; i++) {
			this.arrowKeys[i].setScale(0.75);
			this.arrowKeys[i].x += offset.x;
			this.arrowKeys[i].y += offset.y;
		}

		return this.arrowKeys;
	},

    /**
     * Cria um botão default, podendo ou não colocar uma imagem ou texto como label.
     * @param {Number} posX
     * @param {Number} posY
     * @param {cc.Sprite|cc.LabelTTF} [sprite = null] Imagem ou LabelTTF para colocar como "texto" do botão.
     * @returns {pd.Animation}
     */
    createNakedButton: function (posX, posY, sprite) {
        var botao = this._createButton("keyNaked", posX, posY);
        if (sprite) {
            botao.label = sprite;
            botao.label.setPosition(botao.width / 2, botao.height / 2);
            botao.addChild(botao.label, pd.ZOrders.TUTORIAL_BUTTON);
        }
    },

    /**
	 * Cria o ponteiro (setinha do mouse ou mãozinha, se for mobile).
     * @param {cc.Point} initialPosition
     */
	createPointer:function(initialPosition) {
		var frameName = "mouse" in cc.sys.capabilities ? "seta_" : "dedo_";
		
		this.pointer = new pd.Animation();
		this.pointer.addAnimation('normal', 1, 1, frameName);
		this.pointer.addAnimation('pressed', 2, 2, frameName);
		this.pointer.setPosition(initialPosition.x, initialPosition.y);
		this.addChild(this.pointer, pd.ZOrders.TUTORIAL_POINTER);
		this.pointer.setAnchorPoint(0,1);
		this.pointer.initialPosition = initialPosition;

		this.ponteiro = this.pointer; //legado
	},

    /**
     * Cria a barra de espaço e adiciona-a à layer.
     * @param {Number} posX
     * @param {Number} posY
     */
    createSpaceButton: function (posX, posY) {
        this.btnSpace = this._createButton('keySpace', posX, posY);
        this.btnSpace.setScale(0.7);
    },

	/**
	 * Cria um botão (apenas uso interno!)
	 * @param {String} frameName
	 * @param {Number} posX
	 * @param {Number} posY
	 * @returns {pd.Animation}
	 * @private
	 */
	_createButton: function(frameName, posX, posY) {
		const btn = new pd.Animation();
		btn.addAnimation('normal', 1, 1, frameName);
		btn.addAnimation('pressed', 2, 2, frameName);
		btn.setPosition(posX, posY);
		this.addChild(btn, pd.ZOrders.TUTORIAL_BUTTON);
		return btn;
	},

    /**
	 * Cria o texto inferior.
     * @param {String|cc.SpriteFrame} txt
	 * @private
     */
	_createBottomText: function(txt) {
		if(!pd.delegate.activeNamespace.tutoriais.txtOffSetY)
			pd.delegate.activeNamespace.tutoriais.txtOffSetY = 0;

		const label = pd.cText(0, 0, txt, "Calibri", 25);
		label.setPosition(512, 140 + pd.delegate.activeNamespace.tutoriais.txtOffSetY);
		this.addChild(label, pd.ZOrders.TUTORIAL_PAGE_BOTTOM_TEXT);
	},

    /**
	 * Mata e reseta todas as animaçoes dos componentes internos. <br />
	 * Sobescrever esta função para parar e resetar componentes customizados.
	 * @virtual
     */
	stop: function() {
		if(this.arrowKeys){
			for(var i = 0; i < 4; i++){
				this.arrowKeys[i].changeAndStop('normal', false);
			}
		}

		if(this.pointer){
			this.pointer.changeAndStop('normal', false);
			this.pointer.x = this.pointer.initialPosition.x;
			this.pointer.y = this.pointer.initialPosition.y;
		}
	},

    /**
	 * Roda a animação da página.
	 * @virtual.
     */
	run: function() {

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
			this._cleanAllRunningActions(this);
			this.unscheduleUpdate();
			if(shouldResetAfterStopping != false)
				this.stop();
		}
		else {
			this.run();
		}
	},

	/**
	 * Limpa todas as ações rodando na layer recursivamente.
	 * @param {cc.Node} node
	 * @private
	 */
	_cleanAllRunningActions: function(node) {
		const children = node.getChildren();

		for(var i = 0; i < children.length ; i++) {
			var child = children[i];
			if(child) {
				child.cleanup();
				this._cleanAllRunningActions(child);
			}
		}
	},

    /**
	 * Reseta a animação.
     */
	reset: function() {
		this.setStatus(false);
		this.setStatus(true);
	}
});