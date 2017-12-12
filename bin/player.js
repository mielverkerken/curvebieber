const constanten = require("const");
const MoveData=require("movedata");

class Player{
    constructor(userid,color){
        this.userID = userid;
        this.color=color;
        this.keys = {
            leftkey:false,
            rightkey:false
        };
        this.movedata = new MoveData(this.userID,this.color);
        this.direction = Math.floor(Math.random()*360 + 1);
        this.speed = Math.round((constanten.UPDATEINTERVAL/constanten.SPEEDMULTIPLIER)*1000)/1000;
        this.rotationRadius = constanten.UPDATEINTERVAL/constanten.ROTATIONRADIUSMULTIPLIER;
        this.holeTimer = null;
    }
    postKey(key,action){
        if(key === constanten.LEFTKEY){
            if( action === constanten.KEYDOWN){
                this.keys.leftkey = true;
            }
            else if( action === constanten.KEYUP){
                this.keys.leftkey = false;
            }
        }
        else if(key === constanten.RIGHTKEY){
            if( action === constanten.KEYDOWN){
                this.keys.rightkey = true;
            }
            else if( action === constanten.KEYUP){
                this.keys.rightkey = false;
            }
        }
    }
    calculateNextMoveData(){
        let shouldMakeHole=(Math.floor(Math.random()*10000000/(constanten.MEANHOLEPERIOD*constanten.UPDATEINTERVAL))==0);
        if(!this.movedata.isHole&&shouldMakeHole){      //!isHole is added!!!!
            this.movedata.isHole = true;
            this.holeTimer = setTimeout(function () {
               this.movedata.isHole=false;
            },constanten.UPDATEINTERVAL*constanten.HOLELENGTHMULTIPLIER);
        }
        if(this.keys.leftkey) this.direction -= this.rotationRadius*constanten.UPDATEINTERVAL;
        if(this.keys.rightkey) this.direction += this.rotationRadius*constanten.UPDATEINTERVAL;

        this.movedata.x+=this.speed+Math.cos(Math.PI*this.direction/180)*constanten.UPDATEINTERVAL;
        this.movedata.x+=this.speed+Math.sin(Math.PI*this.direction/180)*constanten.UPDATEINTERVAL;
    }

}
module.exports = Player;