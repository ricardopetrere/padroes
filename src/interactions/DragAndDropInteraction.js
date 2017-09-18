/**
 * Created by Ryan Balieiro on 15/09/17.
 * @class
 * @extends {pd.Interaction}
 * @classdesc Implementação genérica de uma mecânica de DragAndDrop.
 */
pd.DragAndDropInteraction = pd.Interaction.extend({/**  @lends pd.DragAndDropInteraction# **/

    /**
     * O objeto sendo arrastado.
     * @type {*}
     */
    _draggingObject: null,

    /**
     * O fator de escala do objeto selecionado.
     * @type {Number}
     */
    _selectedScale:1,

    /**
     * O ZOrder local a ser aplicado ao objeto selecionado.
     * Se for null, o zOrder original do objeto é preservado.
     * @type {Number}
     */
    _selectedZOrder:null,

    /**
     * Posição do toque inicial.
     * @type {cc.Point}
     */
    _initialTouchPoint: cc.p(0, 0),

    /**
     * @override
     * @param {*} actor
     */
    addActor: function(actor) {
        this._super(actor);
        pd.decorate(actor, pd.decorators.ClickableNode);
        pd.decorate(actor, pd.decorators.ResetableNode);
        actor.saveDisplayState();
    },

    /**
     * Configura a interação.
     * @param {Number} selectedScale
     * @param {Number} selectedZOrder
     */
    config: function(selectedScale, selectedZOrder) {
        this._selectedScale = selectedScale;
        this._selectedZOrder = selectedZOrder;
    },

    /**
     * Ativa a interação.
     * @override
     */
    enable: function() {
        pd.inputManager.add(pd.InputManager.Events.MOUSE_DOWN, this._handler, this._onDragStart, this);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_MOVE, this._handler, this._onDragMove, this);
        pd.inputManager.add(pd.InputManager.Events.MOUSE_UP, this._handler, this._onDragEnd, this);
    },

    /**
     * Desativa a interação.
     * @override
     */
    disable: function() {
        pd.inputManager.remove(pd.InputManager.Events.MOUSE_DOWN, this._handler, this._onDragStart);
        pd.inputManager.remove(pd.InputManager.Events.MOUSE_MOVE, this._handler, this._onDragMove);
        pd.inputManager.remove(pd.InputManager.Events.MOUSE_UP, this._handler, this._onDragEnd);
    },

    /**
     * Manipula o início de uma ação de drag.
     * @param event
     * @private
     */
    _onDragStart: function(event) {
        if(this._draggingObject)
            return;

        var collidingObject = pd.getNearestCollidingObject(event.getLocationX(), event.getLocationY(), this._actors);
        if(collidingObject) {
            this._draggingObject = collidingObject;
            if(!(this._draggingObject instanceof pd.Animation))
                this._draggingObject.stopAllActions();

            if(this._draggingObject.scaleX == this._draggingObject.displayState.scaleX)
                this._draggingObject.setScale(this._draggingObject.getScaleX()*this._selectedScale, this._draggingObject.getScaleY()*this._selectedScale);
            if(this._selectedZOrder)
                this._draggingObject.moveForward(this._selectedZOrder);

            this._initialTouchPoint.x = event.getLocationX();
            this._initialTouchPoint.y = event.getLocationY();
            this.notifyObserver(pd.DragAndDropInteraction.Events.DRAG_DID_START, this._draggingObject);
        }
    },

    /**
     * Manipula o progresso de uma ação de drag.
     * @param event
     * @private
     */
    _onDragMove: function(event) {
        if(this._draggingObject) {
            this._draggingObject.x = event.getLocationX() - this._initialTouchPoint.x + this._draggingObject.displayState.x;
            this._draggingObject.y = event.getLocationY() - this._initialTouchPoint.y + this._draggingObject.displayState.y;
        }
    },

    /**
     * Manipula o fim de uma ação de drag.
     * @param event
     * @private
     */
    _onDragEnd: function(event) {
        if(this._draggingObject) {
            this.notifyObserver(pd.DragAndDropInteraction.Events.DRAG_DID_END, this._draggingObject);
            this._draggingObject.resetZOrder();
            this._draggingObject = null;
        }
    }
});

/**
 * @enum {String}
 */
pd.DragAndDropInteraction.Events = {
    DRAG_DID_START: "dragDidStart",
    DRAG_DID_END: "dragDidEnd"
};
