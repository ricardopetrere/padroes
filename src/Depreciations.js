/**
 * Created by Ryan Balieiro on 23/05/17.
 * @desc Listagem de propriedades depreciadas durante alterações dos padrões - para manter a compatibilidade com versões antigas.
 */

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.delegate.activeNamespace.
 * @type {Object}
 */
activeGameSpace = pd.delegate.activeNamespace;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.delegate.isPaused.
 * @type {boolean}
 */
isPaused = pd.delegate.isPaused;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.createSprite.
 * A função ainda é a mesma, apenas foi dado um nome mais claro à ela.
 */
pd.cObject = pd.createSprite;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.createText.
 * A função ainda é a mesma, apenas foi dado um nome mais claro à ela.
 */
pd.cText = pd.createText;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.delegate.init.
 */
pd.initGlobals = pd.delegate.init;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.switchScene.
 * A função ainda é a mesma, apenas foi refatorado o seu nome para enquadrar-se no padrão.
 */
pd.trocaCena = pd.switchScene;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.openURL.
 */
abreLink = pd.openURL;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.openURL.
 */
abreLinkIOS = pd.openURL;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.validate.
 */
registrarValidacao = pd.validate;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.checkValidation.
 */
checarValidacao = pd.checkValidation;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.delegate.pause.
 */
pd.pausar = pd.delegate.pause;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.delegate.resume.
 */
pd.resumar = pd.delegate.resume;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.delegate.retain ou pd.retain.
 */
pd.reter = pd.retain;

/**
 * @deprecated - desde a versão 2.2 - não fazer chamadas a essa função - deixar apenas ela para ser manipulada pelo controlador interno.
 */
pd.liberar = pd.delegate.releaseAll;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.delegate.finish.
 */
pd.finishGame = pd.delegate.finish;

/**
 * @deprecated - desde a versão 2.2 - utilizar pd.res.
 */
pd.resPadrao = pd.res;

/**
 * @deprecated - desde a versão 2.2 - não utilizar mais este recurso! Utilizar pd.debugMode, e setar o modo debug via project.json.
 * @type {undefined}
 */
DebugMode = undefined;

