SingletonId_Animacoes = 0;

pd.Animado = cc.Sprite.extend({
    acao: null,   
    Animations:null,
    running: null,
    speed:null,
    currentAnimation:null,
    id:null,
    
    ctor: function() {
        this._super();
        this.id = SingletonId_Animacoes;
        SingletonId_Animacoes++;
        this.Animations = [];
        this.running = false;
        this.speed = 24;
        this.TipoDoObj = "Animado";
    },
    
    
    addAnimation: function(nome, ini_frames, num_frames, anim_name, animationSpeed) {
    	//Adiciona animacoes ao objeto
    	var firstFrame = "";
    	if(ini_frames < 10) {
    		firstFrame = "000" + ini_frames + ".png";
    	}
    	else if(ini_frames < 100) {
    		firstFrame = "00" + ini_frames + ".png";
    	}
    	else if(ini_frames < 1000) {
    		firstFrame = "0" + ini_frames + ".png";
    	}
    	else {
    		firstFrame = ini_frames + ".png";
    	}
    	var frames = [];
    	var str = "";
    	for (var i = ini_frames; i <= num_frames; i++) {
    		if(i < 10) {
    			str = anim_name + "000" + i + ".png";
    		}
    		else if(i < 100) {
    			str = anim_name + "00" + i + ".png";
    		}
    		else if(i < 1000) {
    			str = anim_name + "0" + i + ".png";
    		}
    		else {
    			str = anim_name + i + ".png";
    		}
    		var frame = cc.spriteFrameCache.getSpriteFrame(str);
    		frames.push(frame);
    	}

    	if(animationSpeed == null || animationSpeed == undefined)
    		animationSpeed = 24;
    	this.speed = animationSpeed;
    	var animation = new cc.Animation(frames, 1/animationSpeed);
    	//var ani = {n:nome,animation:cc.Animate.create(animation)};
    	var ani = {n:nome,animation:animation};
    	pd.reter(ani.animation);
    	this.Animations.push(ani);
    },
    
    addAnimationWithFrames: function(nome, vFrames, anim_name) {
    	//Adiciona animacoes ao objeto
    	var frames = [];
    	var str = "";
    	for (var i = 0; i < vFrames.length; i++) {
    		var v = vFrames[i];
    		if(v < 10) {
    			str = anim_name + "000" + v + ".png";
    		}
    		else if(v < 100) {
    			str = anim_name + "00" + v + ".png";
    		}
    		else if(v < 1000) {
    			str = anim_name + "0" + v + ".png";
    		}
    		else {
    			str = anim_name + v + ".png";
    		}
    		var frame = cc.spriteFrameCache.getSpriteFrame(str);
    		frames.push(frame);
    	}

    	this.speed = 24;
    	
    	var animation = new cc.Animation(frames, 1/24);
    	//var ani = {n:nome,animation:cc.Animate.create(animation)};
    	var ani = {n:nome,animation:animation};
    	pd.reter(ani.animation);
    	this.Animations.push(ani);
    },
    

    changeAnimationSpeed:function(animationSpeed){//frames / segundo
    	this.speed = animationSpeed;
    	this.currentAnimation.setDelayPerUnit(1/this.speed);
    },
    
    setAnimation: function(nome) {
    //Seleciona uma animacao
        for(var i = 0; i < this.Animations.length; i++){
            if(this.Animations[i].n == nome){
            	this.currentAnimation = this.Animations[i].animation;
            }
        }
    },    
    
    getAnimation: function(nome) {
    //Retorna uma animacao
        for(var i = 0; i < this.Animations.length; i++){
            if(this.Animations[i].n == nome){
                return this.Animations[i].animation;
            }
        }
    },
    
    listarAnimations:function(){
    	return this.Animations[i];
    },    

    //funcao: rodar a animação
    //parametros
    //repeatable : false/true @se vai repetir
    //taxaRepeticao: int @quantas vezes vai repetir <0 = repetir indefinidamente>
    //parametros
    run: function(repeatable, taxaRepeticao) {
    //Comeca a animacao atual
    	/*
    	if(!this.acao.isDone()){
    		this.stopAction(this.acao);
    	}
    	*/
    	if(this.acao != null || this.acao != undefined)
    		this.acao.release();
    	newSpeed = (1/this.speed);
    	this.currentAnimation.setDelayPerUnit(newSpeed);
    	this.acao = cc.Animate.create(this.currentAnimation);
    	
        if(repeatable == null || repeatable == true) {
        	if(taxaRepeticao == null || taxaRepeticao == undefined){
	            repeat = cc.RepeatForever.create(this.acao);
	            this.acao = repeat;
        	}
        	else{
        		repeat = new cc.Repeat(this.acao, taxaRepeticao);
        		this.acao = repeat;
        	}
        }
        /*
        if(!this.acao.isDone()){
        	this.stopAction(this.acao);
        }
        */
        //reter(this.acao);
        this.acao.retain();
        this.runAction(this.acao);        
        this.running = true;
    },

    //funcao: rodar a animação e chamar o CallBack apos terminar;
    //parametros
    //repeatable : false/true @se vai repetir
    //taxaRepeticao: int @quantas vezes vai repetir <0 = repetir indefinidamente>
    //parametros
    runWithCallBack:function(repeatable,taxaRepeticao){
		var seq = null;
		if(!this.acao.isDone()){
			this.stopAction(this.acao);
		}
		cb = new cc.CallFunc(function(){
			this.callCustomCallBack();
		},this);
		

		newSpeed = (1/this.speed);
		this.currentAnimation.setDelayPerUnit(newSpeed);
		this.acao = cc.Animate.create(this.currentAnimation);

    	if(repeatable && taxaRepeticao == null || taxaRepeticao == undefined){
			seq = new cc.Sequence(this.acao, cb);
			this.acao = seq;
		}
		else{
			repeat = new cc.Repeat(this.acao, taxaRepeticao);
			seq = new cc.Sequence(repeat, cb);
			this.acao = seq;
		}
    	pd.reter(this.acao);
    	this.runAction(this.acao);        
    	this.running = true;
    },
    
    stop: function() {
    //Para a animacao atual
    	if(this.running){
    		if(this.acao != undefined && this.acao != null){
    			if(!this.acao.isDone()){
    				this.stopAction(this.acao);
        			this.running = false;
    			}
    		}
    	}
    },
        
    //funcao: trocar a animação, rodar a animação *e chamar o CallBack apos terminar*;
    //parametros
    //newAnimation :animationName @o noma da animação a ser trocada
    //repeatable : false/true @se vai repetir
    //taxaRepeticao: int @quantas vezes vai repetir <0 = repetir indefinidamente>
    //callBack : false/true @ se vai ser chamado o callBack;
    //parametros
    changeAnimation: function(newAnimation, repeatable, newSpeed, taxaRepeticao, callBack) {
        this.stop();
        this.setAnimation(newAnimation);
        if(newSpeed == null || newSpeed == undefined)
        	newSpeed = this.speed;
        this.speed = newSpeed;
        if(callBack == null || callBack == undefined)
        	this.run(repeatable, taxaRepeticao); 
        else
        	this.runWithCallBack(repeatable,taxaRepeticao);
    },
    
    changeAnimationInstant:function(newAnimation, repeatable, newSpeed, taxaRepeticao, callBack){
    	func = new cc.CallFunc(function(){
    		this.changeAnimation(newAnimation, repeatable, newSpeed, taxaRepeticao, callBack);
    	},this);
    	return func;
    },

    changeAnimationAction:function(newAnimation, newSpeed){
    	this.stop();
    	this.setAnimation(newAnimation);
    	if(newSpeed == null || newSpeed == undefined)
    		newSpeed = this.speed;
    	this.speed = newSpeed;
    	
    	if(this.acao != null || this.acao != undefined)
    		this.acao.release();
    	newSpeed = (1/this.speed);
    	this.currentAnimation.setDelayPerUnit(newSpeed);
    	this.acao = cc.Animate.create(this.currentAnimation);

    	this.acao.retain();    
    	this.running = true;
    	return new cc.TargetedAction(this, this.acao);
    },

    animateWithReversal:function(newAnimation, delayForReversal, repeatable){
    	this.stop();
    	this.setAnimation(newAnimation);
    	if(repeatable == null || repeatable == true) {
    		reversal = cc.RepeatForever.create(cc.Sequence.create(this.currentAnimation, cc.DelayTime.create(delayForReversal), this.currentAnimation.reverse()));
    		this.acao = reversal;
    	}
    	else{
    		reversal = cc.Sequence.create(this.acao, cc.DelayTime.create(delayForReversal), this.acao.reverse())
    		this.acao = reversal;
    	}
    	
    	pd.reter(this.acao);
    	this.runAction(this.acao);        
    	this.running = true;
    },
    //funcao: rodar a animação e *chamar o CallBack apos terminar*;
    //parametros
    //newAnimation :animationName @o noma da animação a ser trocada
    //duracao : int @o tempo de duração da animação  em seg
    //callBack: false/true @se vai ser chamado o callback ao termino da duração
    //parametros
    runNewAnimationWithDuration: function(newAnimation, duracao, callBack) {
    	//Para a animacao atual e comeca uma nova
    	this.stop();
    	this.setAnimation(newAnimation);    	
    	var cb = null;
    	if(callBack == null || callBack == undefined){
    		cb = new cc.CallFunc(function(){
    			this.stop();
    		},this);
    	}
    	else{
    		cb = new cc.CallFunc(function(){
    			this.stop();
    			this.callCustomCallBack();
    		},this);
    	}
    	pd.reter(cb);
    	repeat = cc.RepeatForever.create(this.acao);
    	this.acao = repeat;
    	pd.reter(this.acao);
    	this.runAction(this.acao);        
    	this.running = true;
    	this.runAction(new cc.delayTime(duracao), cb);
    },
    
    kill: function() {
    //Remove o objeto da layer
        this.removeFromParent(true);
    },
    
    //prototypo //teste
    //funcao: criar um custom callBack para quando a animação terminar
    //parametros
    //CallBack :function @a função a ser chamada
    //NomeDoEvento : string @o nome do evento, tentar usar nomes unicos para cada 1
    //target: node @alvo que o callback vai tentar chamar a função
    //removeCallBack: false/true @se vai limpar o callBack apos chama-lo
    //parametros
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