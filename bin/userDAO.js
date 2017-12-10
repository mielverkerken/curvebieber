let User = require("./user");
let Redis = require("./redis");

const RANK = "USERRANK";
const NICKNAMES = "NICKNAMES";
const prefix = "user:";

// CRUD operations on userobjects
// receives datasource connection in construction (we will work with redis as datasource)
class UserDAO {
    constructor (datasource) {
        this.source = datasource;
    }

    // returns nicknames of all users in order of descending rank
    async getAllUsers () {
        return await this.source.getSortedValuesDesInRange(RANK, 0, -1);
    }

    // returns full object of a user
    async getUser (nickname) {
        let result = await this.source.getObject(prefix + nickname);
        if (!result) {
            let error = new Error("No user found with nickname: " + nickname);
            error.status = 404;
            throw error;
        }
        return new User(result._firstname, result._lastname, result._nickname, result._points, result._password);
    }

    async getRank (nickname) {
        return await this.source.getRankDesInSet(RANK, nickname);
    }

    /*
     1) add nickname to set with used nicknames
     2) save user with as key user:nickname
     3) add user to ranking
     // possible improvments: use a transaction to ensure nickname is still unused
      */
    async addUser (user) {
        let usedNick = await this.source.containsInSet(NICKNAMES, user.nickname);
        if (usedNick) {
            let error = new Error("nickname is already in use");
            error.status = 409;
            throw error;
        }
        let action1, action2, action3;
        [action1, action2, action3] = await Promise.all([
            this.source.addToSet(NICKNAMES, user.nickname),
            this.source.setObject(prefix + user.nickname, user),
            this.source.addToSortedSet(RANK, user.points, user.nickname)
        ]);
        if (!action1 || !action2 || !action3) {
            console.error("something went wrong persisting a new user:", user.nickname);
            let error = new Error("something went wrong persisting a new user");
            error.status = 500;
            throw error;
        }
        return user;
    }

    /*
     1) remove nickname from set with used nicknames
     2) delete user with as key user:nickname
     3) remove user from ranking
      */
    async deleteUser (nickname) {
        let action1, action2, action3;
        [action1, action2, action3] = await Promise.all([
            this.source.removeFromSet(NICKNAMES, nickname),
            this.source.delete(prefix + nickname),
            this.source.removeFromSortedSet(RANK, nickname)
        ]);
        if (!action1 || !action2 || !action3) {
            console.error("something went wrong persisting a new user:", user.nickname);
            return false;
        }
        return true;
    }

    /*
    1) update object with key user:nickname
    2) update ranking
     */
    async updateUser (user) {
        let usedNick = await this.source.containsInSet(NICKNAMES, user.nickname);
        if (!usedNick) {
            let error = new Error("nickname is unused");
            error.status = 404;
            throw error;
        }
        await Promise.all([
            this.source.setObject(prefix + user.nickname, user),
            this.source.addToSortedSet(RANK, user.points, user.nickname)
        ]);
        return user;
    }
}

// module exports singleton userdao with currently only redis as source
// improvents: create factory that creates dao for each datasource
let userDAO = new UserDAO(new Redis());
module.exports = userDAO;