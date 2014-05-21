
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
  //game.stage.backgroundColor = 0xEECCEE;

  game.load.spritesheet('sheet', 'assets/gfx/sheet.png', 16, 16);
}

var selecting = false;
var line;
var sprite;
var entities;
var selectedUnits = [];

var SHIFT_KEY;
var mouse;

function create() {
  /**
    * Initialize game variables
    */
  entities = game.add.group();

  /**
    * Initialize input
    */
  // disable default right click
  document.onclick = function(e) { if(e.button == 2 || e.button == 3) { return false; } };
  mouse = game.input.mouse;
  mouse.capture = true; // prevent default mouse behaviour
  game.input.maxPointers = 1; // max pointers
  SHIFT_KEY = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT); // shift key

  line = new Phaser.Line(0,0,0,0); // selection line
  mouse.mouseDownCallback = handleOnDown;
  mouse.mouseUpCallback = handleOnUp;

  /**
    * Test
    */
  game.scale.pageAlignHorizontally = true;
  game.stage.smoothed = false;

  for (var i = 0; i < 4; i++) {
    var x = game.world.centerX + 40 + 20 * i;
    var y = game.world.centerY + 40;
    var h = new Harvester(x, y, null, 0xAAFFBB >> i);
    h.animations.add('walk', [2 + i * 2, 3 + i * 2], 2, true);
    h.animations.play('walk');
    entities.add(h);
  }


  var harvester = new Harvester(game.world.centerX + 10, game.world.centerY - 30, 0, 0xFFBBBB);
  entities.add(harvester);
  //game.add.existing(harvester);

  /**
    * Scale game window
    */
  game.scale.setShowAll();
  game.scale.refresh();
}

function update() {

}

function render() {

  //game.debug.spriteBounds(sprite);

  // draw selection box
  if (selecting) {
    if (game.input.activePointer.isDown) {
      line.end.set(game.input.activePointer.x, game.input.activePointer.y);
    }

    game.debug.rectangle(line)
  }

  for (var i = 0; i < selectedUnits.length; i++) {
    var u = selectedUnits[i];
    //game.debug.rectangle(u);
    //game.debug.geom(new Phaser.Rectangle(u.x - u.hw, u.y - u.hh, u.w, u.h), '#ffffff', false);
    game.debug.geom( u.rect, '#bfeebf', false);
    //game.debug.rectangle(u);
  }
}




/**
  * Units
  */
function Unit(x,y,team,hexColor) {
  // call the sprite constructor
  Phaser.Sprite.call(this, game, x, y, 'sheet');

  this.alive = true;
  this.smoothed = false;
  this.anchor.setTo(.5, 1);
  this.tint = hexColor || 0xFFFFFF;
  this.team = team || 9;
  this.selectedUnit = false;
  this.w = 10;
  this.h = 4;
  this.hw = (this.w / 2) | 0; // px
  this.hh = (this.h / 2) | 0; // px
  this.rect = new Phaser.Rectangle(this.x - this.width / 2, this.y - this.height + 1,
   this.width, this.height);

  this.target = null;
  this.tx = x;
  this.ty = y;
};
Unit.prototype = Object.create(Phaser.Sprite.prototype);
Unit.prototype.constructor = Unit;
Unit.prototype.setTarget = function(tx,ty) {
  this.tx = tx | 0;
  this.ty = ty | 0;
}
Unit.prototype.update = function() { // called automatically by phaser
  if (this.x + 1 < this.tx)
    this.x += 1;
  else
    if (this.x - 1 > this.tx)
      this.x -= 1;

  if (this.y + 1 < this.ty)
    this.y += 1;
  else
    if (this.y - 1 > this.ty)
      this.y -= 1;
  if (this.deltaX != 0 || this.deltaY != 0) {
    // update rect position
    this.rect.x = this.x - this.width / 2;
    this.rect.y = this.y - this.height + 1;
  }
}

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






/**
  * Mouse Input
  */
function handleOnDown() { // mouse down
  switch (mouse.button) {
    case Phaser.Mouse.LEFT_BUTTON:
      if (!selecting) {
        selecting = true;
        line.start.set(game.input.activePointer.x, game.input.activePointer.y);
      }
      break;
    case Phaser.Mouse.RIGHT_BUTTON:
      for (var i = 0; i < selectedUnits.length; i++) {
        var u = selectedUnits[i];
        u.setTarget(game.input.worldX, game.input.worldY);
      }
      break;
  }
};
function handleOnUp() { // mouse up
  mouse.event.preventDefault();

  switch (mouse.button) {
    default:
      if (selecting) {
        selecting = false;
        line.end.set(game.input.activePointer.x, game.input.activePointer.y);

        // half width, height
        var hw = (line.end.x - line.start.x) / 2;
        var hh = (line.end.y - line.start.y) / 2;
        // center
        var cx = (line.start.x + hw) | 0;
        var cy = (line.start.y + hh) | 0;
        hw = Math.abs(hw) | 0;
        hh = Math.abs(hh) | 0;

        if (!SHIFT_KEY.isDown) { // clear the selection list
          while (selectedUnits.length > 0) {
            var u = selectedUnits.pop();
            u.selectedUnit = false;
          }
        }

        console.log("cx: " + (cx | 0) + ", cy: " + (cy | 0) + ", hw: " + (hw | 0) + ", hh: " + (hh | 0));

        // check through AABB
        for (var i = 0; i < entities.length; i++) {
          var e = entities.getAt(i);
          if (e.selectedUnit) continue;
          if (Math.abs( e.x - cx ) > e.hw + hw ) continue;
          if (Math.abs( e.y - cy ) > e.hh + hh ) continue;
          // there's an overlap
          e.selectedUnit = true;
          selectedUnits.push(e);
        }

        console.log("num of selected: " + selectedUnits.length);
      }
      break;
  }
};