$(document).ready(function () {
    console.log("document ready");
    let socket = io('/game');
    socket.on('gameupdate', function (msg) {
        console.log(msg);
    });
});