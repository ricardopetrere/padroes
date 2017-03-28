/////////////////////////////////Transiçoes//////////////////////////////////////////


// t = tempo 
// s = proxima scene
var ZoomTo = function (t, s, layer, z, x, y) {
    var pos = cc.p(x, y);
    layer.runAction(new cc.Spawn(
        new cc.MoveTo(t, (512 - pos.x) * z,  (384 - pos.y) * z),
        new cc.ScaleTo(t, z)
    ));
    return FadeWhiteTransition(t, s);
}

var JumpZoomTransition = function (t, s) {
    return new cc.TransitionJumpZoom(t, s);
};
var FadeTransition = function (t, s) {
    return new cc.TransitionFade(t, s);
};

var FadeWhiteTransition = function (t, s) {
    return new cc.TransitionFade(t, s, new cc.Color(255, 255, 255));
};

var FlipXLeftOver = function (t, s) {
    return new cc.TransitionFlipX(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

var FlipXRightOver = function (t, s) {
    return new cc.TransitionFlipX(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

var FlipYUpOver = function (t, s) {
    return new cc.TransitionFlipY(t, s, cc.TRANSITION_ORIENTATION_UP_OVER);
};

var FlipYDownOver = function (t, s) {
    return new cc.TransitionFlipY(t, s, cc.TRANSITION_ORIENTATION_DOWN_OVER);
};

var FlipAngularLeftOver = function (t, s) {
    return new cc.TransitionFlipAngular(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

var FlipAngularRightOver = function (t, s) {
    return new cc.TransitionFlipAngular(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

var ZoomFlipXLeftOver = function (t, s) {
    return new cc.TransitionZoomFlipX(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

var ZoomFlipXRightOver = function (t, s) {
    return new cc.TransitionZoomFlipX(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

var ZoomFlipYUpOver = function (t, s) {
    return new cc.TransitionZoomFlipY(t, s, cc.TRANSITION_ORIENTATION_UP_OVER);
};

var ZoomFlipYDownOver = function (t, s) {
    return new cc.TransitionZoomFlipY(t, s, cc.TRANSITION_ORIENTATION_DOWN_OVER);
};

var ZoomFlipAngularLeftOver = function (t, s) {
    return new cc.TransitionZoomFlipAngular(t, s, cc.TRANSITION_ORIENTATION_LEFT_OVER);
};

var ZoomFlipAngularRightOver = function (t, s) {
    return new cc.TransitionZoomFlipAngular(t, s, cc.TRANSITION_ORIENTATION_RIGHT_OVER);
};

var ShrinkGrowTransition = function (t, s) {
    return new cc.TransitionShrinkGrow(t, s);
};

var RotoZoomTransition = function (t, s) {
    return new cc.TransitionRotoZoom(t, s);
};

var MoveInLTransition = function (t, s) {
    return new cc.TransitionMoveInL(t, s);
};

var MoveInRTransition = function (t, s) {
    return new cc.TransitionMoveInR(t, s);
};

var MoveInTTransition = function (t, s) {
    return new cc.TransitionMoveInT(t, s);
};

var MoveInBTransition = function (t, s) {
    return new cc.TransitionMoveInB(t, s);
};

var SlideInLTransition = function (t, s) {
    return new cc.TransitionSlideInL(t, s);
};

var SlideInRTransition = function (t, s) {
    return new cc.TransitionSlideInR(t, s);
};

var SlideInTTransition = function (t, s) {
    return new cc.TransitionSlideInT(t, s);
};

var SlideInBTransition = function (t, s) {
    return new cc.TransitionSlideInB(t, s);
};

var CCTransitionCrossFade = function (t, s) {
    return new cc.TransitionCrossFade(t, s);
};

var CCTransitionRadialCCW = function (t, s) {
    return new cc.TransitionProgressRadialCCW(t, s);
};

var CCTransitionRadialCW = function (t, s) {
    return new cc.TransitionProgressRadialCW(t, s);
};

var PageTransitionForward = function (t, s) {
    cc.director.setDepthTest(false);
    return new cc.TransitionPageTurn(t, s, false);
};

var PageTransitionBackward = function (t, s) {
	cc.director.setDepthTest(false);
    return new cc.TransitionPageTurn(t, s, true);
};

var FadeTRTransition = function (t, s) {
    return new cc.TransitionFadeTR(t, s);
};

var FadeBLTransition = function (t, s) {
    return new cc.TransitionFadeBL(t, s);
};

var FadeUpTransition = function (t, s) {
    return new cc.TransitionFadeUp(t, s);
};

var FadeDownTransition = function (t, s) {
    return new cc.TransitionFadeDown(t, s);
};

var TurnOffTilesTransition = function (t, s) {
    return new cc.TransitionTurnOffTiles(t, s);
};

var SplitRowsTransition = function (t, s) {
    return new cc.TransitionSplitRows(t, s);
};

var SplitColsTransition = function (t, s) {
    return new cc.TransitionSplitCols(t, s);
};