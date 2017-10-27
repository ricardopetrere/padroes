/**
 * Created by Ryan Balieiro on 15/09/17.
 *
 * @desc
 * Implementa as capacidades de um node clicável. <br />
 * Este decorator é útil para objetos de interface que interagem de maneira explícita com inputs de mouse/touch.
 * @mixin
 */
pd.decorators.ClickableNode = {/** @lends pd.decorators.ClickableNode#*/
    /**
     * Os dados de posição pré-cacheados do objeto.
     * @type {{local:cc.Point, global:cc.Point}}
     */
    _positionData: null,

    /**
     * Bounding Box utilizada para a colisão por intersecção.
     * @type {cc.Rect}
     */
    _cachedBoundingBox:null,

    /**
     *
     * @type {cc.Rect}
     */
    _collisionRect: null,

    /**
     * Salva uma cópia dos dados de exibição do objeto. <br >
     * Esse método tem o intuito de reaproveitar objetos geométricos utilizados em colisões, visando otimizar o uso da memória.
     * @private
     */
    cacheCollisionData: function() {
        this._positionData = this._positionData || {local:cc.p(null, null), global:null};

        if(this._positionData.local.x != this.x || this._positionData.local.y != this.y) {
            this._positionData.local.x = this.x;
            this._positionData.local.y = this.y;
            this._positionData.global = this.convertToWorldSpace(this._positionData.local);
            this._cachedBoundingBox = this.getBoundingBoxToWorld();
        }
    },

    /**
     * Atualiza o retângulo de colisão .
     * @param {Number} x
     * @param {Number} y
     * @param {Number} size
     * @private
     */
    _updateCollisionRect: function(x, y, size) {
        this._collisionRect = this._collisionRect || cc.rect(0, 0, 0, 0);
        var rect = this._collisionRect;
        rect.x = x;
        rect.y = y;
        rect.width = size || 1;
        rect.height = size || 1;
    },

    /**
     * Verifica se um ponto local (x,y) está contido dentro da collision box/bounding box do node.
     * @param {Number} _x
     * @param {Number} _y
     * @param {Number} [tolerance = 1]
     * @returns {Boolean}
     */
    isInside: function(_x, _y, tolerance) {
        this._updateCollisionRect(_x, _y, tolerance);
        return cc.rectIntersectsRect(this._cachedBoundingBox || this.getBoundingBoxToWorld(), this._collisionRect);
    },

    /**
     * @param {Object} event
     * @param {Number} [tolerance = 1]
     */
    isInsideMouseEvent: function(event, tolerance) {
        return this.isInside(event.getLocationX(), event.getLocationY(), tolerance);
    },

    /**
     * Calcula a distância entre a sprite e um ponto, para o caso de colisões por distância.
     * @param {Number} _x
     * @param {Number} _y
     * @returns {number}
     */
    getRelativeDistanceTo: function(_x, _y) {
        if(!this._positionData) {
            var globalPosition = this.getParent().convertToWorldSpace(this.getPosition());
            return pd.pointDistance(_x, _y, globalPosition.x, globalPosition.y);
        }

        return pd.pointDistance(_x, _y, this._positionData.global.x, this._positionData.global.y);
    }
};
