let express = require('express');
let router = express.Router();
let redis = require('../bin/redis');

// BASEURL "/api"

/* GET users listing. */
router.get('/user', async function(req, res, next) {
    let result = await redis.setString('Miel', 'Verkerken');
    console.log(result);
    res.send(result);
});

/* Post new user. */
router.post('/user', async function(req, res, next) {
    let result = await redis.getString('Miel');
    console.log(result);
    res.send(result);
});

module.exports = router;
