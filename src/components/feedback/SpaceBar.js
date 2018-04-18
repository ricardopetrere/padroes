/**
 * Created by rcardoso on 18/04/18.
 */
/**
 *
 * @extends {pd.Button}
 */
pd.SpaceBar = pd.Button.extend({
    /**
     * @param {Object} [attr=null] - as propriedades de exibição da barra de espaço.
     * @param {Boolean} [autoEnable=false] - indica se os listeners do botão devem ser adicionados automaticamente após a sua construção.
     * @param {Boolean} [eventBased=false] - indica se o mecanismo de callbacks do botão será baseado em eventos.
     * @param {*|null} [handler=null] - para o método de callback explícito: o objeto que irá executar a função de callback.
     * @param {Function|String|null} [handlerFunc=null] - para o método de callback explícito: a função de callback a ser executada.
     * @param {Array|null} [handlerFuncArgs=null] - para o método de callback explícito: os argumentos a serem passados para a função de callback.
     * @constructs
     */
    ctor: function (attr, autoEnable, eventBased, handler, handlerFunc, handlerFuncArgs) {
        this._super(pd.SpriteFrames.KEY_SPACE, pd.SpriteFrames.KEY_SPACE_PRESSED, attr, 1, autoEnable, eventBased, handler, handlerFunc, handlerFuncArgs);
    }
});