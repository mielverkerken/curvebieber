let redis = require("redis");

class Redis {
    constructor () {
        this.client = redis.createClient();
        this.client.on('error', function (err) {
            console.error(err);
        });
    }

    async getString (key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, function (error, result) {
                if (error) {
                    console.error(err);
                    reject(err);
                }
                resolve(result);
            });
        });
    }
    
    async setString (key, value) {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, function (err, reply) {
                if (err) {
                    console.error(err);
                    reject(err);
                }
                resolve(reply);
            });
        });
    }
}

let redisInstance = new Redis();

module.exports = redisInstance;