var express = require('express');
var router = express.Router();
let redis = require('../bin/redis');

/* GET users listing. */
router.get('/', function(req, res, next) {
  redis.setString('Miel', 'Verkerken');
  console.log(redis.getString('Miel'));
  res.send('respond with a resource');
});

module.exports = router;
