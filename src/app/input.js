
ds.make.class({
    type: 'Game.Input.DigitalToAnalog',
    constructor: function (game) {
        this.game = game;
        this.x = 0;
        this.y = 0;
        this.config = {
            xmin: -1, ymin: -1,
            xmax: 1, ymax: 1,
            xstep: 0.05, ystep: 0.05,
            xidle: 0.01, yidle: 0.01,            
        };
        this.keys = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
            down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
            right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
            left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        };
    },
    update: function () {
        with (this) {
            if (keys.up.isDown) { if (y < config.ymax) y += config.ystep; else y = config.xmax; }
            else if (keys.down.isDown) { if (y > config.ymin) y -= config.ystep; else y = config.ymin; }
            else {
                if (Math.abs(y) < config.ystep) y = 0; else y > 0 ? y -= config.ystep : y += config.ystep;
                if (Math.abs(y) < config.yidle) y = 0; else y > 0 ? y -= config.yidle : y += config.yidle;
            }
            if (keys.right.isDown) { if (x < config.xmax) x += config.xstep; else x = config.xmax; }
            else if (keys.left.isDown) { if (x > config.xmin) x -= config.xstep; else x = config.xmin; }
            else {
                if (Math.abs(x) < config.xstep) x = 0; else x > 0 ? x -= config.xstep : x += config.xstep;
                if (Math.abs(x) < config.xidle) x = 0; else x > 0 ? x -= config.xidle : x += config.xidle;
            }
        }
    }
});
