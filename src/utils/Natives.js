/**
 * Created by rcardoso on 11/09/17.
 * @namespace
 */
pd.natives = {
    /**
     * Tipos:
     * Ljava/lang/String; - String
     * I - int
     * F - float
     * Z - boolean
     * Retornos:
     * V - void
     * I - int
     * F - float
     * Z - boolean
     * Ljava/lang/String; - NSString
     */
    JavaTypes: {
        VOID: "V",
        INT: "I",
        FLOAT: "F",
        BOOLEAN: "Z",
        STRING: "Ljava/lang/String;"
    },

    /**
     * Realiza uma chamada à código nativo (Android: Java, iOS: Objetive-C)
     * Verificar em:
     * http://www.cocos2d-x.org/wiki/Invoking_Android_Java_methods_from_JavaScript
     * e
     * http://www.cocos2d-x.org/wiki/Invoking_Objective-C_methods_from_JavaScript
     * IMPORTANTE: O método deve existir na classe
     * @param {String} methodName O nome da função a ser chamada
     * @param {pd.natives.JavaTypes[]} [paramTypes] Um vetor contendo os tipos de parâmetros (exclusivo para Android)
     * @param {pd.natives.JavaTypes} [returnType] O tipo de retorno (exclusivo para Android)
     * @param {...} args Argumentos a serem passados para a função
     * @returns {*}
     */
    callNative: function (methodName, paramTypes, returnType, args) {
        var methodArgs = [], fncArgs, n;
        for (n = 3; n < arguments.length; n++) {
            methodArgs.push(arguments[n]);
        }
        if(cc.sys.os == cc.sys.OS_ANDROID) {
            var paramString = "";
            for(n = 0; paramTypes && n < paramTypes.length; n++) {
                paramString += paramTypes[n];
            }
            fncArgs = ["org/cocos2dx/javascript/AppActivity", methodName, "(" + paramString + ")" + returnType].concat(methodArgs);
        }
        else if(cc.sys.os == cc.sys.OS_IOS) {
            fncArgs = ["AppController", methodName].concat(methodArgs);
        }
        return jsb.reflection.callStaticMethod.apply(jsb.reflection, fncArgs);
    },

    /**
     * Abre uma URL.
     * @type {Function}
     * @param {String} url
     */
    openURL: function(url) {
        if (!cc.sys.isNative && !cc._isNodeJs) {
            window.open(url, '_blank');
        } else if (cc.sys.os == cc.sys.OS_ANDROID)
            pd.natives.callNative("openURL", [pd.natives.JavaTypes.STRING], pd.natives.JavaTypes.VOID, url);
        else if (cc.sys.os == cc.sys.OS_IOS)
            pd.natives.callNative("openURL:", null, null, url);
    }
};