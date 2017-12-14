const constanten = require("./const");
class MoveData{
    constructor(userid,color){
        this.userId=userid;
        this.color=color;
        this.isHole=false;

        this.generateRandomCoordinates();
    }

    generateRandomValue(){
        return Math.floor(Math.random()*(constanten.CANVAS.WIDTH-2*constanten.SPANDISTANCEFROMBORDER))+constanten.SPANDISTANCEFROMBORDER;
    }

    generateRandomCoordinates(){
        this.x=this.generateRandomValue();
        this.y=this.generateRandomValue();
    }
}
module.exports= MoveData;