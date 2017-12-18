const lineWidth = 8;
const KEYDOWN = "keydown";
const KEYUP = "keyup";

//mapping keycode on keyname that server expects
var keys=new Map();
keys.set(37,"leftkey");     //left arrow
keys.set(39,"rightkey");    //right arrow

// store previously recieved movedata for drawing lines on canvas
var previousMoveDataMap=null;

var gameData;
var userData;
var roundsLeft = undefined;

$(document).ready(function () {

    // Get canvas element and set width of curves
    let canvas=document.getElementById("curvecanvas");
    let ctx=canvas.getContext("2d");
    ctx.lineWidth=lineWidth;


    // Read user & game data out hidden fields in html
    gameData  = JSON.parse($('#gameData').val());
    userData = JSON.parse($('#userData').val());

    // Connect to room
    let socket = io('/game');
    socket.emit("joinRoom", gameData._id, userData._nickname);

    // Receives update from server and draws them on the canvas
    socket.on("updateGame", function (msg) {
        updateGame(JSON.parse(msg));
    });

    // Loops song
    startMusic();

    // Handle keyevents
    $(window).keydown(function (event) {
        handleKeyEvent(event,KEYDOWN);
    });

    $(window).keyup(function (event) {
        handleKeyEvent(event,KEYUP);
    });

    function handleKeyEvent(event,action) {
        let key = event.which || event.keyCode;
        if(keys.has(key)){
            socket.emit("postKey", keys.get(key), action, gameData._id,userData._nickname);
        }
    }

    function updateGame(data) {
        updateScoreTable(data.ranking);

        if(roundsLeft !== data.roundsLeft ){
            roundsLeft = data.roundsLeft;
            clearCanvas();
            updateRoundsLeft(roundsLeft);
            previousMoveDataMap = null;
        }

        if(roundsLeft > 0 || roundsLeft === undefined){
            let currentMoveDataMap=data.moveDataMap;
            if(Object.keys(currentMoveDataMap).length !== 0){ //Check if game is started
                if(previousMoveDataMap !== null){
                    for(let userid of Object.keys(currentMoveDataMap)){
                        checkNextCurveForUser(userid,previousMoveDataMap[userid],currentMoveDataMap[userid]);
                    }
                }
                else{
                    clearCanvas();
                }
                previousMoveDataMap = currentMoveDataMap;
            }
            else{                                           //Waiting for all players to join
                drawCanvasText("WAITING FOR OTHER PLAYERS");
            }
        }
        else{
            drawCanvasText("GAME ENDED");
        }
    }

    function checkNextCurveForUser(userId,previousMoveData,currentMoveData) {

        //Only check if user is dead when the client corresponds to this user
        if(!currentMoveData.isHole){
            if(userId === userData._nickname){
                if( !isDead(currentMoveData)){
                    drawNextCurveForUser(previousMoveData,currentMoveData);

                }
                else{
                    console.log(userId+" is dood");
                }
            } else {
                drawNextCurveForUser(previousMoveData,currentMoveData);
            }
        }
    }

    function isDead(currentMoveData) {

        var imgData=ctx.getImageData(currentMoveData.x,currentMoveData.y,1,1);

        //  If curveline has other color than backgroundcolor or crashes into the border,
        //  the player is dead

        if( (imgData.data[0] != 0 || imgData.data[1] != 0 || imgData.data[2] != 0)
                    || currentMoveData.x < lineWidth/2
                    || currentMoveData.y < lineWidth/2
                    || currentMoveData.x > canvas.width-lineWidth/2
                    || currentMoveData.y > canvas.height-lineWidth/2){

            socket.emit("gameOver",gameData._id,userData._nickname);
            return true;
        }
        else return false;
    }
    function drawNextCurveForUser(previousMoveData,currentMoveData) {

        ctx.strokeStyle = currentMoveData.color;
        ctx.beginPath();
        ctx.moveTo(previousMoveData.x, previousMoveData.y);
        ctx.lineTo(currentMoveData.x, currentMoveData.y);
        ctx.stroke();
    }

    function clearCanvas() {
        ctx.clearRect(0,0,canvas.width,canvas.height);
    }

    function drawCanvasText(text) {
        ctx.fillStyle="#FFFFFF";
        ctx.textAlign="center";
        ctx.font="50px Arial";
        ctx.fillText(text,canvas.width/2,canvas.height/2)
    }

    function startMusic() {
        let curveAudio = new Audio('/audio/curvebiebersong.mp3');

        curveAudio.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);

        curveAudio.play();
    }

    function updateRoundsLeft(roundsLeft) {
        $('#roundsLeft').text("rounds left: " + roundsLeft);
    }

    function updateScoreTable(ranking) {
        $('#scoretable').empty();
        let rank = 1;
        for(let player of ranking){
            $('#scoretable').append(
                "<tr>" +
                "<td>" + rank + "</td>" +
                "<td>" + player.nickname + "</td>" +
                "<td>" + player.points + "</td>" +
                "</tr>"
            );
            rank++;
        }
    }
});
