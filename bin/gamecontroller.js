const gameDAO = require("gameDAO");
const userDAO = require("userDAO");
const constanten = require("const");
const Player = require("player");

class GameController{
    constructor (game) {
        this.game = game;
        this.roundsLeft = this.game.points;
        this.playersLeftInRound = this.game.maxPlayers;
        this.gamestatus = constanten.GAMESTATUS.WAITING;
        this.players=new Map();
        this.livingPlayers=new Map();

    }
    async postUser(userID){   //new user joined the game
        if(this.game.joinedPlayers.length!=this.game.maxPlayers){
            this.game.joinedPlayers.push(userID);
            await gameDAO.updateGame(this.game);

            let color = constanten.COLORS[this.game.joinedPlayers.length];
            let player=new Player(userID,color);

            this.players.set(userID, player);
            this.livingPlayers.set(userID, player);
        }
    }
    postKey(key,action,userID){ // user pressed a button
        if(this.livingPlayers.has(userID)){
            this.livingPlayers.get(userID).postKey(key,action);
        }

    }
    getUpdate(){
        let data =  {
                        roundsLeft: this.roundsLeft,
                        playersLeftInRound: this.playersLeftInRound,
                        movedata: [],
                    };
        for(let player of this.livingPlayers){
            player.calculateNextMoveData();
            data.movedata.push(player.movedata);
        }

    }
}

module.exports = GameController;