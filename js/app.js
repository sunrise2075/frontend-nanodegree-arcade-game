//util constants
var STONE_BLOCK_WIDTH = 101;
var STONE_BLOCK_HEIGHT = 171;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function check( enemy) {
    var laneNo = enemy.laneNo;
    if((laneNo === 1) &&( player.gridY === 4)){
        if(enemy.x + STONE_BLOCK_WIDTH > player.x){
            return true;
        }else{
            return false;
        }
    }
    if((laneNo ===2) && (player.gridY === 3)){
        if(enemy.x + STONE_BLOCK_WIDTH > player.x){
            return true;
        }else{
            return false;
        }
    }
    if((laneNo ===3) && (player.gridY === 2)){
        if(enemy.x + STONE_BLOCK_WIDTH > player.x){
            return true;
        }else{
            return false;
        }
    }
    return false;
}

// Enemies our player must avoid
var Enemy = function(serialNo) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.serialNo = serialNo;
    this.laneNo = this.serialNo % 3 + 1;
    this.speed = getRandomInt(10, 20)* 10 ;
    this.calculateX();
    this.calculateY();
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.isOnCanvas = function(){
   if(this.x < 550){
       return true;
   }else{
       return false;
   }
};

Enemy.prototype.calculateX = function(){
    this.x = -(this.serialNo + 1) * STONE_BLOCK_WIDTH;
};

Enemy.prototype.calculateY = function(){
    // an easier way to select a stone lane by its serialNo
    switch (this.laneNo) {
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
    }else{
        this.calculateX();
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
    //control the absolute position
    this.x = 0;
    //default position, the left-down corner of grass block
    this.y = 2.5 * STONE_BLOCK_HEIGHT - 20;
    //control the relative position with reference of an
    // Cartesian coordinate system which takes left down corner as its origin
    this.gridX = 0;
    this.gridY = 0;
};

Player.prototype.update = function() {
    //if the player is touched by the enemy
    //recalculate a new starting position

    // allEnemies.forEach(function(enemy){
    //     var flag = check( enemy)
    //     console.log("  check result  :" +  flag);
    //     if(flag){
    //         //control the absolute position
    //         player.x = 0;
    //         //default position, the left-down corner of grass block
    //         player.y = 2.5 * STONE_BLOCK_HEIGHT - 20;
    //         return ;
    //     }
    // });
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
            if (this.gridX > 0) {
                //keep the player from the leftmost boundary
                this.x = this.x - STONE_BLOCK_WIDTH;
                this.gridX--;
                this.update();
            }
            break;
        case 'up':
            if (this.gridY < 4) {
                //keep the player from the water block boundary
                this.y = this.y - STONE_BLOCK_HEIGHT / 2;
                this.gridY++;
                this.update();
            }
            break;
        case 'right':
            //keep the player from the rightmost boundary
            if (this.gridX < 4) {
                this.x = this.x + STONE_BLOCK_WIDTH;
                this.gridX++;
                this.update();
            }
            break;
        case 'down':
            //keep the player from the bottom boundary
            if (this.gridY > 0) {
                this.y = this.y + STONE_BLOCK_HEIGHT / 2;
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

for (var i = 0; i < 5; i++) {
    var serialNo = i+1;
    var enemy = new Enemy(serialNo);
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