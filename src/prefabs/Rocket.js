class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame);

        //add an object to the scene, displayList, updateList
        scene.add.existing(this);
        this.isFiring = false;
    }

    update(){
        //need moving, firing.
        if(!this.isFiring){
            if(keyLEFT.isDown && this.x >= 47){
                this.x -= 2;
            }
            else if(keyRIGHT.isDown && this.x <= 578){
                this.x += 2;
            }
        }
        //firing
        if(Phaser.Input.Keyboard.JustDown(keyF)){
            this.isFiring = true;
        }
        //move if firing
        if(this.isFiring && this.y >= 108){
            this.y -= 2;
        }
        //if we didn't hit, reset rocket if hit ceiling
        if(this.y <= 108){
            this.isFiring = false;
            this.y = 431;
        }
    }
}