pd.TextFunctions = [];

pd.TextCreator = cc.Node.extend({
	ctor:function(font, size, father){
		this._super();
		this.textVector = [];
		this.font = font; this.labelSize = size;
		this.funcToCall = null;
		this.fatherRef = father;
	},
	addFinishCallback:function(target, callback){
		this.completionCallBackTarget = target;
		this.cbUponCompletion = callback;
	},
	addTextLine:function(txt, cb, funcCaller){
		var texto = new cc.LabelTTF('', this.font, this.labelSize);
		texto.textoCompleto = txt;
		pd.ApplyTextFunctions(texto);
		texto.funcToCall = cb;
		texto.funcCaller = funcCaller;
		texto.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
		texto.setAnchorPoint(0, 0.5);
		this.textVector.push(texto);
		this.addChild(texto);
	},
	
	setFontColor:function(color){
		for(var i = 0; i < this.textVector.length; i++){
			this.textVector[i].setFontFillColor(color);
		}
	},
	
	setTextPosition:function(x, y, yDif){
		this.basePosition = [x, y, yDif];
		for(var i = 0; i < this.textVector.length; i++){
			this.textVector[i].setPosition(x, y + (yDif * i));
		}
	},
	
	startUpdate:function(dur){
		this.LinhaAtual = 0;
		for(var i = 0; i < this.textVector.length; i++){
			this.textVector[i].durPerLetra = dur;
		}
		this.textVector[this.LinhaAtual].startUpdate(this);
	},
	reset:function(){
		this.LinhaAtual = 0;
		for(var i = 0; i < this.textVector.length; i++){
			this.textVector[i].setString('');
			this.textVector[i].terminou = false;
			this.textVector[i].setPosition(this.basePosition[0], this.basePosition[1] + (this.basePosition[2] * i));
		}
	},
	setSound:function(s){
		this.tecla_sound = s;
		cc.log(this.tecla_sound);
	},
	nextUpdate:function(){
		this.LinhaAtual ++;
		if(this.funcToCall)
			this.funcToCall();
		if(this.LinhaAtual < this.textVector.length)
			this.textVector[this.LinhaAtual].startUpdate(this);	
		else{
			if(this.cbUponCompletion)
				this.completionCallBackTarget[this.cbUponCompletion]();
		}
	}
});

pd.TextCreator.setFadeType = function(target, numLinhasVisiveis){
	target.numLinhasVisiveis = numLinhasVisiveis;
	target.funcToCall = function(){
		if(target.LinhaAtual > target.numLinhasVisiveis && target.LinhaAtual < target.textVector.length){
			for(var i = 0; i < target.textVector.length; i++){
				target.textVector[i].runAction(new cc.MoveBy(0.5, 0, target.basePositionInfo[2]));
			}
			target.textVector[target.LinhaAtual - target.numLinhasVisiveis - 1].runAction(new cc.FadeOut(0.2));
		}
	}
}


pd.ApplyTextFunctions = function(text){
	text.startUpdate = function(refer){
		this.refTextCreator = refer;
		this.textoAtual = "";
		this.textoFinal = this.textoCompleto.split("");
		this.setString("");
		this.curDelay = 0;
		this.scheduleUpdate();
		this.terminou = false;
	};
		
	text.update = function(dt){
		if(!isPaused){
			this.curDelay += dt;
			if(this.curDelay >= this.durPerLetra){
				this.curDelay -= this.durPerLetra;
				if(this.textoFinal[0] != " "){
					if(this.refTextCreator.tecla_sound)
						pd.audioEngine.playEffect(this.refTextCreator.tecla_sound);
					else
						pd.audioEngine.playEffect(pd.resPadrao.fx_escrever);
						
				}
				this.textoAtual += this.textoFinal[0];
				this.textoFinal.splice(0, 1);
				this.setString(this.textoAtual);
				if(this.textoFinal.length <= 0){
					this.unscheduleUpdate();
					this.finalizar();
				}
			}
		}
	};
		
	text.finalizar = function(){
		this.terminou = true;
		this.refTextCreator.nextUpdate();
		if(this.funcToCall){
			this.funcCaller[this.funcToCall](this);
		}
	};
}