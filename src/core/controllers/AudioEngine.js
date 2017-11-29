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
//<editor-fold desc="Fade">
    /**
     *
     * @param {Function} getterFunction - A função de get (getEffectsVolume ou getMusicVolume)
     * @param {Function} setterFunction - A função de set (setEffectsVolume ou setMusicVolume)
     * @param {cc.Node} [target] - O objeto que irá executar a ação
     * @param {Number} duration - A duração do fade
     * @param {Number} from - o fade inicial
     * @param {Number} to - o fade final
     * @param {Function} [cb] - A função para executar depois do fade
     * @private
     */
    _fade: function (getterFunction, setterFunction, target, duration, from, to, cb) {
        if (from == null)
            from = getterFunction();
        duration = duration * 100;
        var d = 1 / duration;
        var elapsed = 0;
        var sequenceSteps = [];
        sequenceSteps.push(
            new cc.Repeat(new cc.Sequence(
                new cc.DelayTime(0.01),
                new cc.CallFunc(function(){
                    setterFunction(from + (to - from) * elapsed.toFixed(3));
                    elapsed += d;
                })
            ), duration)
        );
        if (cb) {
            sequenceSteps.push(new cc.CallFunc(cb, target));
        }
        if (!(target instanceof cc.Node))
            target = pd.currentScene;
        target.runAction(new cc.Sequence(sequenceSteps));
    },

    /**
     * Realiza um efeito de fade nos efeitos sonoros
     * @param {cc.Node} [target] - O objeto que irá executar a ação
     * @param {Number} duration - A duração do fade
     * @param {Number} from - o fade inicial
     * @param {Number} to - o fade final
     * @param {Function} [cb] - Uma função a ser executada após o fade
     */
    fadeEffect: function (target, duration, from, to, cb) {
        this._fade(pd.audioEngine.getEffectsVolume, pd.audioEngine.setEffectsVolume, target, duration, from, to, cb);
    },
    
    /**
     * Realiza um efeito de fade no volume da música de fundo.
     * @param {cc.Node} [target] - O objeto que irá executar a ação
     * @param {Number} duration - A duração do fade
     * @param {Number} from - o fade inicial
     * @param {Number} to - o fade final
     * @param {Function} [cb] - Uma função a ser executada após o fade
     */
    fadeMusic: function(target, duration, from, to, cb) {
        this._fade(pd.audioEngine.getMusicVolume, pd.audioEngine.setMusicVolume, target, duration, from, to, cb);
    },
//</editor-fold>
//<editor-fold desc="Volume & Mute">
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
     * Retorna o volume de um áudio em específico
     * @param {cc.Audio} audio
     * @returns {Number}
     */
    getAudioVolume: function (audio) {
        if(cc.sys.isMobile) {
            return 0.5;//Isso aqui ainda não funciona
        } else {
            return audio.getVolume();
        }
    },

    /**
     * Configura o volume de um áudio específico
     * @param {cc.Audio} audio
     * @param {Number} volume
     * @returns {cc.Audio}
     */
    setAudioVolume: function (audio, volume) {
        if (cc.sys.isMobile) {
            //Isso aqui ainda não funciona
        }
        else {
            audio.setVolume(volume);
        }
        return audio;
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
            cc.audioEngine.setMusicVolume(0);
            cc.audioEngine.setEffectsVolume(0);
        } else {
            cc.audioEngine.setMusicVolume(this.musicVolume);
            cc.audioEngine.setEffectsVolume(this.effectVolume);
        }
    },

    /**
     * Inverte o status da variável isMuted.
     */
    toggleMute: function () {
        this.setMute(!this.isMuted);
    },
//</editor-fold>
//<editor-fold desc="Play/Pause/Stop">
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
     * @private
     */
    _play: function (res, loop, volume, funcPlay, cb) {
        var ret = -1;
        if (res) {
            if(cc.sys.isMobile) {
                if(funcPlay == "playEffect")
                    ret = cc.audioEngine.playEffect(res, loop || false, 1, 0, volume);
                else
                    ret = cc.audioEngine.playMusic(res, loop);
            }
            else {
                ret = cc.audioEngine[funcPlay](res, loop || false, volume);
            }
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
    playEffect: function (effect, loop, volume, cb) {
        if(this.isMuted)
            return -1;

        var ret = -1;
        volume = (volume != null ? volume : this.effectVolume);
        //No Desktop, playEffect retorna o objeto de WebAudio. No mobile, retorna o ID do áudio
        ret = this._play(effect, loop, volume, "playEffect", function() {
            console.log('fim do efeito');
        });
        return ret;
    },

    /**
     * Toca uma música de fundo.
     * @param {string} music
     * @param {boolean} [loop]
     * @param {number} [volume]
     */
    playMusic: function (music, loop, volume, cb) {
        if(this.isMuted)
            return;

        if (music && cc.audioEngine.willPlayMusic()) {
            cc.audioEngine.stopMusic();
        }
        this.musicVolume = (volume != null ? volume : this.musicVolume);
        this._play(music, loop, this.musicVolume, "playMusic", function() {
            cc.log('fim da música');
        });
        this.setMusicVolume(this.musicVolume);
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
     * Para todos os efeitos.
     */
    stopAllEffects: function () {
        cc.audioEngine.stopAllEffects();
    },

    /**
     * Para um efeito específico.
     * @param {Number | cc.WebAudio} effectId
     */
    stopEffect: function (effectId) {
        if (effectId >= 0 || effectId instanceof Object)
            cc.audioEngine.stopEffect(effectId);
    },

    /**
     * Para a música de fundo.
     * @param {Boolean} [releaseData]
     */
    stopMusic: function (releaseData) {
        cc.audioEngine.stopMusic(releaseData);
    }
//</editor-fold>
});

/**
 * @type {pd.AudioEngine}
 */
pd.audioEngine = pd.generateSingleton(pd.AudioEngine);