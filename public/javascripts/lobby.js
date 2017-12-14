var games; // map: key = gameid, value = game
var user;

$(document).ready(function () {
    console.log("document ready");
    user = JSON.parse($('#userData').val());
    var socket = io();
    socket.on('games', function (msg) {
        console.log(msg);
        games = msg;
        updateTable();
    });

    // receive updated game, update model and view
    socket.on('updateLobby', function (msg) {
        console.log(msg);
        if (msg.status === "delete") {
            delete games[msg.id];
        } else {
            games[msg.game._id] = msg.game;
        }
        updateTable();
    });
});

function updateTable () {
    $('#gametable').empty();
    for (let game in games) {
        $('#gametable').append(
            "<tr>" +
            "<td>" + games[game]._name + "</td>" +
            "<td>" + games[game]._joinedPlayers.length + "/" + games[game]._maxPlayers + "</td>" +
            "<td>"+ games[game]._status +"</td>" +
            "<td><a href='/game/" + games[game]._id + "' class='btn btn-sm btn-info btn-block'>Join</a></td>" +
            "</td>"
        );
    }
}

function createGame() {
    let name = $('#gamename').val();
    let points = $('#gamepoints').val();
    let maxPlayers = $('#gameMaxPlayers').val();
    let joinedPlayers = [user._nickname];
    console.log(name, points, maxPlayers, joinedPlayers);
    $.post("/api/game", {
        name: name,
        points: points,
        status: "Waiting",
        maxPlayers: maxPlayers,
        joinedPlayers: joinedPlayers
    }, function (data, status) {
        console.log(data, status);
    });
}