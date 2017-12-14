const gameDAO = require("./gameDAO");
const userDAO = require("./userDAO");
const constanten = require("./const");
const Player = require("./player");

class GameController{
    constructor (game) {
        this.game = game;
        this.roundsLeft = this.game._points;
        //this.playersLeftInRound = this.game.maxPlayers;
        this.game._status=constanten.GAMESTATUS.WAITING;
        this.game._joinedPlayers=[];
        this.players=new Map();
        this.livingPlayers=new Map();

    }
    async postUser(userID){   //new user joined the game
        if(this.game._joinedPlayers.length !== this.game.maxPlayers){
            this.game._joinedPlayers.push(userID);

            let color = constanten.COLORS[this.game._joinedPlayers.length];
            let player=new Player(userID,color);

            this.players.set(userID, player);
            this.livingPlayers.set(userID, player);
        }
        if(this.game._joinedPlayers.length === this.game.maxPlayers){
            this.game._status=constanten.GAMESTATUS.PLAYING;
        }
        await this.updateGame();
    }
    postKey(key,action,userID){ // user pressed a button
        if(this.livingPlayers.has(userID)){
            this.livingPlayers.get(userID).postKey(key,action);
        }

    }
    getUpdate(){
        let data = {
            roundsLeft: this.roundsLeft,
            //playersLeftInRound: this.playersLeftInRound,
            moveDataMap: new Map(),
        };
        if(this.game._status === constanten.GAMESTATUS.PLAYING){

            for(let player of this.livingPlayers){
                player.calculateNextMoveData();
                data.moveDataMap.set(player.userId,player.movedata);    // only movedata of living players are passed
            }
        }
        return data;


    }
    async postGameOver(userid){
        this.livingPlayers.delete(userid);

        for(let player of this.livingPlayers){
            player.points++;                    //give all the living players an extra point
        }

        if(this.livingPlayers.size === 0){     // go to the next round
            if(this.roundsLeft === 0){      // check if game is finished
                this.game._status = constanten.GAMESTATUS.ENDED;
                await this.updateUsers();
                await this.updateGame();
            }
            else{
                this.roundsLeft--;
                this.livingPlayers = this.players;
                for(let player of this.livingPlayers){
                    player.movedata.generateRandomCoordinates();    // new positions for the players
                }
            }
        }

    }
    async updateUsers(){
        for(let player of this.players){
            let user = await userDAO.getUser(player.userId);
            user.points+=player.points;
            await userDAO.updateUser(user);
        }
    }
    async updateGame(){
        await gameDAO.updateGame(this.game);
    }
}
module.exports = GameController;