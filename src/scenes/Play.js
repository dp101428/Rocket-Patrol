class Play extends Phaser.Scene{
    constructor (){
        super ("playScene");
    }

    preload(){
        //load images/tile sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth:64, frameHeight:32,
             startFrame:0, endFrame:9});

        
    }
    create(){
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);


        //white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 433, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);
        //green background
        this.add.rectangle(37,42,566,64,0x00FF00).setOrigin(0,0);

        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431, 'rocket').setScale(.5, .5);

        //add spaceships
        this.ships = [new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0,0), 
                      new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0,0),
                      new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0,0)];
        
        

        //define all the keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //adds explosion to the scene
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start:0, end:9, first:0}),
            frameRate: 30
        });

        //establish score.
        this.p1Score = 0;

        //then set up the display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        //this tells the game what to display and how to display it?
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);

        //game over flag
        this.gameOver = false;
        //clock for the game
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, ()=>{
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update(){
        //handle post-game choices.
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)){
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        //scroll starfield
        this.starfield.tilePositionX -= 4;
        //update rocket
        if(!this.gameOver){
            this.p1Rocket.update();
        }

        //update all the ships
        this.ships.forEach((ship) => {
            ship.update();
            if(this.checkCollision(this.p1Rocket, ship)){
                this.p1Rocket.reset();
                this.shipExplode(ship);
            }
        });
    }

    checkCollision(rocket, ship){
        //Simple fake rectangle collision checking
        if(rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height&&
            rocket.height + rocket.y > ship.y){
            return true;
        }
        //no else necessary, but tutorial has it
        //if it is actually necessary then JS is worse than I thought
        else{
            return false;
        }
    }

    shipExplode(ship){
        //hide the ship since it's blowing up
        ship.alpha = 0;
        //make the explosion on the invisible ship
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode'); //make the explosion happen
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha=1;
            boom.destroy();
        });
        //add the score
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}

