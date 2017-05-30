var audioTutorial = null;

pd.TutorialScene = cc.LayerColor.extend({
	ctor:function(caller, p){
		this._super(new cc.Color(255, 255, 255), 1024, 768);
		this.setOpacity(0);
		this.setCascadeOpacityEnabled(true);
		this.isControlEnabled = true;
		this.tutorialIndex = 0;
		this.layerPai = caller;
		if(!(this.layerPai instanceof cc.Scene))
			this.layerPai = this.layerPai.getParent();

		if(!p)
			this.layerPai.onPause();
		
		this.layerPai.addChild(this, 99999);

		//Background
		this.background_01 = pd.cObject('background_01_instrucoes', 512, -500, this, 1);
		this.background_02 = pd.cObject('background_02_instrucoes', 512, -500, this, 2);
		this.background_03 = pd.cObject('layer_instrucoes', 512, -500, this, 3);
		
		this.instru_logo = pd.cObject('txt_instrucoes', 512, 730, this, 99);
		this.instru_logo.setOpacity(0);
		
		//botoes
		this.btn_exit = new pd.Button(1090, 740, this, 'exitFunc', 'btn_sair_instrucoes.png', 'btp_sair_instrucoes.png');
		this.addChild(this.btn_exit, 99);
		
		this.btn_dir = new pd.Button(987, 360, this, 'proxFunc', "btn_next_instrucoes.png", "btp_next_instrucoes.png");
		this.addChild(this.btn_dir, 99);
		this.btn_dir.setFlippedX(true);
		this.btn_dir.setOpacity(0);
		this.btn_dir.setVisible(pd.delegate.activeNamespace.tutoriais.length>1);
		
		this.btn_esq = new pd.Button(37, 360, this, 'antFunc', "btn_next_instrucoes.png", "btp_next_instrucoes.png");
		this.addChild(this.btn_esq, 99);
		this.btn_esq.setOpacity(0);
		this.btn_esq.setVisible(false);
		
		this.texto_objetivo = pd.cText(512, 660, pd.delegate.activeNamespace.tutoriais.txt_objetivo, "Calibri", 25);
		this.addChild(this.texto_objetivo, 99);
		this.texto_objetivo.setOpacity(0);
		
		var tamanho = pd.delegate.activeNamespace.tutoriais.length;
		var xInicial = -(tamanho/2 - 1) * 20;
		this.vBolinhas = [];
		for(var i = 0; i < tamanho; i++){
			var bolinha = pd.cObject("stage_instrucoes", 512 + xInicial + i * 20, 130 + pd.delegate.activeNamespace.tutoriais.txtOffSetY, this, 50);
			bolinha.setScale(0);
			this.vBolinhas.push(bolinha);
		}
		//inicia Tweens
		for(var i = 0; i < pd.delegate.activeNamespace.tutoriais.length - 1; i++){
			pd.delegate.activeNamespace.tutoriais[i].setCascadeOpacityEnabled(true);
			pd.delegate.activeNamespace.tutoriais[i].setOpacity(0);
		}
		this.startInitialTweens();
	},
	startInitialTweens:function(){
		var fadeScene = new cc.FadeIn(0.2);
		var move_background_01 = new cc.TargetedAction(this.background_01, new cc.MoveTo(0.35, 512, 364).easing(cc.easeSineOut()));
		var move_background_02 = new cc.TargetedAction(this.background_02, new cc.MoveTo(0.55, 512, 364).easing(cc.easeSineOut()));
		var move_background_03 = new cc.TargetedAction(this.background_03, new cc.MoveTo(0.75, 512, 350).easing(cc.easeSineOut()));
		var fadeName = new cc.TargetedAction(this.instru_logo, new cc.FadeIn(0.1));
		var fadeBtnDir = new cc.TargetedAction(this.btn_dir, new cc.FadeIn(0.1));
		var fadeBtnEsq = new cc.TargetedAction(this.btn_esq, new cc.FadeIn(0.1));
		var fadeTxtObjetivo = new cc.TargetedAction(this.texto_objetivo, new cc.FadeIn(0.1));
		var move_btn_exit = new cc.TargetedAction(this.btn_exit, new cc.MoveTo(0.1, 990, 740));
		
		var seq = new cc.Sequence(fadeScene, pd.delegate.context == pd.Delegate.CONTEXT_PORTAL ? new cc.TintTo(0.3, 225, 105, 10) : new cc.TintTo(0.3, 101, 167, 228), new cc.Spawn(move_background_01, move_background_02, move_background_03)
		, new cc.Spawn(fadeName, fadeBtnDir, fadeBtnEsq, fadeTxtObjetivo), new cc.CallFunc(this.changeLayer, this),
		new cc.CallFunc(function(){
			for(var i = 0; i < this.vBolinhas.length; i++){
				this.vBolinhas[i].runAction(new cc.Sequence(new cc.DelayTime(i / 5), new cc.ScaleTo(0.2, 1 + (i == 0 ? 0.4 : 0) ).easing(cc.easeElasticOut(1)) ));
			}
		},this), move_btn_exit);
		this.runAction(seq);
	},
	fadeOutLayer:function(){
		this.atualizarBolinhas();
		this.activeLayer.stopAllActions();//necessario pra que o reset não interrompa o fade
		this.activeLayer.runAction(new cc.Sequence(new cc.FadeOut(0.2), new cc.CallFunc(this.changeLayer, this)));
	},
	changeLayer:function(){
		if(this.activeLayer != null){
			this.activeLayer.pararCena();
			this.activeLayer.removeFromParent();
		}
		this.activeLayer = pd.delegate.activeNamespace.tutoriais[this.tutorialIndex];
		if(this.activeLayer) {
			this.addChild(this.activeLayer, 5);
			this.activeLayer.pararCena();
			this.activeLayer.runAction(new cc.Sequence(new cc.FadeIn(0.2), new cc.CallFunc(this.startLayer, this)));
		}
	},
	startLayer:function(){
		this.activeLayer.rodarCena();
	},
	proxFunc:function(caller, arg){
		if(caller.isVisible() && this.isControlEnabled && !arg){
			pd.audioEngine.playEffect(pd.res.fx_button);
			var size = pd.delegate.activeNamespace.tutoriais.length -1;
			if(this.tutorialIndex < size){
				this.tutorialIndex++;
				
				this.btn_esq.setVisible(true);
				if(this.tutorialIndex == size){
					this.btn_dir.setVisible(false);
				}
				this.fadeOutLayer();
			}
		}
	},
	antFunc:function(caller,arg){
		if(caller.isVisible() && this.isControlEnabled && !arg){
			pd.audioEngine.playEffect(pd.res.fx_button);
			if(this.tutorialIndex > 0){
				this.tutorialIndex--;

				this.btn_dir.setVisible(true);
				if(this.tutorialIndex == 0){
					this.btn_esq.setVisible(false);
				}
				this.fadeOutLayer();
			}
		}
	},
	atualizarBolinhas:function(){
		for(var i = 0; i < this.vBolinhas.length; i++){
			this.vBolinhas[i].runAction(new cc.ScaleTo(0.2, 1 + (i == this.tutorialIndex ? 0.4 : 0) ).easing(cc.easeElasticOut(1)));
		}
	},
	exitFunc:function(caller, isPressed){
		if (isPressed == true) {
			return;
		}
		caller.cleanup();
		pd.audioEngine.playEffect(pd.res.fx_escrever);
		this.isControlEnabled = false;

		var sequencia = [];

		var tempoMoveBy = 0.3;
		for (var n = 0; n < this.getChildrenCount(); n++) {
			if (this.children[n] !== this.activeLayer) {
				sequencia.push(new cc.TargetedAction(this.children[n], new cc.MoveBy(tempoMoveBy, 0, -800).easing(new cc.easeSineIn())));
			}
		}
		var acoes = [];
		if (this.activeLayer) {
			acoes.push(
				new cc.TargetedAction(this.activeLayer, new cc.FadeOut(0.2)),
				new cc.TargetedAction(this.activeLayer, new cc.CallFunc(function () {
					this.activeLayer.removeFromParent();
				}, this))
			)
		}
		acoes.push(
			new cc.Spawn(
				new cc.Spawn(
					sequencia
				),
				new cc.Sequence(
					new cc.DelayTime(tempoMoveBy - 0.1),
					new cc.FadeOut(0.5),
					new cc.CallFunc(function() {
						this.layerPai.onResume();
					}, this)
				)
			),
			new cc.TargetedAction(this, new cc.RemoveSelf())
		)
		this.runAction(new cc.Sequence(acoes));
	},
});

