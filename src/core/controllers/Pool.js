/**
 * Created by rcardoso on 19/09/17.
 * @class
 * @extends {cc.Class}
 * @classdesc Pool de objetos.
 */
pd.Pool = cc.Class.extend({
    /**
     * @type {pd.Pool}
     */
    _singleton: null,
    /**
     * @type {*[][]}
     */
    _refs: null,
    /**
     * @constructs
     */
    ctor: function () {
        this.reset();
    },
    /**
     * Retirar um objeto do pool, entregando-o para quem o chamou
     * @param {pd.Pool.Types} type O tipo de objeto a ser retornado
     * @param {Function} [typePrototype] Classe para quando for criar um tipo customizado
     * @returns {*} Um objeto a ser retornado
     */
    borrow: function (type, typePrototype) {
        if(this.has(type)) {
            return this._refs[type].shift();
        } else {
            return this._createObject(type, typePrototype);
        }
    },
    /**
     * Gera um objeto, caso o pool não possua o objeto pedido em {@link pd.Pool.borrow}
     * @param {pd.Pool.Types} type O tipo a ser criado
     * @param {Function} [typePrototype] Classe para quando for criar um tipo customizado
     * @private
     * @returns {*}
     */
    _createObject: function (type, typePrototype) {
        switch (type) {
            case pd.Pool.Types.Point:
                return cc.p();
            case pd.Pool.Types.Sprite:
                return new cc.Sprite();
            case pd.Pool.Types.Object:
                return {};
            default:
                if(!typePrototype)
                    throw new Error("Se for para criar um objeto customizado, informar a classe.");
                else
                    return new typePrototype();
        }
    },
    /**
     * Retorna a quantidade de itens no pool, podendo ou não filtrar por tipo de objeto
     * @param {pd.Pool.Types} [type]
     * @returns {number}
     */
    getAmount: function (type) {
        var ret = 0;
        if (type) {
            if(this.has(type)) {
                ret = this._refs[type].length;
            }
        } else {
            for (var k in this._refs) {
                ret += this.getAmount(k);
            }
        }
        return ret;
    },
    /**
     * Verifica se existe no pool algum objeto do tipo informado
     * @param {pd.Pool.Types} type O tipo de objeto para verificar
     * @returns {boolean} Se existe um objeto desse tipo no pool
     */
    has: function (type) {
        if(this._refs[type]) {
            return this._refs[type].length > 0;
        } else {
            return false;
        }
    },
    /**
     * Entrega para o Pool um objeto do tipo informado
     * @param {*} obj
     * @param {pd.Pool.Types} [type] Se o tipo não for informado, será inserido no pool de Object
     */
    lend: function (obj, type) {
        this._refs[type] = this._refs[type] || [];
        if (this._refs[type].lastIndexOf(obj) < 0)
            this._refs[type].push(obj);
    },
    /**
     *
     */
    reset: function () {
        this._refs = {};
    }
});

/**
 * @type {pd.Pool}
 */
pd.pool = pd.generateSingleton(pd.Pool);

/**
 *
 * @enum {string}
 */
pd.Pool.Types = {
    Point: "CCPoint",
    Sprite: "CCSprite",
    Object: "Object"
};