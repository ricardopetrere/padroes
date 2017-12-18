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
     * Indica se o 'update' está ativo.
     */
    _isUpdatingScore:false,

    /**
     * Parseia a string para o formato XXX XXX XXX
     * @returns {String}
     */
    _parseString: function(str) {
        str = str.toString();
        if(str.length <= 3)
            return str;

        var formattedStr = "";
        var count = 0;
        for(var i = str.length - 1 ; i >= 0 ; i--) {
            formattedStr = str.charAt(i) + formattedStr;
            count++;
            if(count % 3 == 0)
                formattedStr = "  " + formattedStr;
        }

        return formattedStr;
    },

    /**
     * Seta o score atual.
     * @param {String|Number} score - a pontuação atual.
     * @param {Number} [duration=0] - a duração da animação.
     */
    setScore: function(score, duration) {
        duration = duration || 0;
        if(duration > 0 && pd.currentScene.getChildren().length > 0) {
            var current = parseInt(this.getString().replace("  ", ""));
            if (!current || isNaN(current))
                current = 0;

            this._currentScore = current;
            this._targetDuration = duration;
            this._currentDuration = 0;
            this._dScore = score - current;
            const factor = cc.sys.isMobile ? 1/30 : 1/60;

            if(!this._isUpdatingScore) {
                pd.currentScene.getChildren()[0].runAction(this.updateAction = cc.repeatForever(cc.sequence(
                    cc.delayTime(factor),
                    pd.perfectCallFunc(this._updateScore, this, factor)
                )));
            }
            this._isUpdatingScore = true;
        }
        else {
            this.setString(this._parseString(score));
        }
    },

    /**
     * Atualiza a animação.
     * @param dt
     */
    _updateScore: function(dt) {
        if(pd.currentScene.getChildren().length == 0)
            return;

        this._currentDuration += dt;
        const percentage = pd.clamp(this._currentDuration/this._targetDuration, 0, 1);

        this.setString(this._parseString(Math.round(this._currentScore + this._dScore*percentage)));
        if(percentage == 1) {
            this.setString(this._parseString(this._currentScore + this._dScore));
            if(this._isUpdatingScore)
                pd.currentScene.getChildren()[0].stopAction(this.updateAction);
            this._isUpdatingScore = false;
        }
    }
};
