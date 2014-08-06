/**
 * The Physics Body is linked to a single IsoSprite. All physics operations should be performed against the body rather than
 * the IsoSprite itself. For example you can set the velocity, acceleration, bounce values etc all on the Body.
 *
 * @class Phaser.Plugin.Isometric.Body
 * @classdesc IsoArcade Physics Body Constructor
 * @constructor
 * @param {Phaser.Plugin.Isometric.IsoSprite} sprite - The IsoSprite object this physics body belongs to.
 */
Phaser.Plugin.Isometric.Body = function (sprite) {

    /**
     * @property {Phaser.Plugin.Isometric.IsoSprite} sprite - Reference to the parent IsoSprite.
     */
    this.sprite = sprite;

    /**
     * @property {Phaser.Game} game - Local reference to game.
     */
    this.game = sprite.game;

    /**
     * @property {number} type - The type of physics system this body belongs to.
     */
    this.type = Phaser.Plugin.Isometric.ISOARCADE;

    /**
     * @property {boolean} enable - A disabled body won't be checked for any form of collision or overlap or have its pre/post updates run.
     * @default
     */
    this.enable = true;

    /**
     * @property {Phaser.Point} offset - The offset of the Physics Body from the IsoSprite x/y/z position.
     */
    this.offset = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} position - The position of the physics body.
     * @readonly
     */
    this.position = new Phaser.Plugin.Isometric.Point3(sprite.isoX, sprite.isoY, sprite.isoZ);

    /**
     * @property {Phaser.Point} prev - The previous position of the physics body.
     * @readonly
     */
    this.prev = new Phaser.Plugin.Isometric.Point3(this.position.x, this.position.y, this.position.z);

    /**
     * @property {boolean} allowRotation - Allow this Body to be rotated? (via angularVelocity, etc)
     * @default
     */
    this.allowRotation = true;

    /**
     * @property {number} rotation - The amount the Body is rotated.
     */
    this.rotation = sprite.rotation;

    /**
     * @property {number} preRotation - The previous rotation of the physics body.
     * @readonly
     */
    this.preRotation = sprite.rotation;

    /**
     * @property {number} sourceWidthX - The un-scaled original size.
     * @readonly
     */
    this.sourceWidthX = sprite.texture.frame.width;

    /**
     * @property {number} sourceWidthY - The un-scaled original size.
     * @readonly
     */
    this.sourceWidthY = sprite.texture.frame.width;

    /**
     * @property {number} sourceHeight - The un-scaled original size.
     * @readonly
     */
    this.sourceHeight = sprite.texture.frame.height;

    /**
     * @property {number} widthX - The calculated X width (breadth) of the physics body.
     */
    this.widthX = sprite.width * 0.5;

    /**
     * @property {number} widthY - The calculated Y width (depth) of the physics body.
     */
    this.widthY = sprite.width * 0.5;

    /**
     * @property {number} height - The calculated height of the physics body.
     */
    this.height = sprite.height - (sprite.width * 0.5);

    /**
     * @property {number} halfWidthX - The calculated X width / 2 of the physics body.
     */
    this.halfWidthX = Math.abs(this.widthX * 0.5);

    /**
     * @property {number} halfWidthX - The calculated X width / 2 of the physics body.
     */
    this.halfWidthY = Math.abs(this.widthY * 0.5);

    /**
     * @property {number} halfHeight - The calculated height / 2 of the physics body.
     */
    this.halfHeight = Math.abs(this.height * 0.5);

    /**
     * @property {Phaser.Plugin.Isometric.Point3} center - The center coordinate of the physics body.
     */
    this.center = new Phaser.Plugin.Isometric.Point3(sprite.isoX + this.halfWidthX, sprite.isoY + this.halfWidthY, sprite.isoZ + this.halfHeight);

    /**
     * @property {Phaser.Plugin.Isometric.Point3} velocity - The velocity in pixels per second sq. of the Body.
     */
    this.velocity = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} newVelocity - New velocity.
     * @readonly
     */
    this.newVelocity = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} deltaMax - The Sprite position is updated based on the delta x/y values. You can set a cap on those (both +-) using deltaMax.
     */
    this.deltaMax = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} acceleration - The velocity in pixels per second sq. of the Body.
     */
    this.acceleration = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} drag - The drag applied to the motion of the Body.
     */
    this.drag = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {boolean} allowGravity - Allow this Body to be influenced by gravity? Either world or local.
     * @default
     */
    this.allowGravity = true;

    /**
     * @property {Phaser.Plugin.Isometric.Point3} gravity - A local gravity applied to this Body. If non-zero this over rides any world gravity, unless Body.allowGravity is set to false.
     */
    this.gravity = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} bounce - The elasticitiy of the Body when colliding. bounce.x/y/z = 1 means full rebound, bounce.x/y/z = 0.5 means 50% rebound velocity.
     */
    this.bounce = new Phaser.Plugin.Isometric.Point3();

    /**
     * @property {Phaser.Plugin.Isometric.Point3} maxVelocity - The maximum velocity in pixels per second sq. that the Body can reach.
     * @default
     */
    this.maxVelocity = new Phaser.Plugin.Isometric.Point3(10000, 10000, 10000);

    /**
     * @property {number} angularVelocity - The angular velocity in pixels per second sq. of the Body.
     * @default
     */
    this.angularVelocity = 0;

    /**
     * @property {number} angularAcceleration - The angular acceleration in pixels per second sq. of the Body.
     * @default
     */
    this.angularAcceleration = 0;

    /**
     * @property {number} angularDrag - The angular drag applied to the rotation of the Body.
     * @default
     */
    this.angularDrag = 0;

    /**
     * @property {number} maxAngular - The maximum angular velocity in pixels per second sq. that the Body can reach.
     * @default
     */
    this.maxAngular = 1000;

    /**
     * @property {number} mass - The mass of the Body.
     * @default
     */
    this.mass = 1;

    /**
     * @property {number} angle - The angle of the Body in radians as calculated by its velocity, rather than its visual angle.
     * @readonly
     */
    this.angle = 0;

    /**
     * @property {number} speed - The speed of the Body as calculated by its velocity.
     * @readonly
     */
    this.speed = 0;

    /**
     * @property {number} facing - A const reference to the direction the Body is traveling or facing.
     * @default
     */
    this.facing = Phaser.NONE;

    /**
     * @property {boolean} immovable - An immovable Body will not receive any impacts from other bodies.
     * @default
     */
    this.immovable = false;

    /**
     * If you have a Body that is being moved around the world via a tween or a Group motion, but its local x/y position never
     * actually changes, then you should set Body.moves = false. Otherwise it will most likely fly off the screen.
     * If you want the physics system to move the body around, then set moves to true.
     * @property {boolean} moves - Set to true to allow the Physics system to move this Body, other false to move it manually.
     * @default
     */
    this.moves = true;

    /**
     * This flag allows you to disable the custom x separation that takes place by Physics.IsoArcade.separate.
     * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
     * @property {boolean} customSeparateX - Use a custom separation system or the built-in one?
     * @default
     */
    this.customSeparateX = false;

    /**
     * This flag allows you to disable the custom y separation that takes place by Physics.IsoArcade.separate.
     * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
     * @property {boolean} customSeparateY - Use a custom separation system or the built-in one?
     * @default
     */
    this.customSeparateY = false;

    /**
     * This flag allows you to disable the custom z separation that takes place by Physics.IsoArcade.separate.
     * Used in combination with your own collision processHandler you can create whatever type of collision response you need.
     * @property {boolean} customSeparateZ - Use a custom separation system or the built-in one?
     * @default
     */
    this.customSeparateZ = false;

    /**
     * When this body collides with another, the amount of overlap is stored here.
     * @property {number} overlapX - The amount of horizontal overlap during the collision.
     */
    this.overlapX = 0;

    /**
     * When this body collides with another, the amount of overlap is stored here.
     * @property {number} overlapY - The amount of vertical overlap during the collision.
     */
    this.overlapY = 0;

    /**
     * When this body collides with another, the amount of overlap is stored here.
     * @property {number} overlapY - The amount of vertical overlap during the collision.
     */
    this.overlapZ = 0;

    /**
     * If a body is overlapping with another body, but neither of them are moving (maybe they spawned on-top of each other?) this is set to true.
     * @property {boolean} embedded - Body embed value.
     */
    this.embedded = false;

    /**
     * A Body can be set to collide against the World bounds automatically and rebound back into the World if this is set to true. Otherwise it will leave the World.
     * @property {boolean} collideWorldBounds - Should the Body collide with the World bounds?
     */
    this.collideWorldBounds = false;

    /**
     * Set the checkCollision properties to control which directions collision is processed for this Body.
     * For example checkCollision.up = false means it won't collide when the collision happened while moving up.
     * @property {object} checkCollision - An object containing allowed collision.
     */
    this.checkCollision = {
        none: false,
        any: true,
        up: true,
        down: true,
        frontX: true,
        frontY: true,
        backX: true,
        backY: true
    };

    /**
     * This object is populated with boolean values when the Body collides with another.
     * touching.up = true means the collision happened to the top of this Body for example.
     * @property {object} touching - An object containing touching results.
     */
    this.touching = {
        none: true,
        up: false,
        down: false,
        frontX: false,
        frontY: false,
        backX: false,
        backY: false
    };

    /**
     * This object is populated with previous touching values from the bodies previous collision.
     * @property {object} wasTouching - An object containing previous touching results.
     */
    this.wasTouching = {
        none: true,
        up: false,
        down: false,
        frontX: false,
        frontY: false,
        backX: false,
        backY: false
    };

    /**
     * This object is populated with boolean values when the Body collides with the World bounds or a Tile.
     * For example if blocked.up is true then the Body cannot move up.
     * @property {object} blocked - An object containing on which faces this Body is blocked from moving, if any.
     */
    this.blocked = {
        up: false,
        down: false,
        frontX: false,
        frontY: false,
        backX: false,
        backY: false
    };

    /**
     * @property {number} phase - Is this Body in a preUpdate (1) or postUpdate (2) state?
     */
    this.phase = 0;

    /**
     * @property {boolean} skipTree - If true and you collide this IsoSprite against a Group, it will disable the collision check from using a QuadTree/Octree.
     */
    this.skipTree = false;

    /**
     * @property {boolean} _reset - Internal cache var.
     * @private
     */
    this._reset = true;

    /**
     * @property {number} _sx - Internal cache var.
     * @private
     */
    this._sx = sprite.scale.x;

    /**
     * @property {number} _sy - Internal cache var.
     * @private
     */
    this._sy = sprite.scale.y;

    /**
     * @property {number} _dx - Internal cache var.
     * @private
     */
    this._dx = 0;

    /**
     * @property {number} _dy - Internal cache var.
     * @private
     */
    this._dy = 0;

    /**
     * @property {number} _dz - Internal cache var.
     * @private
     */
    this._dz = 0;

    /**
     * @property {Array.<Phaser.Plugin.Isometric.Point3>} _corners - The 8 corners of the bounding cube.
     * @private
     */
    this._corners = [new Phaser.Plugin.Isometric.Point3(this.x, this.y, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x, this.y, this.z + this.height),
        new Phaser.Plugin.Isometric.Point3(this.x, this.y + this.widthY, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x, this.y + this.widthY, this.z + this.height),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y, this.z + this.height),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y + this.widthY, this.z),
        new Phaser.Plugin.Isometric.Point3(this.x + this.widthX, this.y + this.widthY, this.z + this.height)
    ];

};

