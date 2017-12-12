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
    }
}

module.exports = Websocket;