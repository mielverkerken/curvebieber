const constanten = require("./const");
const MoveData=require("./movedata");

class Player{
    constructor(userid,color){
        this.userId = userid;
        this.points = 0;
        this.color = color;
        this.movedata = new MoveData(this.userId,this.color);

        this.keys = {
            leftkey: false,
            rightkey: false
        };

        this.direction = Player.generateRandomDirection();
        this.speed = Math.round((constanten.UPDATEINTERVAL*constanten.SPEEDMULTIPLIER/100)*1000)/1000;
        this.rotationRadius = constanten.UPDATEINTERVAL*constanten.ROTATIONRADIUSMULTIPLIER/100;
        this.holeTimer = null;
    }

    postKey(key,action){
        if (key === constanten.LEFTKEY){
            if ( action === constanten.KEYDOWN){
                this.keys.leftkey = true;
            }
            else if ( action === constanten.KEYUP){
                this.keys.leftkey = false;
            }
        }
        else if (key === constanten.RIGHTKEY){
            if ( action === constanten.KEYDOWN){
                this.keys.rightkey = true;
            }
            else if ( action === constanten.KEYUP){
                this.keys.rightkey = false;
            }
        }
    }

    calculateNextMoveData(){
        let shouldMakeHole = (Math.floor(Math.random()*10000000/(constanten.MEANHOLEPERIOD*constanten.UPDATEINTERVAL)) === 0);

        if (!this.movedata.isHole && shouldMakeHole){
            this.movedata.isHole = true;
            this.holeTimer = setTimeout(function () {
                    this.movedata.isHole = false;
            }.bind(this), constanten.UPDATEINTERVAL*constanten.HOLELENGTHMULTIPLIER);
        }

        if (this.keys.leftkey) this.direction -= this.rotationRadius*constanten.UPDATEINTERVAL;
        if (this.keys.rightkey) this.direction += this.rotationRadius*constanten.UPDATEINTERVAL;

        this.movedata.x += this.speed*Math.cos(Math.PI*this.direction/180)*constanten.UPDATEINTERVAL;
        this.movedata.y += this.speed*Math.sin(Math.PI*this.direction/180)*constanten.UPDATEINTERVAL;
    }
    static generateRandomDirection(){
        return Math.floor(Math.random()*360 + 1);
    }
    reset(){
        this.movedata.randomizeCoordinates()
        this.direction = Player.generateRandomDirection();
    }
}
module.exports = Player;