Phaser.Plugin.Isometric.Body.prototype = {

    /**
     * Internal method.
     *
     * @method Phaser.Plugin.Isometric.Body#updateBounds
     * @protected
     */
    updateBounds: function () {

        var asx = Math.abs(this.sprite.scale.x);
        var asy = Math.abs(this.sprite.scale.y);

        if (asx !== this._sx || asy !== this._sy) {
            this.widthX = (this.sprite.width * 0.5) * asx;
            this.widthY = (this.sprite.width * 0.5) * asx;
            this.height = (this.sprite.height - (this.sprite.width * 0.5)) * asy;
            this.halfWidthX = Math.floor(this.widthX * 2);
            this.halfWidthY = Math.floor(this.widthY * 2);
            this.halfHeight = Math.floor(this.height * 2);
            this._sx = asx;
            this._sy = asy;
            this.center.setTo(this.position.x + this.halfWidthX, this.position.y + this.halfWidthY, this.position.z + this.halfHeight);

            this._reset = true;
        }

    },

    /**
     * Internal method.
     *
     * @method Phaser.Plugin.Isometric.Body#preUpdate
     * @protected
     */
    preUpdate: function () {

        if (!this.enable) {
            return;
        }

        this.phase = 1;

        //  Store and reset collision flags
        this.wasTouching.none = this.touching.none;
        this.wasTouching.up = this.touching.up;
        this.wasTouching.down = this.touching.down;
        this.wasTouching.backX = this.touching.backX;
        this.wasTouching.backY = this.touching.backY;
        this.wasTouching.frontX = this.touching.frontX;
        this.wasTouching.frontY = this.touching.frontY;

        this.touching.none = true;
        this.touching.up = false;
        this.touching.down = false;
        this.touching.backX = false;
        this.touching.backY = false;
        this.touching.frontX = false;
        this.touching.frontY = false;

        this.blocked.up = false;
        this.blocked.down = false;
        this.blocked.backX = false;
        this.blocked.frontX = false;
        this.blocked.backY = false;
        this.blocked.backX = false;

        this.embedded = false;

        this.updateBounds();

        //  Working out how to incorporate anchors into this was... fun.
        this.position.x = this.sprite.isoX + ((this.widthX * -this.sprite.anchor.x) + this.widthX * 0.5) + this.offset.x;
        this.position.y = this.sprite.isoY + ((this.widthY * this.sprite.anchor.x) - this.widthY * 0.5) + this.offset.y;
        this.position.z = this.sprite.isoZ - (Math.abs(this.sprite.height) * (1 - this.sprite.anchor.y)) + (Math.abs(this.sprite.width * 0.5)) + this.offset.z;


        this.rotation = this.sprite.angle;

        this.preRotation = this.rotation;

        if (this._reset || this.sprite._cache[4] === 1) {
            this.prev.x = this.position.x;
            this.prev.y = this.position.y;
            this.prev.z = this.position.z;
        }

        if (this.moves) {
            this.game.physics.isoArcade.updateMotion(this);

            this.newVelocity.set(this.velocity.x * this.game.time.physicsElapsed, this.velocity.y * this.game.time.physicsElapsed, this.velocity.z * this.game.time.physicsElapsed);

            this.position.x += this.newVelocity.x;
            this.position.y += this.newVelocity.y;
            this.position.z += this.newVelocity.z;

            if (this.position.x !== this.prev.x || this.position.y !== this.prev.y || this.position.z !== this.prev.z) {
                this.speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y + this.velocity.z * this.velocity.z);
                this.angle = Math.atan2(this.velocity.y, this.velocity.x);
            }

            //  Now the State update will throw collision checks at the Body
            //  And finally we'll integrate the new position back to the Sprite in postUpdate

            if (this.collideWorldBounds) {
                this.checkWorldBounds();
            }
        }

        this._dx = this.deltaX();
        this._dy = this.deltaY();
        this._dz = this.deltaZ();

        this._reset = false;

    },

    /**
     * Internal method.
     *
     * @method Phaser.Plugin.Isometric.Body#postUpdate
     * @protected
     */
    postUpdate: function () {

        if (!this.enable) {
            return;
        }

        //  Only allow postUpdate to be called once per frame
        if (this.phase === 2) {
            return;
        }

        this.phase = 2;

        if (this.deltaX() < 0) {
            this.facing = Phaser.Plugin.Isometric.BACKWARDX;
        } else if (this.deltaX() > 0) {
            this.facing = Phaser.Plugin.Isometric.FORWARDX;
        }

        if (this.deltaY() < 0) {
            this.facing = Phaser.Plugin.Isometric.BACKWARDY;
        } else if (this.deltaY() > 0) {
            this.facing = Phaser.Plugin.Isometric.FORWARDY;
        }

        if (this.deltaZ() < 0) {
            this.facing = Phaser.Plugin.Isometric.DOWN;
        } else if (this.deltaZ() > 0) {
            this.facing = Phaser.Plugin.Isometric.UP;
        }

        if (this.moves) {
            this._dx = this.deltaX();
            this._dy = this.deltaY();
            this._dz = this.deltaZ();

            if (this.deltaMax.x !== 0 && this._dx !== 0) {
                if (this._dx < 0 && this._dx < -this.deltaMax.x) {
                    this._dx = -this.deltaMax.x;
                } else if (this._dx > 0 && this._dx > this.deltaMax.x) {
                    this._dx = this.deltaMax.x;
                }
            }

            if (this.deltaMax.y !== 0 && this._dy !== 0) {
                if (this._dy < 0 && this._dy < -this.deltaMax.y) {
                    this._dy = -this.deltaMax.y;
                } else if (this._dy > 0 && this._dy > this.deltaMax.y) {
                    this._dy = this.deltaMax.y;
                }
            }

            if (this.deltaMax.z !== 0 && this._dz !== 0) {
                if (this._dz < 0 && this._dz < -this.deltaMax.z) {
                    this._dz = -this.deltaMax.z;
                } else if (this._dz > 0 && this._dz > this.deltaMax.z) {
                    this._dz = this.deltaMax.z;
                }
            }

            this.sprite.isoX += this._dx;
            this.sprite.isoY += this._dy;
            this.sprite.isoZ += this._dz;
        }

        this.center.setTo(this.position.x + this.halfWidthX, this.position.y + this.halfWidthY, this.position.z + this.halfHeight);

        if (this.allowRotation) {
            this.sprite.angle += this.deltaR();
        }

        this.prev.x = this.position.x;
        this.prev.y = this.position.y;
        this.prev.z = this.position.z;

    },

    /**
     * Removes this body's reference to its parent sprite, freeing it up for gc.
     *
     * @method Phaser.Plugin.Isometric.Body#destroy
     */
    destroy: function () {

        this.sprite = null;

    },

    /**
     * Internal method.
     *
     * @method Phaser.Plugin.Isometric.Body#checkWorldBounds
     * @protected
     */
    checkWorldBounds: function () {

        if (this.position.x < this.game.physics.isoArcade.bounds.x && this.game.physics.isoArcade.checkCollision.backX) {
            this.position.x = this.game.physics.isoArcade.bounds.x;
            this.velocity.x *= -this.bounce.x;
            this.blocked.backX = true;
        } else if (this.frontX > this.game.physics.isoArcade.bounds.frontX && this.game.physics.isoArcade.checkCollision.frontX) {
            this.position.x = this.game.physics.isoArcade.bounds.frontX - this.widthX;
            this.velocity.x *= -this.bounce.x;
            this.blocked.frontX = true;
        }

        if (this.position.y < this.game.physics.isoArcade.bounds.y && this.game.physics.isoArcade.checkCollision.backY) {
            this.position.y = this.game.physics.isoArcade.bounds.y;
            this.velocity.y *= -this.bounce.y;
            this.blocked.backY = true;
        } else if (this.frontY > this.game.physics.isoArcade.bounds.frontY && this.game.physics.isoArcade.checkCollision.frontY) {
            this.position.y = this.game.physics.isoArcade.bounds.frontY - this.widthY;
            this.velocity.y *= -this.bounce.y;
            this.blocked.frontY = true;
        }

        if (this.position.z < this.game.physics.isoArcade.bounds.z && this.game.physics.isoArcade.checkCollision.down) {
            this.position.z = this.game.physics.isoArcade.bounds.z;
            this.velocity.z *= -this.bounce.z;
            this.blocked.down = true;
        } else if (this.top > this.game.physics.isoArcade.bounds.top && this.game.physics.isoArcade.checkCollision.up) {
            this.position.z = this.game.physics.isoArcade.bounds.top - this.height;
            this.velocity.z *= -this.bounce.z;
            this.blocked.up = true;
        }

    },

    /**
     * You can modify the size of the physics Body to be any dimension you need.
     * So it could be smaller or larger than the parent Sprite. You can also control the x, y and z offset, which
     * is the position of the Body relative to the center of the Sprite.
     *
     * @method Phaser.Plugin.Isometric.Body#setSize
     * @param {number} widthX - The X width (breadth) of the Body.
     * @param {number} widthY - The Y width (depth) of the Body.
     * @param {number} height - The height of the Body.
     * @param {number} [offsetX] - The X offset of the Body from the Sprite position.
     * @param {number} [offsetY] - The Y offset of the Body from the Sprite position.
     * @param {number} [offsetY] - The Z offset of the Body from the Sprite position.
     */
    setSize: function (widthX, widthY, height, offsetX, offsetY, offsetZ) {

        if (typeof offsetX === 'undefined') {
            offsetX = this.offset.x;
        }
        if (typeof offsetY === 'undefined') {
            offsetY = this.offset.y;
        }
        if (typeof offsetZ === 'undefined') {
            offsetZ = this.offset.z;
        }

        this.sourceWidthX = widthX;
        this.sourceWidthY = widthY;
        this.sourceHeight = height;
        this.widthX = (this.sourceWidthX) * this._sx;
        this.widthY = (this.sourceWidthY) * this._sx;
        this.height = (this.sourceHeight) * this._sy;
        this.halfWidthX = Math.floor(this.widthX * 0.5);
        this.halfWidthY = Math.floor(this.widthY * 0.5);
        this.halfHeight = Math.floor(this.height * 0.5);
        this.offset.setTo(offsetX, offsetY, offsetZ);

        this.center.setTo(this.position.x + this.halfWidthX, this.position.y + this.halfWidthY, this.position.z + this.halfHeight);

    },

    /**
     * Resets all Body values (velocity, acceleration, rotation, etc)
     *
     * @method Phaser.Plugin.Isometric.Body#reset
     * @param {number} x - The new x position of the Body.
     * @param {number} y - The new y position of the Body.
     * @param {number} z - The new z position of the Body.
     */
    reset: function (x, y, z) {

        this.velocity.set(0);
        this.acceleration.set(0);

        this.angularVelocity = 0;
        this.angularAcceleration = 0;

        this.position.x = x + ((this.widthX * -this.sprite.anchor.x) + this.widthX * 0.5) + this.offset.x;
        this.position.y = y + ((this.widthY * this.sprite.anchor.x) - this.widthY * 0.5) + this.offset.y;
        this.position.z = z - ((this.height * -this.sprite.anchor.y * 2) + this.height) + this.offset.z;

        this.prev.x = this.position.x;
        this.prev.y = this.position.y;
        this.prev.z = this.position.z;

        this.rotation = this.sprite.angle;
        this.preRotation = this.rotation;

        this._sx = this.sprite.scale.x;
        this._sy = this.sprite.scale.y;

        this.center.setTo(this.position.x + this.halfWidthX, this.position.y + this.halfWidthY, this.position.z + this.halfHeight);

    },

    /**
     * Tests if a world point lies within this Body.
     *
     * @method Phaser.Plugin.Isometric.Body#hitTest
     * @param {number} x - The world x coordinate to test.
     * @param {number} y - The world y coordinate to test.
     * @param {number} z - The world z coordinate to test.
     * @return {boolean} True if the given coordinates are inside this Body, otherwise false.
     */
    hitTest: function (x, y, z) {

        return Phaser.Plugin.Isometric.Cube.contains(this, x, y, z);

    },

    /**
     * Returns true if the bottom of this Body is in contact with either the world bounds.
     *
     * @method Phaser.Plugin.Isometric.Body#onFloor
     * @return {boolean} True if in contact with either the world bounds.
     */
    onFloor: function () {

        return this.blocked.down;

    },

    /**
     * Returns true if either side of this Body is in contact with either the world bounds.
     *
     * @method Phaser.Plugin.Isometric.Body#onWall
     * @return {boolean} True if in contact with world bounds.
     */
    onWall: function () {

        return (this.blocked.frontX || this.blocked.frontY || this.blocked.backX || this.blocked.backY);

    },

    /**
     * Returns the absolute delta x value.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaAbsX
     * @return {number} The absolute delta value.
     */
    deltaAbsX: function () {

        return (this.deltaX() > 0 ? this.deltaX() : -this.deltaX());

    },

    /**
     * Returns the absolute delta y value.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaAbsY
     * @return {number} The absolute delta value.
     */
    deltaAbsY: function () {

        return (this.deltaY() > 0 ? this.deltaY() : -this.deltaY());

    },

    /**
     * Returns the absolute delta z value.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaAbsZ
     * @return {number} The absolute delta value.
     */
    deltaAbsZ: function () {

        return (this.deltaZ() > 0 ? this.deltaZ() : -this.deltaZ());

    },

    /**
     * Returns the delta x value. The difference between Body.x now and in the previous step.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaX
     * @return {number} The delta value. Positive if the motion was to the right, negative if to the left.
     */
    deltaX: function () {

        return this.position.x - this.prev.x;

    },

    /**
     * Returns the delta y value. The difference between Body.y now and in the previous step.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaY
     * @return {number} The delta value. Positive if the motion was downwards, negative if upwards.
     */
    deltaY: function () {

        return this.position.y - this.prev.y;

    },

    /**
     * Returns the delta z value. The difference between Body.z now and in the previous step.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaZ
     * @return {number} The delta value. Positive if the motion was downwards, negative if upwards.
     */
    deltaZ: function () {

        return this.position.z - this.prev.z;

    },

    /**
     * Returns the delta r value. The difference between Body.rotation now and in the previous step.
     *
     * @method Phaser.Plugin.Isometric.Body#deltaR
     * @return {number} The delta value. Positive if the motion was clockwise, negative if anti-clockwise.
     */
    deltaR: function () {

        return this.rotation - this.preRotation;

    },

    /**
     * Returns the 8 corners that make up the body's bounding cube.
     *
     * @method Phaser.Plugin.Isometric.Body#getCorners
     * @return {Array.<Phaser.Plugin.Isometric.Point3>} An array of Phaser.Plugin.Isometric.Point3 values specifying each corner co-ordinate.
     */
    getCorners: function () {

        this._corners[0].setTo(this.x, this.y, this.z);
        this._corners[1].setTo(this.x, this.y, this.z + this.height);
        this._corners[2].setTo(this.x, this.y + this.widthY, this.z);
        this._corners[3].setTo(this.x, this.y + this.widthY, this.z + this.height);
        this._corners[4].setTo(this.x + this.widthX, this.y, this.z);
        this._corners[5].setTo(this.x + this.widthX, this.y, this.z + this.height);
        this._corners[6].setTo(this.x + this.widthX, this.y + this.widthY, this.z);
        this._corners[7].setTo(this.x + this.widthX, this.y + this.widthY, this.z + this.height);

        return this._corners;

    }
};

