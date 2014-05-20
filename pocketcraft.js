
var WIDTH = 568;
var HEIGHT = 320;
var container_id = 'phaser-container'

var opts = {
  preload: preload,
  create: create,
  render: render
}

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, container_id || 'phaser-container', opts);

function preload() {
  game.load.spritesheet('sheet', 'assets/sheet.png', 16, 16);
}

var sprite;

function create() {

  sprite = game.add.sprite(game.world.centerX, game.world.centerY, 'sheet');
  sprite.anchor.setTo(.5, 1);

  sprite.animations.add('walk', [0, 1], 2, true);
  sprite.animations.play('walk');

  sprite = game.add.sprite(game.world.centerX + 20, game.world.centerY, 'sheet');
  sprite.anchor.setTo(.5, 1);

  sprite.animations.add('walk', [2, 3], 2, true);
  sprite.animations.play('walk');
}

function render() {

  game.debug.spriteBounds(sprite);

}