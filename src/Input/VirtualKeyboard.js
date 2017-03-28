pd.virtualKeyboard = cc.Layer.extend({
	sprite: null,

	ctor: function () {
		//////////////////////////////
		// 1. super init first
		this._super();
		var size = cc.winSize;
		setInput(this);
		this.vetorBotoes = [];
		//background = new cc.Sprite();
		this.initBotoes();
		return true;
	},
	initBotoes:function(){
		this.criarBotao(100, 100, "Q");
		this.criarBotao(100, 100, "W");
		this.criarBotao(100, 100, "E");
		this.criarBotao(100, 100, "R");
		this.criarBotao(100, 100, "T");
		this.criarBotao(100, 100, "Y");
		this.criarBotao(100, 100, "U");
		this.criarBotao(100, 100, "I");
		this.criarBotao(100, 100, "O");
		this.criarBotao(100, 100, "P");
		
		this.criarBotao(100, 100, "A");
		this.criarBotao(100, 100, "S");
		this.criarBotao(100, 100, "D");
		this.criarBotao(100, 100, "F");
		this.criarBotao(100, 100, "G");
		this.criarBotao(100, 100, "H");
		this.criarBotao(100, 100, "J");
		this.criarBotao(100, 100, "K");
		this.criarBotao(100, 100, "L");
		
		this.criarBotao(100, 100, "Z");
		this.criarBotao(100, 100, "X");
		this.criarBotao(100, 100, "C");
		this.criarBotao(100, 100, "V");
		this.criarBotao(100, 100, "B");
		this.criarBotao(100, 100, "N");
		this.criarBotao(100, 100, "M");
		
		this.criarBotao(100, 100, "1");
		this.criarBotao(100, 100, "2");
		this.criarBotao(100, 100, "3");
		this.criarBotao(100, 100, "4");
		this.criarBotao(100, 100, "5");
		this.criarBotao(100, 100, "6");
		this.criarBotao(100, 100, "7");
		this.criarBotao(100, 100, "8");
		this.criarBotao(100, 100, "9");
		this.criarBotao(100, 100, "0");

		botaoApagar = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('tecla_apagar.png'))
		botaoConfirma = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame('tecla_concluido.png'))
		
		for(i = 0; i < this.vetorBotoes.length; i++){
			this.addChild(this.vetorBotoes[i]);			
		}
	},
	criarBotao:function(posx, posy, v){
		pd.botao = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("tecla_" + v + ".png"));
		botao.valor = v;
		botao.isLetra = true;
		botao.setPosition(posx, posy);
		this.vetorBotoes.push(botao);
		return botao;
	},

	update: function() //Funciona normalmente
	{
	},



	onMouseDown:function (event) {

	},
	onMouseDragged:function(event) {

	},
	onMouseExited:function(event){
		this.onMouseUp(event);
	},
	onMouseUp:function (event) {
		var rect = new cc.rect(event.getLocation().x, event.getLocation().y,1,1);

	},

	onTouchesBegan: function(t, e) {
		var touch = t[0];

		this.onMouseDown(touch);
		ispressed = true;
	},

	onTouchesEnded: function(t, e) {
		//Fim do toque na tela - o indice 0 representa o primeiro toque
		var touch = t[0];
		this.onMouseUp(touch);
	},

	onTouchesMoved: function(t, e) {
		//Movimento do toque na tela - o indice 0 representa o primeiro toque
		var touch = t[0];
		this.onMouseDragged(touch);
	},
});
