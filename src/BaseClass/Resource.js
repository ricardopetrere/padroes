pd.resLoad = {
    //Loading Screen
    s_logo : padroesPath+"/res/img/Logo.png",
    s_loadbar : padroesPath+"/res/img/LoadingBar.png",
    s_loadbarBG : padroesPath+"/res/img/LoadingBarBG.png",
    s_carregando : padroesPath+"/res/img/carregando.png",
    icon_plist : padroesPath+"/res/img/icon.plist",
    icon_sprite : padroesPath+"/res/img/icon.png"
};

pd.resPadrao = {
    //debugger
    mainDebugInterface: padroesPath+"/res/Debug/mainDebugInterface.png",
    btn_fechar: padroesPath+"/res/Debug/btn_fechar.png",
    btn_mais: padroesPath+"/res/Debug/btn_mais.png",
    btn_audio: padroesPath+"/res/Debug/btn_audioDebug.png",
    btn_animation: padroesPath+"/res/Debug/btn_animationDebug.png",
    btn_general: padroesPath+"/res/Debug/btn_generalDebug.png",
    debuggerUi: padroesPath+"/res/Debug/DebugUi.png",
    debuggerUi2: padroesPath+"/res/Debug/DebugUi2.png",
    uncheckedButton: padroesPath+"/res/Debug/unchecked.png",
    checkedButton: padroesPath+"/res/Debug/checked.png",
    textBoxImage: padroesPath+"/res/Debug/TextBox.png",
    BoundingBox: padroesPath+"/res/Debug/boundingBox.png",
    cross: padroesPath+"/res/Debug/cross.png",

    //Recursos padrao
    s_input: padroesPath+"/res/img/input.png",
    p_input: padroesPath+"/res/img/input.plist",

    s_menus: padroesPath+"/res/img/menus.png",
    p_menus: padroesPath+"/res/img/menus.plist",

    s_Padroes : padroesPath+"/res/img/padroes.png",
    p_Padroes : padroesPath+"/res/img/padroes.plist",

    //Audios gerais do 2 ano
    fx_Erro : padroesPath+"/res/audios/erro.mp3",
    fx_Acerto : padroesPath+"/res/audios/acerto.mp3",
    fx_BgmLose : padroesPath+"/res/audios/gameover.mp3",
    fx_BgmWin : padroesPath+"/res/audios/happy.mp3",
    fx_escrever : padroesPath+"/res/audios/escrever.mp3",

    //Cenas finais
    s_fundoPreto : padroesPath+"/res/img/bg_final.png",
    fx_flip : padroesPath+"/res/audios/desenrola.mp3",
    fx_exp : padroesPath+"/res/audios/explosion.mp3",
    fx_star : padroesPath+"/res/audios/estrelas.mp3",
    fx_button: padroesPath+"/res/audios/button.mp3"

};

pd.load_resources = [];
for (var i in pd.resLoad) {
    pd.load_resources.push(pd.resLoad[i]);
};

pd.g_resources = [];
for (var i in pd.resPadrao) {
    pd.g_resources.push(pd.resPadrao[i]);
};