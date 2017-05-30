/**
 * Created by ??? on ???.
 * @desc Listagem de recursos utilizados pelo palco.
 */

/****************************************************************************************/
/******************************* #REGION: LoadingScreen *********************************/
/****************************************************************************************/

/**
 * Recursos utilizados pela tela de loading.
 * @global
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
 * @type {Array}
 */
pd.load_resources = [];
for (var i in pd.resLoad) {
    pd.load_resources.push(pd.resLoad[i]);
}


/****************************************************************************************/
/********************************** #REGION: Padroes ************************************/
/****************************************************************************************/

/**
 * Recursos utilizados pelos padrões.
 * @global
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
pd.g_resources = [];
for (var i in pd.res) {
    pd.g_resources.push(pd.res[i]);
}

/**
 * Seta a cor da UI (realizar a chamada antes do carregamento dos recursos).
 * @static
 * @function
 * @param {pd.UI_COLOR_BLUE|pd.UI_COLOR_ORANGE} color
 */
pd.setUIColor = function(color) {
    const uiElements = ["s_input", "p_input", "s_menus", "p_menus"];
    if(pd.res[uiElements[0]].lastIndexOf(color) != -1)
        return;

    const currentPattern = color == pd.UI_COLOR_BLUE ? pd.UI_COLOR_ORANGE : pd.UI_COLOR_BLUE;
    for(var i in uiElements) {
        pd.res[uiElements[i]] = pd.res[uiElements[i]].replace(currentPattern, color);
    }

    pd.g_resources = [];
    for (var i in pd.res)
        pd.g_resources.push(pd.res[i]);
};

/**
 * @constant
 * @type {string}
 */
pd.UI_COLOR_BLUE = "blueUI";

/**
 * @constant
 * @type {string}
 */
pd.UI_COLOR_ORANGE = 'orangeUI';