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

/**
 * Troca a posição de dois elementos de um array entre eles.
 * @param array {Array}
 * @param i {Number} - índice do primeiro elemento.
 * @param j {Number} - índice do segundo elemento.
 */
pd.arraySwap = function(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
};

/**
 * Ordena um array.
 * @param array {Array}
 * @param [key = null] {Number} - a propriedade dos elementos do array que será usada como chave de ordenação.
 * se for null, o elemento do array será a própria chave.
 * @param [crescentOrder=true] {Boolean}
 */
pd.orderBy = function(array, key, crescentOrder) {
    crescentOrder = crescentOrder == null || crescentOrder == undefined ? true : crescentOrder;
    for(var i = 0 ; i < array.length ; i++) {
        for(var j = i + 1 ; j < array.length; j++) {
            if(((array[j][key] || array[j]) < (array[i][key] || array[i])) == !crescentOrder) {
                pd.arraySwap(array, j, i);
            }
        }
    }  
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
};

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
};

/**
 * Cria um clipping node.
 * @param parent {cc.Node}
 * @param xOrClippingNodeRect {Number | cc.Rect}
 * @param yOrMaskRect {Number | cc.Rect}
 * @param width {Number}
 * @param height {Number}
 * @param maskX {Number}
 * @param maskY {Number}
 * @param maskWidth {Number}
 * @param maskHeight {Number}
 * @returns {cc.ClippingNode}
 */
pd.createClippingNode = function(parent, xOrClippingNodeRect, yOrMaskRect, width, height, maskX, maskY, maskWidth, maskHeight) {
    if (xOrClippingNodeRect.x !== undefined) {
        maskX = yOrMaskRect.x;
        maskY = yOrMaskRect.y;
        maskWidth = yOrMaskRect.width;
        maskHeight = yOrMaskRect.height;

        height = xOrClippingNodeRect.height;
        width = xOrClippingNodeRect.width;
        yOrMaskRect = xOrClippingNodeRect.y;
        xOrClippingNodeRect = xOrClippingNodeRect.x;
    }
    var clippingNode = new cc.ClippingNode();
    clippingNode.attr({x:xOrClippingNodeRect, y:yOrMaskRect, width:width, height:height});
    parent.addChild(clippingNode, 50);

    const stencil = new cc.DrawNode();
    const rectangle = [cc.p(maskX, maskY),cc.p(maskX + maskWidth, maskY), cc.p(maskX + maskWidth, maskY + maskHeight), cc.p(maskX, maskY + maskHeight)];
    stencil.drawPoly(rectangle, cc.color(255, 0, 0, 255), 0, cc.color(255, 255, 255, 0));
    clippingNode.stencil = stencil;
    //clippingNode.addChild(stencil); talvez precise para o mobile...
    return clippingNode;
};

/****************************************************************************************/
/******************************** #REGION: Navigation ***********************************/
/****************************************************************************************/

/**
 * Troca a cena atual.
 * @static
 * @param transition {cc.Class}
 * @param layer {cc.Node}
 * @param [delay=0.5] {Number}
 */
pd.switchScene = function(transition, layer, delay) {
    if(!layer.didGetDestroyed) {
        layer.didGetDestroyed = true;
        var delay = new cc.DelayTime(delay || 0.5);
        var funcChange = new cc.CallFunc(function(){
            cc.director.runScene(transition);
        }, layer);
        var switchSequence = cc.Sequence.create(delay, funcChange);
        pd.delegate.retain(transition);
        pd.delegate.retain(switchSequence);
        layer.runAction(switchSequence);
    }
};

/****************************************************************************************/
/********************************* #REGION: Geometry ************************************/
/****************************************************************************************/

/**
 * Verifica se um ponto está em um segmento de reta.
 * @param p {cc.Point}
 * @param l {{p1:cc.p, p2:cc.p}}
 */
pd.pointInLineIntersection = function(p, l) {
    //to-do...
};

/**
 * Verifica se dois segmentos de reta se interceptam.
 * @param l1 {{p1:cc.p, p2:cc.p}}
 * @param l2 {{p1:cc.p, p2:cc.p}}
 */
pd.lineInLineIntersection = function(l1, l2) {
    //to-do...
};

/**
 * Verifica se um ponto está dentro de um polígono.
 * @param p {cc.Point}
 * @param vertexes {cc.Point[]}
 */
pd.pointInPolygonIntersection= function(p, vertexes) {
    var hasCollided = false;
    var j = 0;

    for(var i = 0, j = vertexes.length - 1; i < vertexes.length; j = i++) {
        if(((vertexes[i].y > p.y ) != (vertexes[j].y > p.y) ) && (p.x < (vertexes[j].x - vertexes[i].x) * (p.y - vertexes[i].y) / (vertexes[j].y - vertexes[i].y) + vertexes[i].x))
            hasCollided = !hasCollided;
    }
    return hasCollided;
};

/**
 * Verifica se um polígono intercepta outro polígono.
 * @param polygon1 {cc.Point[]}
 * @param polygon2 {cc.Point[]}
 */
pd.polygonInPolygonIntersection = function(polygon1, polygon2) {
    //to-do...
};

/**
 * Calcula a distância entre dois pontos.
 * @param p1 {cc.Point}
 * @param p2 {cc.Point}
 */
pd.pointDistance = function(p1, p2) {
    //to-do...
};

/**
 * Calcula a distância entre um ponto e um segmento.
 * @param p {cc.Point}
 * @param l {{p1:cc.p, p2:cc.p}}
 */
pd.pointToSegmentDistance = function(p, l) {
    //to-do...
};

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
};

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