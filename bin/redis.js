let redis = require("redis");
let flatten = require('flat');
let unflatten = flatten.unflatten;

class Redis {
    constructor () {
        this.client = redis.createClient();
        this.client.on('error', function (err) {
            console.error(err);
        });
    }

    async getString (key) {
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

    async setString (key, value) {
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
    async incrementString (key, amount) {
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
    async decrementString (key, amount) {
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

    // atomic increment on hash value, amount is default 1
    async incrementHashValue (hash, key, amount) {
        return new Promise((resolve, reject) => {
            if (!amount) {
                amount = 1;
            }
            this.client.hincrby(hash, key, amount, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply);
            });

        });
    }

    // atomic decrement on hash value, amount is default 1
    async decrementHashValue (hash, key, amount) {
        return new Promise((resolve, reject) => {
            if (!amount) {
                amount = 1;
            }
            this.client.hincrby(hash, key, -amount, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }

    async setObject (key, object) {
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
            return this.client.hmset(key, properties, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply === "OK");
            });
        });
    }

    async getPropObject (key, prop) {
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

    async getObject (key) {
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

    // add a value with a score for ordening to a sorted set
    async addToSortedSet (set, score, value) {
        return new Promise((resolve, reject) =>{
            this.client.zadd(set, score, value, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply === 1);
            });
        });
    }

    async removeFromSortedSet (set, value) {
        return new Promise ((resolve, reject) => {
            this.client.zrem(set, value, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply === 1);
            });
        });
    }

    // return elements from start till end in ascending order, end can be a negative index
    async getSortedValuesAscInRange (set, startIndex, endIndex) {
        return new Promise((resolve, reject) => {
            this.client.zrange(set, startIndex, endIndex, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }

    // return elements from start till end in descending order, end can be a negative index
    async getSortedValuesDesInRange (set, startIndex, endIndex) {
        return new Promise((resolve, reject) => {
            this.client.zrevrange(set, startIndex, endIndex, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }

    // return ascending rank in set of value
    async getRankAscInSet (set, value) {
        return new Promise((resolve, reject) => {
            this.client.zrank(set, value, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }

    // return ascending rank in set of value
    async getRankDesInSet (set, value) {
        return new Promise((resolve, reject) => {
            this.client.zrevrank(set, value, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }

    // return amount of elements in set
    async getCountInSet (set) {
        return new Promise((resolve, reject) => {
            this.client.zcard(set, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply);
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

    async delete (key) {
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

    async addToSet (set, key) {
        return new Promise((resolve, reject) => {
            this.client.sadd(set, key, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply === 1);
            });
        });
    }

    async removeFromSet (set, key) {
        return new Promise((resolve, reject) => {
            this.client.srem(set, key, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply === 1);
            });
        });
    }

    async containsInSet (set, key) {
        return new Promise((resolve, reject) => {
            this.client.sismember(set, key, function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply === 1);
            });
        });
    }

    // for testing purposes
    async selectDB (number) {
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
    async flushDB () {
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

    async close () {
        return new Promise((resolve, reject) => {
            this.client.quit(function (err, reply) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                return resolve(reply);
            });
        });
    }
}

// let redisInstance = new Redis();
// module exports redis connection in a wrapper
module.exports = Redis;