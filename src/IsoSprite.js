/**
 * Phaser IsoSprite constructor
 * @class Phaser.Plugin.Isometric.IsoSprite
 * @constructor
 */
Phaser.Plugin.Isometric.IsoSprite = function (game, x, y, z, key, frame, parent) {

    Phaser.Sprite.call(this, game, x, y, key, frame, parent);

    /**
     * @property {number} type - The const type of this object.
     * @readonly
     */
    this.type = Phaser.Plugin.Isometric.ISOSPRITE;

    /**
     * @property {Phaser.Plugin.Isometric.Point3} _isoPosition - Internal 3D position.
     * @private
     */
    this._isoPosition = new Phaser.Plugin.Isometric.Point3(x, y, z);

    /**
     * @property {number} snap - Snap this IsoSprite's position to this value; handy for keeping pixel art snapped to whole pixels.
     * @default
     */
    this.snap = 0;

    /**
     * @property {number} _depth - Internal cached depth value.
     * @readonly
     */
    this._depth = 0;

    /**
     * @property {boolean} _depthChanged - Internal invalidation control for depth management.
     * @readonly
     */
    this._depthChanged = true;

    /**
     * @property {boolean} _isoPositionChanged - Internal invalidation control for positioning.
     * @readonly
     */
    this._isoPositionChanged = true;

    this._project();
};

Phaser.Plugin.Isometric.IsoSprite.prototype = Object.create(Phaser.Sprite.prototype);
Phaser.Plugin.Isometric.IsoSprite.prototype.constructor = Phaser.Plugin.Isometric.IsoSprite;

/**
 * Internal function called by the World postUpdate cycle.
 *
 * @method Phaser.Plugin.Isometric.IsoSprite#postUpdate
 * @memberof Phaser.Plugin.Isometric.IsoSprite
 */
Phaser.Plugin.Isometric.IsoSprite.prototype.postUpdate = function () {
    Phaser.Sprite.prototype.postUpdate.call(this);

    this._project();
};

/**
 * Internal function that performs the axonometric projection from 3D to 2D space.
 * @method Phaser.Plugin.Isometric.IsoSprite#_project
 * @memberof Phaser.Plugin.Isometric.IsoSprite
 * @private
 */
Phaser.Plugin.Isometric.IsoSprite.prototype._project = function () {
    if (this._isoPositionChanged) {
        this.game.iso.project(this._isoPosition, this.position);

        if (this.snap > 0) {
            this.position.x = Phaser.Math.snapTo(this.position.x, this.snap);
            this.position.y = Phaser.Math.snapTo(this.position.y, this.snap);
        }

        this._isoPositionChanged = false;
    }
};

/**
 * The axonometric position of the IsoSprite on the x axis. Increasing the x coordinate will move the object down and to the right on the screen.
 *
 * @name Phaser.Sprite#isoX
 * @property {number} isoX - The axonometric position of the IsoSprite on the x axis.
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoX", {
    get: function () {
        return this._isoPosition.x;
    },
    set: function (value) {
        this._isoPosition.x = value;
        this._depthChanged = this._isoPositionChanged = true;
    }
});

/**
 * The axonometric position of the IsoSprite on the y axis. Increasing the y coordinate will move the object down and to the left on the screen.
 *
 * @name Phaser.Sprite#isoY
 * @property {number} isoY - The axonometric position of the IsoSprite on the y axis.
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoY", {
    get: function () {
        return this._isoPosition.y;
    },
    set: function (value) {
        this._isoPosition.y = value;
        this._depthChanged = this._isoPositionChanged = true;
    }
});

/**
 * The axonometric position of the IsoSprite on the z axis. Increasing the z coordinate will move the object directly upwards on the screen.
 *
 * @name Phaser.Sprite#isoZ
 * @property {number} isoZ - The axonometric position of the IsoSprite on the z axis.
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoZ", {
    get: function () {
        return this._isoPosition.z;
    },
    set: function (value) {
        this._isoPosition.z = value;
        this._depthChanged = this._isoPositionChanged = true;
    }
});

/**
 * A Point3 object representing the axonometric position of the IsoSprite.
 *
 * @name Phaser.Sprite#isoPosition
 * @property {Point3} isoPosition - The axonometric position of the IsoSprite on the z axis.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "isoPosition", {
    get: function () {
        return this._isoPosition;
    }
});

/**
 * The non-unit distance of the IsoSprite from the 'front' of the scene. Used to correctly depth sort a group of IsoSprites.
 *
 * @name Phaser.Sprite#depth
 * @property {number} depth - A calculated value used for depth sorting.
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.IsoSprite.prototype, "depth", {
    get: function () {
        if (this._depthChanged === true) {
            this._depth = (this._isoPosition.x + this._isoPosition.y) + (this._isoPosition.z * 0.95);
            this._depthChanged = false;
        }
        return this._depth;
    }
});

/**
 * Create a new IsoSprite with specific position and sprite sheet key.
 *
 * @method Phaser.GameObjectFactory#isoSprite
 * @param {number} x - X position of the new IsoSprite.
 * @param {number} y - Y position of the new IsoSprite.
 * @param {number} y - Z position of the new IsoSprite.
 * @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
 * @param {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
 * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
 * @returns {Phaser.Plugin.Isometric.IsoSprite} the newly created IsoSprite object.
 */

Phaser.GameObjectCreator.prototype.isoSprite = function (x, y, z, key, frame) {

    return new Phaser.Plugin.Isometric.IsoSprite(this.game, x, y, z, key, frame);

};

/**
 * Create a new IsoSprite with specific position and sprite sheet key.
 *
 * @method Phaser.GameObjectFactory#isoSprite
 * @param {number} x - X position of the new IsoSprite.
 * @param {number} y - Y position of the new IsoSprite.
 * @param {number} y - Z position of the new IsoSprite.
 * @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
 * @param {string|number} [frame] - If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
 * @param {Phaser.Group} [group] - Optional Group to add the object to. If not specified it will be added to the World group.
 * @returns {Phaser.Plugin.Isometric.IsoSprite} the newly created IsoSprite object.
 */
Phaser.GameObjectFactory.prototype.isoSprite = function (x, y, z, key, frame, group) {

    if (typeof group === 'undefined') {
        group = this.world;
    }

    return group.add(new Phaser.Plugin.Isometric.IsoSprite(this.game, x, y, z, key, frame));

};