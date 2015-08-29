
ds.make.class({
    type: 'Game.Player',
    constructor: function (game, world) {
        // car
        this.sprite = game.add.sprite(1000, 1000, 'car');
        game.physics.p2.enable(this.sprite, false);
        this.sprite.body.clearShapes();
        this.sprite.body.addRectangle(72, 162, 0, -58);
        this.sprite.body.mass = 1000;
        this.sprite.anchor.setTo(0.5, 0.85);
        world.group.add(this.sprite);

        this.sprite.body.onBeginContact.add(this.hit, this);

        this.game = game;
        this.world = world;
        this.input = new Game.Input.DigitalToAnalog(game);
        this.camera = new Game.Camera(game);

        this.angle = this.sprite.rotation;
        this.thrust = 0;
        this.maxthrust = 800;
        this.minthrust = -400;
    },
    hit: function () {
        //this.thrust = 0;
    },
    update: function () {
        this.input.update();

        // calculate new rotation and velocity
        if ((this.thrust < this.maxthrust && this.input.y > 0) ||
            (this.thrust > this.minthrust && this.input.y < 0))
            this.thrust += (this.input.y * 10);
        this.thrust *= 0.99;
        var turnrate = this.input.x * this.thrust * 0.1;

        var car = this.sprite;
        car.body.rotateRight(turnrate);
        car.body.moveForward(this.thrust);

        this.angle = car.rotation;
        var r = Phaser.Math.wrapAngle(this.angle - (Math.PI * 0.5), true);
        var vx = Math.cos(r);
        var vy = Math.sin(r);
        var tvx = vx * car.body.inertia * 0.02;
        var tvy = vy * car.body.inertia * 0.02;

        this.camera.update(car.position.x + tvx + (vx * -100), car.position.y + tvy + (vy * -100));
        this.world.group.bringToTop(car);
    }
});