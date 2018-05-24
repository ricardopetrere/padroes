/**
 * Created by Ryan Balieiro on 24/08/17.
 * @class {pd.Tablet}
 * @extends {cc.Layer}
 * @classdesc Animação de uma mão segurando um tablet utilizada para feedbacks de acelerômetro.
 */
pd.Tablet = pd.Animation.extend({/**@lends pd.Tablet#**/

    /**
     * @constructs
     */
    ctor: function() {
        this._super();
        //
        // this.addAnimation('normal', 1, 1, 'accel_lateral');
        this.addAnimation(pd.Animations.accel_normal);
        // this.addAnimation('left', 1, 10, 'accel_lateral');
        this.addAnimation(pd.Animations.accel_left);
        // this.addAnimation('right', 11, 20, 'accel_lateral');
        this.addAnimation(pd.Animations.accel_right);
        // this.addAnimation('up', 1, 10, 'accel_vertical');
        this.addAnimation(pd.Animations.accel_up);
        // this.addAnimation('down', 11, 20, 'accel_vertical');
        this.addAnimation(pd.Animations.accel_down);

        this.changeAndStop('normal');
    }
});