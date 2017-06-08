/**
 * Created by Ryan Balieiro on 23/05/17.
 * @desc - Conjunto de snippets (utilitários).
 */

/****************************************************************************************/
/******************************* #REGION: Array Utils ***********************************/
/****************************************************************************************/

/**
 * Embaralha um array.
 * @type {Function}
 * @param array {Array}
 * @returns {Array}
 */
pd.shuffle = function(array) {
    for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
    return array;
};

/**
 * Elimina um elemento do array e reorganiza-o (fazendo shifting de todos elementos à frente do item removido para a esquerda).
 * @type {Function}
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
 * @type {Function}
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
 * @type {Function}
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
 * @type {Function}
 * @param array {Array}
 * @param [key = null] {Number} - a propriedade dos elementos do array que será usada como chave de ordenação. Se for null, o elemento do array será a própria chave.
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
 * @type {Function}
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
 * Busca um SpriteFrame no cache.
 * @param {String} spriteFrameName
 * @returns {cc.SpriteFrame}
 */
pd.getSpriteFrame = function(spriteFrameName) {
    if(spriteFrameName.lastIndexOf("png") == -1)
        spriteFrameName += ".png";

    return cc.spriteFrameCache.getSpriteFrame(spriteFrameName);
};

/**
 * Cria uma sprite.
 * @type {Function}
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
 * @type {Function}
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
    return clippingNode;
};

/****************************************************************************************/
/******************************** #REGION: Navigation ***********************************/
/****************************************************************************************/

/**
 * Troca a cena atual para a cena informada.
 * @type {Function}
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
        var switchSequence = cc.sequence(delay, funcChange);
        pd.delegate.retain(transition);
        pd.delegate.retain(switchSequence);
        layer.runAction(switchSequence);
    }
};

/**
 * Obtém a cena atual -> utilizar a chamada direta pd.currentScene (útil para acessar elementos via console).
 * @type {cc.Scene}
 */
pd.mainScene = null;
pd.__defineGetter__("mainScene", function() {
   return cc.director._runningScene;
});

/****************************************************************************************/
/********************************* #REGION: Geometry ************************************/
/****************************************************************************************/

/**
 * Verifica se um ponto está em um segmento de reta.
 * @param p {cc.Point}
 * @param l {{p1:cc.Point, p2:cc.Point}}
 * @param w {Number} Distância máxima para considerar um ponto como dentro de uma reta
 * @returns {boolean}
 */
pd.pointInLineIntersection = function(p, l, w) {
    //TODO Rever essa assinatura. Criar objeto só para isso?
    return pd.pointToSegmentDistance(p, l) <= w;
};

/**
 * Verifica se dois segmentos de reta se interceptam.
 * @param l1 {{p1:cc.Point, p2:cc.Point}}
 * @param l2 {{p1:cc.Point, p2:cc.Point}}
 * @returns {boolean}
 */
pd.lineInLineIntersection = function(l1, l2) {
    //TODO Criar lógica. Rever aulas de cálculo/matemática aplicada
};

/**
 * Verifica se um ponto está dentro de um polígono.
 * @param p {cc.Point}
 * @param vertexes {cc.Point[]}
 * @returns {boolean}
 */
