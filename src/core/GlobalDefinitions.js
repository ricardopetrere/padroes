/**
 * Created by Ryan Balieiro on 07/06/17.
 * Lista de constantes globais do namespace 'Padrões'.
 */

/****************************************************************************************/
/******************************* #REGION: Resources *************************************/
/****************************************************************************************/

/**
 * Recursos utilizados pela tela de loading.
 * @static
 * @type {{s_logo: string, s_loadbar: string, s_loadbarBG: string, s_carregando: string, icon_plist: string, icon_sprite: string, s_loader: string, p_loader: string, fx_woosh: string}}
 */
pd.resLoad = {
    s_loader: padroesPath+"/res/img/loading/loader.png",
    p_loader: padroesPath+"/res/img/loading/loader.plist",
    fx_woosh: padroesPath+"/res/snd/loading/woosh.mp3",
    fx_logo: padroesPath+"/res/snd/loading/logo.mp3",
    fx_swish: padroesPath+"/res/snd/loading/swish.mp3",
    lato: padroesPath+"/res/font/Lato.ttf"
};

/**
 * Recursos utilizados pelos padrões.
 * @static
 * @type {{mainDebugInterface: string, btn_fechar: string, btn_mais: string, btn_audio: string, btn_animation: string, btn_general: string, debuggerUi: string, debuggerUi2: string, uncheckedButton: string, checkedButton: string, textBoxImage: string, BoundingBox: string, cross: string, s_input: string, p_input: string, s_menus: string, p_menus: string, s_Padroes: string, p_Padroes: string, fx_Erro: string, fx_Acerto: string, fx_BgmLose: string, fx_BgmWin: string, fx_escrever: string, s_fundoPreto: string, fx_flip: string, fx_exp: string, fx_star: string, fx_button: string}}
 */
pd.res = {
    
    //Debugger:
    mainDebugInterface: padroesPath+"/res/img/debug/mainDebugInterface.png",
    btn_fechar: padroesPath+"/res/img/debug/btn_fechar.png",
    btn_mais: padroesPath+"/res/img/debug/btn_mais.png",
    btn_audio: padroesPath+"/res/img/debug/btn_audioDebug.png",
    btn_animation: padroesPath+"/res/img/debug/btn_animationDebug.png",
    btn_general: padroesPath+"/res/img/debug/btn_generalDebug.png",
    debuggerUi: padroesPath+"/res/img/debug/debugUi.png",
    debuggerUi2: padroesPath+"/res/img/debug/debugUi2.png",
    uncheckedButton: padroesPath+"/res/img/debug/unchecked.png",
    checkedButton: padroesPath+"/res/img/debug/checked.png",
    textBoxImage: padroesPath+"/res/img/debug/textBox.png",
    BoundingBox: padroesPath+"/res/img/debug/boundingBox.png",
    cross: padroesPath+"/res/img/debug/cross.png",

    //UI:
    s_input: padroesPath+"/res/img/blueUI/input.png",
    p_input: padroesPath+"/res/img/blueUI/input.plist",
    s_menus: padroesPath+"/res/img/blueUI/menus.png",
    p_menus: padroesPath+"/res/img/blueUI/menus.plist",
    s_Padroes: padroesPath+"/res/img/padroes.png",
    p_Padroes: padroesPath+"/res/img/padroes.plist",

    //Audios:
    fx_Erro : padroesPath+"/res/snd/erro.mp3",
    fx_Acerto : padroesPath+"/res/snd/acerto.mp3",
    fx_BgmLose : padroesPath+"/res/snd/gameover.mp3",
    fx_BgmWin : padroesPath+"/res/snd/happy.mp3",
    fx_escrever : padroesPath+"/res/snd/escrever.mp3",

    //Win/Lose:
    s_fundoPreto : padroesPath+"/res/img/bg_final.png",
    fx_flip : padroesPath+"/res/snd/desenrola.mp3",
    fx_exp : padroesPath+"/res/snd/explosion.mp3",
    fx_star : padroesPath+"/res/snd/estrelas.mp3",
    fx_button: padroesPath+"/res/snd/button.mp3"

};

/**
 * @type {Array}
 */
pd.load_resources = [];
for (var i in pd.resLoad) {
    pd.load_resources.push(pd.resLoad[i]);
}

/**
 * @type {Array}
 */
pd.g_resources = [];
for (var i in pd.res) {
    pd.g_resources.push(pd.res[i]);
}

/****************************************************************************************/
/******************************* #REGION: Enumerators ***********************************/
/****************************************************************************************/

/**
 * Enumerador com o mapeamento de teclas comumente utilizadas.
 * @enum {number}
 */
pd.Keys = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    A: 65,
    W: 87,
    D: 68,
    S: 83,
    DPAD0: 96, //Pros outros, somar com esse aqui.
    F0: 111, //Pros outros, somar com esse aqui.
    CTRL: 17,
    SHIFT: 16,
    ALT: 18,
    WIN: 91,
    TAB: 9,
    CAPS: 20,
    SPACE: 32,
    DELETE: 46,
    ZERO: 48,
    ESC: 27 //Cuidado: nas pd.GameLayer, essa tecla chama a pauseLayer.
};

/**
 * Enumerador com os zOrders os elementos de interface dos padrões.
 * @enum {number}
 */
pd.ZOrders = {
    TUTORIAL_BUTTON: 10,
    TUTORIAL_POINTER: 30,
    TUTORIAL_PAGE: 50,
    TUTORIAL_CONTROLLER_BUTTON:99,
    TUTORIAL_PAGE_BOTTOM_TEXT: 999,
    PAUSE_LAYER_UI_ELEMENTS:9000,
    DEBUG_SCREEN: 1000,
    PAUSE_BUTTON: 9000,
    GAME_OVER_LAYER: 9999,
    TUTORIAL_LAYER: 99999,
    PAUSE_LAYER: 999999
};