export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.tilemapTiledJSON("map", "../mapa/mapa.json");
    this.load.image("terrain", "../mapa/rock_packed.png");

    // Usamos temporalmente el sprite de la compañera disponible en el repo
    this.load.image("player", "assets/sprites/enemies/mutant.png");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const tileset = map.addTilesetImage("rock_packed", "terrain");
    const platforms = map.createLayer("plataformas", tileset, 0, 0);

    platforms.setCollisionByExclusion([0]);

    this.player = this.physics.add.sprite(64, 64, "player");
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.02);
    this.player.setSize(14, 16);

    this.physics.add.collider(this.player, platforms);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.W,
    });
  }

  update() {
    const movingLeft = this.cursors.left.isDown || this.keys.left.isDown;
    const movingRight = this.cursors.right.isDown || this.keys.right.isDown;

    if (movingLeft) {
      this.player.setVelocityX(-170);
      this.player.setFlipX(true);
    } else if (movingRight) {
      this.player.setVelocityX(170);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.cursors.space) || Phaser.Input.Keyboard.JustDown(this.keys.jump);

    if (jumpPressed && this.player.body.blocked.down) {
      this.player.setVelocityY(-350);
    }
  }
}