/**
 * @name Phaser.Plugin.Isometric.Body#top
 * @property {number} bottom - The top value of this Body (same as Body.z + Body.height)
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "top", {

    get: function () {
        return this.position.z + this.height;
    }

});

/**
 * @name Phaser.Plugin.Isometric.Body#frontX
 * @property {number} right - The front X value of this Body (same as Body.x + Body.widthX)
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "frontX", {

    get: function () {
        return this.position.x + this.widthX;
    }

});

/**
 * @name Phaser.Plugin.Isometric.Body#right
 * @property {number} right - The front X value of this Body (same as Body.x + Body.widthX) - alias used for QuadTree
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "right", {

    get: function () {
        return this.position.x + this.widthX;
    }

});

/**
 * @name Phaser.Plugin.Isometric.Body#frontY
 * @property {number} right - The front Y value of this Body (same as Body.y + Body.widthY)
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "frontY", {

    get: function () {
        return this.position.y + this.widthY;
    }

});

/**
 * @name Phaser.Plugin.Isometric.Body#bottom
 * @property {number} right - The front Y value of this Body (same as Body.y + Body.widthY) - alias used for QuadTree
 * @readonly
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "bottom", {

    get: function () {
        return this.position.y + this.widthY;
    }

});


/**
 * @name Phaser.Plugin.Isometric.Body#x
 * @property {number} x - The x position.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "x", {

    get: function () {
        return this.position.x;
    },

    set: function (value) {

        this.position.x = value;
    }

});

/**
 * @name Phaser.Plugin.Isometric.Body#y
 * @property {number} y - The y position.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "y", {

    get: function () {
        return this.position.y;
    },

    set: function (value) {

        this.position.y = value;

    }

});

/**
 * @name Phaser.Plugin.Isometric.Body#z
 * @property {number} z - The z position.
 */
