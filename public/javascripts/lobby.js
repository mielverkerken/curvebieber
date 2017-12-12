$(document).ready(function () {
    console.log("document ready");
    var socket = io();
    socket.on('games', function (msg) {
        console.log(msg);
        $('#gametable').html = "";
        msg.forEach(function (game) {
            $('#gametable').append(
                "<tr>" +
                    "<td>" + game._name + "</td>" +
                    "<td>" + game._joinedPlayers.length + "/" + game._maxPlayers + "</td>" +
                    "<td>"+ game._status +"</td>" +
                    "<td><a href='#' class='btn btn-sm btn-info btn-block'>Join</a></td>" +
                "</td>"
            );
        })
    });
});