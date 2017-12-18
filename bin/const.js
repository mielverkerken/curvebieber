module.exports = {
    KEYDOWN: "keydown",
    KEYUP: "keyup",
    LEFTKEY: 'leftkey',
    RIGHTKEY: 'rightkey',
    UPDATEINTERVAL: 20, // update interval for game in ms
    CANVAS: {
        WIDTH: 850,
        HEIGHT: 750,
    },
    GAMESTATUS: {
        ENDED: "ended",
        WAITING: "waiting",
        PLAYING: "playing",
    },
    COLORS: [
                "rgb(255, 255, 0)",
                "rgb(0, 102, 255)",
                "rgb(255, 153, 255)",
                "rgb(255, 0, 0)",
                "rgb(255, 255, 255)",
                "rgb(0, 153, 0)",
                "rgb(102, 51, 0)",
                "rgb(255, 153, 0)",
            ],
    SPEEDMULTIPLIER: 0.35 ,   // smaller => higher speed //350
    ROTATIONRADIUSMULTIPLIER: 0.45,    // smaller => wider rotation
    HOLELENGTHMULTIPLIER: 10,   // smaller => smaller hole
    MEANHOLEPERIOD: 2000,   // the mean period at which a hole appears in the curve line
    SPANDISTANCEFROMBORDER: 50, // the minimum spawndistance from the canvas border
    ENDGAMETIME: 1000,  //time (in ms) to wait before ending the game (give clients possibility to render last results)
};