Object.defineProperty(Phaser.Plugin.Isometric.Body.prototype, "z", {

    get: function () {
        return this.position.z;
    },

    set: function (value) {

        this.position.z = value;

    }

});

/**
 * Render IsoSprite Body.
 *
 * @method Phaser.Plugin.Isometric.Body#render
 * @param {object} context - The context to render to.
 * @param {Phaser.Plugin.Isometric.Body} body - The Body to render the info of.
 * @param {string} [color='rgba(0,255,0,0.4)'] - color of the debug info to be rendered. (format is css color string).
 * @param {boolean} [filled=true] - Render the objected as a filled (default, true) or a stroked (false)
 */
Phaser.Plugin.Isometric.Body.render = function (context, body, color, filled) {

    if (typeof filled === 'undefined') {
        filled = true;
    }

    color = color || 'rgba(0,255,0,0.4)';

    var points = [],
        corners = body.getCorners();

    var posX = -body.sprite.game.camera.x;
    var posY = -body.sprite.game.camera.y;

    if (filled) {
        points = [corners[1], corners[3], corners[2], corners[6], corners[4], corners[5], corners[1]];

        points = points.map(function (p) {
            var newPos = this.game.iso.project(p);
            newPos.x += posX;
            newPos.y += posY;
            return newPos;
        });
        context.beginPath();
        context.fillStyle = color;
        context.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }
        context.fill();
    } else {
        points = corners.slice(0, corners.length);
        points = points.map(function (p) {
            var newPos = this.game.iso.project(p);
            newPos.x += posX;
            newPos.y += posY;
            return newPos;
        });

        context.moveTo(points[0].x, points[0].y);
        context.beginPath();
        context.strokeStyle = color;

        context.lineTo(points[1].x, points[1].y);
        context.lineTo(points[3].x, points[3].y);
        context.lineTo(points[2].x, points[2].y);
        context.lineTo(points[6].x, points[6].y);
        context.lineTo(points[4].x, points[4].y);
        context.lineTo(points[5].x, points[5].y);
        context.lineTo(points[1].x, points[1].y);
        context.lineTo(points[0].x, points[0].y);
        context.lineTo(points[4].x, points[4].y);
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[2].x, points[2].y);
        context.moveTo(points[3].x, points[3].y);
        context.lineTo(points[7].x, points[7].y);
        context.lineTo(points[6].x, points[6].y);
        context.moveTo(points[7].x, points[7].y);
        context.lineTo(points[5].x, points[5].y);
        context.stroke();
        context.closePath();
    }

};

