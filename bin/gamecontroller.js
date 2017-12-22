const gameDAO = require("./gameDAO");
const userDAO = require("./userDAO");
const constanten = require("./const");
const MoveData=require("./movedata");
const Player = require("./player");

class GameController{
    constructor (game) {
        this.game = game;
        this.roundsLeft = this.game._points;
        this.game._status = constanten.GAMESTATUS.WAITING;
        this.game._joinedPlayers = [];
        this.players = new Map();
        this.livingPlayers = new Map();
        this.ranking = [];

    }
    async postUser(userID){   //new user joined the game

        if (this.game._joinedPlayers.length !== this.game.maxPlayers && !this.players.has(userID)){
            this.game._joinedPlayers.push(userID);

            let color = constanten.COLORS[this.game._joinedPlayers.length];
            let player = new Player(userID,color);

            this.players.set(userID, player);
            this.livingPlayers.set(userID, player);
        }

        if (this.game._joinedPlayers.length === +this.game._maxPlayers){
            this.game._status = constanten.GAMESTATUS.PLAYING;
        }
        this.buildRankingTable();
        await this.updateGame();
    }
    postKey(key,action,userID){ // user pressed a button
        if (this.livingPlayers.has(userID)){
            this.livingPlayers.get(userID).postKey(key,action);
        }

    }
    getUpdate() {
        // not implemented as a real es6 Map because of problems with sending it in JSON
        let moveDataMap = {};

        if (this.game._status === constanten.GAMESTATUS.PLAYING) {
            for (let player of this.livingPlayers.values()) {
                player.calculateNextMoveData();
                moveDataMap[player.userId] = player.movedata;    // only movedata of living players are passed
            }
        }
        let data = {
            roundsLeft: this.roundsLeft,
            //playersLeftInRound: this.playersLeftInRound,
            moveDataMap: moveDataMap,
            ranking: this.ranking,
        };
        return data;
    }

    async postGameOver(userid){
        if (this.game._status === constanten.GAMESTATUS.PLAYING && this.livingPlayers.has(userid)){

            this.livingPlayers.delete(userid);
            for (let player of this.livingPlayers.values()){
                player.points++;                    //give all the living players an extra point
            }

            if (this.livingPlayers.size === 0){     // go to the next round

                this.roundsLeft--;
                this.livingPlayers = new Map(this.players);
                for (let player of this.livingPlayers.values()){
                    player.reset();    // new positions for the players
                }
                if (this.roundsLeft === 0){      // check if game is finished
                    var timer=setTimeout(function () {
                        this.game._status = constanten.GAMESTATUS.ENDED;
                    }.bind(this),constanten.ENDGAMETIME);

                    await this.updateUsers();
                    await this.updateGame();
                }
            }
            this.buildRankingTable();

        }

    }

    async updateUsers(){
        for (let player of this.players.values()){
            let user = await userDAO.getUser(player.userId);
            user.points = +user.points +player.points;
            await userDAO.updateUser(user);
        }
    }
    async updateGame(){
        await gameDAO.updateGame(this.game);
    }

    buildRankingTable(){
        this.ranking = [];
        for (let player of this.players.values()){
            this.ranking.push({nickname: player.userId, color:player.color, points: player.points});
        }
        this.ranking.sort(function (a,b) {
            return b.points - a.points;
        });
    }

}
module.exports = GameController;