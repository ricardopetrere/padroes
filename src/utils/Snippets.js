/**
 * Created by Ryan Balieiro on 23/05/17.
 * @desc - Conjunto de snippets (utilitários).
 */

/****************************************************************************************/
/******************************* #REGION: Array Utils ***********************************/
/****************************************************************************************/

/**
 * Embaralha um array.
 * @static
 * @param array {Array}
 * @returns {Array}
 */
pd.shuffle = function(array) {
    for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
    return array;
};

/**
 * Elimina um elemento do array e reorganiza-o (fazendo shifting de todos elementos à frente do item removido para a esquerda).
 * @static
 * @param array {Array}
 * @param index {Number}
 */
pd.rearrange = function(array, index) {
    array.splice(index, 1);
    for(i = index; i < array.length; i++) {
        array[i].indice = array[i].indice - 1;
    }
};

/**
 * Clona um array.
 * @param array {Array}
 * @returns {Array}
 */
pd.cloneArray = function(array) {
    const cloned = [];
    for(var i in array)
        cloned[i] = array[i];
    return cloned;
};

/****************************************************************************************/
/****************************** #REGION: Randomization **********************************/
/****************************************************************************************/

/**
 * Retorna um número aleatório dentro de um intervalo pré-definido.
 * @static
 * @param min {Number}
 * @param max {Number}
 * @returns {Number}
 */
pd.randomInterval = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/****************************************************************************************/
/****************************** #REGION: Object Creation ********************************/
/****************************************************************************************/

/**
 * Cria uma sprite.
 * @static
 * @param spriteFrameName {String}
 * @param x {Number}
 * @param y {Number}
 * @param parentNode {cc.Node}
 * @param zOrder {Number}
 * @returns {cc.Sprite}
 */
pd.createSprite = function(spriteFrameName, x, y, parentNode, zOrder){
    const obj = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame(spriteFrameName + '.png'));
    obj.setPosition(x, y);
    zOrder = zOrder || 0;

    if(parentNode != undefined && parentNode != null)
        parentNode.addChild(obj, zOrder);

    if(pd.debugMode)
        pd.AddToDebugger(obj);
    
    return obj;
}

/**
 * Cria uma caixa de texto.
 * @static
 * @param x {Number}
 * @param y {Number}
 * @param txt {String}
 * @param font {String}
 * @param size {Number}
 * @returns {cc.LabelTTF}
 */
pd.createText = function(x, y, txt, font, size){
    var text = null;
    if(typeof txt == "string"){
        text = new cc.LabelTTF(txt, font, size);
        text.setFontFillColor(new cc.Color(0, 0, 0));
    }
    else{
        text = new cc.Sprite(txt);
    }
    text.setPosition(x, y);
    text.setAnchorPoint(0.5, 1);
    return text;
}

/****************************************************************************************/
/******************************** #REGION: Navigation ***********************************/
/****************************************************************************************/

/**
 * Troca a cena atual.
 * @static
 * @param transition {cc.Class}
 * @param layer {cc.Node}
 */
pd.switchScene = function(transition, layer) {
    //TODO: verificar depois porque fazer essa verificação com a variável 'FinalizouCena'... deixar por enquanto.
    if(layer.FinalizouCena == null || layer.FinalizouCena == undefined){
        layer.FinalizouCena = true;
        var delay = new cc.DelayTime(0.5);
        var troca = new cc.CallFunc(function(){
            cc.director.runScene(transition);
        }, layer);
        var seqTroca = cc.Sequence.create(delay, troca);
        pd.delegate.retain(transition);
        pd.delegate.retain(seqTroca);
        layer.runAction(seqTroca);
    }
};

/****************************************************************************************/
/********************************* #REGION: Geometry ************************************/
/****************************************************************************************/

// TO-DO...

/****************************************************************************************/
/*************************** #REGION: Native Capabilities *******************************/
/****************************************************************************************/

/**
 * Abre uma URL.
 * @static
 * @param url {String}
 */
pd.openURL = function(url) {
    if(cc.sys.os == cc.sys.OS_ANDROID)
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openURL", "(Ljava/lang/String;)V", url);
    else if(cc.sys.os == cc.sys.OS_IOS)
        jsb.reflection.callStaticMethod("AppController", "openURL:", url);
};

/**
 * Salva a validação da aplicação localmente.
 * @static
 */
pd.validate = function() {
    var value = "true";
    var key = "validado";

    lStorage.setItem(key, value);
};

/**
 * Checa o status de validação.
 * @static
 */
pd.checkValidation = function() {
    var data = lStorage.getItem("validado");
    if(data == "true") {
        return true;
    }
    else {
        return false;
    }
}

/****************************************************************************************/
/********************************** #REGION: Legacy *************************************/
/****************************************************************************************/

/**
 * TODO: Verificar onde isso está sendo utilizado... por enquanto deixar aqui.
 */
singletonTouchId = [];
for(i = 0; i < 6; i++){
    singletonTouchId[i] = false;
}