/**
 * Render IsoSprite Body Physics Data as text.
 *
 * @method Phaser.Plugin.Isometric.Body#renderBodyInfo
 * @param {Phaser.Plugin.Isometric.Body} body - The Body to render the info of.
 * @param {number} x - X position of the debug info to be rendered.
 * @param {number} y - Y position of the debug info to be rendered.
 * @param {string} [color='rgb(255,255,255)'] - color of the debug info to be rendered. (format is css color string).
 */
Phaser.Plugin.Isometric.Body.renderBodyInfo = function (debug, body) {

    debug.line('x: ' + body.x.toFixed(2), 'y: ' + body.y.toFixed(2), 'z: ' + body.z.toFixed(2), 'widthX: ' + body.widthX, 'widthY: ' + body.widthY, 'height: ' + body.height);
    debug.line('velocity x: ' + body.velocity.x.toFixed(2), 'y: ' + body.velocity.y.toFixed(2), 'z: ' + body.velocity.z.toFixed(2), 'deltaX: ' + body._dx.toFixed(2), 'deltaY: ' + body._dy.toFixed(2), 'deltaZ: ' + body._dz.toFixed(2));
    debug.line('acceleration x: ' + body.acceleration.x.toFixed(2), 'y: ' + body.acceleration.y.toFixed(2), 'z: ' + body.acceleration.z.toFixed(2), 'speed: ' + body.speed.toFixed(2), 'angle: ' + body.angle.toFixed(2));
    debug.line('gravity x: ' + body.gravity.x, 'y: ' + body.gravity.y, 'z: ' + body.gravity.z);
    debug.line('bounce x: ' + body.bounce.x.toFixed(2), 'y: ' + body.bounce.y.toFixed(2), 'z: ' + body.bounce.z.toFixed(2));
    debug.line('touching: ', 'frontX: ' + (body.touching.frontX ? 1 : 0) + ' frontY: ' + (body.touching.frontY ? 1 : 0) + ' backX: ' + (body.touching.backX ? 1 : 0) + ' backY: ' + (body.touching.backY ? 1 : 0) + ' up: ' + (body.touching.up ? 1 : 0) + ' down: ' + (body.touching.down ? 1 : 0));
    debug.line('blocked: ', 'frontX: ' + (body.blocked.frontX ? 1 : 0) + ' frontY: ' + (body.blocked.frontY ? 1 : 0) + ' backX: ' + (body.blocked.backX ? 1 : 0) + ' backY: ' + (body.blocked.backY ? 1 : 0) + ' up: ' + (body.blocked.up ? 1 : 0) + ' down: ' + (body.blocked.down ? 1 : 0));

};

