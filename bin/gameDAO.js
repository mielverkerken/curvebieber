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
        this.observers = []; // observer pattern
    }

    // return all games form newest to oldest
    async getAllGames () {
        let games = await Promise.all((await this.source.getSortedValuesDesInRange(GAMES, 0, -1)).map(id => this.getGame(id)));
        let result = {};
        games.forEach(game => result[game._id] = game);
        return result;
    }

    async getGame (id) {
        let result = await this.source.getObject(prefix + id);
        if (!result) {
            let error = new Error("No game found with id: " + id);
            error.status = 404;
            throw error;
        }
        let game = new Game(result._name, result._points, result._status, result._maxPlayers, result._joinedPlayers);
        game._id=result._id;
        return game;
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
        this.notify( { game: game, status: "new" });
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
        this.notify( { id: id, status: "delete" });
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
        this.notify( { game: game, status: "update" });
        return game;
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notify (game) {
        this.observers.forEach(observer => observer.update(game));
    }
}

// module exports singleton gamedao with currently only redis as source
// improvents: create factory that creates dao for each datasource
let gameDAO = new GameDAO(new Redis());
module.exports = gameDAO;