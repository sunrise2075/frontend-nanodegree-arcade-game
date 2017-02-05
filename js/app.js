//
var STONE_BLOCK_WIDTH = 101;
var STONE_BLOCK_HEIGHT = 171;

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = 0;
    // select a stone track line
    var trackNo = Math.floor(Math.random() * 3) + 1 ;
    switch (trackNo){
        case 1:
            this.y =1/3 * STONE_BLOCK_HEIGHT;  //the topmost stone track line
            break;
        case 2:
            this.y = 1/3 * STONE_BLOCK_HEIGHT + 1/2*STONE_BLOCK_HEIGHT;  //the second stone track line
            break;
        case 3:
            this.y = 1/3 * STONE_BLOCK_HEIGHT + 2/2*STONE_BLOCK_HEIGHT;  // the down-most stone track line
            break;
        default:
            throw "invalid track number, please use 1, 2 or 3 to specify the track in the topdown order";
    }

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //how to use the parameter of dt?
    this.x = this.x + 20 * dt;
    //I need some logic to
    //control the time delay before drawing this enemy bug onto the stone track line
    this.render();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(name){
    //you can set a name to the player
    this.name = name;
    //used as the default icon of player
    this.image = 'images/char-boy.png';
    //control the absolute position
    this.x = 0;
    //default position, the left-down corner of grass block
    this.y = 2.5 * STONE_BLOCK_HEIGHT - 20;
    //control the relative position with reference of an
    // Cartesian coordinate system which takes left down corner as its origin
    this.gridX = 0;
    this.gridY = 0;
}

Player.prototype.update = function(){
    this.render();
};

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
};

Player.prototype.handleInput = function(action){
    if(!action)  return;
    switch (action) {
        case 'left':
            if(this.gridX > 0){
                //keep the player from the leftmost boundary
                this.x = this.x - STONE_BLOCK_WIDTH;
                this.gridX--;
                this.update();
            }
            break;
        case 'up':
            if(this.gridY < 4){
                //keep the player from the water block boundary
                this.y = this.y - STONE_BLOCK_HEIGHT/2;
                this.gridY++;
                this.update();
            }
            break;
        case 'right':
            //keep the player from the rightmost boundary
            if(this.gridX < 4){
                this.x = this.x + STONE_BLOCK_WIDTH ;
                this.gridX++;
                this.update();
            }
            break;
        case 'down':
            //keep the player from the bottom boundary
            if(this.gridY> 0){
                this.y = this.y + STONE_BLOCK_HEIGHT/2 ;
                this.gridY--;
                this.update();
            }
            break;
        default:
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

for(var i=0; i < 3; i++){
    var enemy = new Enemy();
    allEnemies.push(enemy);
}

var player = new Player('sunrise2075');

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
