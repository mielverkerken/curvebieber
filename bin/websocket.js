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

        this.gameSpace = io.of('/game');
        this.gameSpace.on('connection', function(socket){
            console.log('connection on game');
            socket.emit('gameUpdate', 'test');
        });
    }

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