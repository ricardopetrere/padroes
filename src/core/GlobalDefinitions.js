/**
 * Created by Ryan Balieiro on 07/06/17.
 * Lista de constantes globais do namespace 'Padrões'.
 */

//<editor-fold desc="#Resources">
/**
 * Recursos utilizados pela tela de loading.
 * @static
 * @enum {string}
 */
pd.resLoad = {
    s_loader: pd.padroesPath+"/res/img/loading/loader.png",
    p_loader: pd.padroesPath+"/res/img/loading/loader.plist",
    fx_woosh: pd.padroesPath+"/res/snd/loading/woosh.mp3",
    fx_logo: pd.padroesPath+"/res/snd/loading/logo.mp3",
    fx_swish: pd.padroesPath+"/res/snd/loading/swish.mp3",
    lato: pd.padroesPath+"/res/font/Lato.ttf"
};

/**
 * Recursos utilizados pelos padrões.
 * @static
 * @enum {string}
 */
pd.res = {

    //Debugger:
    editorSpriteSheet_s: pd.padroesPath+"/res/img/editor/editorAssets.png",
    editorSpriteSheet_p: pd.padroesPath+"/res/img/editor/editorAssets.plist",

    //UI:
    s_input: pd.padroesPath+"/res/img/blueUI/input.png",
    p_input: pd.padroesPath+"/res/img/blueUI/input.plist",
    s_menus: pd.padroesPath+"/res/img/blueUI/menus.png",
    p_menus: pd.padroesPath+"/res/img/blueUI/menus.plist",
    s_Padroes: pd.padroesPath+"/res/img/padroes.png",
    p_Padroes: pd.padroesPath+"/res/img/padroes.plist",

    //Audios:
    fx_Erro : pd.padroesPath+"/res/snd/erro.mp3",
    fx_Acerto : pd.padroesPath+"/res/snd/acerto.mp3",
    fx_BgmLose : pd.padroesPath+"/res/snd/gameover.mp3",
    fx_BgmWin : pd.padroesPath+"/res/snd/happy.mp3",
    fx_escrever : pd.padroesPath+"/res/snd/escrever.mp3",

    //Win/Lose:
    s_fundoPreto : pd.padroesPath+"/res/img/bg_final.png",
    fx_flip : pd.padroesPath+"/res/snd/desenrola.mp3",
    fx_exp : pd.padroesPath+"/res/snd/explosion.mp3",
    fx_star : pd.padroesPath+"/res/snd/estrelas.mp3",
    fx_button: pd.padroesPath+"/res/snd/button.mp3",

    //Fonts
    carton_six: pd.padroesPath+"/res/font/Carton Six.ttf",
    dimbo: pd.padroesPath+"/res/font/Dimbo.ttf",
    calibri: pd.padroesPath+"/res/font/Calibri.ttf",
    gill_sans: pd.padroesPath+"/res/font/Gill Sans MT Condensed.ttf"

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
//</editor-fold>
//<editor-fold desc="#Global Constants">
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
    ESC: 27, //Cuidado: nas pd.GameLayer, essa tecla chama a pauseLayer.
    ENTER: 13
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
    EDITOR_SCREEN: 9010,
    PAUSE_BUTTON: 9000,
    GAME_OVER_LAYER: 9999,
    FOCUS_LAYER:10000,
    FOCUS_OBJECTS:10001,
    TUTORIAL_LAYER: 99999,
    PAUSE_LAYER: 999999
};

/**
 * Enumerador com as fontes padrões.
 * @enum {{name:String, path:String}}
 */
pd.Fonts = {
    CALIBRI: {name: "Calibri", path:pd.res.calibri},
    CARTON_SIX: {name: "Carton Six", path:pd.res.carton_six},
    DIMBO: {name: "Dimbo", path:pd.res.dimbo},
    GILL_SANS: {name: "Gill Sans MT Condensed", path:pd.res.gill_sans}
};

/**
 * Enumerador com os SpriteFrames dos padrões.
 * @enum {String}
 */
