let redis = require("redis");
let flatten = require('flat');
let unflatten = flatten.unflatten;

class Redis {
    constructor() {
        this.client = redis.createClient();
        this.client.on('error', function (err) {
            console.error(err);
        });
    }

    async getString(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, function (err, result) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }

    async setString(key, value) {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }

    // atomic increment, amount is default 1
    async incrementString(key, amount) {
        return new Promise((resolve, reject) => {
            if (amount) {
                this.client.incrby(key, amount, function (err, reply) {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    return resolve(reply);
                });
            } else {
                this.client.incr(key, function (err, reply) {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    return resolve(reply);
                });
            }
        });
    }

    // atomic decrement, amount is default 1
    async decrementString(key, amount) {
        return new Promise((resolve, reject) => {
            if (amount) {
                this.client.decrby(key, amount, function (err, reply) {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    return resolve(reply);
                });
            } else {
                this.client.decr(key, function (err, reply) {
                    if (err) {
                        console.error(err);
                        return reject(err);
                    }
                    return resolve(reply);
                });
            }
        });
    }

    async setObject(key, object) {
        return new Promise((resolve, reject) => {
            // create object with only 1 level deep properties
            let flatObject = flatten(object);
            // push prop with value in array
            let properties = [];
            for (let prop in flatObject) {
                properties.push(prop);
                properties.push(flatObject[prop]);
            }
            // set mulitple properties in redis
            this.client.hmset(key, properties, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }

    async getPropObject(key, prop) {
        return new Promise((resolve, reject) => {
            this.client.hget(key, prop, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }

    async getObject(key) {
        return new Promise((resolve, reject) => {
            this.client.hgetall(key, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(unflatten(reply));
            });
        });
    }

    // return 1 (true) if key exists else 0 (false)
    async exists(key) {
        return new Promise((resolve, reject) => {
            this.client.exists(key, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply === 1);
            });
        });
    }

    async delete(key) {
        return new Promise((resolve, reject) => {
            this.client.del(key, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply === 1);
            });
        });
    }

    // for testing purposes
    async selectDB(number) {
        return new Promise((resolve, reject) => {
            this.client.select(number, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }

    // for testing purposes
    async flushDB() {
        return new Promise((resolve, reject) => {
            this.client.flushdb(function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }
}

let redisInstance = new Redis();

module.exports = redisInstance;