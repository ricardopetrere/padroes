pd.SceneDebugger =  cc.Node.extend({
	ctor:function(font, size, father){
		this._super();
		pd.setKeyboard(this, "onKeyDown", "onKeyUp");
	},
	addScene:function(sc, cb){
		pd.DebugScenes.push({Scene:sc, Callback: cb});
	},
	onKeyDown:function(e){
	},
	reset:function(){
		pd.DebugScenes = [];		
	},
	onKeyUp:function(e){
		for(var i = 0; i < pd.DebugScenes.length; i ++){
			if(e == 49 + i){
				sc = pd.DebugScenes[i];
				if(sc.Callback)
				this.runAction(new cc.Sequence(sc.Callback, new cc.CallFunc(function(){
					proximo = new pd.delegate.activeNamespace[sc.Scene]();
					var transition = FadeTransition(0.5, proximo);
					pd.delegate.retain(transition);
					cc.director.runScene(transition);
				},this)));

				else{
					proximo = new pd.delegate.activeNamespace[sc.Scene]();
					var transition = FadeTransition(0.5, proximo);
					pd.delegate.retain(transition);
					cc.director.runScene(transition);
				}
			}		
		}
	}
});

if(!pd.delegate.context == pd.Delegate.CONTEXT_PALCO){
	pd.DebugScenes = [];
}