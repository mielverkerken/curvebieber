let express = require('express');
let router = express.Router();
let validation = require('./validation');
let validate = require('express-validation');
let userDao = require('../bin/userDAO');
let User = require('../bin/user');
let gameDao = require('../bin/gameDAO');
const constanten=require('../bin/const');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.user) {
        if(req.session.loggedin){
            req.session.loggedin = false;
            res.render('index', { title: 'CurveBieber', user: req.session.user, message: { type: "success", text: "successfully logged in"} });
        }
        else{
            res.render('index', { title: 'CurveBieber', user: req.session.user});
        }
    }
    else{
        res.redirect("/login");
    }
});

router.get('/lobby', function (req, res, next) {
    res.render('lobby', { user: req.session.user });
});

router.get('/rank', function (req, res, next) {
    res.render('ranking', { user: req.session.user });
});

router.get('/game/:id', async function (req, res, next) {
    let game = await gameDao.getGame(req.params.id);
    res.render('game', { user: req.session.user, game: game, canvas: {width: constanten.CANVAS.WIDTH, height: constanten.CANVAS.HEIGHT} });
});

router.get("/login", function (req, res, next) {
    if (req.session.user){
        res.redirect("/");
    }
    else if (req.session.unauthorised){
        req.session.unauthorised = false;
        res.render('login', { message: {type: "danger", text: "login before entering the restricted area"}})
    }
    else if (req.session.loggedout){
        req.session.loggedout = false;
        res.render('login', { message: {type: "success", text: "successfully logged out"} });
    }
    else if(req.session.registered){
        req.session.registered = false;
        res.render('login', { message: {type: "success", text: "successfully registered"} });
    }
    else{
        res.render('login');
    }

});

router.post("/login", validate(validation.login), async function (req, res, next) {
    try {
        let user = await userDao.getUser(req.body.nickname);
        if (req.body.password === user.password) {
            req.session.user = user;
            //return res.render("index", { user: user, message: { type: "success", text: "successfully logged in"}});
            req.session.loggedin = true;
            res.redirect("/");
        }
        else{
            res.render('login', { message: { type: "danger", text: "incorrect password"} });
        }

    } catch (e) {
        res.render('login', { message: { type: "danger", text: "incorrect nickname"} });
    }
});

router.get("/register", function (req, res, next) {
    if (req.session.user) return res.redirect("/");
    res.render('register');
});

router.get("/logout", async function (req, res, next) {
    if (req.session.user) {
        req.session.loggedout = true;
        req.session.user = null;
        res.redirect("login");
    }
});

router.post("/register", validate(validation.register), async function (req, res, next) {
    try {
        let user = new User(req.body.firstname, req.body.lastname, req.body.nickname, 0, req.body.password);
        await userDao.addUser(user);
        req.session.registered = true;
        res.redirect("login");
    } catch (e) {
        res.render('register', {message: {type: "danger", text: e }});
    }
});

module.exports = router;
