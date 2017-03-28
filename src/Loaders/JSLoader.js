pd.JSLoader = [];
pd.JSLoader.loadJSList = function(dir, jsList, call){
	if(call == null || call == undefined)
		call = false;
	
	cc.loader.loadJs(dir,jsList, function(err){
		if(err){
			cc.log(dir);
			cc.log("load failed");
		}
		else{
			cc.log('Registrado JSLIST - ' + dir)
			//JSRegister = true;//?
			if(call)
			RegisterMainAndRes();
			
			cc.LoaderScene.preload(pd.load_resources, function () {//preload dos arquivos de loadscreen
				cc.director.runScene(new pd.PreloadScene());//inicia o loadScreen
			}, this);
		}
	});
};