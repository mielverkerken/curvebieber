const gameDao = require('./gameDAO');
const GameControllerFactory=require('./gamecontrollerfactory');
const constanten = require("./const");
const GameController=require('./gamecontroller');


class Websocket {
    constructor(io) {
        this.io = io;
        io.on('connection', function (socket) {
            console.log('new connection');
            socket.on('disconnect', function () {
                console.log("connection closed");
            });

            // send current games
            gameDao.getAllGames().then(result => socket.emit('games', result));
        });
        gameDao.addObserver(this);

        let gameControllerFactory=GameControllerFactory.getInstance();

        this.gameSpace = io.of('/game');
        this.gameSpace.on('connection', function(socket){
            socket.on("joinRoom", async function (room, nickname) {
                console.log(nickname + " joined room " + room);
                socket.join(room);
                var gameController=await gameControllerFactory.getGameController(room);
                await gameController.postUser(nickname);
            });

            socket.on("postKey", async function (key, action, gameId, userId) {
                await gameControllerFactory.getGameController(gameId).postKey(key,action,userId);
                // this.updateGame(gameId, message)
            });

            socket.on("gameOver", async function (gameId, userId) {
                await gameControllerFactory.getGameController(gameId).postGameOver(userId);
            });
        });

        // broadcast periodic updates to all the gamerooms
        let updateTimer=setInterval(function () {
            for( let gamecontroller of gameControllerFactory.getAllGameControllers()){
                console.log(gamecontroller);
                instance.updateGame(gamecontroller.game._id,gamecontroller.getUpdate());
            }
        },constanten.UPDATEINTERVAL);

    }

    // Call this function to update players in game with gameId
    updateGame(gameId, message) {
        this.io.in(gameId).emit("updateGame", message);
    }

    // all users on /lobby will update their model and view 'game'
    // param => game = { status: "new/delete/update", game/id: game/id }
    updateLobby (game) {
        this.io.emit('updateLobby', game);
    }

    static getInstance (io) {
        if (!instance) {
            instance = new Websocket(io);
        }
        return instance;
    }

    update (game) {
        this.updateLobby(game);
    }
}

let instance;

module.exports = Websocket;