var mainMenu;
var resources;

pd.PreloadLayer = cc.Layer.extend(
		{
			icons:[],
			layer:null,
			progress:null,

			init:function()
			{
				winSize = cc.director.getWinSize();

				this._super();
				if(cc.sys.isNative){
					pd.limparSpriteFrameCache();
					var loader = cc.loader.load(pd.load_resources);
				}

				var logo = new cc.Sprite(pd.resLoad.s_logo);

				this.layer = new cc.LayerColor(cc.color(255, 255, 255, 0), 1024, 768);
				this.layer.setPosition(winSize.width / 2, winSize.height / 2);
				this.addChild(this.layer, 0, 0);

				var str_carregando = new cc.Sprite(pd.resLoad.s_carregando);
				var progress = new cc.Sprite(pd.resLoad.s_loadbar);
				var progressBG = new cc.Sprite(pd.resLoad.s_loadbarBG);


				var cache = cc.spriteFrameCache;
				cache.addSpriteFrames(pd.resLoad.icon_plist);

				logo.setPosition(cc.p(0, 0));
				progress.setAnchorPoint(0,0);
				progressBG.setPosition(cc.p(512, 100));
				posx = progressBG.getPosition().x;
				posx -= 389.5;
				posy = progressBG.getPosition().y;
				posy += 15.5;
				progress.setPosition(cc.p(posx + 8, 90)); 
				str_carregando.setPosition(cc.p(512, 100));
				//cc.log(progressBG.getPosition().y)
				//cc.log(progressBG.getContentSize().height/2)
				//cc.log(progress.getPosition())
				

				nframes = [30,55,30,45,40,43,37,53,30];


				for(i = 0; i < 9; i++){
					aux = i+1;
					this.icons[i] = new pd.Animado();
					this.icons[i].addAnimation("icon"+aux, 1, nframes[i],"icon"+aux+"_");
					this.icons[i].setAnimation("icon"+aux);
					this.icons[i].setPosition(posx + 78*aux, posy);
					this.icons[i].setAnchorPoint(0.5,0);
					this.icons[i].valor = false;
				}
				this.layer.addChild(logo,1,1);
				logo.addChild(progressBG,2,2)
				logo.addChild(progress,3,3);
				logo.addChild(str_carregando,4,4);

				for(i = 0; i < 9; i++) {
					logo.addChild(this.icons[i],5,5);
				}

				progress.icons = this.icons;
				progress.perc = 0; 
				progress.setScaleX(0);
				this.progress = progress;
				return true;
			},
			onEnterTransitionDidFinish: function() {
				//cc.log(cc.textureCache.getCachedTextureInfo());
				//sys.dump();
				//sys.dumpRoot();
				this.LoadScreen(resources);    
			},

			LoadScreen:function(res) {
				if(cc.sys.isNative){
					this.progress.loader = new pd.textureLoader(res, pd.g_resources);
					this.progress.total = res.length + pd.g_resources.length - 1;  		
					this.progress.schedule(this.LoadUpdateNative);
					this.progress.isDoneLoading = false;
					//this.progress.cacheLoader = preload_Cache;
				}
				else{
					var loading = {
						name : "the name is loading",
						trigger : function(){this.count ++;},
						cb : function(err){
							pd.preload_Cache(resources, pd.g_resources);
							this.termino = true;
						}
					};
					res = resources.concat(pd.g_resources);

					loading.res = res;
					loading.cacheLoader = pd.preload_Cache;
					loading.count = 0;
					loading.termino = false;
					var option = {
							trigger : loading.trigger,
							triggerTarget : loading,
							cbTarget : loading,
							cb : loading.cb
					}
					//Usage1
					var loader = cc.loader.load(res, option, function(err){
						if(err) return cc.log("load failed");
					});
	
					this.progress.icons = this.icons;
					this.progress.loader = loading;
					this.progress.perc = 0;
					this.progress.total = res.length;
					this.progress.schedule(this.LoadUpdateHtml5);
					
				}
				return true;
			},

			LoadUpdateNative:function() {
				if ("mouse" in cc.sys.capabilities) {
					//Deve ser executado apenas no browser - funcao cc.Loader.getInstance() da pau no mobile por razoes desconhecidas
					var percentage = (this.loader.countTotal/ this.total ) * 100;
				}
				else if ("touches" in cc.sys.capabilities) {
					//Para ser utilizado no mobile - ver inicio do metodo Loadupdate
					var percentage = (this.loader.countTotal/ this.total ) * 100;
				}
				//cc.log(this.total);
				//cc.log(this.loader.count);
				if(this.loader.count <= this.loader.maxCount){
					if(this.loader.LoadNextTexture()){
						this.isDoneLoading = true;
					}
				}
				if(this.perc < percentage) {
					this.perc += 0.5;
				}
				this.setScaleX(this.perc/100);
				for(i = 0;i < 9; i++) {
					if(this.icons[i].valor == false && this.perc >= (i+1)*10) {
						this.icons[i].run(false);
						this.icons[i].valor = true;
					}
				}

				if((this.perc >= 100 ||(percentage == 100 && DebugMode) )&& this.isDoneLoading){
					this.isDoneLoading = false;
					this.unscheduleAllCallbacks();
					//fim do load, trocar a cena por a proxima que voce desejar
					var director = cc.director;  
					//ver classe Transitions.js pra mais transiçoes
					if (DebugMode) {
						transition = mainMenu;
					} else {
						transition = new FadeWhiteTransition(1.2, mainMenu);
					}
 					pd.reter(transition);
					if(cc.sys.isNative){
						cc.log('getCachedTextureInfo TC');
						cc.log(cc.textureCache.getCachedTextureInfo());
						//cc.textureCache.dumpCachedTextureInfo();
					}
					director.runScene(transition);
					return true;
				}   
				return true;
			},
			LoadUpdateHtml5:function() {
				if ("mouse" in cc.sys.capabilities) {
					//Deve ser executado apenas no browser - funcao cc.Loader.getInstance() da pau no mobile por razoes desconhecidas
					var percentage = (this.loader.count/ this.total ) * 100;
				}
				else if ("touches" in cc.sys.capabilities) {
					//Para ser utilizado no mobile - ver inicio do metodo Loadupdate
					var percentage = (this.loader.count/ this.total ) * 100;
				}

				if(this.perc < percentage) {
					this.perc += 0.5;
				}
				this.setScaleX(this.perc/100);
				for(i = 0;i < 9; i++) {
					if(this.icons[i].valor == false && this.perc >= (i+1)*10) {
						this.icons[i].run(false);
						this.icons[i].valor = true; 
					}
				}

				if((this.perc >= 100 ||(percentage == 100 && DebugMode) )&& this.loader.termino == true){
					this.unscheduleAllCallbacks();
					//fim do load, trocar a cena por a proxima que voce desejar
					var director = cc.director;  
					//ver classe Transitions.js pra mais transiçoes
					if (DebugMode) {
						transition = mainMenu;
					} else {
						transition = new FadeWhiteTransition(1.2, mainMenu);
					}
 					pd.reter(transition);
					director.runScene(transition);
					return true;
				}   
				return true;
			},
		});

pd.PreloadScene = cc.Scene.extend({
	onEnter:function(){
		this._super();
		var layer = new pd.PreloadLayer();
		layer.init();
		this.addChild(layer);
	}
});