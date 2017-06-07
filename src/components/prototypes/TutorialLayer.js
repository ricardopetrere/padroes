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
	 * @deprecated - utilizar this.btnArrowUp.
     */
	tecla_cima:null,
    /**
	 * @deprecated - utilizar this.btnArrowDown.
     */
	tecla_baixo:null,
    /**
	 * @deprecated - utilizar this.btnArrowLeft.
     */
	tecla_esquerda:null,
    /**
	 * @deprecated - utilizar this.btnArrowRight.
     */
	tecla_direita:null,
    /**
	 * @deprecated - utilizar this.arrowKeys.
     */
	vTeclas:null,
    /**
	 * @deprecated - utilizar this.pointer.
     */
	ponteiro:null,
	///////////////////////////////////////////////////////////

	/**
	 * Construtor padrao - informar uma string ou um sprite frame para o texto inferior (instrução da página).
	 * @constructs
	 * @param txt {String | cc.SpriteFrame}
	 */
	ctor: function(txt) {
		this._super();
		this._createBottomText(txt);
	},

    /**
	 * Cria um botão de arrow key (apenas uso interno!)
     * @param frameName {String}
     * @param posX {Number}
     * @param posY {Number}
	 * @returns {pd.Animation}
     * @private
     */
	_createArrowButton: function(frameName, posX, posY) {
		const btn = new pd.Animation();
        btn.addAnimation('normal', 1, 1, frameName);
        btn.addAnimation('pressed', 2, 2, frameName);
        btn.setPosition(posX, posY);
        this.addChild(btn, pd.ZOrders.TUTORIAL_BUTTON);
        return btn;
	},

    /**
	 * Cria as setas do teclado e adiciona-as à layer.
     * @param offset {cc.Point} - ajuste relativo da posição das teclas.
     * @returns {Array}
     */
	createArrowKeys: function(offset) {
		this.btnArrowUp = this._createArrowButton("keyUp", 0, 60);
		this.btnArrowDown = this._createArrowButton("keyDown", 0, 0);
		this.btnArrowLeft = this._createArrowButton("keyLeft", -60, 0);
		this.btnArrowRight = this._createArrowButton("keyRight", 60, 0);

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
	 * Cria o ponteiro (setinha do mouse ou mãozinha, se for mobile).
     * @param initialPosition {cc.Point}
     */
	createPointer:function(initialPosition) {
		var frameName = "mouse" in cc.sys.capabilities ? "seta_" : "dedo_";
		
		this.pointer = new pd.Animation();
		this.pointer.addAnimation('normal', 1, 1, frameName);
		this.pointer.addAnimation('pressed', 1, 2, frameName);
		this.pointer.setPosition(initialPosition.x, initialPosition.y);
		this.addChild(this.pointer, pd.ZOrders.TUTORIAL_POINTER);
		this.pointer.setAnchorPoint(0,1);
		this.pointer.initialPosition = initialPosition;

		this.ponteiro = this.pointer; //legado
	},

    /**
	 * Cria o texto inferior.
     * @param txt {String|cc.SpriteFrame}
	 * @private
     */
	_createBottomText: function(txt) {
		if(!pd.delegate.activeNamespace.tutoriais.txtOffSetY)
			pd.delegate.activeNamespace.tutoriais.txtOffSetY = 0;

		const label = pd.createText(0, 0, txt, "Calibri", 25);
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
	 * @param running {Boolean} - indica se a animação deve rodar ou não.
	 * @param [shouldResetAfterStopping=true] {Boolean}
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
	 * @param node {cc.Node}
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