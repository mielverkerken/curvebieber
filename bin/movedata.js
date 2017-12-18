const constanten = require("./const");
class MoveData{
    constructor(userid,color){
        this.userId = userid;
        this.color = color;
        this.isHole = false;

        this.randomizeCoordinates();
    }

    static generateRandomValue(size){
        return Math.floor(Math.random()*(size-2*constanten.SPANDISTANCEFROMBORDER))+constanten.SPANDISTANCEFROMBORDER;
    }

    randomizeCoordinates(){
        this.x = MoveData.generateRandomValue(constanten.CANVAS.WIDTH);
        this.y = MoveData.generateRandomValue(constanten.CANVAS.HEIGHT);
    }
}
module.exports = MoveData;