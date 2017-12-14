const gameDao = require('./gameDAO');

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

        // TODO: create gameControllerFactory that create a gamecontroller if it doesn't
        // TODO: exists and returns gamecontroller

        this.gameSpace = io.of('/game');
        this.gameSpace.on('connection', function(socket){
            socket.on("joinRoom", function (room, nickname) {
                console.log(nickname + " joined room " + room);
                socket.join(room);
                // TODO: let gamecontroller know that player joined
            });

            socket.on("postKey", function (key, action, gameId, userId) {
                // TODO: process action and send location to players
                // this.updateGame(gameId, message)
            });

            socket.on("gameOver", function (gameId, userId) {
                // TODO: let gamecontroller know player died
            });
        });
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