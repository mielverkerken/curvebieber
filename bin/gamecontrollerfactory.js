const GameController=require('./gamecontroller');
const gameDAO = require("./gameDAO");

class GameControllerFactory{
    constructor(){
        this.gameControllers=new Map();
    }
    async getGameController(gameid){
        if(!this.gameControllers.has(gameid)){  // if there is no gamecontroller for this game, create and add one
            this.gameControllers.set(gameid, new GameController(await gameDAO.getGame(gameid)));
        }
        return this.gameControllers.get(gameid);
    }
    getAllGameControllers(){
        return this.gameControllers.values();
    }
    static getInstance(){
        if(!instance){
            instance=new GameControllerFactory();
        }
        return instance;
    }
}
let instance;
module.exports=GameControllerFactory;