Phaser.Plugin.Isometric.Body.prototype.constructor = Phaser.Plugin.Isometric.Body;

/**
 * Octree Constructor
 *
 * @class Phaser.Plugin.Isometric.Octree
 * @classdesc A Octree implementation. The original code was a conversion of the Java code posted to GameDevTuts.
 * However I've tweaked it massively to add node indexing, removed lots of temp. var creation and significantly increased performance as a result.
 * Original version at https://github.com/timohausmann/quadtree-js/
 * @constructor
 * @param {number} x - The bottom-back coordinate of the octree.
 * @param {number} y - The bottom-back coordinate of the octree.
 * @param {number} z - The bottom-back coordinate of the octree.
 * @param {number} widthX - The width X (breadth) of the octree.
 * @param {number} widthY - The width Y (depth) of the octree.
 * @param {number} height - The height (Z) of the octree.
 * @param {number} [maxObjects=10] - The maximum number of objects per node.
 * @param {number} [maxLevels=4] - The maximum number of levels to iterate to.
 * @param {number} [level=0] - Which level is this?
 */
Phaser.Plugin.Isometric.Octree = function (x, y, z, widthX, widthY, height, maxObjects, maxLevels, level) {

    /**
     * @property {number} maxObjects - The maximum number of objects per node.
     * @default
     */
    this.maxObjects = 10;

    /**
     * @property {number} maxLevels - The maximum number of levels to break down to.
     * @default
     */
    this.maxLevels = 4;

    /**
     * @property {number} level - The current level.
     */
    this.level = 0;

    /**
     * @property {object} bounds - Object that contains the octree bounds.
     */
    this.bounds = {};

    /**
     * @property {array} objects - Array of octree children.
     */
    this.objects = [];

    /**
     * @property {array} nodes - Array of associated child nodes.
     */
    this.nodes = [];

    /**
     * @property {array} _empty - Internal empty array.
     * @private
     */
    this._empty = [];

    this.reset(x, y, z, widthX, widthY, height, maxObjects, maxLevels, level);

};

