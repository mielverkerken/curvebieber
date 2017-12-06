class Game {
    constructor (name, points, status, maxPlayers, joinedPlayers) {
        this._name = name;
        this._points = points;
        this._status = status;
        this._maxPlayers = maxPlayers;
        this._joinedPlayers = joinedPlayers;
        this._timestamp = Date.now();
        this._id = null;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
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

    get timestamp() {
        return this._timestamp;
    }

    set timestamp(value) {
        this._timestamp = value;
    }
}

module.exports = Game;