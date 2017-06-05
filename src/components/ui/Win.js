pd.WinLayer = cc.Layer.extend({

	init: function(mamae, cenaMenu, personagem, texto, tremer) {
		//mamae: @layer - layer principal da cena que for parar
		//cenaMenu: @scene - cena do menu do jogo, se for PALCO passar NULL
		//personagem: @string - nome do frame com o personagem e o circulo
		//texto: @string - nome do frame com a placa do texto

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

		pd.pausar(this.mamae);

		//Fundo
		this.bg = new cc.Sprite(pd.res.s_fundoPreto);
		this.bg.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
		this.addChild(this.bg, 0);

		//Faixa
		this.faixa = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("faixa.png"));
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
		this.faixa.reboteIn = new cc.TargetedAction(this.faixa, new cc.ScaleTo(0.3, 1.1, 1));
		this.faixa.reboteOut = new cc.TargetedAction(this.faixa, new cc.EaseBounceOut(new cc.ScaleTo(1, 1, 1)));
		pd.delegate.retain(this.faixa.reboteIn);
		pd.delegate.retain(this.faixa.reboteOut);
		
		//Placa
		this.placa = new cc.Sprite(texto);
		this.placa.setPosition(cc.winSize.width / 2, cc.winSize.height / 4 + 55);
		this.placa.setAnchorPoint(0.5, 1);
		this.addChild(this.placa, 8);
		this.placa.setScale(1, 0);
		this.placa.escalar = new cc.TargetedAction(this.placa, new cc.ScaleTo(0.3, 1, 1));
		this.placa.reboteIn = new cc.TargetedAction(this.placa, new cc.ScaleTo(0.3, 1, 1.2));
		this.placa.reboteOut = new cc.TargetedAction(this.placa, new cc.EaseBounceOut(new cc.ScaleTo(1, 1, 1)));

		pd.delegate.retain(this.placa.escalar);
		pd.delegate.retain(this.faixa.reboteIn);
		pd.delegate.retain(this.faixa.reboteOut);
		
		//Sequencia de rebote
		var seqPlaca = cc.Sequence.create(this.placa.escalar, this.placa.reboteIn, cc.DelayTime.create(0.1), this.placa.reboteOut);
		var escalaPlaca = cc.CallFunc.create(function(){this.runAction(seqPlaca)}, this);
		this.reboteSeq = cc.Sequence.create(this.faixa.reboteIn, escalaPlaca, cc.DelayTime.create(0.1), this.faixa.reboteOut);
		pd.delegate.retain(this.reboteSeq)
		pd.delegate.retain(seqPlaca);
		//Personagem
		this.personagem = new cc.Sprite(this.personagem);
		this.personagem.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 + 80);
		this.addChild(this.personagem, 5);
		this.personagem.setScale(0);
		this.personagem.animar = new cc.TargetedAction(this.personagem, new cc.EaseBounceOut(new cc.ScaleTo(1, 1)));

		pd.delegate.retain(this.personagem.animar);
		
		//Estrelas
		this.estrelas = [];
		
		this.estrelas[0] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("estrela_grande.png"));
		this.estrelas[0].setPosition(cc.winSize.width / 2 - 82, cc.winSize.height / 2);
		this.estrelas[0].setAnchorPoint(1, 0);
				
		this.estrelas[1] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("estrela_grande.png"));
		this.estrelas[1].setPosition(cc.winSize.width / 2 + 82, cc.winSize.height / 2);
		this.estrelas[1].setAnchorPoint(0, 0);
		this.estrelas[1].setFlippedX(true);	
		
		this.estrelas[2] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("estrela1.png"));
		this.estrelas[2].setPosition(760, 270);
		this.estrelas[2].maxEscala = 1;
		
		this.estrelas[3] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("estrela1.png"));
		this.estrelas[3].setPosition(730, 250);
		this.estrelas[3].maxEscala = 0.5;
		
		this.estrelas[4] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("estrela2.png"));
		this.estrelas[4].setPosition(700, 200);
		this.estrelas[4].maxEscala = 0.85;
		
		this.estrelas[5] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("estrela2.png"));
		this.estrelas[5].setPosition(670, 330);
		this.estrelas[5].maxEscala = 1.4;
		
		this.estrelas[6] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("estrela2.png"));
		this.estrelas[6].setPosition(360, 330);
		this.estrelas[6].maxEscala = 1;
		
		this.estrelas[7] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("estrela2.png"));
		this.estrelas[7].setPosition(330, 200);
		this.estrelas[7].maxEscala = 1;
		
		this.estrelas[8] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("estrela3.png"));
		this.estrelas[8].setPosition(255, 240);
		this.estrelas[8].maxEscala = 1;
		
		this.estrelas[9] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("estrela3.png"));
		this.estrelas[9].setPosition(220, 195);
		this.estrelas[9].maxEscala = 0.5;
		
		this.estrelas[10] = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("estrela3.png"));
		this.estrelas[10].setPosition(265, 175);
		this.estrelas[10].maxEscala = 0.45;
		
		for(var i in this.estrelas) {
			this.estrelas[i].setScale(0);
			if(i <= 1) {
			//Estrelas grandes
				this.addChild(this.estrelas[i], 2);
				this.estrelas[i].escalar = new cc.EaseBounceOut(new cc.ScaleTo(2, 1));
				this.estrelas[i].animar = cc.CallFunc.create(function(){
					this.runAction(this.escalar);}, this.estrelas[i]);

				pd.delegate.retain(this.estrelas[i].escalar);
				pd.delegate.retain(this.estrelas[i].animar);
			}
			else {
			//Estrelas pequenas
				this.addChild(this.estrelas[i], 12);
				this.estrelas[i].escalar = new cc.RepeatForever(new cc.EaseBounceOut(new cc.ScaleTo(2.5, this.estrelas[i].maxEscala)));
				this.estrelas[i].rodar = new cc.RepeatForever(new cc.RotateBy(2.5, 360));
				this.estrelas[i].animar = cc.CallFunc.create(function(){
					this.runAction(this.escalar);
					this.runAction(this.rodar);},this.estrelas[i]);
				pd.delegate.retain(this.estrelas[i].escalar);
				pd.delegate.retain(this.estrelas[i].animar);
				pd.delegate.retain(this.estrelas[i].rodar);
				
			}
		}
		
		//Audio
		var explosion = cc.CallFunc.create(function(){
			pd.audioEngine.playEffect(pd.res.fx_exp);}, this);
		var desenrolar = cc.CallFunc.create(function(){
			pd.audioEngine.playEffect(pd.res.fx_star);
			for(var i = 0; i < this.estrelas.length; i++) {
				this.runAction(this.estrelas[i].animar);
			}
			this.schedule(this.animar, 1/60);}, this);
		var audioFlip = cc.CallFunc.create(function(){
			pd.audioEngine.playEffect(pd.res.fx_flip);}, this);
		this.audioSeq = cc.Sequence.create(cc.DelayTime.create(0.3), explosion, cc.DelayTime.create(0.7), desenrolar, audioFlip);
		pd.delegate.retain(this.audioSeq);
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
			pd.audioEngine.playMusic(pd.res.fx_BgmWin, false);
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
			this.tremidaSeq2 = cc.Sequence.create(cc.DelayTime.create(0.35), impacto, repeticao, tremidaReset,new cc.DelayTime(1), musica);
		else{
			this.tremidaSeq2 = cc.Sequence.create(cc.DelayTime.create(0.35), new cc.DelayTime(1.5), musica);			
		}
		pd.delegate.retain(this.tremidaSeq2);
		//Inicio das animacoes
		pd.audioEngine.stopMusic();
		
		this.runAction(this.audioSeq);
		this.runAction(this.personagem.animar);
			this.runAction(this.tremidaSeq2);
		this.schedule(this.finishar, 9.5);
	},

	animar: function() {
		//Faixa
		if(this.faixa.XEsquerdo - this.velocidade > this.faixa.rectX) {
			this.faixa.XEsquerdo -= this.velocidade;
			this.faixa.XDireito += this.velocidade * 2;
		}
		else { 
			this.faixa.XEsquerdo = this.faixa.rectX;
			this.faixa.XDireito = this.faixa.rectW;
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