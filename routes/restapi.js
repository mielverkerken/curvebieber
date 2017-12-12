let express = require('express');
let router = express.Router();
let userDAO = require('../bin/userDAO');
let gameDAO = require('../bin/gameDAO');
let User = require('../bin/user');
let Game = require('../bin/game');
let validation = require('./validation');
let validate = require('express-validation');

// BASEURL "/api"

function createResponse (statusCode = 200, message = "success", json) {
    let result = {
        meta: {
            status: statusCode,
            message: message
        }
    };
    if (json) {
        result.data = json;
    }
    return result;
}

/*
####################
REST ROUTES FOR USER
####################
 */

/* GET users listing. */
router.get('/user', async function(req, res, next) {
    let status, message, data;
    try {
        data = await userDAO.getAllUsers();
        status = 200;
    } catch (e) {
        console.error(e);
        status = 500;
        message = e.message;
    }
    status = status ? status : 500;
    res.status(status).send(createResponse(status, message, data));
});

/* Post new user. */
router.post('/user', validate(validation.newUser), async function(req, res, next) {
    let status, message, data;
    try{
        let user = new User(req.body.firstname, req.body.lastname, req.body.nickname, 0);
        data = await userDAO.addUser(user);
        status = 200;
    } catch (e) {
        console.error(e);
        status = e.status;
        message = e.message;
    }
    status = status ? status : 500;
    res.status(status).send(createResponse(status, message, data));
});

// get specific user with nickname
router.get('/user/:nickname', async function (req, res, next) {
    let status, message, data;
    try {
        data = await userDAO.getUser(req.params.nickname);
        status = 200;
    } catch (e) {
        console.error(e);
        status = e.status;
        message = e.message;
    }
    status = status ? status : 500;
    res.status(status).send(createResponse(status, message, data));
});

// update specific user with nickname
router.post('/user/:nickname', validate(validation.updateUser), async function (req, res, next) {
    let status, message, data;
    try {
        let user = new User(req.body.firstname, req.body.lastname, req.body.nickname, req.body.points);
        data = await userDAO.updateUser(user);
        status = 200;
    } catch (e) {
        console.error(e);
        status = e.status;
        message = e.message;
    }
    status = status ? status : 500;
    res.status(status).send(createResponse(status, message, data));
});

/*
####################
REST ROUTES FOR GAME
####################
 */

// get all games
router.get('/game', async function (req, res, next) {
    let status, message, data;
    try {
        data = await gameDAO.getAllGames();
        status = 200;
    } catch (e) {
        console.error(e);
        status = 500;
        message = e.message;
    }
    status = status ? status : 500;
    res.status(status).send(createResponse(status, message, data));
});

// add new game
router.post('/game', validate(validation.newGame), async function (req, res, next) {
    let status, message, data;
    try{
        let game = new Game(req.body.name, req.body.points, req.body.status, req.body.maxPlayers, req.body.joinedPlayers);
        status = 200;
        data = await gameDAO.addGame(game);
    } catch (e) {
        console.error(e);
        status = e.status;
        message = e.message;
    }
    status = status ? status : 500;
    res.status(status).send(createResponse(status, message, data));
});

// get specific game with id
router.get('/game/:id', async function (req, res, next) {
    let status, message, data;
    try {
        data = await gameDAO.getGame(req.params.id);
        status = 200;
    } catch (e) {
        console.error(e);
        status = e.status;
        message = e.message;
    }
    status = status ? status : 500;
    res.status(status).send(createResponse(status, message, data));
});

// update specific game with id
router.post('/game/:id', validate(validation.updateGame), async function (req, res, next) {
    let status, message, data;
    try {
        let game = new Game(req.body.name, req.body.points, req.body.status, req.body.maxPlayers, req.body.joinedPlayers);
        game.id = req.params.id;
        data = await gameDAO.updateGame(game);
        status = 200;
    } catch (e) {
        console.error(e);
        status = e.status;
        message = e.message;
    }
    status = status ? status : 500;
    res.status(status).send(createResponse(status, message, data));
});
module.exports = router;
