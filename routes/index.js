let express = require('express');
let router = express.Router();
let validation = require('./validation');
let validate = require('express-validation');
let userDao = require('../bin/userDAO');
let User = require('../bin/user');
let gameDao = require('../bin/gameDAO');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.user) {
        return res.render('index', { title: 'Express', user: req.session.user });
    }
    return res.render('index');
});

router.get('/lobby', function (req, res, next) {
    res.render('lobby', { user: req.session.user });
});

router.get('/rank', function (req, res, next) {
    res.render('ranking', { user: req.session.user });
});

router.get('/game/:id', async function (req, res, next) {
    let game = await gameDao.getGame(req.params.id);
    res.render('game', { user: req.session.user, game: game });
});

router.get("/login", function (req, res, next) {
    if (req.session.user) return res.redirect("/");
    res.render('login');
});

router.post("/login", validate(validation.login), async function (req, res, next) {
    try {
        let user = await userDao.getUser(req.body.nickname);
        if (req.body.password === user.password) {
            req.session.user = user;
            return res.render("index", { user: user, message: { type: "success", text: "successfully logged in"}});
        }
        return res.render('login', { message: { type: "danger", text: "incorrect password"} });
    } catch (e) {
        return res.render('login', { message: { type: "danger", text: "incorrect nickname"} });
    }
});

router.get("/register", function (req, res, next) {
    if (req.session.user) return res.redirect("/");
    res.render('register');
});

router.get("/logout", async function (req, res, next) {
    if (req.session.user) {
        req.session.destroy(function (err) {
            return res.render('login', { message: {type: "success", text: "successfully logged out"} });
        })
    }
});

router.post("/register", validate(validation.register), async function (req, res, next) {
    try {
        let user = new User(req.body.firstname, req.body.lastname, req.body.nickname, 0, req.body.password);
        await userDao.addUser(user);
        return res.render('login', { message: {type: "success", text: "successfully registered"} });
    } catch (e) {
        return res.render('register', {message: {type: "danger", text: e }});
    }
});

module.exports = router;
