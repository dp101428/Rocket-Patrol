class Menu extends Phaser.Scene{
    constructor (){
        super ("menuScene");
    }

    create(){
        //shows menu text
        this.add.text(20,20,"Rocket Patrol Menu");


        // launches the next scene (temp)
        this.scene.start("playScene");
    }
}