Phaser.Plugin.Isometric.Octree.prototype = {

    /**
     * Resets the QuadTree.
     *
     * @method Phaser.Plugin.Isometric.Octree#reset
     * @param {number} x - The bottom-back coordinate of the octree.
     * @param {number} y - The bottom-back coordinate of the octree.
     * @param {number} z - The bottom-back coordinate of the octree.
     * @param {number} widthX - The width X (breadth) of the octree.
     * @param {number} widthY - The width Y (depth) of the octree.
     * @param {number} height - The height (Z) of the octree.
     * @param {number} [maxObjects=10] - The maximum number of objects per node.
     * @param {number} [maxLevels=4] - The maximum number of levels to iterate to.
     * @param {number} [level=0] - Which level is this?
     */
    reset: function (x, y, z, widthX, widthY, height, maxObjects, maxLevels, level) {

        this.maxObjects = maxObjects || 10;
        this.maxLevels = maxLevels || 4;
        this.level = level || 0;

        this.bounds = {
            x: Math.round(x),
            y: Math.round(y),
            z: Math.round(z),
            widthX: widthX,
            widthY: widthY,
            height: height,
            subWidthX: Math.floor(widthX * 0.5),
            subWidthY: Math.floor(widthY * 0.5),
            subHeight: Math.floor(height * 0.5),
            frontX: Math.round(x) + Math.floor(widthX * 0.5),
            frontY: Math.round(y) + Math.floor(widthY * 0.5),
            top: Math.round(z) + Math.floor(height * 0.5)
        };

        this.objects.length = 0;
        this.nodes.length = 0;

    },

    /**
     * Populates this octree with the children of the given Group. In order to be added the child must exist and have a body property.
     *
     * @method Phaser.Plugin.Isometric.Octree#populate
     * @param {Phaser.Group} group - The Group to add to the octree.
     */
    populate: function (group) {

        group.forEach(this.populateHandler, this, true);

    },

    /**
     * Handler for the populate method.
     *
     * @method Phaser.Plugin.Isometric.Octree#populateHandler
     * @param {Phaser.Plugin.Isometric.IsoSprite|object} sprite - The Sprite to check.
     */
    populateHandler: function (sprite) {

        if (sprite.body && sprite.exists) {
            this.insert(sprite.body);
        }

    },

    /**
     * Split the node into 8 subnodes
     *
     * @method Phaser.Plugin.Isometric.Octree#split
     */
    split: function () {

        //  bottom four octants
        //  -x-y-z
        this.nodes[0] = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.y, this.bounds.z, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  +x-y-z
        this.nodes[1] = new Phaser.Plugin.Isometric.Octree(this.bounds.frontX, this.bounds.y, this.bounds.z, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  -x+y-z
        this.nodes[2] = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.frontY, this.bounds.z, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  +x+y-z
        this.nodes[3] = new Phaser.Plugin.Isometric.Octree(this.bounds.frontX, this.bounds.frontY, this.bounds.z, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));

        //  top four octants
        //  -x-y+z
        this.nodes[4] = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.y, this.bounds.top, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  +x-y+z
        this.nodes[5] = new Phaser.Plugin.Isometric.Octree(this.bounds.frontX, this.bounds.y, this.bounds.top, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  -x+y+z
        this.nodes[6] = new Phaser.Plugin.Isometric.Octree(this.bounds.x, this.bounds.frontY, this.bounds.top, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
        //  +x+y+z
        this.nodes[7] = new Phaser.Plugin.Isometric.Octree(this.bounds.frontX, this.bounds.frontY, this.bounds.top, this.bounds.subWidthX, this.bounds.subWidthY, this.bounds.subHeight, this.maxLevels, (this.level + 1));
    },

    /**
     * Insert the object into the node. If the node exceeds the capacity, it will split and add all objects to their corresponding subnodes.
     *
     * @method Phaser.Plugin.Isometric.Octree#insert
     * @param {Phaser.Plugin.Isometric.Body|Phaser.Plugin.Isometric.Cube|object} body - The Body object to insert into the octree. Can be any object so long as it exposes x, y, z, frontX, frontY and top properties.
     */
    insert: function (body) {

        var i = 0;
        var index;

        //  if we have subnodes ...
        if (this.nodes[0] !== null) {
            index = this.getIndex(body);

            if (index !== -1) {
                this.nodes[index].insert(body);
                return;
            }
        }

        this.objects.push(body);

        if (this.objects.length > this.maxObjects && this.level < this.maxLevels) {
            //  Split if we don't already have subnodes
            if (this.nodes[0] === null) {
                this.split();
            }

            //  Add objects to subnodes
            while (i < this.objects.length) {
                index = this.getIndex(this.objects[i]);

                if (index !== -1) {
                    //  this is expensive - see what we can do about it
                    this.nodes[index].insert(this.objects.splice(i, 1)[0]);
                } else {
                    i++;
                }
            }
        }

    },

    /**
     * Determine which node the object belongs to.
     *
     * @method Phaser.Plugin.Isometric.Octree#getIndex
     * @param {Phaser.Plugin.Isometric.Cube|object} cube - The bounds in which to check.
     * @return {number} index - Index of the subnode (0-7), or -1 if cube cannot completely fit within a subnode and is part of the parent node.
     */
    getIndex: function (cube) {

        //  default is that cube doesn't fit, i.e. it straddles the internal octants
        var index = -1;

        if (cube.x < this.bounds.frontX && cube.frontX < this.bounds.frontX) {
            if (cube.y < this.bounds.frontY && cube.frontY < this.bounds.frontY) {
                if (cube.z < this.bounds.top && cube.top < this.bounds.top) {
                    //  cube fits into -x-y-z octant
                    index = 0;
                } else if (cube.z > this.bounds.top) {
                    //  cube fits into -x-y+z octant
                    index = 4;
                }
            } else if (cube.y > this.bounds.frontY) {
                if (cube.z < this.bounds.top && cube.top < this.bounds.top) {
                    //  cube fits into -x+y-z octant
                    index = 2;
                } else if (cube.z > this.bounds.top) {
                    //  cube fits into -x+y+z octant
                    index = 6;
                }
            }
        } else if (cube.x > this.bounds.frontX) {
            if (cube.y < this.bounds.frontY && cube.frontY < this.bounds.frontY) {
                if (cube.z < this.bounds.top && cube.top < this.bounds.top) {
                    //  cube fits into +x-y-z octant
                    index = 1;
                } else if (cube.z > this.bounds.top) {
                    //  cube fits into +x-y+z octant
                    index = 5;
                }
            } else if (cube.y > this.bounds.frontY) {
                if (cube.z < this.bounds.top && cube.top < this.bounds.top) {
                    //  cube fits into +x+y-z octant
                    index = 3;
                } else if (cube.z > this.bounds.top) {
                    //  cube fits into +x+y+z octant
                    index = 7;
                }
            }
        }


        return index;

    },

    /**
     * Return all objects that could collide with the given IsoSprite or Cube.
     *
     * @method Phaser.Plugin.Isometric.Octree#retrieve
     * @param {Phaser.Plugin.Isometric.IsoSprite|Phaser.Plugin.Isometric.Cube} source - The source object to check the Octree against. Either a IsoSprite or Cube.
     * @return {array} - Array with all detected objects.
     */
    retrieve: function (source) {

        var returnObjects, index;

        if (source instanceof Phaser.Plugin.Isometric.Cube) {
            returnObjects = this.objects;

            index = this.getIndex(source);
        } else {
            if (!source.body) {
                return this._empty;
            }

            returnObjects = this.objects;

            index = this.getIndex(source.body);
        }

        if (this.nodes[0]) {
            //  If cube fits into a subnode ..
            if (index !== -1) {
                returnObjects = returnObjects.concat(this.nodes[index].retrieve(source));
            } else {
                //  If cube does not fit into a subnode, check it against all subnodes (unrolled for speed)
                returnObjects = returnObjects.concat(this.nodes[0].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[1].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[2].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[3].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[4].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[5].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[6].retrieve(source));
                returnObjects = returnObjects.concat(this.nodes[7].retrieve(source));
            }
        }

        return returnObjects;

    },

    /**
     * Clear the octree.
     * @method Phaser.Plugin.Isometric.Octree#clear
     */
    clear: function () {

        this.objects.length = 0;

        var i = this.nodes.length;

        while (i--) {
            this.nodes[i].clear();
            this.nodes.splice(i, 1);
        }

        this.nodes.length = 0;
    }

};

Phaser.Plugin.Isometric.Octree.prototype.constructor = Phaser.Plugin.Isometric.Octree;

/**
 * Visually renders an Octree to the display.
 *
 * @method Phaser.Utils.Debug#octree
 * @param {Phaser.Plugin.Isometric.Octree} octree - The octree to render.
 * @param {string} color - The color of the lines in the quadtree.
 */
Phaser.Utils.Debug.prototype.octree = function (octree, color) {

    color = color || 'rgba(255,0,0,0.3)';

    this.start();

    var bounds = octree.bounds,
        i, points;

    if (octree.nodes.length === 0) {

        this.context.strokeStyle = color;

        var cube = new Phaser.Plugin.Isometric.Cube(bounds.x, bounds.y, bounds.z, bounds.widthX, bounds.widthY, bounds.height);
        var corners = cube.getCorners();

        points = corners.slice(0, corners.length);
        points = points.map(function (p) {
            return this.game.iso.project(p);
        });

        this.context.moveTo(points[0].x, points[0].y);
        this.context.beginPath();
        this.context.strokeStyle = color;

        this.context.lineTo(points[1].x, points[1].y);
        this.context.lineTo(points[3].x, points[3].y);
        this.context.lineTo(points[2].x, points[2].y);
        this.context.lineTo(points[6].x, points[6].y);
        this.context.lineTo(points[4].x, points[4].y);
        this.context.lineTo(points[5].x, points[5].y);
        this.context.lineTo(points[1].x, points[1].y);
        this.context.lineTo(points[0].x, points[0].y);
        this.context.lineTo(points[4].x, points[4].y);
        this.context.moveTo(points[0].x, points[0].y);
        this.context.lineTo(points[2].x, points[2].y);
        this.context.moveTo(points[3].x, points[3].y);
        this.context.lineTo(points[7].x, points[7].y);
        this.context.lineTo(points[6].x, points[6].y);
        this.context.moveTo(points[7].x, points[7].y);
        this.context.lineTo(points[5].x, points[5].y);
        this.context.stroke();
        this.context.closePath();

        for (i = 0; i < octree.objects.length; i++) {
            this.body(octree.objects[i].sprite, 'rgb(0,255,0)', false);
        }
    } else {
        for (i = 0; i < octree.nodes.length; i++) {
            this.octree(octree.nodes[i]);
        }
    }

    this.stop();

};

Phaser.Utils.Debug.prototype.body = (function (_super) {

    return function (sprite, color, filled) {
        if (sprite.body && sprite.body.type === Phaser.Plugin.Isometric.ISOARCADE) {
            this.start();
            Phaser.Plugin.Isometric.Body.render(this.context, sprite.body, color, filled);
            this.stop();
        }

        return _super.call(this, sprite, color, filled);
    };

})(Phaser.Utils.Debug.prototype.body);

Phaser.Utils.Debug.prototype.bodyInfo = (function (_super) {

    return function (sprite, x, y, color) {
        if (sprite.body && sprite.body.type === Phaser.Plugin.Isometric.ISOARCADE) {
            this.start(x, y, color, 210);
            Phaser.Plugin.Isometric.Body.renderBodyInfo(this, sprite.body);
            this.stop();
        }

        return _super.call(this, sprite, x, y, color);
    };

})(Phaser.Utils.Debug.prototype.bodyInfo);