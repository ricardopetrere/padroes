//v1 estavel 06/01/15

//Variavel utilizada para identificar o index do player (só serve pra debug)
Singleton_effectPlayerId = 1;
Singleton_eventId = 1;
//para poder fazer limpesa dos custom listener
CustomEventVectorList = [];

/*
 * função para limpar o custom listeners
 * Singleton_effectPlayerId = 1;
 * for(i = 0; i < CustomEventVectorList.length; i++){
 * 		removeCustomListeners(CustomEventVectorList[i]);
 * }
 * CustomEventVectorList = [];
 */

/*
 * O long effect player eh para tocar especialmente efeitos que tenham mais de 5s
 * mas tambem pode ser utilizado em qualquer efeito desejado
 * Vantagens de usar o LongEffectPlayer é que ele possui callback pra saber quando o efeito acabou
 */
pd.playSimpleEffect = function(nome, loop, volume){
	if(volume == null || volume == undefined)
		volume = 1;
	var audioId = null;
	if(cc.sys.isNative)
		audioId = pd.audioEngine.playEffect(nome, loop, 1, 0, volume);
	else
		audioId = pd.audioEngine.playEffect(nome, loop, volume);
	return audioId;
}
pd.createLongEffectPlayer = function(nomePadrao, vetorDuracao, layerPai, callBack){
	var effectSounds;
	var longPlayer = new longEffectPlayer();

	effectSounds = new longEffect();
	for(var i = 0; i < vetorDuracao.length; i++){
		caminho = nomePadrao + (i + 1).toString();
		effectSounds.addEfeito(resources[caminho], vetorDuracao[i]);//efeito e duração
	}
	longPlayer.init(effectSounds.getEfeitos());
	
	if(layerPai != null && layerPai != undefined){
		layerPai.addChild(longPlayer, 0);
	}
	if(callBack != null && callBack != undefined){
		longPlayer.createCustomListener(callBack, 'padrao', layerPai);
	}
	if(pd.delegate.activeNamespace.audioVector != undefined)
		pd.delegate.activeNamespace.audioVector.push(longPlayer);
	
	return longPlayer;
	
};