pd.SpriteFrames = {
    // Elementos de Interface:
    ARROW: "seta_0001.png",
    ARROW_PRESSED: "seta_0002.png",
    BG_TUTORIAL_01: "background_01_instrucoes.png",
    BG_TUTORIAL_02: "background_02_instrucoes.png",
    BIG_STAR: "estrela_grande.png",
    BTN_AUDIO: "pd_btn_audio_normal.png",
    BTN_AUDIO_PRESSED: "pd_btn_audio_pressed.png",
    BTN_CLOSE: "pd_btn_close_normal.png",
    BTN_CLOSE_PRESSED: "pd_btn_close_pressed.png",
    BTN_EXIT: "btn_sair_instrucoes.png",
    BTN_EXIT_PRESSED: "btp_sair_instrucoes.png",
    BTN_MENU: "pd_btn_menu_normal.png",
    BTN_MENU_PRESSED: "pd_btn_menu_pressed.png",
    BTN_MUTED: "pd_btn_muted_normal.png",
    BTN_MUTED_PRESSED: "pd_btn_muted_pressed.png",
    BTN_NAKED: "pd_btn_naked_normal.png",
    BTN_NAKED_PRESSED: "pd_btn_naked_pressed.png",
    BTN_NEXT: "btn_next_instrucoes.png",
    BTN_NEXT_PRESSED: "btp_next_instrucoes.png",
    BTN_PAUSE: "pd_btn_pause_normal.png",
    BTN_PAUSE_PRESSED: "pd_btn_pause_pressed.png",
    BTN_PAUSE_LONG: "pd_pause_interface.png",
    BTN_RESTART: "pd_btn_restart_normal.png",
    BTN_RESTART_PRESSED: "pd_btn_restart_pressed.png",
    BTN_RESUME: "pd_btn_resume_normal.png",
    BTN_RESUME_PRESSED: "pd_btn_resume_pressed.png",
    BTN_TIP: "pd_btn_dica_normal.png",
    BTN_TIP_PRESSED: "pd_btn_dica_pressed.png",
    BTN_TUTORIAL: "pd_btn_tutorial_normal.png",
    BTN_TUTORIAL_PRESSED: "pd_btn_tutorial_pressed.png",
    EDITOR_BOUNDING_BOX: "boundingBox.png",
    EDITOR_BTN: "btn_editor.png",
    EDITOR_BTN_CLOSE: "btn_fechar.png",
    EDITOR_BTN_CREATE: "btn_criar.png",
    EDITOR_BTN_LIST: "btn_lista.png",
    EDITOR_BTN_PRINT: "btn_printar.png",
    EDITOR_BTN_PRINTER: "btn_printer.png",
    EDITOR_BTN_SPRITE_CREATOR: "btn_spriteCreator.png",
    EDITOR_CHAINED: "chained.png",
    EDITOR_CHECKED: "checked.png",
    EDITOR_HEADER: "editor_cabecalho.png",
    EDITOR_INTERFACE: "editor_interface.png",
    EDITOR_LIST: "editor_list.png",
    EDITOR_UNCHAINED: "unchained.png",
    EDITOR_UNCHECKED: "unchecked.png",
    HAND: "dedo_0001.png",
    HAND_PRESSED: "dedo_0002.png",
    IMPACT_SHADOW: "impacto.png",
    JOYSTICK_BACKGROUND: "JoystickBackGround.png",
    JOYSTICK_PAD: "JoystickStick.png",
    KEY_DOWN: "keyDown0001.png",
    KEY_DOWN_PRESSED: "keyDown0002.png",
    KEY_LEFT: "keyLeft0001.png",
    KEY_LEFT_PRESSED: "keyLeft0002.png",
    KEY_NAKED: "keyNaked0001.png",
    KEY_NAKED_PRESSED: "keyNaked0002.png",
    KEY_RIGHT: "keyRight0001.png",
    KEY_RIGHT_PRESSED: "keyRight0002.png",
    KEY_SPACE: "keySpace0001.png",
    KEY_SPACE_PRESSED: "keySpace0002.png",
    KEY_UP: "keyUp0001.png",
    KEY_UP_PRESSED: "keyUp0002.png",
    PIAGET_LOGO: "piagetLogo.png",
    PORTAL_LOGO: "portalLogo.png",
    ROUND_BUTTON_BODY: "roundButtonBody.png",
    ROUND_BUTTON_TRANSPARENT: "roundButtonTransparent0001.png",
    ROUND_BUTTON_TRANSPARENT_PRESSED: "roundButtonTransparent0002.png",
    SQUARE_BUTTON_BODY: "squareButtonBody.png",
    SQUARE_BUTTON_TRANSPARENT: "squareButtonTransparent0001.png",
    SQUARE_BUTTON_TRANSPARENT_PRESSED: "squareButtonTransparent0002.png",
    STAR_1: "estrela1.png",
    STAR_2: "estrela2.png",
    STAR_3: "estrela3.png",
    STRIP: "faixa.png",
    STRIP_CORNER: "faixa_aba.png",
    STRIP_FRONT: "faixa_frente.png",
    TABLET: "accel_lateral0001.png",
    EDITOR_TEXT_BOX: "textBox.png",
    TUTORIAL_GRADIENT_LAYER: "degrade_instrucoes.png",
    TUTORIAL_LAYER: "layer_instrucoes.png",
    TUTORIAL_STAGE: "stage_instrucoes.png",
    TUTORIAL_TEXT: "txt_instrucoes.png"
};

//</editor-fold">
//<editor-fold desc="#Internal Namespaces">
/**
 * @namespace
 * 'Package' responsável por encapsular as implementações de objetos decorators.
 *
 * @desc
 * Conjunto de estruturas pré-implementadas que podem ser adicionadas à objetos nativos ou customizados. <br />
 * Decorators podem ser utilizados para extender as funcionalidades de um objeto:
 * - estaticamente: através de sua inserção no protótipo do objeto via {Class}.extend({Decorator}).
 * - dinâmicamente: através de sua injeção no objeto em runtime, via pd.decorate({Object}, {Decorator}). A grande vantagem deste método é que as outras instâncias da classe do objeto extendido não serão afetadas.
 *
 * Método estático (inserindo o decorator pd.Model em um protótipo de um objeto):
 * @example
 * var prototype = cc.Class.extend(pd.Model).extend({...});
 *
 * Método dinâmico (inserindo o decorator pd.Model em uma instância de uma classe qualquer):
 * @example
 * pd.decorate(myObject, pd.Model);
 */
pd.decorators = {};
//</editor-fold>