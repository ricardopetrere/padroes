pd.LoseLayer = cc.Layer.extend({

	willPlayFarofa:null,
	init: function(mamae, cenaMenu, personagem, tremer) {
	//mamae: @layer - layer principal da cena que for parar
	//cenaMenu: @scene - cena do menu do jogo, se for PALCO passar NULL
	//personagem: @string - nome do frame com o personagem e o circulo

		this._super();
		this.mamae = mamae;
		this.cenaMenu = cenaMenu;
		if (!pd.delegate.context == pd.Delegate.CONTEXT_PALCO) {
			pd.delegate.retain(this.cenaMenu);
		}
		this.personagem = personagem;
		this.escalarAbas = false;
		this.velocidade = 25;
		if(tremer == null || tremer == undefined)
			tremer = true;
		// cc.log(mamae.getBoundingBox().width);
		pd.pausar(this.mamae);

		//Fundo
		this.bg = new cc.Sprite(pd.res.s_fundoPreto);
		this.bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
		this.addChild(this.bg, 0);
		
		//Faixa
		this.faixa = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("faixa_frente.png"));
		this.faixa.setPosition(cc.winSize.width / 2, cc.winSize.height / 4 + 30);
		this.addChild(this.faixa, 10);
		//Posicao da faixa no plist
		this.faixa.rectX = this.faixa.getTextureRect().x;
		this.faixa.rectY = this.faixa.getTextureRect().y;
		this.faixa.rectW = this.faixa.getTextureRect().width;
		this.faixa.rectH = this.faixa.getTextureRect().height;
		this.faixa.XEsquerdo = this.faixa.rectX + this.faixa.rectW/2;
		this.faixa.XDireito = 0;
		this.faixa.setTextureRect(cc.rect(this.faixa.XEsquerdo,
				this.faixa.rectY,
				this.faixa.XDireito,
				this.faixa.rectH));
		this.faixa.reboteIn = new cc.TargetedAction(this.faixa, new cc.ScaleTo(0.3, 1.03, 1));
		this.faixa.reboteOut = new cc.TargetedAction(this.faixa, new cc.ScaleTo(1, 1, 1));
		pd.delegate.retain(this.faixa.reboteIn);
		pd.delegate.retain(this.faixa.reboteOut);
		
		this.abaL = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("faixa_aba.png"));
		this.abaL.setPosition(this.faixa.x - 177, this.faixa.y + 41);
		this.abaL.setAnchorPoint(1, 0.5);
		this.addChild(this.abaL, 10);
		this.abaL.setScale(0, 1);
		this.willPlayFarofa = true;/////////////////////////////////////////corrigido
		
		this.abaL.escalar = new cc.TargetedAction(this.abaL, new cc.ScaleTo(0.3, 1));
		this.abaL.reboteIn = new cc.TargetedAction(this.abaL, new cc.ScaleTo(0.1, 1.08, 1));
		this.abaL.reboteOut = new cc.TargetedAction(this.abaL, new cc.EaseBounceOut(new cc.ScaleTo(1, 1, 1)));
		pd.delegate.retain(this.abaL.escalar);
		pd.delegate.retain(this.abaL.reboteIn);
		pd.delegate.retain(this.abaL.reboteOut);
		
		this.abaR = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("faixa_aba.png"));
		this.abaR.setPosition(this.faixa.x + 177, this.faixa.y + 41);
		this.abaR.setAnchorPoint(0, 0.5);
		this.abaR.setFlippedX(true);
		this.addChild(this.abaR, 10);
		this.abaR.setScale(0, 1);
		this.abaR.escalar = new cc.TargetedAction(this.abaR, new cc.ScaleTo(0.3, 1));
		this.abaR.reboteIn = new cc.TargetedAction(this.abaR, new cc.ScaleTo(0.1, 1.08, 1));
		this.abaR.reboteOut = new cc.TargetedAction(this.abaR, new cc.EaseBounceOut(new cc.ScaleTo(1, 1, 1)));
		pd.delegate.retain(this.abaR.escalar);
		pd.delegate.retain(this.abaR.reboteIn);
		pd.delegate.retain(this.abaR.reboteOut);
		
		this.escalarTimer = cc.Sequence.create(cc.DelayTime.create(0.2), cc.CallFunc.create(function(){this.escalarAbas = true;}, this));
		pd.delegate.retain(this.escalarTimer);
		//Sequencia de rebote
		var reboteIn = cc.CallFunc.create(function(){
			this.runAction(this.faixa.reboteIn);
			this.runAction(this.abaL.reboteIn);
			this.runAction(this.abaR.reboteIn);}, this);
		var reboteOut = cc.CallFunc.create(function(){
			this.runAction(this.faixa.reboteOut);
			this.runAction(this.abaL.reboteOut);
			this.runAction(this.abaR.reboteOut);}, this);
		this.reboteSeq = cc.Sequence.create(reboteIn, cc.DelayTime.create(0.1), reboteOut);
		pd.delegate.retain(reboteIn);
		pd.delegate.retain(reboteOut);
		pd.delegate.retain(this.reboteSeq);
		
		
		//Personagem
		this.personagem = new cc.Sprite(this.personagem);
		this.personagem.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + 30);
		this.addChild(this.personagem, 5);
		this.personagem.setScale(0);
		this.personagem.animar = new cc.TargetedAction(this.personagem, new cc.EaseBounceOut(new cc.ScaleTo(1, 1)));
		pd.delegate.retain(this.personagem.animar);
		//Audio
		var explosion = cc.CallFunc.create(function(){
			pd.audioEngine.playEffect(pd.res.fx_exp);}, this);
		var desenrolar = cc.CallFunc.create(function(){
			this.schedule(this.animar, 1/60);}, this);
		var audioFlip = cc.CallFunc.create(function(){
			pd.audioEngine.playEffect(pd.res.fx_flip);}, this);
		this.audioSeq = cc.Sequence.create(cc.DelayTime.create(0.3), explosion, cc.DelayTime.create(0.7), desenrolar, audioFlip);
		pd.delegate.retain(this.audioSeq);
		//pd.delegate.retain(desenrolar);
		//pd.delegate.retain(audioFlip);
		//Onda de impacto
		this.onda = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("impacto.png"));
		this.onda.setPosition(this.personagem.getPosition());
		this.addChild(this.onda, 4);
		this.onda.setScale(0);
		this.onda.setOpacity(50);
		this.onda.escalar = new cc.TargetedAction(this.onda, new cc.ScaleTo(0.5, 3));
		this.onda.sumir = new cc.TargetedAction(this.onda, new cc.FadeTo(0.5, 0));
		var impacto = cc.CallFunc.create(function(){
			this.runAction(this.onda.escalar);
			this.runAction(this.onda.sumir);}, this);
		pd.delegate.retain(this.onda.escalar);
		pd.delegate.retain(this.onda.sumir);
		pd.delegate.retain(impacto);
		//Musica de fundo
		var musica = cc.CallFunc.create(function(){
			pd.audioEngine.playMusic(pd.res.fx_BgmLose, false);
			pd.audioEngine.setMusicVolume(0.3);
		}, this);
		pd.delegate.retain(musica);
		//Tremida da tela
		var tremidaIn = new cc.TargetedAction(this.mamae, new cc.RotateTo(0.05, 1));
		var tremidaOut = new cc.TargetedAction(this.mamae, new cc.RotateTo(0.06, -1.7));
		var tremidaReset = new cc.TargetedAction(this.mamae, new cc.RotateTo(0.05, 0));
		var tremidaSeq1 = cc.Sequence.create(tremidaIn, tremidaOut);
		var repeticao = new cc.Repeat(tremidaSeq1, 5);

		if(tremer)
		this.tremidaSeq2 = cc.Sequence.create(cc.DelayTime.create(0.35), impacto, repeticao, tremidaReset, cc.DelayTime.create(1), musica);
		else
			this.tremidaSeq2 = cc.Sequence.create(cc.DelayTime.create(0.35), cc.DelayTime.create(1.5), musica);
		pd.delegate.retain(this.tremidaSeq2);
		//Inicio das animacoes
		pd.audioEngine.stopMusic();
		
		this.runAction(this.audioSeq);
		this.runAction(this.personagem.animar);
		this.runAction(this.tremidaSeq2);
		this.runAction(new cc.Sequence(new cc.DelayTime(6), new cc.CallFunc(function(){
			this.finishar();
		},this)))
		//this.schedule(this.finishar, 6);
	},
	
	animar: function() {
		//Faixa
		if(this.faixa.XEsquerdo - this.velocidade > this.faixa.rectX) {
			this.faixa.XEsquerdo -= this.velocidade;
			this.faixa.XDireito += this.velocidade * 2;
		}
		else if(!this.escalarAbas) {
			this.faixa.XEsquerdo = this.faixa.rectX;
			this.faixa.XDireito = this.faixa.rectW;
			if(this.willPlayFarofa){
				this.runAction(this.abaL.escalar);
				this.willPlayFarofa = false;
				this.runAction(this.abaR.escalar);
				this.runAction(this.escalarTimer);
			}
		}
		else {
			this.runAction(this.reboteSeq);
			this.unschedule(this.animar);
		}
		this.faixa.setTextureRect(cc.rect(this.faixa.XEsquerdo,
				this.faixa.rectY,
				this.faixa.XDireito,
				this.faixa.rectH));
	},

	finishar: function() {
		if(pd.delegate.context == pd.Delegate.CONTEXT_PALCO != null && pd.delegate.context == pd.Delegate.CONTEXT_PALCO != undefined && pd.delegate.context == pd.Delegate.CONTEXT_PALCO){
			pd.delegate.finish();
		}
		else pd.delegate.finish(this.cenaMenu);
	}
});