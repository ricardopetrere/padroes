//*****************
//Constantes
//*****************
var TARGETX = 1024;
var TARGETY = 768;

var pd = [];//padroes

singletonTouchId = [];
for(i = 0; i < 6; i++){
	singletonTouchId[i] = false;
}

//*****************
//Variaveis
//*****************
var isPalco = false;//marcar como true se estiver usando o palco / deixar null ou false caso esteja usando o standAlone
// var winSize = null;
var cache = null;//TODO Verificar se ainda estão sendo usados
var endGame = false;
var endLevel = false;//TODO Verificar se ainda estão sendo usados
var isPaused = false;
var talking = false;//TODO Verificar se ainda estão sendo usados
var audiosTut = [];//TODO Verificar se ainda estão sendo usados
var retidos = [];
var acoesPausadas = [];
var resAdicional = [];//TODO Verificar se ainda estão sendo usados
var DebugMode = false;
var activeGameSpace = null;
var padroesPath = cc.game.config["padroesPath"];
var versaoPadroes = "2.0";
var lastGame = null;//TODO Verificar se ainda estão sendo usados
cc.log("Padrões Cocos Versão " + versaoPadroes);

//Especifico para android - relativos ao obb
if (cc.sys.isNative) {
	if(cc.sys.os == cc.sys.OS_ANDROID) {
		var caminho;
		var saida;
		var dezipado;
	}
	var lStorage = cc.sys.localStorage;
}

//*****************
//Funcoes
//*****************

pd.initGlobals = function() {
//	Inicializa as variaveis globais
// 	winSize = cc.director.getWinSize();
	cache = cc.spriteFrameCache;
	endGame = false;
	endLevel = false;
	isPaused = false;
	talking = false;
	audiosTut = [];
	activeGameSpace.audioVector = [];
};

pd.finishGame = function(menu) {////talvez seja alterado pra remover o loaderEntreScenas assim que os jogos forem mais leves
//	Finaliza o jogo   
	if(!endGame) {
		endGame = true;
		if(menu != null && menu != undefined) {
			var scene = menu;
		}
		else {
			pd.liberar();
			mainMenu = new PalcoScene();
			pl.setGlobalDefinitions(definitions_palco);
			vetorDeRecursos = pl.loaderVec;
			scene = new pd.LoaderEntreScenas(vetorDeRecursos, mainMenu);
			pd.reter(mainMenu);
		}
		var transition = FadeTransition(0.3, scene);
		pd.reter(transition);
		cc.director.runScene(transition);
	}
};


pd.shuffle = function(vetor) {
//	Embaralha um vetor
	for(var j, x, i = vetor.length; i; j = Math.floor(Math.random() * i), x = vetor[--i], vetor[i] = vetor[j], vetor[j] = x);
	return vetor;
};


pd.rearrange = function(vetor, index) {
//	Elimina um item de um vetor e rearranja os indices dos seguintes
	vetor.splice(index, 1);
	for(i = index; i < vetor.length; i++) {
		vetor[i].indice = vetor[i].indice - 1;
	}
};


pd.lastIndex = function(vetor) {
//	Retorna o último índice de um vetor
	return vetor[vetor.length -1];
};


pd.randomInterval = function(min, max) {
//	Retorna um numero aleatorio dentro de um intervalo definido por min e max
	return Math.floor(Math.random() * (max - min + 1)) + min;
};


pd.proportion = function() {
//	Mantem as coordenadas proporcionais para todos os tamanhos de tela - a área desenhavel (canvas), TEM QUE ESTAR CENTRALIZADA
	var largura = (cc.winSize.width - TARGETX) / 2;
	var altura = (cc.winSize.height - TARGETY) / 2;
	return {x: largura, y: altura};
};

pd.pausar = function(target, audios) {
	if(audios != null && audios != undefined) {
		for(var i = 0; i < audios.length; i++) {
			audios[i].pausar();
		}
	}
	

	target.pause();
	var acoesPausadas = cc.director.getActionManager().pauseAllRunningActions();

	isPaused = true;
	return acoesPausadas;
};


pd.resumar = function(target, acoesPausadas,audios) {
	if(audios != null && audios != undefined) {
		for(var i = 0; i < audios.length; i++) {
			audios[i].despausar();
		}
	}

	target.resume();
	if (acoesPausadas && acoesPausadas.length > 0) {
		cc.director.getActionManager().resumeTargets(acoesPausadas);
	}

	isPaused = false;
};

pd.reter = function(objeto) {
	if(objeto.foiRetido == null || objeto.foiRetido == undefined){
		objeto.retain();
		objeto.foiRetido = true;
		retidos.push(objeto);
	}
};

pd.liberar = function() {//libera Tudo incluindo cache
	for(var i = 0; i < retidos.length; i++) {
		retidos[i].foiRetido = null;
		if(retidos[i] != null && retidos[i] != undefined){
			retidos[i].release();
			retidos[i] = null;
		}
	}

	pd.limparSpriteFrameCache(pd.load_resources);
	pd.limparSpriteFrameCache(activeGameSpace.g_resources);
	pd.limparSpriteFrameCache(resources);

	if(resAdicional != undefined && resAdicional != null && resAdicional.length > 0)
		pd.limparSpriteFrameCache(resAdicional);
	resAdicional = [];

	cc.sys.garbageCollect();
	retidos = [];
};

pd.trocaCena = function(transicao, layer) {	
	if(layer.FinalizouCena == null || layer.FinalizouCena == undefined){
		layer.FinalizouCena = true;
		var delay = new cc.DelayTime(0.5);
		var troca = new cc.CallFunc(function(){
			endLevel = false;
			cc.director.runScene(transicao);
		}, layer);
		var seqTroca = cc.Sequence.create(delay, troca);
		pd.reter(transicao);
		pd.reter(seqTroca);
		layer.runAction(seqTroca);	
	}
};
//console.log("cObject");
pd.cObject = function(spriteName, x, y, pai, zOrder, name){
	var obj = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(spriteName + '.png'));
	obj.setPosition(x, y);
	if(zOrder == null || zOrder == undefined)
		zOrder = 0;

	if(pai != undefined && pai != null)
		pai.addChild(obj, zOrder);

	if(DebugMode)
		pd.AddToDebugger(obj);
	return obj;
}

pd.cText = function(x, y, txt, font, size){
	var text = null;
	if(typeof txt == "string"){
		texto = new cc.LabelTTF(txt, font, size);
		texto.setFontFillColor(new cc.Color(0, 0, 0));
	}
	else{
		texto = new cc.Sprite(txt);
	}
	texto.setPosition(x, y);
	texto.setAnchorPoint(0.5, 1);
	return texto;
}


