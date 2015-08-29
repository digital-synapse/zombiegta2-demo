ds.make.class({
    type: 'Game.Camera',
    constructor: function (game) {
        this.game = game;
        this.q = new Queue();
        this.config = {
            buffersize: 10
        };
    },
    update: function (x, y) {
        this.q.enqueue({ x: x, y: y });
        if (this.q.count > this.config.buffersize) {
            this.q.dequeue();
        }
        var sum = { x: 0, y: 0 };
        this.q.iterate(function (each) {
            sum.x += each.x;
            sum.y += each.y;
        });
        this.game.camera.focusOnXY(sum.x / this.q.count, sum.y / this.q.count);
    }
});
    