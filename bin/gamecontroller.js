const gameDAO = require("gameDAO");
const userDAO = require("userDAO");
const constanten = require("const");
const Player = require("player");

class GameController{
    constructor (game) {
        this.game = game;
        this.roundsLeft = this.game.points;
        //this.playersLeftInRound = this.game.maxPlayers;
        this.game.status=constanten.GAMESTATUS.WAITING;
        this.players=new Map();
        this.livingPlayers=new Map();

    }
    async postUser(userID){   //new user joined the game
        if(this.game.joinedPlayers.length !== this.game.maxPlayers){
            this.game.joinedPlayers.push(userID);
            await gameDAO.updateGame(this.game);

            let color = constanten.COLORS[this.game.joinedPlayers.length];
            let player=new Player(userID,color);

            this.players.set(userID, player);
            this.livingPlayers.set(userID, player);
        }
        if(this.game.joinedPlayers.length === this.game.maxPlayers){
            this.gamestatus=constanten.GAMESTATUS.PLAYING;
        }
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
            movedata: [],
        };
        if(this.game.status === constanten.GAMESTATUS.PLAYING){

            for(let player of this.livingPlayers){
                player.calculateNextMoveData();
                data.movedata.push(player.movedata);    // only movedata of living players is passed
            }
        }
        return data;


    }
    postGameOver(userid){
        this.livingPlayers.delete(userid);

        for(let player of this.livingPlayers){
            player.points++;                    //give all the living players an extra point
        }

        if(this.livingPlayers.size === 0){     // go to the next round
            if(this.roundsLeft === 0){      // check if game is finished
                this.gamestatus = constanten.GAMESTATUS.ENDED;
                this.updateUsers();
                this.updateGame();
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
            let user = await userDAO.getUser(player.userID);
            user.points+=player.points;
            await userDAO.updateUser(user);
        }
    }
    async updateGame(){
        await gameDAO.updateGame(this.game);
    }
}

module.exports = GameController;