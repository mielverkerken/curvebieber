const constanten = require("const");
class MoveData{
    constructor(userid,color){
        this.userID=userid;
        this.color=color;

        this.x=this.generateRandomPosition();
        this.y=this.generateRandomPosition();

        this.isHole=false;
    }
    generateRandomPosition(){
        return Math.floor(Math.random()*(constanten.CANVAS.WIDTH-2*constanten.SPANDISTANCEFROMBORDER))+constanten.SPANDISTANCEFROMBORDER;
    }
}
module.exports= MoveData;