pd.longEffectPlayer = cc.Node.extend(
{
	id:null,
	player:null,
	effectVector:[],
	currentAudio:null,
	currentSequence:null,
	aux:null,
	isFinished:null,
	event:null,
	removeCallBack:null,
	eventName:null,
	callBack:null,
	inicializado:null,
	tocarCB:null,

	/*
	 * Init precisa ser chamado para o efeito rodar
	 * Parametro 1: longEffectVector é um vetor com os efeitos a serem tocados, os efeitos sao compostos de longEffect(s)
	 * Parametro 2: valor é uma booleana, se for False não ira reIniciar as variaveis de CallBack - para caso vc queira
	 * mudar o efeito a ser usado mas manter o msm callback
	 */
	init:function (longEffectVector, valor) {
		this.inicializado = true;
		if(this.id == null){
			this.id = Singleton_effectPlayerId;
			Singleton_effectPlayerId++;
		}
		this.player = pd.audioEngine;
		this.effectVector = new Array();
		this.effectVector = longEffectVector;
		this.aux = 0;
		
		if(valor != false){
			this.eventName = null;
			this.isPlaying = false;
			this.event = null;
		}
		this.isFinished = false;
		//colocar preload talvez?
	},
	tocarInterno:function(){
		if(this.aux < this.effectVector.length){
			this.isPlaying = true;
			this.currentAudio = pd.playSimpleEffect(this.effectVector[this.aux].effect,false);
			var delay = cc.DelayTime.create(this.effectVector[this.aux].delay);
			var playNextEffect = cc.CallFunc.create(this.tocarInterno, this);
			var seq = cc.Sequence.create(delay, playNextEffect);
			this.runAction(seq);
			pd.delegate.retain(seq);
			this.aux ++;
		}
		else{
			this.isFinished = true;
			this.isPlaying = false;
			this.currentAudio = null;
			this.aux = 0;
			if(this.tocarCB){
				this.callCustomCallBack();
			}
		}
	},
	//Chamar tocar para fazer o efeito tocar. ao fim, se o efeito possuir callBack o msm sera chamado
	tocar:function(tocarCallBack){
		this.verificaExistenciaPlayer();
		if(tocarCallBack != null && tocarCallBack != undefined){
			this.tocarCB = false;
		}
		else{
			this.tocarCB = true;
		}
		this.tocarInterno();
	},
	//Para o Efeito, diferente do pausar esse não salva a posição do audio para continuar
	parar:function(){
		if(this.inicializado != undefined && this.inicializado != null){
			this.cleanup();
			this.verificaExistenciaPlayer();
			this.player.stopEffect(this.currentAudio);
			this.aux = 0;
			this.isFinished = true;
			this.isPlaying = false;
			this.currentAudio = null;
		}
	},
	//Pausa o Efeito, nesse caso podera chamar despausar para continuar de onde parou o audio *evite de chamar pause e despause mto frequente
	pausar:function(){
		if(this.inicializado != undefined && this.inicializado != null){
			this.pause();
			this.verificaExistenciaPlayer();
			this.player.pauseEffect(this.currentAudio);
		}
	},
	//Despausa o Efeito, continua o audio de onde ele parou *evite de chamar pause e despause constantemente
	despausar:function() {
		if(this.inicializado != undefined && this.inicializado != null){
			this.resume();		
			this.verificaExistenciaPlayer();
			this.player.resumeEffect(this.currentAudio);
		}
	},
	//remove e limpa o Player
	kill:function(){
		this.removeFromParent(true);
	},
	//boleana pra saber se o som ja acabou
	didFinish:function(){
		return this.isFinished;
	},
	//debug
	verificaExistenciaPlayer:function(){
		if(this.player == null || this.player == undefined){
			this.errorMessage();
			cc.log('player não inicializado')
		}
	},
	errorMessage:function(){
		cc.log('Erro no LongEffectPlayer id ' + this.id);
	},
	/*
	 * Serve para chamar uma função ao terminar o audio
	 * Parametro 1 : CallBack é a função a ser chamada, ex  this.mouseDown. *nao usar parenteses
	 * Parametro 2 : NomeDoEvento é para caso voce tenha mais de um player ativo ao mesmo tempo, o callback precisa
	 * ter nome diferente. Não obrigatorio
	 * Parametro 3 : target é para caso você queira dar um alvo diferente da layer onde o player foi add, ex: o player foi
	 * adicionado a HuD mas você quer chamar a função callback do gameLayer, voce passa a gameLayer como target
	 * Parametro 4 : removeCallBack é caso voce queira que o callBack seja removido apos ser chamado
	 */
	createCustomListener: function(CallBack, NomeDoEvento, target, removeCallBack){
		this.removeCallBack = removeCallBack;
		if(target == null && target == undefined){
			target = this.getParent();
		}
			
		if(NomeDoEvento == undefined || NomeDoEvento == null){
			NomeDoEvento = 'padrao';
		}
		NomeDoEvento += this.id.toString();
		NomeDoEvento += Singleton_eventId.toString();
		Singleton_eventId ++;
		CustomEventVectorList.push(NomeDoEvento);
		var evento = cc.EventListener.create({
			event: cc.EventListener.CUSTOM,
			eventName: NomeDoEvento,
			callback: function(event){
				var call = event.getUserData();
				var target = event.getCurrentTarget();
				target.call = call;
				target.call();
			}
		});    
		if(CallBack == undefined || CallBack == null){
			this.errorMessage();
			cc.log('Parametro 1(CallBack) esta como nulo ou indefinido');
		}
		if(typeof(CallBack) != "function"){
			this.errorMessage();
			cc.log('CallBack Precisa ser uma função');
		}
		if(target == null || target == undefined){
			this.errorMessage();
			cc.log('Target esta nulo ou undefined, adicione esse LongEffectPlayer à layer que deseja chamar o CallBack');
		}
		this.callBack = CallBack;
		this.event = evento;
		cc.eventManager.addListener(this.event, target);
		this.eventName = NomeDoEvento;
	},
	//Ao termino do som, o callBack eh chamado
	callCustomCallBack: function(){
		if((this.eventName == null || this.eventName == undefined) && this.event != null && this.event != undefined){
			this.errorMessage();
			cc.log('eventName nulo ou undefined, init chamado apos criação do CustomCallBack sem o parametro false');
		}
		if(this.eventName != null && this.eventName != undefined) {
			var evento = new cc.EventCustom(this.eventName);
			evento.setUserData(this.callBack);
			cc.eventManager.dispatchEvent(evento);
			if(this.removeCallBack != null && this.removeCallBack != undefined){
				if(this.removeCallBack)
					cc.eventManager.removeListener(this.event);
					this.event = null;
			}
		}
	}
});

//variavel para ajudar a criar LongEffects
pd.longEffect = function(){
	this.efeitos = null;
};
//adiciona um efeito e a sua duração para chamar a proxima 
pd.longEffect.prototype.addEfeito = function(efeito, dur){
	var cusEffect = new pd.customEffect();
	cusEffect.effect = efeito;
	cusEffect.delay = dur;
	if(this.efeitos == null || this.efeitos == undefined){
		this.efeitos = [];
	}
	this.efeitos.push(cusEffect);
};
//retorna o vetor de efeitos
pd.longEffect.prototype.getEfeitos = function(){
	return this.efeitos;
};

pd.customEffect = function(efeito,dur){
	this.effect = efeito;
	this.delay = dur;
};

pd.longEffectManager = function(){
	longEffects = null;
	init = function(){
		this.longEffects = new Array();
	};
	adicionarEfeito = function(efeito){
		this.longEffects.push(efeito);
	};
	pausar = function(){
		for(i = 0; i < this.longEffects.length; i++){
			this.longEffects[i].pausar();
		}
	};
	despausar = function(){
		for(i = 0; i < this.longEffects.length; i++){
			this.longEffects[i].despausar();
		}
	};
}