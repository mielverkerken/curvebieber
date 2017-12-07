let express = require('express');
let router = express.Router();
let userDAO = require('../bin/userDAO');
let gameDAO = require('../bin/gameDAO');
let User = require('../bin/user');
let Game = require('../bin/game');

// BASEURL "/api"
// TODO:  create class for creating json response

/*
####################
REST ROUTES FOR USER
####################
 */

/* GET users listing. */
router.get('/user', async function(req, res, next) {
    res.send(await userDAO.getAllUsers());
});

/* Post new user. */
router.post('/user', async function(req, res, next) {
    let user = new User(req.body.firstname, req.body.lastname, req.body.nickname, 0);
    res.send(await userDAO.addUser(user));
});

// get specific user with nickname
router.get('/user/:nickname', async function (req, res, next) {
    res.send(await userDAO.getUser(req.params.nickname));
});

// update specific user with nickname
router.post('/user/:nickname', async function (req, res, next) {
    let user = new User(req.body.firstname, req.body.lastname, req.body.nickname, req.body.points);
    res.send(await userDAO.updateUser(user));
});

/*
####################
REST ROUTES FOR GAME
####################
 */

// get all games
router.get('/game', async function (req, res, next) {
    res.send(await gameDAO.getAllGemes());
});

// add new game
router.post('/game', async function (req, res, next) {
    let game = new Game(req.body.name, req.body.points, req.body.status, req.body.maxPlayers, req.body.joinedPlayers);
    let result = { id: await gameDAO.addGame(game) };
    res.send(result);
});

// get specific game with id
router.get('/game/:id', async function (req, res, next) {
    res.send(await gameDAO.getGame(req.params.id));
});

// update specific game with id
router.post('/game/:id', async function (req, res, next) {
    let game = new Game(req.body.name, req.body.points, req.body.status, req.body.maxPlayers, req.body.joinedPlayers);
    game.id = req.params.id;
    res.send(await gameDAO.updateGame(game));
});
module.exports = router;
