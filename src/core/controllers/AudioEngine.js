/**
 * Created by Ricardo Cardoso on 13/03/2017.
 * @class
 * @extends {cc.Class}
 * @classdesc Gerenciador de áudios.
 */
pd.AudioEngine = cc.Class.extend({/** @lends pd.AudioEngine#*/
    /**
     * Instância singleton do objeto.
     * @type {null|pd.AudioEngine}
     */
    _singleton: null,
    /**
     * Volume dos efeitos.
     * @type {number}
     */
    effectVolume: 1,
    /**
     * Indica se o jogo está mutado.
     * @type {boolean}
     */
    isMuted: false,
    /**
     * Volume da música.
     * @type {number}
     */
    musicVolume: 1,

    /**
     *
     * @param {Function} fnc_get - A função de get (getEffectsVolume ou getMusicVolume)
     * @param {Function} fnc_set - A função de set (setEffectsVolume ou setMusicVolume)
     * @param {cc.Node} [target] - O objeto que irá executar a ação
     * @param {Number} duration - A duração do fade
     * @param {Number} from - o fade inicial
     * @param {Number} to - o fade final
     * @param {Function} [cb] - A função para executar depois do fade
     * @private
     */
    _fade: function (fnc_get, fnc_set, target, duration, from, to, cb) {
        if (from == null)
            from = fnc_get();
        duration = duration * 100;
        var d = 1 / duration;
        var elapsed = 0;
        var sequencia = [];
        sequencia.push(
            new cc.Repeat(new cc.Sequence(
                new cc.DelayTime(0.01),
                new cc.CallFunc(function(){
                    fnc_set(from + (to - from) * elapsed.toFixed(3));
                    elapsed += d;
                })
            ), duration)
        );
        if (cb) {
            sequencia.push(new cc.CallFunc(cb, target));
        }
        if (!(target instanceof cc.Node))
            target = pd.currentScene;
        target.runAction(new cc.Sequence(sequencia));
    },

    fadeEffect: function (target, duration, from, to, cb) {
        this._fade(pd.audioEngine.getEffectsVolume, pd.audioEngine.setEffectsVolume, target, duration, from, to, cb);
    },
    
    /**
     * Realiza um efeito de fade no volume da música de fundo.
     * @param {cc.Node} [target] - O objeto que irá executar a ação
     * @param {Number} duration - A duração do fade
     * @param {Number} from - o fade inicial
     * @param {Number} to
     * @param {Function} [cb]
     */
    fadeMusic: function(target, duration, from, to, cb) {
        this._fade(pd.audioEngine.getMusicVolume, pd.audioEngine.setMusicVolume, target, duration, from, to, cb)
        // if (from == null)
        //     from = pd.audioEngine.getMusicVolume();
        // duration = duration * 100;
        // var d = 1 / duration;
        // var elapsed = 0;
        // var sequencia = [];
        // sequencia.push(
        //     new cc.Repeat(new cc.Sequence(
        //         new cc.DelayTime(0.01),
        //         new cc.CallFunc(function(){
        //             pd.audioEngine.setMusicVolume(from + (to - from) * elapsed.toFixed(3));
        //             elapsed += d;
        //         })
        //     ), duration)
        // );
        // if (cb) {
        //     sequencia.push(new cc.CallFunc(cb, target));
        // }
        // if (!(target instanceof cc.Node))
        //     target = pd.currentScene;
        // target.runAction(new cc.Sequence(sequencia));
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
     *
     * @param {String} res
     * @param {boolean} loop
     * @param {number} volume
     * @param {string} funcPlay
     * @param {string} funcVolume
     * @private
     */
    _play: function (res, loop, volume, funcPlay, funcVolume) {
        var ret = -1;
        if (res) {
            ret = cc.audioEngine[funcPlay](res, loop || false);
        }
        if (volume) {
            this[funcVolume](volume);
        }
        return ret;
    },
    /**
     * Toca um efeito.
     * @param {String} effect
     * @param {boolean} [loop]
     * @param {number} [volume]
     * @returns {number} effectId
     */
    playEffect: function (effect, loop, volume) {
        var ret = -1;
        ret = this._play(effect, loop, volume, "playEffect", "setEffectsVolume");
        return ret;
    },

    /**
     * Toca uma música de fundo.
     * @param {string} music
     * @param {boolean} [loop]
     * @param {number} [volume]
     */
    playMusic: function (music, loop, volume) {
        if (music && cc.audioEngine.willPlayMusic()) {
            cc.audioEngine.stopMusic();
        }
        this._play(music, loop, volume, "playMusic", "setMusicVolume")
    },

    /**
     * Despausa um efeito.
     * @param {Number} effectId
     * @returns {Number}
     */
    resumeEffect: function (effectId) {
        return cc.audioEngine.resumeEffect(effectId);
    },

    /**
     * @param {Number} volume
     */
    setEffectsVolume: function (volume) {
        if (this.isMuted) {
            this.effectVolume = volume;
        } else {
            cc.audioEngine.setEffectsVolume(volume);
        }
    },

    /**
     * @param {Number} volume
     */
    setMusicVolume: function (volume) {
        if (!this.isMuted) {
            cc.audioEngine.setMusicVolume(volume);
        }
        this.musicVolume = volume;
    },

    /**
     * @param {Boolean} mute
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
     * @param {Number} effectId
     */
    stopEffect: function (effectId) {
        cc.audioEngine.stopEffect(effectId);
    },

    /**
     * Para a música de fundo.
     * @param {Boolean} releaseData
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

/**
 * Obtém a instância singleton do objeto.
 * @returns {pd.AudioEngine}
 */
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