pd.pointInPolygonIntersection = function(p, vertexes) {
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
 * @returns {boolean}
 * @author Ricardo Petrére
 */
pd.polygonInPolygonIntersection = function(polygon1, polygon2) {
    var hasCollided = false;
    var n = 0;
    //polygon1 vai primeiro
    for (n = 0; n < polygon1.length; n++) {
        if (jogo4av3mat1.pointInPolygonCollision(polygon1[n], polygon2)) {
            hasCollided = true;
            break;
        }
    }
    //É a vez de polygon2, mas só se não houve colisão do lado de polygon1
    if (!hasCollided) {
        for (n = 0; n < polygon2.length; n++) {
            if (jogo4av3mat1.pointInPolygonCollision(polygon2[n], polygon1)) {
                hasCollided = true;
                break;
            }
        }
    }
    return hasCollided;
};

/**
 *
 * @param {cc.Point[]} array
 * @param {cc.Rect} rect
 * @returns {boolean}
 * @author Ricardo Petrére
 */
pd.polygonInRectCollision = function (array, rect) {
    var hasCollided = false;
    var n = 0;
    for (n = 0; n < array.length; n++) {
        if (cc.rectContainsPoint(rect, array[n])) {
            hasCollided = true;
            break;
        }
    }
    return hasCollided;
};

/**
 * Calcula a distância entre dois pontos.
 * @param p1 {cc.Point}
 * @param p2 {cc.Point}
 * @returns {number}
 * @author Ricardo Petrére
 */
pd.pointDistance = function(p1, p2) {
    //TODO Revisar a assinatura da função. Ser obrigado a criar cc.Point pode impactar performance em alguns jogos
// Ricardo Petrére: Na minha versão, está assim:
// jogo4av3mat1.distance = function (x1, y1, x2, y2) {
    var x1 = p1.x, y1 = p1.y, x2 = p2.x, y2 = p2.y;
    if (x1.x !== undefined) {
        x2 = y1;
        y2 = x2;
        y1 = x1.y;
        x1 = x1.x;
        if (x2.x !== undefined) {
            y2 = x2.y;
            x2 = x2.x;
        }
    }
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

/**
 * Calcula a distância entre um ponto e um segmento.
 * @param p {cc.Point}
 * @param l {{p1:cc.Point, p2:cc.Point}}
 * @author Ricardo Petrére
 */
pd.pointToSegmentDistance = function(p, l) {
    //TODO Rever essa assinatura. Criar objeto só para isso?
    var v = l.p1, w = l.p2;
    /**
     * Para uso futuro (de verificar apenas quando um ponto está paralelo a um segmento)
     *
     * Dentro de {@link distToSegmentSquared}, se t < 0, significa que o ponto está abaixo do intervalo do segmento. <br/>
     * Se t > 1, significa que o ponto está acima do intervalo do segmento
     * @type {boolean}
     */
    var fora_do_segmento;
    function sqr(x) { return x * x }
    function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
    function distToSegmentSquared(p, v, w) {
        var l2 = dist2(v, w);
        if (l2 === 0) return dist2(p, v);
        /**
         * Indicador, relativo ao comprimento do segmento e de 0 a 1, de em que ponto do segmento o ponto está paralelo ao segmento <br/>
         * Valores acima de 1 ou abaixo de 0 indica que o ponto não está paralelo ao segmento
         * @type {number}
         */
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        if (t < 0 || t > 1) {
            fora_do_segmento = true;
        }
        //No caso do ponto "extrapolar" o segmento, serve para buscar o ponto mais próximo do segmento
        t = Math.max(0, Math.min(1, t));
        return dist2(p, { x: v.x + t * (w.x - v.x),
            y: v.y + t * (w.y - v.y) });
    }
    return Math.sqrt(distToSegmentSquared(p, v_comeco, v_fim));
};

/****************************************************************************************/
/*************************** #REGION: Native Capabilities *******************************/
/****************************************************************************************/

/**
 * Abre uma URL.
 * @type {Function}
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
 * @type {Function}
 */
pd.validate = function() {
    var value = "true";
    var key = "validado";

    lStorage.setItem(key, value);
};

/**
 * Checa o status de validação.
 * @type {Function}
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
/******************************* #REGION: Configuration *********************************/
/****************************************************************************************/

/**
 * Seta a cor da UI (realizar a chamada antes do carregamento dos recursos).
 * @function
 * @param {pd.UI_COLOR_BLUE|pd.UI_COLOR_ORANGE} color
 */
pd.setUIColor = function(color) {
    const uiElements = ["s_input", "p_input", "s_menus", "p_menus"];
    if(pd.res[uiElements[0]].lastIndexOf(color) != -1)
        return;

    const currentPattern = color == pd.UI_COLOR_BLUE ? pd.UI_COLOR_ORANGE : pd.UI_COLOR_BLUE;
    for(var i in uiElements) {
        pd.res[uiElements[i]] = pd.res[uiElements[i]].replace(currentPattern, color);
    }

    pd.g_resources = [];
    for (var i in pd.res)
        pd.g_resources.push(pd.res[i]);
};

/**
 * @constant
 * @type {string}
 */
pd.UI_COLOR_BLUE = "blueUI";

/**
 * @constant
 * @type {string}
 */
pd.UI_COLOR_ORANGE = 'orangeUI';

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