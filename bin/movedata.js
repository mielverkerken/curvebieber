const constanten = require("const");
class MoveData{
    constructor(userid,color){
        this.userID=userid;
        this.color=color;
        this.isHole=false;

        this.generateRandomCoordinates();
    }

    generateRandomValue(){
        return Math.floor(Math.random()*(constanten.CANVAS.WIDTH-2*constanten.SPANDISTANCEFROMBORDER))+constanten.SPANDISTANCEFROMBORDER;
    }

    generateRandomCoordinates(){
        this.x=this.generateRandomPosition();
        this.y=this.generateRandomPosition();
    }
}
module.exports= MoveData;