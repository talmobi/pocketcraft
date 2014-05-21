
var WIDTH = 568;
var HEIGHT = 320;
var container_id = 'phaser-container'

var opts = {
  preload: preload,
  create: create,
  render: render
}

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.WEBGL, container_id || 'phaser-container', opts);

function preload() {
  game.stage.backgroundColor = 0x222222;
  game.stage.backgroundColor = 0xEECCEE;

  game.load.spritesheet('sheet', 'assets/gfx/sheet.png', 16, 16);
}

var sprite;

function create() {

  sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'sheet');
  sprite.anchor.setTo(.5, 1);

  sprite.animations.add('walk', [0, 1], 2, true);
  sprite.animations.play('walk');

  sprite.tint = 0xBBBBFF;

  sprite = game.add.sprite(game.world.centerX + 20, game.world.centerY, 'sheet');
  sprite.anchor.setTo(.5, 1);

  sprite.animations.add('walk', [4, 5], 2, true);
  sprite.animations.play('walk');

  sprite.tint = 0xBBFFBB;

  for (var i = 0; i < 4; i++) {
    sprite = game.add.sprite(game.world.centerX + 40 + 20 * i, game.world.centerY + 40, 'sheet');
    sprite.anchor.setTo(.5, 1);
    sprite.animations.add('walk', [2 + i * 2, 3 + i * 2], 2, true);
    sprite.animations.play('walk');
  }


  var harvester = new Harvester(game.world.centerX + 10, game.world.centerY - 30, 0, 0xFFBBBB);
  game.add.existing(harvester);
}

function render() {

  //game.debug.spriteBounds(sprite);

}


/**
  * Harvester Unit
  */
function Harvester(x,y,team,hexColor) {
  // call the sprite constructor
  Phaser.Sprite.call(this, game, x, y, 'sheet');

  this.anchor.setTo(.5, 1);
  this.animations.add('walk', [0, 1], 2, true);
  this.animations.play('walk');

  this.tint = hexColor || 0xFFFFFF;
  this.team = team || 9;
};

Harvester.prototype = Object.create(Phaser.Sprite.prototype);
Harvester.prototype.constructor = Harvester;