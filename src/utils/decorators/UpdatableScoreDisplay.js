/**
 * Created by Ryan Balieiro on 15/09/17.
 *
 * @desc
 * Transforma uma cc.LabelTTF em um display de pontuação animado.
 * @mixin
 */
pd.decorators.UpdatableScoreDisplay = {/** @lends pd.decorators.UpdatableScoreDisplay#*/
    /**
     * @type {Number}
     */
    _currentScore:0,

    /**
     * @type {Number}
     */
    _targetDuration:0,

    /**
     * @type {Number}
     */
    _currentDuration:0,

    /**
     * @type {Number}
     */
    _dScore:0,

    /**
     * Parseia a string para o formato XXX XXX XXX
     * @returns {String}
     */
    _parseString: function(str) {
        return str.toLocaleString().replace(".", "  ").replace(",", "  ");
    },

    /**
     * Seta o score atual.
     * @param {String|Number} score - a pontuação atual.
     * @param {Number} [duration=0] - a duração da animação.
     */
    setScore: function(score, duration) {
        duration = duration || 0;
        if(duration > 0) {
            var current = parseInt(this.getString().replace("  ", ""));
            if (!current || isNaN(current))
                current = 0;

            this._currentScore = current;
            this._targetDuration = duration;
            this._currentDuration = 0;
            this._dScore = score - current;

            this.scheduleUpdate();
        }
        else {
            this.setString(this._parseString(score));
        }
    },

    /**
     * Atualiza a animação.
     * @param dt
     */
    update: function(dt) {
        this._currentDuration += dt;
        const percentage = pd.clamp(this._currentDuration/this._targetDuration, 0, 1);
        this.setString(this._parseString(Math.round(this._currentScore + this._dScore*percentage)));
        if(percentage == 1) {
            this.setString(this._parseString(this._currentScore + this._dScore));
            this.unscheduleUpdate();
        }
    }
};