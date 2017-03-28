var vetorDeRecursos = [];

pd.LoaderEntreCenasLayer = cc.Layer.extend({
		loader:null,//area pra iniciar variaveis da layer
		isDoneLoading:null,

		init:function(resVector)
		{
			this.addChild(this.layerFundo = new cc.LayerColor(new cc.Color(101,167,228), pl.contentWidth, pl.contentHeight));
			this.loader = new pd.textureLoader(resVector);
			this.loader.maxCount = resVector.length - 1;
		},

		onEnterTransitionDidFinish:function(){
			pd.limparSpriteFrameCache();
			this.scheduleUpdate();
		},

		update: function(dt){
			if(this.loader.count <= this.loader.maxCount){
				if(this.loader.LoadNextTexture()){
					this.unscheduleAllCallbacks();
					this.getParent().callNextScene();
					this.removeFromParent();
					return true;
				}
			}
		}
});


pd.LoaderEntreScenas = cc.Scene.extend({
		resArray:null,
		nextScene:null,
		
		ctor:function(resVector, nextScene){
			this._super();
			this.resArray = resVector;
			this.nextScene = nextScene;
		},
		
		onEnter:function(){
			this._super();
			var layer = new pd.LoaderEntreCenasLayer();
			layer.init(this.resArray);
			this.addChild(layer);
		},
		
		callNextScene:function(){
			var director = cc.director;  
			director.runScene(this.nextScene);
		}
});