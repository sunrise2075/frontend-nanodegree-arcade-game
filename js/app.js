//util constants
var STONE_BLOCK_WIDTH = 101;
var STONE_BLOCK_HEIGHT = 171;

//an util object encapsulating a set of useful method
var util = {
    /*
    * @description get a random number equal or greater than value of min,
    * and less than value of max
    * @param {number} min
    * @param {number} max
    * */
    getRandomInt : function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },
    /*
     * @description freeze all enemy bugs on the canvas
     * */
    freezeAllEnemies : function(){
        allEnemies.forEach(function(enemy){
            enemy.freeze();
        });
    },
    /*
     * @description unfreeze all enemy bugs on the canvas
     * */
    unFreezeAllEnemies : function(){
        allEnemies.forEach(function(enemy){
            enemy.unfreeze();
        });
    }
};

/*
 * @description represent a banner ot alert messages
 * @constructor
 * */
var Banner = function(){
    this.successImage = "images/success-key.png";
    this.gameOverImage = "images/game-over.png";
    this.x = 1.25 * STONE_BLOCK_WIDTH;
    this.y = 0.3 * STONE_BLOCK_HEIGHT;
}
/*
 * @description draw an alert messages of Good Job
 * */
Banner.prototype.drawSuccessImage = function(){
    ctx.drawImage(Resources.get(this.successImage), this.x, this.y);
};

/*
 * @description draw an alert messages when the player
 *              is killed by any enemy bug
 * */
Banner.prototype.drawGameOverImage = function(){
    ctx.drawImage(Resources.get(this.gameOverImage), this.x, this.y);
};

// Enemies our player must avoid
var Enemy = function(serialNo) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    //take each block as an coordinate
    this.speed = util.getRandomInt(1, 200)  +  200 ;
    this.serialNo = serialNo;
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
    this.blockX = -( 2* this.serialNo + 1);
    this.x = this.blockX  * STONE_BLOCK_WIDTH;
};

Enemy.prototype.calculateY = function(){
    this.blockY = util.getRandomInt(1,4);
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
    }else{
        this.calculateX();
        this.calculateY();
        this.speed = util.getRandomInt(1, 200)  +  200 ;
    }
};

//set the speed of current enemy bug to zero
Enemy.prototype.freeze = function(){
  this.speed = 0;
};

//reset the speed of current enemy bug to zero
Enemy.prototype.unfreeze = function(){
    this.speed = util.getRandomInt(1, 200)  +  200 ;
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
    this.success = false;
    this.fail = false;
    this.initPos();
    //control the relative position with reference of an
    // Cartesian coordinate system which takes left down corner as its origin
};

Player.prototype.initPos = function(){
    this.blockX = 2;
    this.blockY = 4;
    //control the absolute position
    this.x = this.blockX * STONE_BLOCK_WIDTH;
    //default position, the left-down corner of grass block
    this.y = this.blockY * STONE_BLOCK_HEIGHT/2 - 20;
};

Player.prototype.checkCollision = function(){
    var result ;
    var dangerousEnemy = allEnemies.filter(function(enemy) {
            var flag = false;
            if(enemy.blockY === player.blockY){
                var distance = player.x + 25 -enemy.x;
                flag = (distance > 0) &&(distance<= STONE_BLOCK_WIDTH);
            }
            return flag;
    });
    result = (dangerousEnemy.length >0 );
    return result;
};

Player.prototype.update = function() {
    var checkCollision = this.checkCollision();
    if(checkCollision){
        this.initPos();
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.image), this.x, this.y);
    if(this.success){
        util.freezeAllEnemies();
        banner.drawSuccessImage();
    }
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
            if (this.blockY > 1) {
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
            if (this.blockY < 5) {
                this.y = this.y + STONE_BLOCK_HEIGHT / 2;
                this.blockY++;
                this.update();
            }
            break;
        case 'enter':
            this.success = false;
            this.initPos();
            util.unFreezeAllEnemies();
            break;
        default:
            break;
    }

    if(this.blockY === 1){
        this.success = true;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

for (var i = 0; i < 5; i++) {
    var serailNo = i+1;
    var enemy = new Enemy(serailNo);
    allEnemies.push(enemy);
}

var player = new Player('sunrise2075');
var banner = new Banner();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});