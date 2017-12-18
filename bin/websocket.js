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
            console.log("connected to game");
            socket.on("joinRoom", async function (room, nickname) {
                console.log(nickname + " joined room " + room);
                socket.join(room);
                let gameController = await gameControllerFactory.getGameController(room);
                await gameController.postUser(nickname);
            });

            socket.on("postKey", async function (key, action, gameId, userId) {
                let gameController = await gameControllerFactory.getGameController(gameId);
                gameController.postKey(key,action,userId);
            });

            socket.on("gameOver", async function (gameId, userId) {
                let gameController = await gameControllerFactory.getGameController(gameId);
                await gameController.postGameOver(userId);
            });
        });

        // broadcast periodic updates to all the gamerooms
        let updateTimer=setInterval(async function () {
            for( let gamecontroller of gameControllerFactory.getAllGameControllers()){
                if (gamecontroller.game._status !== constanten.GAMESTATUS.ENDED){
                    instance.updateGame(gamecontroller.game._id,JSON.stringify(gamecontroller.getUpdate()));
                } else{
                    console.log("game "+gamecontroller.game._id+" verwijderd");
                    await gameControllerFactory.deleteGameController(gamecontroller);

                }

                //instance.io.in(gamecontroller.game._id).emit("updateGame", gamecontroller.getUpdate());
            }
        },constanten.UPDATEINTERVAL);

    }

    // Call this function to update players in game with gameId
    updateGame(gameId, message) {
        this.gameSpace.in(gameId).emit("updateGame", message);
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