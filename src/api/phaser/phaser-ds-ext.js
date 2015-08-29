/// <reference path="/@JSense.js" />


Phaser.Color.interpolateColor24 = function (color1, color2, steps, currentStep) {
    /**
    * Interpolates the two given colours based on the supplied step and currentStep properties.
    *
    * @method Phaser.Color.interpolateColor
    * @static
    * @param {number} color1 - The first color value.
    * @param {number} color2 - The second color value.
    * @param {number} steps - The number of steps to run the interpolation over.
    * @param {number} currentStep - The currentStep value. If the interpolation will take 100 steps, a currentStep value of 50 would be half-way between the two.
    * @param {number} alpha - The alpha of the returned color.
    * @returns {number} The interpolated color value.
    */
    //var scalar = Math.sin(Math.PI + ((Math.PI / steps) * currentStep)) + 1;

    var src1 = Phaser.Color.getRGB(color1);
    var src2 = Phaser.Color.getRGB(color2);
    var r = (((src2.red - src1.red) * currentStep) / steps) + src1.red;
    var g = (((src2.green - src1.green) * currentStep) / steps) + src1.green;
    var b = (((src2.blue - src1.blue) * currentStep) / steps) + src1.blue;

    return Phaser.Color.getColor(r, g, b);

};

Phaser.Tilemap.prototype.getTilesetProperties = function () {
    var map = this;
    var array = [];
    for (var set in map.tilesets) {
        var tileset = map.tilesets[set];
        var props = tileset.tileProperties;
        for (var tile in props) {
            var tileIndex = parseInt(tile);
            var properties = props[tile];

            var obj = clone(properties);
            obj.tileIndex = tileIndex;
            array.push(obj);
        }
    }
    map.tilesetProperties = array; // store in map
    return array;
};

// this will convert all instances of tiles in the map with the property "sprite" into sprites and store them in map.sprites[]
Phaser.Tilemap.prototype.convertTilesToSprites = function (spritesheet, layer) {
    var map = this;
    map.sprites = [];

    // lookup properties
    if (!map.tilesetProperties)
        map.getTilesetProperties();
    for (var i = 0; i < map.tilesetProperties.length; i++) {
        if (map.tilesetProperties[i].sprite) {

            var tileIndex = map.tilesetProperties[i].tileIndex;
            // create a sprite for each tile instance. 
            // append the tiles properties. 
            // add the sprites to the output array
            map.forEach(function (tile) {
                if (tile.index == tileIndex) {
                    var sprite = game.add.sprite(tile.worldX, tile.worldY, "tiles", tileIndex - 1);
                    var properties = clone(map.tilesetProperties[i]);
                    properties.tileX = tile.x;
                    properties.tileY = tile.y;
                    sprite.properties = properties;
                    map.sprites.push(sprite);
                }
            }, this, 0, 0, map.width, map.height, layer);

            // replace the tile with 1 (blank tile)
            map.replace(tileIndex, 1, 0, 0, layer.width, layer.height, layer);
        }
    }
    return map.sprites;
};


Phaser.Tween.prototype.onChainComplete = function (func, context) {
    this._lastChild.onComplete.add(func, context);
}

Object.defineProperty(Phaser.BitmapText.prototype, 'anchor', {
    get: function () {
        return this._anchor;
    },
    set: function (anchor) {
        this._anchor = anchor;
        this.dirty = true;
        this.updateTransform();

        if (!this.textBitmapSpritesParent) {
            this.textBitmapSpritesParent = new Phaser.Group(this.game);
            this.addChild(this.textBitmapSpritesParent);
        }
        this.textBitmapSpritesParent.x = -this.textWidth * this._anchor.x;
        this.textBitmapSpritesParent.y = -this.textHeight * this._anchor.y;

        for (var i = 0; i < this.children.length; ) {
            if (this.children[i] == this.textBitmapSpritesParent) {
                ++i;
            }
            else {
                this.textBitmapSpritesParent.add(this.children[i]);
            }
        }
    }
});

