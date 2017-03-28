//add to pd?
var usarOBB = function(nome) {
	dezipado = jsb.fileUtils.isDirectoryExist(saida + "/res");
	cc.log(dezipado);

	if(!dezipado) {
		cc.log(caminho);
		cc.log(nome);
		cc.log(saida);	
		cc.log('dezipando');
		jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UnzipUtility", "unzip", "(Ljava/lang/String;Ljava/lang/String;)V", caminho + nome, saida);
		cc.log('passou');
	}
	jsb.fileUtils.addSearchPath(saida);
};

var deletarOBB = function(nome) {
	cc.log(jsb.reflection.callStaticMethod("org/cocos2dx/javascript/UnzipUtility", "deletArquivo", "(Ljava/lang/String;Ljava/lang/String;)Z", caminho, nome));
};

var abreLink = function(url) {
	jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openURL", "(Ljava/lang/String;)V", url);
};

var abreLinkIOS = function(url) {
	jsb.reflection.callStaticMethod("AppController", "openURL:", url);
}

var registrarValidacao = function() {
	var value = "true";
	var key = "validado";

	lStorage.setItem(key, value);
};

var checarValidacao = function() {
	var data = lStorage.getItem("validado");
	if(data == "true") {
		return true;
	}
	else {
		return false;
	}
};  