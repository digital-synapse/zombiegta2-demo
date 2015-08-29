

ds.make.class({
    type: 'Game.Layer3D',
    inherits: Phaser.Three,
    constructor: function (game, buildings) {
        this.init(game);

        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, -1, -1).normalize();
        this.scene.add(light);


        for (var i = 0; i < buildings.length; i++) {
            var building = buildings[i];
            if (building.rectangle) {
                var width = building.width * 2;
                var height = building.height * 2;
                var x = (building.x * 2) + building.width;
                var y = ((-building.height) - (building.y * 2));// +building.height;
                var depth = this.maxHeight;
                if (building.name == 'tall') depth = this.maxHeight * 0.75;
                if (building.name == 'medium') depth = this.maxHeight * 0.50;
                if (building.name == 'short') depth = this.maxHeight * 0.25;


                // box
                var geometry = new THREE.BoxGeometry(width, height, depth);
                var face = new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture('../assets/textures/buildingface1.png')
                })
                var roof = new THREE.MeshLambertMaterial({
                    map: THREE.ImageUtils.loadTexture('../assets/textures/rooftop1.jpg')
                });
                var materials = [face, face, face, face, roof, face];
                mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));

                mesh.position.z = (depth * 0.5) - this.maxHeight;
                mesh.position.x = x;
                mesh.position.y = y;
                this.scene.add(mesh);

                var sprite = game.add.sprite(building.x + building.width/2, building.y + building.height/2, ''); //game.add.sprite(mesh.position.x / 2, mesh.position.y / 2, '');
                sprite.width = building.width ;
                sprite.height = building.height ;
                game.physics.p2.enable(sprite, false);//true);
                sprite.body.kinematic = true;


            }
        }


    }
});
