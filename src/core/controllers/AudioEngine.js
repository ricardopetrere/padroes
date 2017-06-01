/**
 * Created by Ricardo Cardoso on 13/03/2017.
 * @class
 * @extends {cc.Class}
 * @classdesc Gerenciador de áudio da biblioteca.
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
     * Realiza um efeito de fade no volume da música de fundo.
     * @param target {cc.Node}
     * @param duration {Number}
     * @param from {Number}
     * @param to {Number}
     * @param cb {Function}
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
     * Obtém o volume dos efeitos.
     * @returns {Number} effectVolume
     */
    getEffectsVolume: function () {
        return cc.audioEngine.getEffectsVolume();
    },
    
    /**
     * Obtém o volume da música de fundo.
     * @returns {Number} musicVolume
     */
    getMusicVolume: function () {
        return cc.audioEngine.getMusicVolume();
    },
    
    /**
     * Pausa um efeito específico.
     * @param {number} effectId
     */
    pauseEffect: function (effectId) {
        return cc.audioEngine.pauseEffect(effectId);
    },
    
    /**
     * Toca um efeito.
     * @param {String} effect
     * @param {boolean} loop 
     * @param {number} volume
     * @returns {number} effectId
     */
    playEffect: function (effect, loop, volume) {
        var ret = -1;
        if (effect) {
            ret = cc.audioEngine.playEffect(effect, loop || false);
        }
        if (volume) {
            this.setEffectsVolume(volume);
        }
        return ret;
    },

    /**
     * Toca uma música de fundo.
     * @param music {string}
     * @param loop {boolean}
     * @param volume {number}
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

    /**
     * Despausa um efeito.
     * @param effectId {Number}
     * @returns {Number}
     */
    resumeEffect: function (effectId) {
        return cc.audioEngine.resumeEffect(effectId);
    },

    /**
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
     * @param volume {number}
     */
    setMusicVolume: function (volume) {
        if (!this.isMuted) {
            cc.audioEngine.setMusicVolume(volume);
        }
        this.musicVolume = volume;
    },

    /**
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

    /**
     * Para todos os efeitos.
     */
    stopAllEffects: function () {
        cc.audioEngine.stopAllEffects();
    },

    /**
     * Para um efeito específico.
     * @param effectId {Number}
     */
    stopEffect: function (effectId) {
        cc.audioEngine.stopEffect(effectId);
    },

    /**
     * Para a música de fundo.
     * @param releaseData {Boolean}
     */
    stopMusic: function (releaseData) {
        cc.audioEngine.stopMusic(releaseData);
    },

    /**
     * Inverte o status da variável isMuted.
     */
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