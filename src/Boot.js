/**
 * Created by Ryan Balieiro on 22/05/17.
 * Ponto de entrada da biblioteca - define o namespace 'pd'.
 * @namespace pd
 */
var pd = {};

/**
 * Indica se o modo debug está ativo (não setar esta variável manualmente!).
 * @type {boolean}
 */
pd.debugMode = cc.game.config[cc.game.CONFIG_KEY.debugMode] != cc.game.DEBUG_MODE_NONE;

if (cc.game.config[cc.game.CONFIG_KEY.renderMode] != 1) {
    //Não colocar o renderMode para 1 já ocorreu erro ao utilizar DrawNode e ClippingNode
    cc.error("[pd] O render mode está num valor que muito provavelmente dará erro no jogo! Mudar para 1!!!");
}

/**
 * Versão atual dos padrões.
 * @type {string}
 */
pd.version = "3.0beta";

cc.log("[pd] Padrões Cocos Versão: " + pd.version);
if(pd.debugMode)
    cc.warn("[pd] O modo de debug está ativo!");

/**
 * Lista de arquivos a serem carregados pelos padrões.
 * @type {Array.<string>}
 */
pd.jsList = [
    "src/core/Delegate.js",
    "src/core/GlobalDefinitions.js",
    "src/core/controllers/AudioEngine.js",
    "src/core/controllers/Debugger.js",
    "src/core/controllers/EffectPlayer.js",
    "src/core/controllers/InputManager.js",
    "src/utils/Transitions.js",
    "src/utils/Snippets.js",
    "src/utils/Decorators.js",
    "src/components/prototypes/Scenes.js",
    "src/components/prototypes/Animation.js",
    "src/components/prototypes/TutorialLayer.js",
    "src/components/prototypes/TypewriterLabel.js",
    "src/components/prototypes/LifeHUD.js",
    "src/components/input/Button.js",
    "src/components/input/Joystick.js",
    "src/components/input/StandardButton.js",
    "src/components/input/ArrowKeys.js",
    "src/components/ui/Tutorial.js",
    "src/components/ui/GameOverLayer.js",
    "src/components/ui/PauseLayer.js",
    "src/components/feedback/Pointer.js",
    "src/components/feedback/Tablet.js",
    "src/loading/LoaderScene.js",
    "src/loading/Loader.js",
    "src/Depreciations.js"].concat((!cc.sys.isNative /**&& pd.debugMode*/ ? 

    [ //A versão mobile não utiliza o editor, não sendo necessário esses arquivos
        "src/editor/Editor.js",
        "src/editor/SpriteCreator.js",
        "src/editor/SpriteListViewer.js",
        "src/editor/Printer.js"
    ] : []
));

/**
 * Boota os padrões com os caminhos informados.
 * @param {Object} paths
 * @param {String} context
 */
pd.boot = function(paths, context) {
    padroesPath = paths.padroesPath;
    cc.loader.loadJs(paths.padroesPath, pd.jsList, function() {
        pd.delegate.setPaths(paths);

        if(context)
            pd.delegate.setContext("context" + context);
        else
            pd.delegate.setContext(pd.Delegate.CONTEXT_STAND_ALONE);

        //////////////////// MODO PALCO //////////////////////
        if(pd.delegate.context == pd.Delegate.CONTEXT_PALCO) {
            pd.loader.loadJSON(pd.delegate.paths.volumePath + "/metadata/modules.json", function(metadata) {
                cc.loader.loadJs("src", ["Config.js"], function() {
                    palco.boot(metadata.targetBuild);
                });
            });
        }
        /////////////////////////////////////////////////////
        //////////////// MODO STAND-ALONE ///////////////////
        else {
            cc.loader.loadJs("src", ["Config.js"]);
        }
        /////////////////////////////////////////////////////
    });
};