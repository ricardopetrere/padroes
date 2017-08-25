/**
 * Created by ??? on ???.
 * @desc - Presets de transições.
 */

/**
 * @param {Number} t
 * @param {cc.Scene} s
 * @param {cc.Layer} layer
 * @param {Number} z
 * @param {Number} x
 * @param {Number} y
 * @constructor
 * @returns {cc.TransitionScene}
 */
var ZoomTo = function (t, s, layer, z, x, y) {
    var pos = cc.p(x, y);
    layer.runAction(new cc.Spawn(
        new cc.MoveTo(t, (512 - pos.x) * z,  (384 - pos.y) * z),
        new cc.ScaleTo(t, z)
    ));
    return FadeWhiteTransition(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var JumpZoomTransition = function (t, s) {
    return new cc.TransitionJumpZoom(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var FadeTransition = function (t, s) {
    return new cc.TransitionFade(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var FadeWhiteTransition = function (t, s) {
    return new cc.TransitionFade(t, s, cc.color(255, 255, 255, 255));
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var FlipXLeftOver = function (t, s) {
    return new cc.TransitionFlipX(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var FlipXRightOver = function (t, s) {
    return new cc.TransitionFlipX(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var FlipYUpOver = function (t, s) {
    return new cc.TransitionFlipY(t, s, cc.TRANSITION_ORIENTATION_UP_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var FlipYDownOver = function (t, s) {
    return new cc.TransitionFlipY(t, s, cc.TRANSITION_ORIENTATION_DOWN_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var FlipAngularLeftOver = function (t, s) {
    return new cc.TransitionFlipAngular(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var FlipAngularRightOver = function (t, s) {
    return new cc.TransitionFlipAngular(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var ZoomFlipXLeftOver = function (t, s) {
    return new cc.TransitionZoomFlipX(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var ZoomFlipXRightOver = function (t, s) {
    return new cc.TransitionZoomFlipX(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var ZoomFlipYUpOver = function (t, s) {
    return new cc.TransitionZoomFlipY(t, s, cc.TRANSITION_ORIENTATION_UP_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var ZoomFlipYDownOver = function (t, s) {
    return new cc.TransitionZoomFlipY(t, s, cc.TRANSITION_ORIENTATION_DOWN_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var ZoomFlipAngularLeftOver = function (t, s) {
    return new cc.TransitionZoomFlipAngular(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var ZoomFlipAngularRightOver = function (t, s) {
    return new cc.TransitionZoomFlipAngular(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var ShrinkGrowTransition = function (t, s) {
    return new cc.TransitionShrinkGrow(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var RotoZoomTransition = function (t, s) {
    return new cc.TransitionRotoZoom(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var MoveInLTransition = function (t, s) {
    return new cc.TransitionMoveInL(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var MoveInRTransition = function (t, s) {
    return new cc.TransitionMoveInR(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var MoveInTTransition = function (t, s) {
    return new cc.TransitionMoveInT(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var MoveInBTransition = function (t, s) {
    return new cc.TransitionMoveInB(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var SlideInLTransition = function (t, s) {
    return new cc.TransitionSlideInL(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var SlideInRTransition = function (t, s) {
    return new cc.TransitionSlideInR(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var SlideInTTransition = function (t, s) {
    return new cc.TransitionSlideInT(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var SlideInBTransition = function (t, s) {
    return new cc.TransitionSlideInB(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var CCTransitionCrossFade = function (t, s) {
    return new cc.TransitionCrossFade(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var CCTransitionRadialCCW = function (t, s) {
    return new cc.TransitionProgressRadialCCW(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var CCTransitionRadialCW = function (t, s) {
    return new cc.TransitionProgressRadialCW(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var PageTransitionForward = function (t, s) {
    cc.director.setDepthTest(false);
    return new cc.TransitionPageTurn(t, s, false);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var PageTransitionBackward = function (t, s) {
	cc.director.setDepthTest(false);
    return new cc.TransitionPageTurn(t, s, true);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var FadeTRTransition = function (t, s) {
    return new cc.TransitionFadeTR(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var FadeBLTransition = function (t, s) {
    return new cc.TransitionFadeBL(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var FadeUpTransition = function (t, s) {
    return new cc.TransitionFadeUp(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var FadeDownTransition = function (t, s) {
    return new cc.TransitionFadeDown(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var TurnOffTilesTransition = function (t, s) {
    return new cc.TransitionTurnOffTiles(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var SplitRowsTransition = function (t, s) {
    return new cc.TransitionSplitRows(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 * @constructor
 */
var SplitColsTransition = function (t, s) {
    return new cc.TransitionSplitCols(t, s);
};