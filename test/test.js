let chai = require('chai');
let should = chai.should();

/*
###############################
Test this file using "npm test"
###############################
 */

describe('redis', function () {

    const Redis = require('../bin/redis');
    const redis = new Redis();
    const key = "key";
    const value = "value";
    const keyObject = "keyObject";
    const object = {
        id: "1",
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
        await redis.close();
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
        res.should.be.true;
        res = await redis.getObject(keyObject);
        res.should.be.eql(object);
        res = await redis.getPropObject(keyObject, "id");
        res.should.be.eql("1");
        res = await redis.getPropObject(keyObject, "prop1");
        res.should.be.eql("val1");
        res = await redis.getPropObject(keyObject, "prop2.nested1");
        res.should.be.eql("val2");
        res = await redis.getPropObject(keyObject, "prop3.2");
        res.should.be.eql("val6");
    });

    it("should be able to atomic increase/decrease a hash value", async function () {
        let res = await redis.setObject(keyObject, object);
        res.should.be.true;
        res = await redis.incrementHashValue(keyObject, "id");
        res.should.be.equal(2);
        res = await redis.decrementHashValue(keyObject, "id");
        res.should.be.equal(1);
        res = await redis.incrementHashValue(keyObject, "id", 10);
        res.should.be.equal(11);
        res = await redis.decrementHashValue(keyObject, "id", 10);
        res.should.be.equal(1);
    });

    it('should be able to add/remove keys to/from sorted set', async function () {
        const set = "testset";
        let res = await redis.addToSortedSet(set, 1, "val1");
        res.should.be.true;
        res = await redis.removeFromSortedSet(set, "val1");
        res.should.be.true;
    });

    it('should be able to do functions on a sorted set', async function () {
        const set = "testset";
        let res = await redis.addToSortedSet(set, 1, "val1");
        res.should.be.true;
        res = await redis.addToSortedSet(set, 2, "val2");
        res.should.be.true;
        res = await redis.addToSortedSet(set, 3, "val3");
        res.should.be.true;
        res = await redis.getSortedValuesAscInRange(set, 0, -1);
        res.should.be.eql(["val1", "val2", "val3"]);
        res = await redis.getSortedValuesDesInRange(set, 0, -1);
        res.should.be.eql(['val3', 'val2', 'val1']);
        res = await redis.getRankAscInSet(set, 'val1');
        res.should.be.eql(0);
        res = await redis.getRankDesInSet(set, 'val3');
        res.should.be.eql(0);
        res = await redis.getCountInSet(set);
        res.should.be.eql(3);
    });

    it('should be able to add/remove keys and check existing keys in a set', async function () {
        const set = "testset";
        let res = await redis.addToSet(set, "val1");
        res.should.be.true;
        res = await redis.containsInSet(set, "val1");
        res.should.be.true;
        res = await redis.containsInSet(set, "val2");
        res.should.be.false;
        res = await redis.removeFromSet(set, "val1");
        res.should.be.true;
        res = await redis.containsInSet(set, "val1");
        res.should.be.false;
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

// improve: mock redis object and pass it throw constructor of userDAO to only test userdao without dependencies
describe("UserDAO", function () {
    const userDAO = require('../bin/userDAO');
    const User = require('../bin/user');
    const Redis = require('../bin/redis');
    const redis = new Redis();
    const user = new User("Miel", "Verkerken", "epicmieltime", "1");
    const user2 = new User("Robin", "Dejonckheere", "fluffy boi", "2");

    before(async function () {
        // change to empty db for testing
        await redis.selectDB(1);
        await userDAO.source.selectDB(1);
    });

    beforeEach(async function () {
        // start from empty db every test
        await redis.flushDB();
    });

    after(async function () {
        // flush testdata and change back to original db
        await redis.flushDB();
        await redis.selectDB(0);
        await userDAO.source.close();
        await redis.close();
    });

    it("should be able to add/get a user", async function () {
        let res = await userDAO.addUser(user);
        res.should.be.true;
        res = await userDAO.getUser(user.nickname);
        res.should.eql(user);
    });

    it("should be able to getAllUsers", async function () {
        let res = await userDAO.addUser(user);
        res.should.be.true;
        res = await userDAO.addUser(user2);
        res.should.be.true;
        res = await userDAO.getAllUsers();
        res.should.eql(["fluffy boi", "epicmieltime"]);
    });

    it("should be able to get rank of a user", async function () {
        let res = await userDAO.addUser(user);
        res.should.be.true;
        res = await userDAO.addUser(user2);
        res.should.be.true;
        res = await userDAO.getRank(user.nickname);
        res.should.be.eql(1);
    });

    it("should be able to delete a user", async function () {
        let res = await userDAO.addUser(user);
        res.should.be.true;
        res = await userDAO.addUser(user2);
        res.should.be.true;
        res = await userDAO.deleteUser(user.nickname);
        res.should.be.true;
        res = await userDAO.getUser(user.nickname);
        (res === null).should.be.true;
        res = await userDAO.getRank(user.nickname);
        (res === null).should.be.true;
        res = await userDAO.source.containsInSet("NICKNAMES", user.nickname);
        res.should.be.false;
    });

    it("should be able to update a user", async function () {
        let res = await userDAO.addUser(user);
        res.should.be.true;
        res = await userDAO.addUser(user2);
        res.should.be.true;
        user.points = "10";
        res = await userDAO.updateUser(user);
        res.should.be.true;
        res = await userDAO.getRank(user.nickname);
        res.should.eql(0);
        res = await userDAO.getUser(user.nickname);
        res.should.eql(user);
    });
});

// improve: mock redis object and pass it throw constructor of gameDAO to only test userdao without dependencies
describe("GameDAO", function () {
    const gameDAO = require('../bin/gameDAO');
    const Game = require('../bin/game');
    const game1 = new Game("Game1", "10", "waiting", "4", ["epicmieltime", "fluffy boi"]);
    const game2 = new Game("Game1", "15", "ended", "6", ["fluffy boi", "epicmieltime"]);

    before(async function () {
        // change to empty db for testing
        await gameDAO.source.selectDB(1);
    });

    beforeEach(async function () {
        // start from empty db every test
        await gameDAO.source.flushDB();
    });

    after(async function () {
        // flush testdata and change back to original db
        await gameDAO.source.flushDB();
        await gameDAO.source.selectDB(0);
        await gameDAO.source.close();
    });

    it("should be able to add/get a game", async function () {
        let res = await gameDAO.addGame(game1);
        res = await gameDAO.getGame(res);
        (res._name).should.eql(game1.name);
        (res._points).should.eql(game1.points);
        (res._status).should.eql(game1.status);
        (res._maxPlayers).should.eql(game1.maxPlayers);
        (res._joinedPlayers).should.eql(game1.joinedPlayers);
    });

    it("should be able to get all games", async function () {
        await gameDAO.addGame(game1);
        await gameDAO.addGame(game2);
        let res = await gameDAO.getAllGemes();
        res.should.have.length(2);
    });

    it("should be able to delete a game", async function () {
        let res = await gameDAO.addGame(game1);
        res.should.not.be.false;
        res = await gameDAO.addGame(game2);
        res.should.not.be.false;
        res = await gameDAO.deleteGame(game1.id);
        res.should.be.true;
        res = await gameDAO.getGame(game1.id);
        (res === null).should.be.true;
        res = await gameDAO.getAllGemes();
        res.should.have.length(1);
    });

    it("should be able to update a game", async function () {
        let res = await gameDAO.addGame(game1);
        res.should.not.be.false;
        game1.name = "New Name";
        res = await gameDAO.updateGame(game1);
        res = await gameDAO.getGame(game1.id);
        (res._name).should.eql(game1.name);
        res = await gameDAO.getAllGemes();
        res.should.have.length(1);
    });
});