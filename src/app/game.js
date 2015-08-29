
ds.make.class({
    type: 'Game.World',
    preload: function () {
    },
    create: function () {
        this.game.time.advancedTiming = true;

        // world
        var game = this.game;
        game.world.setBounds(0, 0, 10000, 10000);
        this.group = game.add.group();

        // background
        var map = game.add.tilemap('map');
        map.addTilesetImage('tiles', 'tiles');
        var layer = map.createLayer('ground');  // basicly a sprite
        layer.resizeWorld(); //  This resizes the game world to match the layer dimensions
        this.group.add(layer);

        // start physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        //game.physics.p2.restitution = 0.9;
        game.physics.p2.friction = 0.1;
        //game.physics.p2.setImpactEvents(true);

        this.player = new Game.Player(game, this);

        // enemies
        this.enemies = [];
        for (var x = 0; x < 100; x++) {
            this.enemies.push(new Game.Enemy(game, this.group));
        }

        // 3d rendering -----------------------------------------------------------------
        this.canvasSprite = new Game.Layer3D(game, map.objects.buildings);  // tiled map needs an object layer called 'buildings'

        // hud
        var style = { font: "12px Lucida Console", fill: "#ffff44", align: "left" };
        this.text = game.add.text(5, 5, 'text', style);
        this.text.fixedToCamera = true;

    },
    update: function () {


        this.player.update();

        var x = this.enemies.length;
        while (x--) {
            this.enemies[x].update();
        }

        // some debug text
        this.text.setText(
        "input.x: " + decimals.clip(this.player.input.x, 2) + '\n' +
        'input.y: ' + decimals.clip(this.player.input.y, 2) + '\n' +
        'FPS: ' + (this.game.time.fps || '--')
        );

        // update 3d
        this.canvasSprite.update();
    },
    render: function () {
    }
});

ds.make.class({
    type: 'Game.Loader',
    preload: function() {
        var style = { font: "12px Lucida Console", fill: "#ffff44", align: "left" };
        this.text = this.game.add.text(5, 5, 'Loading...', style);
        this.text.fixedToCamera = true;

        this.game.load.image('car', '../assets/cars/A4_T-spark.png');
        this.game.load.spritesheet('zombie', '../assets/zombie_0.png', 128, 128, 288);

        this.game.load.tilemap('map', '../assets/maps/map1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.spritesheet('tiles', '../assets/maps/gta2tiles.jpg', 64, 64);
    },
    loadUpdate: function () {
        this.text.setText('Loading: ' + this.game.load.progress + '%');
    },
    create: function () {
        //this.game.state.start('Game.World'); 
        Game.State.next();
    }
});

ds.make.class({
    type: 'Game.Boot',
    create: function () {
        Game.State.next();
    }
});

// Singleton Class
ds.make.static.class({
    type: 'Game.State',
    constructor: function () {
        this.width = 800;
        this.height = 600;
        this.game = new Phaser.Game(this.width, this.height, Phaser.WEBGL, 'cartest');
        this.states = [];

        this.add(Game.Boot);
        this.add(Game.Loader, false);
        this.add(Game.World);
        this.start();
    },
    add: function (stateClass, clearWorld, clearCache) {
        this.game.state.add(stateClass.prototype.type, stateClass);
        this.states.push({
            state: stateClass.prototype.type,
            clearWorld: clearWorld,
            clearCache: clearCache
        });
    },
    start: function () {
        this.stateIndex = -1;
        this.next();
    },
    next: function () {
        var p = this.states[++this.stateIndex];
        this.game.state.start(p.state, p.clearWorld, p.clearCache);
    }
});
