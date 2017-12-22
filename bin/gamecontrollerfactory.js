const GameController=require('./gamecontroller');
const gameDAO = require("./gameDAO");

class GameControllerFactory{
    constructor(){
        this.gameControllers=new Map();
    }
    async getGameController(gameid){
        if (!this.gameControllers.has(gameid)){  // if there is no gamecontroller for this game, create and add one
            this.gameControllers.set(gameid, new GameController(await gameDAO.getGame(gameid)));
        }
        return this.gameControllers.get(gameid);
    }
    getAllGameControllers(){
        return this.gameControllers.values();
    }
    // Deletes the GameController and deletes the game from the GameDAO
    async deleteGameController(gamecontoller){
        let gameid=gamecontoller.game._id;
        if (this.gameControllers.has(gameid)) {
            await gameDAO.deleteGame(gameid);
            this.gameControllers.delete(gameid);
        }
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

