let redis = require("redis");
let flatten = require('flat');
let unflatten = flatten.unflatten;
let bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);

class Redis {
    constructor () {
        this.client = redis.createClient();
        this.client.on('error', function (err) {
            console.error(err);
        });
    }

    getString (key) {
        return this.client.getAsync(key).then(result => result);
    }

    setString (key, value) {
        return this.client.setAsync(key, value).then(reply => reply);
    }

    // atomic increment, amount is default 1
    incrementString (key, amount) {
        if (amount) {
            return this.client.incrbyAsync(key, amount).then(reply => reply);
        } else {
            return this.client.incrAsync(key).then(reply => reply);
        }
    }

    // atomic decrement, amount is default 1
    decrementString (key, amount) {
        if (amount) {
            return this.client.decrbyAsync(key, amount).then(reply => reply);
        } else {
            return this.client.decrAsync(key).then(reply => reply);
        }
    }

    // atomic increment on hash value, amount is default 1
    incrementHashValue (hash, key, amount = 1) {
        return this.client.hincrbyAsync(hash, key, amount).then(reply => reply);
    }

    // atomic decrement on hash value, amount is default 1
    decrementHashValue (hash, key, amount = 1) {
        return this.client.hincrbyAsync(hash, key, -amount).then(reply => reply);
    }

    setObject (key, object) {
        // create object with only 1 level deep properties
        let flatObject = flatten(object);
        // push prop with value in array
        let properties = [];
        for (let prop in flatObject) {
            properties.push(prop);
            properties.push(flatObject[prop]);
        }
        // set mulitple properties in redis
        return this.client.hmsetAsync(key, properties).then(reply => reply === "OK");
    }

    getPropObject (key, prop) {
        return this.client.hgetAsync(key, prop).then(reply => reply);
    }

    getObject (key) {
        return this.client.hgetallAsync(key).then(reply => unflatten(reply));
    }

    // add a value with a score for ordening to a sorted set
    addToSortedSet (set, score, value) {
            return this.client.zaddAsync(set, score, value).then(reply => reply === 1);
    }

    removeFromSortedSet (set, value) {
        return this.client.zremAsync(set, value).then(reply => reply === 1);
    }

    // return elements from start till end in ascending order, end can be a negative index
    getSortedValuesAscInRange (set, startIndex, endIndex) {
        return this.client.zrangeAsync(set, startIndex, endIndex).then(reply => reply);
    }

    // return elements from start till end in descending order, end can be a negative index
    getSortedValuesDesInRange (set, startIndex, endIndex) {
        return this.client.zrevrangeAsync(set, startIndex, endIndex).then(reply => reply);
    }

    // return ascending rank in set of value
    getRankAscInSet (set, value) {
        return this.client.zrankAsync(set, value).then(reply => reply);
    }

    // return ascending rank in set of value
    getRankDesInSet (set, value) {
        return this.client.zrevrankAsync(set, value).then(reply => reply);
    }

    // return amount of elements in set
    getCountInSet (set) {
        return this.client.zcardAsync(set).then(reply => reply);
    }

    // return 1 (true) if key exists else 0 (false)
    exists(key) {
        return this.client.existsAsync(key).then(reply => reply === 1);
    }

    delete (key) {
        return this.client.delAsync(key).then(reply => reply === 1);
    }

    addToSet (set, key) {
        return this.client.saddAsync(set, key).then(reply => reply === 1);
    }

    removeFromSet (set, key) {
        return this.client.sremAsync(set, key).then(reply => reply === 1);
    }

    containsInSet (set, key) {
        return this.client.sismemberAsync(set, key).then(reply => reply === 1);
    }

    // for testing purposes
    selectDB (number) {
        return this.client.selectAsync(number).then(reply => reply);
    }

    // for testing purposes
    flushDB () {
        return this.client.flushdbAsync().then(reply => reply);
    }

    close () {
        return this.client.quitAsync().then(reply => reply);
    }
}

// let redisInstance = new Redis();
// module exports redis connection in a wrapper
module.exports = Redis;