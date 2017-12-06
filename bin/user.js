class User {
    constructor (firstname, lastname, nickname, points) {
        this._firstname = firstname;
        this._lastname = lastname;
        this._nickname = nickname;
        this._points = points;
    }

    get firstname() {
        return this._firstname;
    }

    set firstname(value) {
        this._firstname = value;
    }

    get lastname() {
        return this._lastname;
    }

    set lastname(value) {
        this._lastname = value;
    }

    get nickname() {
        return this._nickname;
    }

    set nickname(value) {
        this._nickname = value;
    }

    get points() {
        return this._points;
    }

    set points(value) {
        this._points = value;
    }
}

module.exports = User;