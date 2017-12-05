let chai = require('chai');
let should = chai.should();

/*
###############################
Test this file using "npm test"
###############################
 */

describe('redis', function () {

    const redis = require('../bin/redis');
    const key = "key";
    const value = "value";
    const keyObject = "keyObject";
    const object = {
        prop1: "val1",
        prop2: {
            nested1 : "val2",
            nested2 : "val3"
        },
        prop3: ["val4", "val5", "val6"]
    };
    const OKReply = "OK";

    before(async function () {
        // change to empty db for testing
        await redis.selectDB(1);
    });

    beforeEach(async function () {
        // start from empty db every test
        await redis.flushDB();
    });

    after(async function () {
        // flush testdata and change back to original db
        await redis.flushDB();
        await redis.selectDB(0);
    });

    it('should be able to add/get a key-value pair', async function () {
        let res = await redis.setString(key, value);
        res.should.be.equal(OKReply);
        res = await redis.getString(key);
        res.should.be.equal(value);
    });

    it("should be able to atomic increase/decrease a string", async function () {
        let res = await redis.setString(key, "1");
        res = await redis.incrementString(key);
        res.should.be.equal(2);
        res = await redis.decrementString(key);
        res.should.be.equal(1);
        res = await redis.incrementString(key, 10);
        res.should.be.equal(11);
        res = await redis.decrementString(key, 10);
        res.should.be.equal(1);
    });

    it('should be able to add/get an object', async function () {
        let res = await redis.setObject(keyObject, object);
        res.should.equal(OKReply);
        res = await redis.getObject(keyObject);
        res.should.be.eql(object);
        res = await redis.getPropObject(keyObject, "prop1");
        res.should.be.eql("val1");
        res = await redis.getPropObject(keyObject, "prop2.nested1");
        res.should.be.eql("val2");
        res = await redis.getPropObject(keyObject, "prop3.2");
        res.should.be.eql("val6");
    });

    it('should be able to check if key exists', async function () {
        let res = await redis.setString(key, value);
        res.should.be.equal(OKReply);
        res = await redis.exists(key);
        res.should.be.true;
    });

    it('should be able to delete a key', async function () {
        let res = await redis.setString(key, value);
        res.should.be.equal(OKReply);
        res = await redis.delete(key);
        res.should.be.true;
    });
});

describe('User', function () {
    const User = require('../bin/user');

    it('should be able to create a instance of User', function () {
        let user = new User();
        user.should.be.an.instanceof(User);
    });

    it('should be able to use getters and setters', function () {
        let user = new User("Miel", "Verkerken", "epicmieltime", 99);
        user.should.be.an.instanceof(User);
        user.should.have.property('firstname', 'Miel');
        user.should.have.property('lastname', 'Verkerken');
        user.should.have.property('nickname', 'epicmieltime');
        user.should.have.property('points', 99);
        user.firstname = "Robin";
        user.lastname = "Dejonckheere";
        user.nickname = "fluffy boi";
        user.points = 1;
        user.should.have.property('firstname', 'Robin');
        user.should.have.property('lastname', 'Dejonckheere');
        user.should.have.property('nickname', 'fluffy boi');
        user.should.have.property('points', 1);
    });
});

describe('Game', function () {
    const Game = require('../bin/game');

    it('should be able to create a instance of Game', function () {
        let game = new Game();
        game.should.be.an.instanceof(Game);
    });

    it('should be able to use getters and setters', function () {
        let game = new Game("Game1", 10, "waiting", 8, []);
        game.should.be.an.instanceof(Game);
        game.should.have.property('name', 'Game1');
        game.should.have.property('points', 10);
        game.should.have.property('status', 'waiting');
        game.should.have.property('maxPlayers', 8);
        game.should.have.deep.property('joinedPlayers', []);
        game.name = "Game63";
        game.points = 15;
        game.status = "started";
        game.maxPlayers = 4;
        game.joinedPlayers = ["fluffy boi", "epicmieltime"];
        game.should.have.property('name', 'Game63');
        game.should.have.property('points', 15);
        game.should.have.property('status', 'started');
        game.should.have.property('maxPlayers', 4);
        game.should.have.deep.property('joinedPlayers', ["fluffy boi", "epicmieltime"]);
    });
});