/**
 * Created by Ryan Balieiro on 22/05/17.
 * Ponto de entrada da biblioteca - define o namespace 'pd'.
 * @namespace pd
 *
 * Lista de pendências:
 * - transformar as arrow keys e os botões de interface (pause button e exit button) em pd.StandardButton.
 * - alterar a pd.TutorialLayer para criar as 'teclas' no formato novo.
 * - inserir um método para criar um joystick na pd.TutorialLayer.
 */
cc.game.config.jsList = [
    "src/core/Delegate.js",
    "src/core/GlobalDefinitions.js",
    "src/core/controllers/AudioEngine.js",
    "src/core/controllers/Debugger.js",
    "src/core/controllers/EffectPlayer.js",
    "src/core/controllers/TextCreator.js",
    "src/core/controllers/InputManager.js",
    "src/utils/Transitions.js",
    "src/utils/Snippets.js",
    "src/utils/Decorators.js",
    "src/components/prototypes/Scenes.js",
    "src/components/prototypes/Animation.js",
    "src/components/prototypes/TutorialLayer.js",
    "src/components/input/Button.js",
    "src/components/input/Joystick.js",
    "src/components/input/CustomInputSources.js",
    "src/components/ui/Tutorial.js",
    "src/components/ui/GameOverLayer.js",
    "src/components/ui/PauseLayer.js",
    "src/loading/LoaderScene.js",
    "src/loading/Loader.js",
    "src/Depreciations.js"].concat((!cc.sys.isNative ?

        //A versão mobile não utiliza o editor, não sendo necessário esses arquivos
        ["src/editor/Editor.js",
            "src/editor/SpriteCreator.js",
            "src/editor/SpriteListViewer.js",
            "src/editor/Printer.js"] : []
));

var pd = {};

/**
 * @global
 * @type {String}
 */
var padroesPath = cc.game.config["padroesPath"];

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
pd.version = "3.0alpha";

cc.log("[pd] Padrões Cocos Versão: " + pd.version);
if(pd.debugMode)
    cc.warn("[pd] O modo de debug está ativo!");

var indexSrcPadrao;
for (indexSrcPadrao = 0; indexSrcPadrao < cc.game.config.jsList.length; indexSrcPadrao++) {
    cc.game.config.jsList[indexSrcPadrao] = cc.path.join(padroesPath, cc.game.config.jsList[indexSrcPadrao]);
}