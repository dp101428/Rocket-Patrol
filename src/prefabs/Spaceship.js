class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame);

        //add an object to the scene, displayList, updateList
        scene.add.existing(this);
        this.points = pointValue;
    }

    update(){
        this.x -= 3;
        //wrap behaviour
        if(this.x <= 0 - this.width){
            this.x = game.config.width;
        }
    }
}