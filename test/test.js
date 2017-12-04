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