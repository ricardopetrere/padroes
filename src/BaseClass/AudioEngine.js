/**
 * Created by rcardoso on 13/03/2017.
 * @class
 */
pd.AudioEngine = cc.Class.extend({/** @lends pd.AudioEngine#*/
    /**
     * @type {null|pd.AudioEngine}
     */
    _singleton: null,
    /**
     * @type {number}
     */
    effectVolume: 1,
    /**
     * @type {boolean}
     */
    isMuted: false,
    /**
     * @type {number}
     */
    musicVolume: 1,
    /**
     *
     * @param target
     * @param duration
     * @param from
     * @param to
     * @param cb
     */
    fadeMusic: function(target, duration, from, to, cb) {
        duration = duration * 100;
        var d = 1 / duration;
        var elapsed = 0;
        var sequencia = [];
        sequencia.push(
            new cc.Repeat(new cc.Sequence(
                new cc.DelayTime(0.01),
                new cc.CallFunc(function(){
                    pd.audioEngine.setMusicVolume(from + (to - from) * elapsed.toFixed(3));
                    elapsed += d;
                },target)
            ), duration)
        );
        if (cb) {
            sequencia.push(new cc.CallFunc(cb, target));
        }
        target.runAction(new cc.Sequence(sequencia));
    },
    /**
     *
     * @returns {Number} effectVolume
     */
    getEffectsVolume: function () {
        return cc.audioEngine.getEffectsVolume();
    },
    /**
     *
     * @returns {Number} musicVolume
     */
    getMusicVolume: function () {
        return cc.audioEngine.getMusicVolume();
    },
    /**
     *
     * @param {number} effectId
     */
    pauseEffect: function (effectId) {
        return cc.audioEngine.pauseEffect(effectId);
    },
    /**
     *
     * @param effect {resources}
     * @param loop [boolean]
     * @param volume [number]
     * @returns {number} effectId
     */
    playEffect: function (effect, loop, volume) {
        var retorno = -1;
        if (effect) {
            retorno = cc.audioEngine.playEffect(effect, loop || false);
        }
        if (volume) {
            this.setEffectsVolume(volume);
        }
        return retorno;
    },
    /**
     *
     * @param music {resources}
     * @param loop [boolean]
     * @param volume [number]
     */
    playMusic: function (music, loop, volume) {
        if (music) {
            if (cc.audioEngine.willPlayMusic()) {
                cc.audioEngine.stopMusic();
            }
            cc.audioEngine.playMusic(music, loop || false);
        }
        if (volume) {
            this.setMusicVolume(volume);
        }
    },
    resumeEffect: function (effectId) {
        return cc.audioEngine.resumeEffect(effectId);
    },
    /**
     *
     * @param volume {number}
     */
    setEffectsVolume: function (volume) {
        if (this.isMuted) {
            this.effectVolume = volume;
        } else {
            cc.audioEngine.setEffectsVolume(volume);
        }
    },
    /**
     *
     * @param volume {number}
     */
    setMusicVolume: function (volume) {
        if (this.isMuted) {
            this.musicVolume = volume;
        } else {
            cc.audioEngine.setMusicVolume(volume);
        }
    },
    /**
     *
     * @param mute {boolean}
     */
    setMute: function (mute) {
        this.isMuted = mute;
        if (mute) {
            this.musicVolume = cc.audioEngine.getMusicVolume();
            this.effectVolume = cc.audioEngine.getEffectsVolume();
            cc.audioEngine.setMusicVolume(0);
            cc.audioEngine.setEffectsVolume(0);
        } else {
            cc.audioEngine.setMusicVolume(this.musicVolume);
            cc.audioEngine.setEffectsVolume(this.effectVolume);
        }
    },
    stopAllEffects: function () {
        cc.audioEngine.stopAllEffects();
    },
    stopEffect: function (effectId) {
        cc.audioEngine.stopEffect(effectId);
    },
    stopMusic: function (releaseData) {
        cc.audioEngine.stopMusic(releaseData);
    },
    toggleMute: function () {
        this.setMute(!this.isMuted);
    }
});

pd.AudioEngine.getInstance = function () {
    if (pd.AudioEngine.prototype._singleton == null) {
        pd.AudioEngine.prototype._singleton = new pd.AudioEngine();
    }
    return pd.AudioEngine.prototype._singleton;
};

/**
 * @type pd.AudioEngine
 */
pd.audioEngine = pd.AudioEngine.getInstance();