pd.tutorialLayer = cc.Layer.extend({
	ctor:function(txt){
		this._super();
		this.criarTextoInferior(txt);
	},
	createTeclas:function(translate){
		var tecla_cima = new pd.Animado();
		tecla_cima.addAnimation('normal', 1, 1, 'keyUp');
		tecla_cima.addAnimation('pressed', 2, 2, 'keyUp');
		tecla_cima.setPosition(0, 60);
		this.addChild(tecla_cima, 10);
		this.tecla_cima = tecla_cima;

		var tecla_baixo = new pd.Animado();
		tecla_baixo.addAnimation('normal', 1, 1, 'keyDown');
		tecla_baixo.addAnimation('pressed', 2, 2, 'keyDown');
		tecla_baixo.setPosition(0, 0);
		this.addChild(tecla_baixo, 10);
		tecla_baixo = tecla_baixo;

		var tecla_esq = new pd.Animado();
		tecla_esq.addAnimation('normal', 1, 1, 'keyLeft');
		tecla_esq.addAnimation('pressed', 2, 2, 'keyLeft');
		tecla_esq.setPosition(-60, 0);
		this.addChild(tecla_esq, 10);
		this.tecla_esquerda = tecla_esq;

		var tecla_dir = new pd.Animado();
		tecla_dir.addAnimation('normal', 1, 1, 'keyRight');
		tecla_dir.addAnimation('pressed', 2, 2, 'keyRight');
		tecla_dir.setPosition(60, 0);
		this.addChild(tecla_dir, 10);
		this.tecla_direita = tecla_dir;

		this.vTeclas = [];
		this.vTeclas.push(tecla_esq);
		this.vTeclas.push(tecla_cima);
		this.vTeclas.push(tecla_dir);
		this.vTeclas.push(tecla_baixo);
		for(var i = 0; i < 4; i++){
			this.vTeclas[i].setScale(0.75);
			this.vTeclas[i].x += translate.x;
			this.vTeclas[i].y += translate.y;
		}
		return this.vTeclas;
	},

	createPonteiro:function(initialPosition){
		var nome = '';
		if("mouse" in cc.sys.capabilities){
			nome = 'seta_';
		}
		else{
			nome = 'dedo_';
		}
		this.ponteiro = new pd.Animado();
		this.ponteiro.addAnimation('normal', 1, 1, nome);
		this.ponteiro.addAnimation('pressed', 1, 2, nome);
		this.ponteiro.setPosition(initialPosition.x, initialPosition.y);
		this.addChild(this.ponteiro,30);
		this.ponteiro.setAnchorPoint(0,1);
		this.ponteiro.initialPosition = initialPosition;
	},
	criarTextoInferior:function(txt){
		if(txt == null || txt == undefined){
			cc.log('override me');
			txt = "TEXTO A SER SOBRESCRITO";
		}
		if(!pd.delegate.activeNamespace.tutoriais.txtOffSetY)
			pd.delegate.activeNamespace.tutoriais.txtOffSetY = 0;
		txt = pd.cText(512, 120 + pd.delegate.activeNamespace.tutoriais.txtOffSetY, txt, "Calibri", 25);
		this.addChild(txt);
	},
	update:function(){

	},
	pararCena: function() {
		if(this.vTeclas){
			for(var i = 0; i < 4; i++){
				this.vTeclas[i].changeAnimation('normal', false);
			}
		}
		if(this.ponteiro){
			this.ponteiro.changeAnimation('normal', false);
			this.ponteiro.x = this.ponteiro.initialPosition.x;
			this.ponteiro.y = this.ponteiro.initialPosition.y;
		}

	},

	rodarCena: function() {
		cc.log('override me');
	},

	reset: function() {
		this.pararCena();
		this.rodarCena();
	}
});