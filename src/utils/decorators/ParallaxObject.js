/**
 * Created by Ryan Balieiro on 15/09/17.
 *
 * @desc
 * Implementa as funcionalidades básicas de um objeto que realiza parallax. <br/>
 * Ao contrário de {@link cc.ParallaxNode}, neste caso é o objeto-filho que possui as configurações de parallax, assim fica mais versátil <br/>
 * O comportamento normal ao se usar esse decorator é de aplicá-lo a um objeto filho da layer principal, que esteja com uma ação {@link cc.Follow} rodando
 * @mixin
 */
pd.decorators.ParallaxObject = {/** @lends pd.decorators.ParallaxObject#*/
    /**
     * A posição default do objeto, para quando o {@link parallaxParent} estiver em cc.p(0,0)
     * @type {cc.Point}
     */
    parallaxOffset: null,
    /**
     * O objeto-pai no parallax. Não necessariamente o pai do objeto, mas normalmente é a layer na qual o objeto está
     * @type {cc.Node}
     */
    parallaxParent: null,
    /**
     * Taxa de correspondência de parallax com {@link parallaxParent}, em X e Y. Quanto mais próximos de 1, menos o objeto se movimentará na tela
     * @type {cc.Point}
     */
    parallaxRatio: null,
    /**
     *
     * @param {cc.Point} ratio
     * @param {cc.Point} [offset]
     */
    parallaxConfigure: function (ratio, offset) {
        this.parallaxParent = this.getParent();
        this.parallaxOffset = cc.p(offset || this.getPosition());
        this.parallaxRatio = cc.p(ratio || cc.p(1, 1));
    },
    /**
     *
     * @param {number} dt
     */
    parallaxMove: function (dt) {
        this.x = this.parallaxOffset.x - (this.parallaxRatio.x * this.parallaxParent.x);
        this.y = this.parallaxOffset.y - (this.parallaxRatio.y * this.parallaxParent.y);
    }
};