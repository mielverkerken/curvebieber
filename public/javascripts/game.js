const lineWidth = 8;
const KEYDOWN = "keydown";
const KEYUP = "keyup";

//mapping keycode on keyname that server expects
var keys=new Map();
keys.set(37,"leftkey");
keys.set(39,"rightkey");

// store previously recieved movedata for drawing lines on canvas
var previousMoveDataMap=null;

var gameData;
var userData;

$(document).ready(function () {

    // get canvas element and set width of curves
    let canvas=document.getElementById("curvecanvas");
    let ctx=canvas.getContext("2d");
    ctx.lineWidth=lineWidth;

    // Read user & game data out hidden fields in html
    gameData  = JSON.parse($('#gameData').val());
    userData = JSON.parse($('#userData').val());

    // connect to room
    let socket = io('/game');
    socket.emit("joinRoom", gameData._id, userData._nickname);

    // receives update from server and draws them on the canvas
    socket.on('gameUpdate', function (msg) {
        console.log(msg);
        drawNextCurves(JSON.parse(msg));
    });

    // loop song
    let curveAudio = new Audio('/audio/curvebiebersong.mp3');

    curveAudio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

    curveAudio.play();

    // handle keyevents
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
    function drawNextCurves(data) {
        let roundLeft=data.roundsLeft;
        if(roundLeft>=0){                           //TODO: check if >= or >
            let currentMoveDataMap=data.moveDataMap;
            if(currentMoveDataMap.size !== 0){ //check if game is started
                if(previousMoveDataMap !== null){
                    for(let userid of currentMoveDataMap.keys()){
                        console.log(currentMoveDataMap.get(userid).x+", "currentMoveDataMap.get(userid).y);
                        checkAndDrawNextCurveForUser(previousMoveDataMap.get(userid),currentMoveDataMap.get(userid));

                    }
                }
                previousMoveDataMap=currentMoveDataMap;
            }
        }
    }
    function checkAndDrawNextCurveForUser(userId,previousMoveData,currentMoveData) {
        //only check if user is dead if the client corresponds to this user
        if(userId === userData._nickname && !isDead(currentMoveData)){
            drawCurveForUser(previousMoveData,currentMoveData);
        } else if (userId !== userData._nickname){
            drawCurveForUser(previousMoveData,currentMoveData);
        }
    }
    function isDead(currentMoveData) {
        //TODO: optimize window that should be checked for background collor
        var imgData=ctx.getImageData(currentMoveData.x,currentMoveData.y,1,1);
        //if canvas has other color than backgroundcolor, the player is dead
        if(imgData[0] !== 0 && imgData[1] !== 0 && imgData[2]!== 0){
            socket.emit("gameOver",gameData._id,userData._nickname);
            return true;
        }
        else return false;
    }
    function drawCurveForUser(previousMoveData,currentMoveData) {
        ctx.strokeStyle=previousMoveData.color;
        ctx.moveTo(previousMoveData.x,previousMoveData.y);
        ctx.lineTo(currentMoveData.x,currentMoveData.y);
    }

});




// TODO: post "gameOver" with param: gameId and userId when player is dead