//util constants
var STONE_BLOCK_WIDTH = 101;
var STONE_BLOCK_HEIGHT = 171;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


// Enemies our player must avoid
var Enemy = function(serialNo) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    //take each block as an coordinate
    this.speed = getRandomInt(100, 200)  +  200 ;
    this.blockX = -( 2* serialNo + 1);
    console.log();
    this.blockY = getRandomInt(1,4);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.calculateX();
    this.calculateY();

};

Enemy.prototype.isOnCanvas = function(){
   if(this.x < 550){
       return true;
   }else{
       return false;
   }
};

Enemy.prototype.calculateX = function(){
    this.x = this.blockX  * STONE_BLOCK_WIDTH;
};

Enemy.prototype.calculateY = function(){
    // an easier way to select a stone lane by its serialNo
    switch (this.blockY) {
        case 1:
            this.y = 1 / 3 * STONE_BLOCK_HEIGHT; //the topmost stone track line
            break;
        case 2:
            this.y = 1 / 3 * STONE_BLOCK_HEIGHT + 1 / 2 * STONE_BLOCK_HEIGHT; //the second stone track line
            break;
        case 3:
            this.y = 1 / 3 * STONE_BLOCK_HEIGHT + 2 / 2 * STONE_BLOCK_HEIGHT; // the down-most stone track line
            break;
        default:
            throw "invalid track number, please use 1, 2 or 3 to specify the track in the topdown order";
    }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if(this.isOnCanvas()){
        this.x = this.x + this.speed * dt;
    }
    //Question 3: I need some logic to
    //control the time delay before drawing this enemy bug onto the stone track line
    //so that current bug cannot collide with and keep a proper distance from any other bug
    this.render();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(name) {
    //you can set a name to the player
    this.name = name;
    //used as the default icon of player
    this.image = 'images/char-boy.png';
    this.blockX = getRandomInt(0, 5);
    this.blockY = getRandomInt(4, 6)
    //control the absolute position
    this.x = this.blockX * STONE_BLOCK_WIDTH;
    //default position, the left-down corner of grass block
    this.y = this.blockY * STONE_BLOCK_HEIGHT/2 - 20;
    //control the relative position with reference of an
    // Cartesian coordinate system which takes left down corner as its origin
};

Player.prototype.toPositionInBlock = function(){
    console.log("blockX:["+ this.blockX +"], blockY:["+ this.blockY +"]");
}

Player.prototype.update = function() {
    this.toPositionInBlock();
    this.render();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
};

Player.prototype.handleInput = function(action) {
    if (!action) {
        return;
    }
    switch (action) {
        case 'left':
            if (this.blockX > 0) {
                //keep the player from the leftmost boundary
                this.x = this.x - STONE_BLOCK_WIDTH;
                this.blockX--;
                this.update();
            }
            break;
        case 'up':
            if (this.blockY < 4) {
                //keep the player from the water block boundary
                this.y = this.y - STONE_BLOCK_HEIGHT / 2;
                this.blockY--;
                this.update();
            }
            break;
        case 'right':
            //keep the player from the rightmost boundary
            if (this.blockX < 4) {
                this.x = this.x + STONE_BLOCK_WIDTH;
                this.blockX++;
                this.update();
            }
            break;
        case 'down':
            //keep the player from the bottom boundary
            if (this.blockY > 0) {
                this.y = this.y + STONE_BLOCK_HEIGHT / 2;
                this.blockY++;
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

for (var i = 0; i < 50; i++) {
    var serailNo = i+1;
    var enemy = new Enemy(serailNo);
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