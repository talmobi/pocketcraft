
var WIDTH = 568;
var HEIGHT = 320;
var container_id = 'phaser-container'

var opts = {
  preload: preload,
  create: create,
  update: update,
  render: render
}

var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.CANVAS, container_id || 'phaser-container', opts);

function preload() {
  game.stage.backgroundColor = 0x222222;
  game.stage.backgroundColor = 0xEECCEE;

  game.load.spritesheet('sheet', 'assets/gfx/sheet.png', 16, 16);
}

var selecting = false;
var line;
var sprite;

function create() {
  // set input
  line = new Phaser.Line(0,0,0,0);
  game.input.onDown.add(function() {
    if (!selecting) {
      selecting = true;
      line.start.set(game.input.activePointer.x, game.input.activePointer.y);
    }
  }, this);
  game.input.onUp.add(function() {
    if (selecting) {
      selecting = false;
      // TODO - select units
    }
  }, this);


  // set others
  game.scale.pageAlignHorizontally = true;
  game.stage.smoothed = false;

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

  /**
    * Scale game window
    */
  game.scale.setShowAll();
  game.scale.refresh();

  /* inheritance test
  var u = new Unit();
  console.log(u instanceof Unit);
  console.log(u instanceof Harvester);
  console.log(harvester instanceof Unit);
  console.log(harvester instanceof Harvester);
  */
}

function update() {

}

function render() {

  //game.debug.spriteBounds(sprite);


  if (selecting) {
    if (game.input.activePointer.isDown) {
      line.end.set(game.input.activePointer.x, game.input.activePointer.y);
    }

    game.debug.rectangle(line)
  }
}


function Unit(x,y,team,hexColor) {
  // call the sprite constructor
  Phaser.Sprite.call(this, game, x, y, 'sheet');

  this.smoothed = false;
  this.anchor.setTo(.5, 1);
  this.tint = hexColor || 0xFFFFFF;
  this.team = team || 9;
};
Unit.prototype = Object.create(Phaser.Sprite.prototype);
Unit.prototype.constructor = Unit;

/**
  * Harvester Unit
  */
function Harvester(x,y,team,hexColor) {
  // call the Unit constructor
  Unit.call(this, x, y, team, hexColor);

  this.animations.add('walk', [0, 1], 2, true);
  this.animations.play('walk');
};
Harvester.prototype = Object.create(Unit.prototype);
Harvester.prototype.constructor = Harvester;
