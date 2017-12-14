var gameData;
var userData;

$(document).ready(function () {
    // Read user & game data out hidden fields in html
    gameData  = JSON.parse($('#gameData').val());
    userData = JSON.parse($('#userData').val());

    // connect to room
    let socket = io('/game');
    socket.emit("joinRoom", gameData._id, userData._nickname);

    // receive updates
    socket.on('gameUpdate', function (msg) {
        console.log(msg);
    });
});

// TODO: add functions that listen to keypresses and emit message
// post on "postKey" with param: key and action(down/up) and gameId (gameData._id)

// TODO: post "gameOver" with param: gameId and userId when player is dead