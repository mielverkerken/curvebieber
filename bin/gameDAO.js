let Game = require("./game");
let Redis = require("./redis");

const GAMES = "GAMES";
const prefix = "game:";
const latestUsedId = "LATESTGAMEID";

// CRUD operations on gameobjects
// receives datasource connection in construction (we will work with redis as datasource)
class GameDAO {
    constructor (datasource) {
        this.source = datasource;
    }

    // return all games form newest to oldest
    async getAllGemes () {
        return await this.source.getSortedValuesDesInRange(GAMES, 0, -1);
    }

    async getGame (id) {
        let result = await this.source.getObject(prefix + id);
        if (!result) {
            let error = new Error("No game found with id: " + id);
            error.status = 404;
            throw error;
        }
        return result;
    }

    // gives a game an id, adds it to redis and add it in ordered set of games sorted on timestamp
    async addGame (game) {
        game.id = await this.source.incrementString(latestUsedId);
        let action1, action2;
        [action1, action2] = await Promise.all([
            this.source.setObject(prefix + game.id, game),
            this.source.addToSortedSet(GAMES, game.timestamp, game.id)
        ]);
        if (!action1 || !action2) {
            console.error("something went adding game");
            let error = new Error("something went wrong persisting a new game");
            error.status = 500;
            throw error;
        }
        return game;
    }

    // delete game from ordered set en delete object
    async deleteGame (id) {
        let action1, action2;
        [action1, action2] = await Promise.all([
            this.source.removeFromSortedSet(GAMES, id),
            this.source.delete(prefix + id)
        ]);
        if (!action1 || !action2) {
            console.error("something went wrong deleting game");
            return false;
        }
        return true;
    }

    // update timestamp in set needed?
    async updateGame (game) {
        let exists = await this.source.getObject(prefix + game.id);
        if (!exists) {
            let error = new Error("game is not found");
            error.status = 404;
            throw error;
        }
        await this.source.setObject(prefix + game.id, game);
        return game;
    }
}

// module exports singleton gamedao with currently only redis as source
// improvents: create factory that creates dao for each datasource
let gameDAO = new GameDAO(new Redis());
module.exports = gameDAO;