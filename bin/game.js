class Game {
    constructor (name, points, status, maxPlayers, joinedPlayers) {
        this._name = name;
        this._points = points;
        this._status = status;
        this._maxPlayers = maxPlayers;
        this._joinedPlayers = joinedPlayers;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get points() {
        return this._points;
    }

    set points(value) {
        this._points = value;
    }

    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
    }

    get maxPlayers() {
        return this._maxPlayers;
    }

    set maxPlayers(value) {
        this._maxPlayers = value;
    }

    get joinedPlayers() {
        return this._joinedPlayers;
    }

    set joinedPlayers(value) {
        this._joinedPlayers = value;
    }
}

module.exports = Game;