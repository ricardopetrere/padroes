pd.preload_Cache = function(res, padrao){//desutilizado, talvez seja removido
	for(i = 0; i < res.length; i++){
		if(res[i].indexOf(".plist") != -1){
			cc.spriteFrameCache.addSpriteFrames(res[i]);
			cc.log('Vetor normal num ' + i + " " + res[i]);
		}
	}
	if(padrao != undefined && padrao != null){
		for(i = 0; i < padrao.length; i++){
			if(padrao[i].indexOf(".plist") != -1){
				cc.spriteFrameCache.addSpriteFrames(padrao[i]);
				cc.log('Vetor Padrao num ' + i + " " + padrao[i]);
			}
		}
	}
}
pd.preloadSingleData = function(res){
	cc.log(res);
	cc.spriteFrameCache.addSpriteFrames(res);
}
pd.limparSpriteFrameCache = function(gameResourcesToBePurged, naoLimparTudo){
	if(gameResourcesToBePurged != null && gameResourcesToBePurged != undefined){
		for(i = 0; i < gameResourcesToBePurged.length; i++){
			if(gameResourcesToBePurged[i].indexOf(".plist") != -1){
				cc.spriteFrameCache.removeSpriteFramesFromFile(gameResourcesToBePurged[i]);
			}
			else if(gameResourcesToBePurged[i].indexOf(".png") != -1){
				cc.textureCache.removeTextureForKey(gameResourcesToBePurged[i]);
			}
			else if(gameResourcesToBePurged[i].indexOf(".mp3") != -1){
				cc.audioEngine.unloadEffect(gameResourcesToBePurged[i]);
			}		
			else if(gameResourcesToBePurged[i].indexOf(".wav") != -1){
				cc.audioEngine.unloadEffect(gameResourcesToBePurged[i]);
			}
			cc.loader.release(gameResourcesToBePurged[i]);
		}
	}
	if(naoLimparTudo == null || naoLimparTudo == undefined){
		cc.spriteFrameCache.removeSpriteFrames();
		cc.textureCache.removeAllTextures();	
		cc.eventManager.removeAllListeners();
	}
}

pd.textureLoader = function(resources, resourcePadrao){
	this.res = resources;
	this.resourcesPadrao = resourcePadrao;
	this.count = this.res.length > 0 ? 0 : -1;
	this.countTotal = 0;
	this.maxCount = this.res.length - 1;
}
pd.textureLoader.prototype.getCount = function(){
	return this.count;
}

pd.textureLoader.prototype.LoadNextTexture = function(){
	if (this.res.length > 0) {
		cc.log(this.count + " " + this.res[this.count]);
		var loader = cc.loader.load(this.res[this.count]);
		if(this.res[this.count].indexOf(".plist") != -1){
			pd.preloadSingleData(this.res[this.count]);
		}
		this.countTotal++;
	}
	this.count++;
	if(this.count > this.maxCount){
		if(this.resourcesPadrao != null && this.resourcesPadrao != undefined && this.resourcesPadrao.length > 0){
			this.res = this.resourcesPadrao;
			this.count = 0;
			this.maxCount = this.res.length - 1;
			this.resourcesPadrao = null;
			return false;
		}
		else{
			return true;
		}
	}
	else{
		return false;
	}
}
