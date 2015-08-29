
// allows the use of Three within Phaser as a "layer"
ds.make.class({
    type: "Phaser.Three",
    constructor: function () {
        throw 'Do no instanciate this class. Inherit it and call the init method from your constructor!';
    },
    init: function (game) {
        this.game = game;

        // renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(game.width, game.height);

        // setup canvas to be used as a sprite texture
        this.canvas = this.renderer.domElement; //Phaser.Canvas.create(this.game.width, this.game.height, '', true);
        this.context = this.canvas.getContext('2d');
        this.baseTexture = new PIXI.BaseTexture(this.canvas);
        this.texture = new PIXI.Texture(this.baseTexture);
        this.textureFrame = new Phaser.Frame(0, 0, 0, this.game.width, this.game.height, 'debug', game.rnd.uuid());
        this.sprite = this.game.add.sprite(0, 0, this.texture, this.textureFrame);
        this.sprite.fixedToCamera = true;

        // camera
        var fov = 45;
        var camera = new THREE.PerspectiveCamera(fov, game.width / game.height, 1, 10000);
        //var camera= new THREE.OrthographicCamera( game.width / - 2, game.width / 2, game.height / 2, game.height / - 2, 1, 10000 );
        var dist = game.height / 2 / Math.tan(Math.PI * fov / 360);
        camera.position.z = dist;
        //camera.position.y = 200;
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera = camera;
        this.maxHeight = dist;

        // scene
        var scene = new THREE.Scene();
        this.scene = scene;

        var ambientlight = new THREE.AmbientLight(0xF0F0F0); // soft white light
        scene.add(ambientlight);
    },
    update: function () {

        this.scene.position.x = -this.game.camera.position.x *2 ;
        this.scene.position.y = this.game.camera.position.y *2;
        //this.scene.position.x = -this.game.camera.position.x * 2;
        //this.scene.position.y = (-this.game.camera.position.y * 2); //+this.game.height*5;

        // render
        this.renderer.render(this.scene, this.camera);

        PIXI.updateWebGLTexture(this.baseTexture, this.game.renderer.gl);
    }
});