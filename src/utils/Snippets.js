/**
 * Created by Ryan Balieiro on 23/05/17.
 * @desc - Conjunto de snippets (utilitários).
 */

//<editor-fold desc="#Array Utils">
/**
 * Embaralha um array.
 * @type {Function}
 * @param {Array} array
 * @returns {Array}
 */
pd.shuffle = function(array) {
    for(var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
    return array;
};

/**
 * Elimina um elemento do array e reorganiza-o (fazendo shifting de todos elementos à frente do item removido para a esquerda).
 * @type {Function}
 * @param {Array} array
 * @param {Number} index
 */
pd.rearrange = function(array, index) {
    array.splice(index, 1);
    for(var i = index; i < array.length; i++) {
        array[i].indice = array[i].indice - 1;
    }
};

/**
 * Clona um array.
 * @type {Function}
 * @param {Array} array
 * @returns {Array}
 */
pd.cloneArray = function(array) {
    const cloned = [];
    for(var i in array)
        cloned[i] = array[i];
    return cloned;
};

/**
 * Clona todas as propriedades de um objeto dentro de um array.
 * @param {Object} object
 * @returns {Array}
 */
pd.objectToArray = function(object) {
    const array = [];
    for(var i in object)
        array.push(object[i]);
    return array;
};

/**
 * Troca a posição de dois elementos de um array entre eles.
 * @type {Function}
 * @param {Array} array
 * @param {Number} i - índice do primeiro elemento.
 * @param {Number} j - índice do segundo elemento.
 */
pd.arraySwap = function(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
};

/**
 * Ordena um array.
 * @type {Function}
 * @param {Array} array
 * @param {Number} [key = null] - a propriedade dos elementos do array que será usada como chave de ordenação. Se for null, o elemento do array será a própria chave.
 * @param {boolean} [crescentOrder=false]
 */
pd.orderBy = function(array, key, crescentOrder) {
    crescentOrder = crescentOrder == null || crescentOrder == undefined ? false : crescentOrder;
    for(var i = 0 ; i < array.length ; i++) {
        for(var j = i + 1 ; j < array.length; j++) {
            if(((array[j][key] || array[j]) < (array[i][key] || array[i])) == !crescentOrder) {
                pd.arraySwap(array, j, i);
            }
        }
    }
};

/**
 * Busca um elemento no array cujo elemento no campo 'key' tem o valor informado.
 * @param {Array} array
 * @param {String} key
 * @param {*} value
 */
pd.findElementByKeyValue = function(array, key, value) {
    for(var i in array) {
        if(array[i][key] == value)
            return array[i];
    }
    return null;
};

/**
 * Retorna o array como um string, podendo usar uma função customizada para converter cada item do array para texto
 * @param {Array} array
 * @param {Function} [fncItems] - Uma função para imprimir cada item do vetor
 * @returns {String}
 */
pd.arrayToString = function (array, fncItems) {
    var text = "[";
    for (var n = 0; n < array.length; n++) {
        if (n !== 0)
            text += ", ";
        if (fncItems) {
            text += fncItems(array[n]);
        } else {
            text += array[n];
        }
    }
    text += "]";
    return text;
};
//</editor-fold>
//<editor-fold desc = "#String">
/**
 * Formata um número para string com um comprimento mínimo fixo.
 * @type {Function}
 * @param {Number} number - um número qualquer.
 * @param {Number} [minLength=4] - o comprimento mínimo.
 * @returns {String}
 */
pd.numberToString = function(number, minLength) {
    if(minLength === undefined)
        minLength = 4;

    var str = number.toString();
    for(var n = str.length ; n < minLength ; n++) {
        str = "0" + str;
    }
    return str;
};

/**
 * Converte um caractere (na realidade, o primeiro caractere do que for passado) para número. Usado para obter o código ASCII de uma letra
 * @param {string} caract
 * @returns {Number}
 */
pd.convertCharToInt = function (caract) {
    return caract.charCodeAt(0);
};
//</editor-fold>
//<editor-fold desc="#Math">
/**
 * Retorna um número aleatório dentro de um intervalo pré-definido.
 * @type {Function}
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
pd.randomInterval = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Retorna um número limitando o seu valor ao range especificado.
 * @param {Number} min - o limite inferior.
 * @param {Number} max - o limite superior.
 * @returns {Number}
 */
pd.clamp = function(number, min, max) {
    return Math.min(Math.max(number, min), max);
};

/**
 * Dado um valor, retorna um extremo, informado, positivo ou negativo
 * @example
 * <p>
 *     pd.roundToExtreme(5, 10) irá retornar 10
 *     pd.roundToExtreme(-2, 1) irá retornar -1
 *     pd.roundToExtreme(0, 5) irá retornar 0
 * </p>
 * @param {Number} number
 * @param {Number} extreme
 * @returns {Number}
 */
pd.roundToExtreme = function (number, extreme) {
    if (number === 0) {
        return 0;
    }
    return (number/Math.abs(number)) * extreme;
};
//</editor-fold>
//<editor-fold desc="#Object Creation">
/**
 * Busca um cc.SpriteFrame no cache.
 * @param {String} spriteFrameName
 * @returns {cc.SpriteFrame}
 */
pd.getSpriteFrame = function(spriteFrameName) {
    if(spriteFrameName.lastIndexOf(".png") == -1)
        spriteFrameName += ".png";

    return cc.spriteFrameCache.getSpriteFrame(spriteFrameName);
};

/**
 * Cria e configura uma sprite.
 * @param {String} spriteOrSpriteFrameName
 * @param {Object} [attr=null]
 * @param {cc.Node} [parentNode=null]
 * @param {Number} [localZOrder=null]
 * @param {String} [editorName=null]
 * @returns {cc.Sprite}
 */
pd.createSprite = function(spriteOrSpriteFrameName, attr, parentNode, localZOrder, editorName) {
    if(typeof arguments[1] == 'number')
        return pd.legacyCreateSprite.apply(pd, arguments);

    const target = pd.getSpriteFrame(spriteOrSpriteFrameName) || spriteOrSpriteFrameName;
    const obj = new cc.Sprite(target);

    if(attr)
        obj.attr(pd.parseAttr(attr));
    if(parentNode)
        parentNode.addChild(obj, localZOrder || 0);

    if(!cc.sys.isNative && pd.debugMode && editorName) {
        obj.name = editorName;
        pd.Editor.add(obj);
    }

    return obj;
};

/**
 * Cria uma caixa de texto.
 * @param {String} fontPath
 * @param {String} fontName
 * @param {Number} x
 * @param {Number} y
 * @param {Number} fontSize
 * @param {cc.Color} [color=cc.color.BLACK]
 * @param {String} [text=""]
 * @param {cc.TEXT_ALIGNMENT_CENTER|cc.TEXT_ALIGNMENT_LEFT|cc.TEXT_ALIGNMENT_RIGHT} [alignment=cc.TEXT_ALIGNMENT_CENTER]
 * @param {cc.Node} [parentNode=null]
 * @param {Number} [zOrder]
 * @returns {cc.LabelTTF}
 */
pd.createText = function(fontPath, fontName, x, y, fontSize, color, text, alignment, parentNode, zOrder) {
    const labelTTF = new cc.LabelTTF(text || "", cc.sys.isNative ? fontPath : fontName, fontSize);
    labelTTF.setPosition(x, y);
    labelTTF.fillStyle = color || cc.color(0, 0, 0, 255);

    if(alignment)
        labelTTF.setHorizontalAlignment(alignment);

    if(parentNode)
        parentNode.addChild(labelTTF, zOrder || 0);

    return labelTTF;
};

/**
 * Cria uma caixa de texto com uma fonte padrão.
 * @param {pd.Fonts} fontID
 * @param {Number} x
 * @param {Number} y
 * @param {Number} fontSize
 * @param {cc.Color} [color=]
 * @param {String} [text=""]
 * @param {cc.TEXT_ALIGNMENT_CENTER|cc.TEXT_ALIGNMENT_LEFT|cc.TEXT_ALIGNMENT_RIGHT} [alignment=null]
 * @param {cc.Node} [parentNode=null]
 * @param {Number} [zOrder]
 * @returns {cc.LabelTTF}
 */
pd.createTextWithStandardFont = function(fontID, x, y, fontSize, color, text, alignment, parentNode, zOrder) {
    return pd.createText(fontID.path, fontID.name, x, y, fontSize, color, text, alignment, parentNode, zOrder);
};

/**
 * Cria um clipping node.
 * o primeiro rect identifica as dimensões do clipping node (podem ser vazios width e height)
 * o segundo rect identifica as dimensões da área a ser exibida
 * O anchorPoint no clippingNode é de cc.p(0.5, 0.5)
 * @param {cc.Node} parent
 * @param {Number | cc.Rect} xOrClippingNodeRect
 * @param {Number | cc.Rect} yOrMaskRect
 * @param {Number} width
 * @param {Number} height
 * @param {Number} maskX
 * @param {Number} maskY
 * @param {Number} maskWidth
 * @param {Number} maskHeight
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

/**
 * Cria um {@link pd.Animation} passando uma lista de {@link pd.AnimationData} a serem adicionadas
 * @param {Object} attr
 * @param {pd.AnimationData | pd.AnimationData[]} animacoes
 * @returns {pd.Animation}
 */
pd.createAnimation = function (attr, animacoes) {
    const animation = new pd.Animation();
    if(attr) {
        animation.attr(pd.parseAttr(attr));
        animation.setPosition(attr.x, attr.y);
    }
    var animationDataArray = [];
    if (animacoes instanceof Array) {
        animationDataArray = animacoes;
    } else {
        for (var n = 1; n < arguments.length; n++) {
            animationDataArray.push(arguments[n]);
        }
    }
    for (var i = 0; i < animationDataArray.length; i++) {
        animation.addAnimation(animationDataArray[i]);
    }
    return animation;
};

/**
 * Cria um background para o objeto passado em 'caller'
 * @param {cc.Node} caller
 * @param {String | cc.SpriteFrame} res
 * @param {String} [name]
 * @param {Object} [attr]
 * @returns {*}
 */
pd.createBackground = function (caller, res, name, attr) {
    name = name || "background";
    caller[name] = pd.createSprite(res, attr, caller);
    caller[name].setAnchorPoint(0, 0);
    caller[name].setLocalZOrder(0);
    return caller[name];
};

/**
 * Parseia um objeto de configuração.
 * @param attr {Object}
 */
pd.parseAttr = function(attr) {
    if(attr.hasOwnProperty("scale")) {
        attr.scaleX = attr.scale;
        attr.scaleY = attr.scale;
    }
    if(attr.hasOwnProperty("rotation")) {
        attr._rotationX = attr.rotation;
        attr._rotationY = attr.rotation;
    }
    if(attr.hasOwnProperty("flippedX")) {
        attr._flippedX = attr.flippedX;
    }
    if(attr.hasOwnProperty("flippedY")) {
        attr._flippedY = attr.flippedY;
    }
    if(attr.hasOwnProperty("anchor")) {
        attr.anchorX = attr.anchor;
        attr.anchorY = attr.anchor;
    }
    /**
     * @link {../../../_3_15/frameworks/cocos2d-html5/cocos2d/core/base-nodes/BaseNodesPropertyDefine.js}
     */
    //skewX
    //skewY
    //zIndex
    //visible

    return attr;
};
//</editor-fold>
//<editor-fold desc="#Navigation">
/**
 * Troca de cena. Essa função supõe que você utilize as funções de transição presentes em Transitions.js
 * @param {cc.Scene|*} scene - Protótipo de cena ou objeto pronto
 * @param {Number} [delay] - Tempo para transição, se necessário
 * @param {Function} [transition] - Transição a ser usada, se for usar
 * @returns {cc.Scene} A cena gerada/informada na função
 */
pd.changeScene = function (scene, delay, transition) {
    var sceneObj = scene instanceof cc.Scene ? scene : new scene();
    pd.delegate.retain(sceneObj);
    if (delay == null || delay === 0) {
        cc.director.runScene(sceneObj);
    } else {
        cc.director.runScene(transition(delay, sceneObj));
    }
    return sceneObj;
};

/**
 * Obtém a cena atual -> utilizar a chamada direta pd.currentScene (útil para acessar elementos via console).
 * @type {cc.Scene}
 */
pd.currentScene = null;
pd.__defineGetter__("currentScene", function() {
    return cc.director.getRunningScene();
});
//</editor-fold>
//<editor-fold desc="#Geometry">
/**
 * Gera o polígono (vetor de vértices a partir de um objeto
 * @param {cc.Node} obj
 * @param {boolean} [toWorld=true]
 */
pd.objectToPolygon = function (obj, toWorld) {
    if(toWorld !== false)
        return pd.rectToPolygon(obj.getBoundingBoxToWorld());
    else
        return pd.rectToPolygon(obj.getBoundingBox());
};

/**
 * Gera o polígono (vetor de vértices) a partir de um rect.
 * @param {cc.Rect} rect
 * @returns {Array}
 */
pd.rectToPolygon = function(rect) {
    return [
        cc.p(rect.x, rect.y),
        cc.p(rect.x + rect.width, rect.y),
        cc.p(rect.x + rect.width, rect.y + rect.height),
        cc.p(rect.x, rect.y + rect.height),
    ];
};

/**
 * Gera a bounding box de um polígono.
 * @param {{cc.Point}[]} polygon
 */
pd.polygonToRect = function(polygon) {
    var minX = null;
    var maxX = null;
    var minY = null;
    var maxY = null;

    for(var i in polygon) {
        var vertex = polygon[i];
        if(minX === null || vertex.x < minX)
            minX = vertex.x;
        if(maxX === null || vertex.x > maxX)
            maxX = vertex.x;
        if(minY === null || vertex.y < minY)
            minY = vertex.y;
        if(maxY === null || vertex.y > maxY)
            maxY = vertex.y;
    }

    return cc.rect(minX, minY, maxX - minX, maxY - minY);
};

/**
 * Verifica se um ponto está em um segmento de reta.
 * @param {cc.Point} p
 * @param {{p1:cc.Point, p2:cc.Point}} l
 * @param {Number} w - distância máxima para considerar um ponto como dentro de uma reta
 * @returns {boolean}
 */
pd.pointInLineIntersection = function(p, l, w) {
    //TODO Rever essa assinatura. Criar objeto só para isso?
    return pd.pointToSegmentDistance(p, l) <= w;
};

/**
 * Verifica se dois segmentos de reta se interceptam.
 * @param {{p1:cc.Point, p2:cc.Point}} l1
 * @param {{p1:cc.Point, p2:cc.Point}} l2
 * @returns {boolean}
 */
pd.lineInLineIntersection = function(l1, l2) {
    var s10_x = l1.p1.x - l1.p2.x; // obtém o "b" da reta l1
    var s10_y = l1.p1.y - l1.p2.y; // obtém o "a" da reta l1
    var s32_x = l2.p1.x - l2.p2.x; // obtém o "b" da reta l2
    var s32_y = l2.p1.y - l2.p2.y; // obtém o "a" da reta l2

    var denom = s10_x * s32_y - s32_x * s10_y; // produto escalar entre as retas.
    if (denom == 0) // retas colineares - não colidem!
        return false;

    var denomPositive = denom > 0; // denom > 0 - retas concorrentes || denom < 0 - retas reversas
    var s02_x = l1.p2.x - l2.p2.x; // calcula o produto misto das retas
    var s02_y = l1.p2.y - l2.p2.y;

    var s_numer = s10_x * s02_y - s10_y * s02_x;
    var t_numer = s32_x * s02_y - s32_y * s02_x;
    if ((s_numer < 0) == denomPositive || (t_numer < 0) == denomPositive || ((s_numer > denom) == denomPositive) || ((t_numer > denom) == denomPositive))
        return false;

    var t = t_numer / denom;
    var i_x = l1.p2.x + (t * s10_x);
    var i_y = l1.p2.y + (t * s10_y);

    function comparePoints(p1x, p1y, p2x, p2y) {if(p1x == p2x && p1y == p2y) return 1; else return 0;}
    return (comparePoints(l1.p1.x, l1.p1.y, i_x, i_y) + comparePoints(l1.p2.x, l1.p2.y, i_x, i_y) + comparePoints(l2.p1.x, l2.p1.y, i_x, i_y) + comparePoints(l2.p1.x, l2.p1.y, i_x, i_y) != 2);
};

/**
 * Verifica se um ponto está dentro de uma faixa de tolerância de uma função
 * @param {number} x
 * @param {number} y
 * @param {Function} func
 * @param {Object} funcHandler
 * @param {number | boolean} toleranceOrReturnPointDistance - Ao invés de retornar verdadeiro ou falso, retorna a distância
 * @returns {boolean}
 */
pd.pointInFunction = function (x, y, func, funcHandler, toleranceOrReturnPointDistance) {
    var retFunc = func.apply(funcHandler, x);
    cc.log("[pd.pointInFunction] x informado: " + x + ", f(x) informado: " + y + ", f(x) obtido: " + retFunc);
    if(toleranceOrReturnPointDistance === true)
        return (Math.abs(retFunc - y));
    else
        return (Math.abs(retFunc - y) <= toleranceOrReturnPointDistance);
};

/**
 * Movimenta um polígono nas quantidades X e Y informadas
 * @param {cc.Point[]} polygon
 * @param {number | cc.Point} xOrPoint
 * @param {number} [y]
 */
pd.translatePolygon = function (polygon, xOrPoint, y) {
    if(y === undefined) {
        y = xOrPoint.y;
        xOrPoint = xOrPoint.x;
    }
    for(var n = 0; n < polygon.length; n++) {
        polygon[n].x += xOrPoint;
        polygon[n].y += y;
    }
};

/**
 * Verifica se um ponto está dentro de um polígono.
 * @param {cc.Point} p
 * @param {cc.Point[]} vertexes
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
 * @param {cc.Point[]} polygon1
 * @param {cc.Point[]} polygon2
 * @returns {boolean}
 * @author Ricardo Petrére
 */
pd.polygonInPolygonIntersection = function(polygon1, polygon2) {
    var hasCollided = false;
    var n = 0;
    //polygon1 vai primeiro
    for (n = 0; n < polygon1.length; n++) {
        if (pd.pointInPolygonIntersection(polygon1[n], polygon2)) {
            hasCollided = true;
            break;
        }
    }
    //É a vez de polygon2, mas só se não houve colisão do lado de polygon1
    if (!hasCollided) {
        for (n = 0; n < polygon2.length; n++) {
            if (pd.pointInPolygonIntersection(polygon2[n], polygon1)) {
                hasCollided = true;
                break;
            }
        }
    }
    return hasCollided;
};

/**
 *
 * @param {cc.Point[]} polygonOuter
 * @param {cc.Point[]} polygonInner
 * @returns {boolean}
 */
pd.polygonContainsPolygon = function (polygonOuter, polygonInner) {
    var n, numberContainedPoints = 0;
    for (n = 0; n < polygonInner.length; n++) {
        if (pd.pointInPolygonIntersection(polygonInner[n], polygonOuter)) {
            numberContainedPoints++;
        }
    }
    return numberContainedPoints === polygonInner.length;
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
 * @param {Number|cc.Point} x1Orp1
 * @param {Number|cc.Point} y1Orp2
 * @param {Number} [x2]
 * @param {Number} [y2]
 * @returns {number}
 * @author Ricardo Petrére
 */
pd.pointDistance = function(x1Orp1, y1Orp2, x2, y2) {
    var x1 = typeof x1Orp1 == "number" ? x1Orp1 : x1Orp1.x;
    var y1 = typeof x1Orp1 == "number" ? y1Orp2 : x1Orp1.y;
    x2 = typeof y1Orp2 == "number" ? x2 : y1Orp2.x;
    y2 = typeof y1Orp2 == "number" ? y2 : y1Orp2.y;

    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

/**
 * Calcula a distância entre um ponto e um segmento.
 * @param {cc.Point} p
 * @param {{p1:cc.Point, p2:cc.Point}} l
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
    return Math.sqrt(distToSegmentSquared(p, l.p1, l.p2));
};

/**
 * Realiza a soma vetorial entre dois {@link cc.Point} ou {@link cc.Rect}
 @param {cc.Rect | cc.Point} posOrRect
 @param {cc.Rect | cc.Point | number} rectOrPosOrX
 @param {number} [y]
 @param {number} [w]
 @param {number} [h]
 @param {cc.Rect | cc.Point} [returnPoint] - O último parâmetro informado. O resultado da soma dos valores, é também retornado na função
 @returns {cc.Rect | cc.Point} O ponto que também foi retornado em 'returnPoint'
 **/
pd.pointAdd = function (posOrRect, rectOrPosOrX, y, w, h, returnPoint) {
    if (arguments.length > 2 && arguments[arguments.length - 1] instanceof Object) {
        var retorno = arguments[arguments.length - 1];
    } else {
        retorno = cc.rect();
    }
    retorno.x = posOrRect.x;
    retorno.y = posOrRect.y;
    if (rectOrPosOrX.x !== undefined) {//rectOrPosOrX isn't number
        retorno.x += rectOrPosOrX.x;
        retorno.y += rectOrPosOrX.y;
    } else {
        retorno.x += rectOrPosOrX;
        if (y !== undefined) {
            retorno.y += y;
        }
    }
    if (posOrRect.width !== undefined) {//posOrRect is cc.rect
        if (rectOrPosOrX.width !== undefined) {
            w = rectOrPosOrX.width;
        }
        if (rectOrPosOrX.height !== undefined) {
            h = rectOrPosOrX.height;
        }
        retorno.width = posOrRect.width + (w || 0);
        retorno.height = posOrRect.height + (h || 0);
    }
    return retorno;
};

/**
 * Calcula o ângulo entre dois pontos, podendo retornar o valor em graus ou radianos, e podendo inverter a ordem dos pontos no cálculo
 * @param {cc.Point} pA
 * @param {cc.Point} pB
 * @param {boolean} [showInRadians]
 * @param {boolean} [reverse] Troca a ordem dos pontos, mudando a referência de pontos
 * @returns {number} - Ângulo no sentido anti-horário
 */
pd.getAngle = function (pA, pB, showInRadians, reverse) {
    if (reverse) {
        var retorno = Math.atan2(pA.y - pB.y, pA.x - pB.x);
    } else {
        retorno = Math.atan2(pB.y - pA.y, pB.x - pA.x);
    }
    if (showInRadians) {
        return retorno;
    } else {
        return cc.radiansToDegrees(retorno);
    }
};

/**
 * Dado um ângulo qualquer, normaliza-o para o intervalo [0-360]
 * @param {Number} angle
 */
pd.normalizeAngle = function(angle) {
    angle = angle % 360;
    if(angle < 0)
        angle = 360 + angle;

    return angle;
};
//</editor-fold>
//<editor-fold desc="#Actions and Feedback">
/**
 * Cria uma sequência de 'palpitação'.
 * @param {Number} time - o tempo da animação.
 * @param {Number} pulsations - o número de palpitações que o objeto irá fazer dentro do intervalo de tempo.
 * @param {Number} initialScale - o valor de escala inicial do objeto.
 * @param {Number} targetScale - a escala que o objeto irá assumir ao encolher-se.
 * @returns {cc.Sequence}
 */
pd.pulse = function(time, pulsations, initialScale, targetScale) {
    if(!time || !pulsations || !initialScale || !targetScale)
        throw new Error("[pd.pulse] Um ou mais argumentos obrigatórios não foram fornecidos para a função!");

    const sequenceSteps = [];
    for(var i = 0; i < pulsations; i++) {
        sequenceSteps.push(
            cc.scaleTo(time/(pulsations*2), targetScale, targetScale),
            cc.scaleTo(time/(pulsations*2), initialScale, initialScale)
        );
    }

    return cc.sequence(sequenceSteps);
};

/**
 * Cria uma sequência de 'balanço'.
 * @param {Number} time - o tempo da animação.
 * @param {Number} cycles - o número de ciclos da animação.
 * @param {Number} initialRotation - a rotação inicial do objeto.
 * @param {Number} strength - a 'força' da rotação (em pixels).
 * @returns {cc.Sequence}
 */
pd.shake = function(time, cycles, initialRotation, strength) {
    if(!time || !cycles || (!initialRotation && initialRotation != 0) || !strength)
        throw new Error("[pd.shake] Um ou mais argumentos obrigatórios não foram fornecidos para a função!");

    const sequenceSteps = [];
    for(var i = 0; i < cycles; i++) {
        sequenceSteps.push(
            cc.rotateTo(time/(cycles*4), initialRotation - strength),
            cc.rotateTo(time/(cycles*2), initialRotation + strength),
            cc.rotateTo(time/(cycles*4), initialRotation)
        )
    }

    return cc.sequence(sequenceSteps);
};

/**
 * Cria uma sequência para 'piscar' um objeto entre duas cores.
 * @param {Number} time - o tempo da animação.
 * @param {Number} flicks - o número de piscadas.
 * @param {cc.Color} initialColor - a cor inicial.
 * @param {cc.Color} targetColor - a cor final.
 * @returns {cc.Sequence}
 */
pd.flicker = function(time, flicks, initialColor, targetColor) {
    if(!time || !flicks || !initialColor || !targetColor)
        throw new Error("[pd.flicker] Um ou mais argumentos obrigatórios não foram fornecidos para a função!");
    const sequenceSteps = [];
    for(var i = 0; i < flicks; i++) {
        sequenceSteps.push(
            cc.tintTo(time/(flicks*2), targetColor.r, targetColor.g, targetColor.b),
            cc.tintTo(time/(flicks*2), initialColor.r, initialColor.g, initialColor.b)
        );
    }
    return cc.sequence(sequenceSteps);
};

/**
 * Cria uma sequência de fluttering (se movendo de um lado pro outro).
 * @param {Number} time
 * @param {Number} cycles
 * @param {Number} dx
 * @param {Number} dy
 */
pd.flutter = function(time, cycles, dx, dy) {
    if(!time || !cycles)
        throw new Error("[pd.flutter] Um ou mais argumentos obrigatórios não foram fornecidos para a função!");

    dx = dx || 0;
    dy = dy || 0;

    const sequenceSteps = [];
    for(var i = 0; i < cycles; i++) {
        sequenceSteps.push(
            cc.moveBy(time/(cycles*4), -dx, -dy),
            cc.moveBy(time/(cycles*2), 2*dx, 2*dy),
            cc.moveBy(time/(cycles*4), -dx, -dy)
        )
    }

    return cc.sequence(sequenceSteps);
};

/**
 * Cria uma ação de distorção do objeto (skew)
 * @param {Number} time
 * @param {Number} cycles
 * @param {Number} [sx]
 * @param {Number} [sy]
 * @returns {cc.Sequence}
 */
pd.distort = function (time, cycles, sx, sy) {
    if (!time || !cycles)
        throw new Error("[pd.distort] Um ou mais argumentos obrigatórios não foram fornecidos para a função!");

    sx = sx || 0;
    sy = sy || 0;

    const sequenceSteps = [];
    for(var i = 0; i < cycles; i++) {
        sequenceSteps.push(
            cc.skewBy(time/(cycles*4), -sx, -sy),
            cc.skewBy(time/(cycles*2), 2 * sx, 2 * sy),
            cc.skewBy(time/(cycles*4), -sx, -sy)
        );
    }

    return cc.sequence(sequenceSteps);
};

/**
 * Executa uma ação customizada, que não pré-existe na Cocos <p/>
 * (ex: fade de áudio, como a função {@link pd.AudioEngine._fade}, que foi usada de base para essa função.
 * Outra intenção dessa função é atender o que {@link cc.ActionTween} não for capaz
 * @param {number} duration - Duração da ação em segundos
 * @param {number} cycles - Número de vezes que a função deve ser executada
 * @param {Function} func - Função que será executada (A função deve listar todos os parâmetros que irá necessitar)
 * @param {Object} [funcHandler] - Proprietário da função. Quem será o 'this' na função
 * @param {Array} [argArray] - Vetor contendo os argumentos usados pela função
 * @param {Function} [cb] - Função a ser executada após a ação terminar
 * @param {Object} [cbHandler] - Quem será o 'this' no callback
 * @param {Array} [cbArgs] - Vetor contendo os argumentos usados pelo callback
 // * @param {Object} [easing] - cc.easeIn ou cc.easeOut. Interfere no intervalo entre cada execução da função
 * @param {number} [easeRate] - Interfere no intervalo entre cada execução da função
 * @param {boolean} [easeOut] - Se é cc.easeIn ou cc.easeOut
 * @return {cc.Sequence}
 */
pd.customAction = function (duration, cycles, func, funcHandler, argArray, cb, cbHandler, cbArgs, easeRate, easeOut) {
    var step = duration / cycles;
    // cc.log("step: " + step);
    var sequenceSteps = [];
    if(easeRate != null) {
        cc.log("customAction tem easeRate");
        easeOut = easeOut || false;
        var easing;
        if(easeOut === true) {
            // easing = new cc.EaseOut(easeRate);
            easing = cc.easeOut(easeRate);
            easeRate = 1 / easeRate;
        } else {
            // easing = new cc.EaseIn(easeRate);
            easing = cc.easeIn(easeRate);
        }
    }
    for(var i = 0; i < cycles; i++) {
        if (i > 0) {
            // sequenceSteps.push(cc.delayTime(easing != null ?
            //     (easing.easing(i / cycles) - easing.easing((i - 1) / cycles)) * duration

            sequenceSteps.push(cc.delayTime(easeRate != null ?
                (
                    Math.pow(i / cycles, easeRate)
                    - Math.pow((i - 1) / cycles, easeRate)
                ) * duration

                : step));
        }
        sequenceSteps.push(pd.perfectCallFunc(func, funcHandler, argArray));
    }
    if (cb) {
        sequenceSteps.push(cc.callFunc(cb, cbHandler || funcHandler));
    }
    return cc.sequence(sequenceSteps);
};

/**
 * Cria uma função anônima que executa a ação indicada no node informado e retorna-a encapsulada em uma ação cc.CallFunc.
 * Útil para deixar ações assíncronas dentro de uma sequência.
 * @param {cc.Node} target
 * @param {cc.Action} action
 * @example
 * var action = pd.asyncAction(myNode, cc.moveTo(0.3, 30, 0));
 * @returns {cc.Action}
 */
pd.asyncAction = function(target, action) {
    pd.delegate.retain(action);
    return cc.callFunc(function() {
        this.runAction(action);
        pd.delegate.release(action);
    }, target);
};

/**
 * Retorna uma ação de callFunc que chama a função com os parâmetros originais sem injetar o primeiro parâmetro como o "this".
 * @param {Function} func
 * @param {*} caller
 * @param {...} args
 */
pd.perfectCallFunc = function(func, caller, args) {
    if(arguments.length > 3 || ((args != null && args != undefined) && Array.isArray(args[2]) == false)) {
        var _arguments = [];
        for(var i = 2 ; i < arguments.length ; i++)
            _arguments.push(arguments[i]);
    }
    else {
        _arguments = args;
    }

    return cc.callFunc(function() {
        func.apply(caller, _arguments);
    }, caller);
};

/**
 * Adiciona uma layer de foco ao objeto informado.
 * @param {cc.Node} layer {cc.Layer}
 * @param {Number} time {Number} - o tempo da transição de aparecimento da layer de foco.
 * @param {Number} opacity {Number} - a opacidade da layer de foco.
 * @param {...} nodes - lista de objetos a serem 'focados'.
 */
pd.addFocus = function(layer, time, opacity, nodes){
    if(!layer._focusLayer) {
        layer._focusLayer = new cc.LayerColor(cc.color(0, 0, 0), 1024, 768);
        layer._focusLayer.setOpacity(0);
        layer._focusLayer.targetOpacity = opacity;
        layer._focusLayer.nodes = [];
        layer.addChild(layer._focusLayer, pd.ZOrders.FOCUS_LAYER);
    }

    if(layer._focusLayer.opacity == 0) {
        for (var i = 3; i < arguments.length; i++) {
            layer._focusLayer.nodes.push(arguments[i]);
            arguments[i]._oldZOrder = arguments[i].zIndex;
            arguments[i].setLocalZOrder(pd.ZOrders.FOCUS_OBJECTS);
        }
        if(time > 0)
            layer._focusLayer.runAction(cc.fadeTo(time, opacity));
        else
            layer._focusLayer.setOpacity(opacity);
    }
};

/**
 * Remove a layer de foco do objeto informado, se houver.
 * @param {cc.Node} layer {cc.Layer}
 * @param {Number} time {Number} - o tempo de transição de fadeOut da layer de foco.
 */
pd.removeFocus = function(layer, time) {
    if(layer._focusLayer && layer._focusLayer.nodes) {
        layer._focusLayer.cleanup();
        for (var i in layer._focusLayer.nodes) {
            layer._focusLayer.nodes[i].setLocalZOrder(layer._focusLayer.nodes[i]._oldZOrder);
        }
        if(time > 0)
            layer._focusLayer.runAction(cc.fadeTo(time, 0));
        else
            layer._focusLayer.setOpacity(0);
    }
};

/**
 * Cria e toca um efeito sonoro.
 * @param url {String} - o caminho para o arquivo de som a ser tocado.
 * @param loop {Boolean} - indica se o som deve loopar.
 * @param volume {Number} - indica o volume do som.
 * @returns {*}
 */
pd.playSimpleEffect = function(url, loop, volume) {
    volume = volume || 1;
    var audioId = null;
    if(cc.sys.isNative)
        audioId = pd.audioEngine.playEffect(url, loop, 1, 0, volume);
    else
        audioId = pd.audioEngine.playEffect(url, loop, volume);
    return audioId;
};

/**
 * Retorna uma ação que executa um som
 * @param {String} effect
 * @param {boolean} [loop]
 * @param {number} [volume]
 * @returns {cc.CallFunc}
 */
pd.actionPlayEffect = function (effect, loop, volume) {
    return cc.callFunc(function () {
        pd.audioEngine.playEffect(effect, loop, volume);
    });
};
//</editor-fold>
//<editor-fold desc="#Native Capabilities">
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
//</editor-fold>
//<editor-fold desc="#Configuration">
/**
 * Seta a cor da UI. <br />
 * Realizar a chamada à esta função antes do carregamento dos recursos.
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

/**
 * Injeta um decorator em um objeto dinamicamente (em runtime).
 * @param {*} object
 * @param {pd.decorators} decorator
 */
pd.decorate = function(object, decorator) {
    if(object._mixes && object._mixes.lastIndexOf(decorator) != -1)
        return;

    for(var i in decorator) {
        object[i] = decorator[i];
    }

    object._mixes = object[i]._mixes || [];
    object._mixes.push(decorator);
    decorator.__initDecorator__ && decorator.__initDecorator__.call(object);
};
//</editor-fold>
//<editor-fold desc="#Others">
/**
 * Limpa todas as ações rodando em um layer recursivamente.
 * @param {cc.Node} node
 */
pd.cleanAllRunningActions = function(node) {
    const children = node.getChildren();

    for(var i = 0; i < children.length ; i++) {
        var child = children[i];
        if(child) {
            child.cleanup();
            pd.cleanAllRunningActions(child);
        }
    }
};

/**
 * Retorna uma estrutura com os dados da versão dos padrões. Útil para fazer workarounds de código em runtime
 * @returns {{major: Number, minor: Number, bugfix: {Number}}}
 */
pd.getVersionInfo = function () {
    var array = pd.version.split('.');
    return {
        major: parseInt(array[0]),
        minor: parseInt(array[1]) || array[1],//Para casos como versão alpha/beta
        bugfix: parseInt(array[2]) || 0//Caso não haja
    };
};

/**
 * Imprime em console a taxa de quadros atual
 */
pd.showFPS = function () {
    cc.log((1 / cc.director._deltaTime).toFixed(1));
};

/**
 * Calcula o valor de zOrder a partir do topo para baixo. Útil para dar sensação de profundidade, onde objetos no topo ficam atrás de objetos no fundo
 * @param {number} max
 * @param {number} y
 * @returns {number}
 */
pd.getReversedZOrder = function (max, y) {
    return Math.max(max - y, 0);
};

/**
 * Calcula a posição do centro de uma imagem. Essa função não leva em consideração o anchorPoint do objeto
 * @param {cc.Rect|cc.Sprite} obj
 * @returns {cc.Point}
 */
pd.middleOf = function (obj) {
    return cc.p(obj.width / 2, obj.height / 2);
};

/**
 * Dado o vetor de objetos, retorna o elemento colidindo mais próximo do ponto (locX, locY).
 * @param {Number} locX
 * @param {Number} locY
 * @param {Array} objects
 * @return {*|null}
 */
pd.getNearestCollidingObject = function(locX, locY, objects) {
    var ret = null;
    var minDistance = -1;
    for(var i in objects) {
        if(!objects[i].isInside)
            pd.decorate(objects[i], pd.decorators.ClickableNode);

        if(objects[i].isInside(locX, locY, 1)) {
            var distance = objects[i].getRelativeDistanceTo(locX, locY);
            if(minDistance == -1 || distance < minDistance) {
                ret = objects[i];
                minDistance = distance;
            }
        }
    }

    return ret;
};

/**
 * Verifica se as coordenadas do evento/ponto estão em colisão com a interface padrão.
 * @param {*} eventOrPoint
 */
pd.isCollidingWithUIButton = function(eventOrPoint) {
    const button = pd.currentScene.uiButton;
    if(!eventOrPoint.x) {
        return button.isInside(eventOrPoint.getLocationX(), eventOrPoint.getLocationY());
    }
    else {
        return button.isInside(eventOrPoint.x, eventOrPoint.y);
    }
};

/**
 * Gera um {@link cc.LabelTTF} no meio da tela, para ser usado dentro de um bloco try-catch (err)
 * @param {Error} err
 */
pd.createErrorText = function (err) {
    var texto = pd.createTextWithStandardFont(
        pd.Fonts.DIMBO, 512, 384, 24, cc.color.WHITE, err.message + err.stack, cc.TEXT_ALIGNMENT_LEFT,
        pd.currentScene, 100);
    texto.setDimensions(cc.size(1000, 750));
};
//</editor-fold>