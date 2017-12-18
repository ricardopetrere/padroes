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
 * @returns {cc.TransitionScene}
 */
pd.ZoomTo = function (t, s, layer, z, x, y) {
    var pos = cc.p(x, y);
    layer.runAction(new cc.Spawn(
        new cc.MoveTo(t, (512 - pos.x) * z,  (384 - pos.y) * z),
        new cc.ScaleTo(t, z)
    ));
    return pd.FadeWhiteTransition(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.JumpZoomTransition = function (t, s) {
    return new cc.TransitionJumpZoom(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.FadeTransition = function (t, s) {
    return new cc.TransitionFade(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.FadeWhiteTransition = function (t, s) {
    return new cc.TransitionFade(t, s, cc.color(255, 255, 255, 255));
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.FlipXLeftOver = function (t, s) {
    return new cc.TransitionFlipX(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.FlipXRightOver = function (t, s) {
    return new cc.TransitionFlipX(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.FlipYUpOver = function (t, s) {
    return new cc.TransitionFlipY(t, s, cc.TRANSITION_ORIENTATION_UP_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.FlipYDownOver = function (t, s) {
    return new cc.TransitionFlipY(t, s, cc.TRANSITION_ORIENTATION_DOWN_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.FlipAngularLeftOver = function (t, s) {
    return new cc.TransitionFlipAngular(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.FlipAngularRightOver = function (t, s) {
    return new cc.TransitionFlipAngular(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.ZoomFlipXLeftOver = function (t, s) {
    return new cc.TransitionZoomFlipX(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.ZoomFlipXRightOver = function (t, s) {
    return new cc.TransitionZoomFlipX(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.ZoomFlipYUpOver = function (t, s) {
    return new cc.TransitionZoomFlipY(t, s, cc.TRANSITION_ORIENTATION_UP_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.ZoomFlipYDownOver = function (t, s) {
    return new cc.TransitionZoomFlipY(t, s, cc.TRANSITION_ORIENTATION_DOWN_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.ZoomFlipAngularLeftOver = function (t, s) {
    return new cc.TransitionZoomFlipAngular(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.ZoomFlipAngularRightOver = function (t, s) {
    return new cc.TransitionZoomFlipAngular(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.ShrinkGrowTransition = function (t, s) {
    return new cc.TransitionShrinkGrow(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.RotoZoomTransition = function (t, s) {
    return new cc.TransitionRotoZoom(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.MoveInLTransition = function (t, s) {
    return new cc.TransitionMoveInL(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.MoveInRTransition = function (t, s) {
    return new cc.TransitionMoveInR(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.MoveInTTransition = function (t, s) {
    return new cc.TransitionMoveInT(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.MoveInBTransition = function (t, s) {
    return new cc.TransitionMoveInB(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.SlideInLTransition = function (t, s) {
    return new cc.TransitionSlideInL(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.SlideInRTransition = function (t, s) {
    return new cc.TransitionSlideInR(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.SlideInTTransition = function (t, s) {
    return new cc.TransitionSlideInT(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.SlideInBTransition = function (t, s) {
    return new cc.TransitionSlideInB(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.CCTransitionCrossFade = function (t, s) {
    return new cc.TransitionCrossFade(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.CCTransitionRadialCCW = function (t, s) {
    return new cc.TransitionProgressRadialCCW(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.CCTransitionRadialCW = function (t, s) {
    return new cc.TransitionProgressRadialCW(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.PageTransitionForward = function (t, s) {
    cc.director.setDepthTest(false);
    return new cc.TransitionPageTurn(t, s, false);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.PageTransitionBackward = function (t, s) {
	cc.director.setDepthTest(false);
    return new cc.TransitionPageTurn(t, s, true);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.FadeTRTransition = function (t, s) {
    return new cc.TransitionFadeTR(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.FadeBLTransition = function (t, s) {
    return new cc.TransitionFadeBL(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.FadeUpTransition = function (t, s) {
    return new cc.TransitionFadeUp(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.FadeDownTransition = function (t, s) {
    return new cc.TransitionFadeDown(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.TurnOffTilesTransition = function (t, s) {
    return new cc.TransitionTurnOffTiles(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.SplitRowsTransition = function (t, s) {
    return new cc.TransitionSplitRows(t, s);
};

/**
 * @param {Number} t
 * @param {Number} s
 * @returns {cc.TransitionScene}
 */
pd.SplitColsTransition = function (t, s) {
    return new cc.TransitionSplitCols(t, s);
};