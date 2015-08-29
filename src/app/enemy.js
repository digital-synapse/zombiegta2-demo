

ds.make.class({
    type: 'Game.Enemy',

    anim: function (obj) {  // obj format -> { 'anim_name': {x:-1,y:1} }
        for (var name in obj)
            return name + ':' + obj[name].x + ',' + obj[name].y;
    },
    frames: function (start, length) {
        var f = [];
        for (var i = start; i < start + length; i++) f.push(i);
        return f;
    },
    constructor: function (game, backgroundGroup) {
        this.game = game;
        this.backgroundGroup = backgroundGroup;
        this.sprite = game.add.sprite(Math.random() * 1000, Math.random() * 1000, 'zombie');

        // build animations
        var i = 3;
        this.sprite.animations.add(this.anim({ walk: { x: -1, y: 0} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ walk: { x: -1, y: -1} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ walk: { x: 0, y: -1} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ walk: { x: 1, y: -1} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ walk: { x: 1, y: 0} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ walk: { x: 1, y: 1} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ walk: { x: 0, y: 1} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ walk: { x: -1, y: 1} }), this.frames(i, 8));
        i = 0;
        this.sprite.animations.add(this.anim({ idle: { x: -1, y: 0} }), this.frames(i, 4)); i += 36;
        this.sprite.animations.add(this.anim({ idle: { x: -1, y: -1} }), this.frames(i, 4)); i += 36;
        this.sprite.animations.add(this.anim({ idle: { x: 0, y: -1} }), this.frames(i, 4)); i += 36;
        this.sprite.animations.add(this.anim({ idle: { x: 1, y: -1} }), this.frames(i, 4)); i += 36;
        this.sprite.animations.add(this.anim({ idle: { x: 1, y: 0} }), this.frames(i, 4)); i += 36;
        this.sprite.animations.add(this.anim({ idle: { x: 1, y: 1} }), this.frames(i, 4)); i += 36;
        this.sprite.animations.add(this.anim({ idle: { x: 0, y: 1} }), this.frames(i, 4)); i += 36;
        this.sprite.animations.add(this.anim({ idle: { x: -1, y: 1} }), this.frames(i, 4));
        i = 28;
        this.sprite.animations.add(this.anim({ explode: { x: -1, y: 0} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ explode: { x: -1, y: -1} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ explode: { x: 0, y: -1} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ explode: { x: 1, y: -1} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ explode: { x: 1, y: 0} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ explode: { x: 1, y: 1} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ explode: { x: 0, y: 1} }), this.frames(i, 8)); i += 36;
        this.sprite.animations.add(this.anim({ explode: { x: -1, y: 1} }), this.frames(i, 8));

        // pick a random direction
        var x = Math.random() > 0.5 ? 1 : 0;
        var y = Math.random() > 0.5 ? 1 : 0;
        if (x == 0 && y == 0) y = 1;
        this.direction = { x: x, y: y };

        // start animation
        var anim = this.anim({ walk: this.direction });
        this.sprite.animations.play(anim, 5, true);

        // physics
        game.physics.p2.enable(this.sprite, false);
        this.sprite.body.mass = 150;
        this.sprite.body.clearShapes();
        this.sprite.body.addRectangle(25, 25, 0, 30);
        this.sprite.body.onBeginContact.add(this.hit, this);
        this.sprite.body.angularDamping = 0.9;
        this.sprite.body.damping = 0.9;

        this.dead = false;

    },
    hit: function (body, shapeA, shapeB, equation) {

        //  hit something
        //	This callback is sent: the Body it collides with
        //	shapeA is the shape in the calling Body involved in the collision
        //	shapeB is the shape in the Body it hit
        //	equation is an array with the contact equation data in it

        if (body && body.sprite.key == 'car') {
            if (!this.dead) {
                var anim = this.anim({ explode: this.direction });
                this.anim = this.sprite.animations.play(anim, 5, false);
                this.dead = true;
            }
        }

    },
    update: function () {

        // velocity
        if (!this.dead) {
            this.sprite.body.velocity.x = this.direction.x * 10;
            this.sprite.body.velocity.y = this.direction.y * 10;
        }
        else {
            if (this.sprite.body) {
                if (this.anim.isFinished) {
                    //if (this.sprite.body.velocity.x * this.sprite.body.velocity.x < 10) {
                        this.sprite.body = null;
                        this.backgroundGroup.add(this.sprite);
                    //}
                }
            }
        }
    }
});