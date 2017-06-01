/**
 * Created by ??? on ???.
 *
 * @class {pd.TutorialLayer}
 * @extends {cc.Layer}
 * @classdesc Classe-base para a implementação de layers de tutorial.
 */
pd.TutorialLayer = cc.Layer.extend({/**@lends pd.TutorialLayer#*/

    /**
	 * @type {pd.Animado}
     */
	btnArrowUp: null,
    /**
     * @type {pd.Animado}
     */
	btnArrowDown: null,
    /**
     * @type {pd.Animado}
     */
	btnArrowLeft:null,
    /**
     * @type {pd.Animado}
     */
	btnArrowRight:null,
    /**
     * @type {pd.Animado[]}
     */
	arrowKeys:null,
    /**
	 * @type {pd.Animado}
     */
	pointer:null,

	/**
	 * @type {Boolean}
	 */
	isActiveAndRunning:false,

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
	 * @constructs
	 * @param txt {String | cc.SpriteFrame}
	 */
	ctor: function(txt) {
		this._super();
		this.createBottomText(txt);
	},

    /**
	 * Cria um botão de arrow key.
     * @param frameName {String}
     * @param posX {Number}
     * @param posY {Number}
	 * @returns {pd.Animado}
     * @private
     */
	_createArrowButton: function(frameName, posX, posY) {
		const btn = new pd.Animado();
        btn.addAnimation('normal', 1, 1, frameName);
        btn.addAnimation('pressed', 2, 2, frameName);
        btn.setPosition(posX, posY);
        this.addChild(btn, 10);
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
	 * Cria o ponteiro (setinha do mouse).
     * @param initialPosition {cc.Point}
     */
	createPointer:function(initialPosition) {
		var frameName = "mouse" in cc.sys.capabilities ? "seta_" : "dedo_";
		
		this.pointer = new pd.Animado();
		this.pointer.addAnimation('normal', 1, 1, frameName);
		this.pointer.addAnimation('pressed', 1, 2, frameName);
		this.pointer.setPosition(initialPosition.x, initialPosition.y);
		this.addChild(this.pointer,30);
		this.pointer.setAnchorPoint(0,1);
		this.pointer.initialPosition = initialPosition;

		this.ponteiro = this.pointer; //legado
	},

    /**
	 * Cria o texto inferior.
     * @param txt {String|cc.SpriteFrame}
     */
	createBottomText: function(txt) {
		if(!pd.delegate.activeNamespace.tutoriais.txtOffSetY)
			pd.delegate.activeNamespace.tutoriais.txtOffSetY = 0;

		const label = pd.createText(0, 0, txt, "Calibri", 25);
		label.setPosition(512, 140 + pd.delegate.activeNamespace.tutoriais.txtOffSetY);
		this.addChild(label, 999);
	},

    /**
	 * Para e reseta todas as animaçoes internas.
	 * @virtual
     */
	stop: function() {
		if(this.arrowKeys){
			for(var i = 0; i < 4; i++){
				this.arrowKeys[i].changeAnimation('normal', false);
			}
		}

		if(this.pointer){
			this.pointer.changeAnimation('normal', false);
			this.pointer.x = this.pointer.initialPosition.x;
			this.pointer.y = this.pointer.initialPosition.y;
		}
	},

    /**
	 * Roda a layer vigente.
	 * @virtual.
     */
	run: function() {

	},

	/**
	 * Seta o status da layer.
	 * @param running {Boolean} - indica se a animação deve rodar ou não.
	 */
	setStatus: function(running) {
		if(this.isActiveAndRunning && running)
			return;

		this.isActiveAndRunning = running;
		if(running == true)
			this.run();
		else
			this.stop();
	},

    /**
	 * Reseta a animação da layer.
     */
	reset: function() {
		this.setStatus(false);
		this.setStatus(true);
	}
});