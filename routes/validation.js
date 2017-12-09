let Joi = require('joi');

const MAXCHAR = 30;

// used as input validation on routes

let newUser = {
    body: {
        firstname: Joi.string().max(MAXCHAR).required(),
        lastname: Joi.string().max(MAXCHAR).required(),
        nickname: Joi.string().max(MAXCHAR).required()
    }
};

let updateUser = {
    body: {
        firstname: Joi.string().max(MAXCHAR).required(),
        lastname: Joi.string().max(MAXCHAR).required(),
        nickname: Joi.string().max(MAXCHAR).required(),
        points: Joi.number().required()
    }
};

let newGame = {
    body: {
        name: Joi.string().max(MAXCHAR).required(),
        points: Joi.number().required(),
        status: Joi.string().max(MAXCHAR).required(),
        maxPlayers: Joi.number().required(),
        joinedPlayers: Joi.array().required()
    }
};

let updateGame = {
    body: {
        name: Joi.string().max(MAXCHAR).required(),
        points: Joi.number().required(),
        status: Joi.string().max(MAXCHAR).required(),
        maxPlayers: Joi.number().required(),
        joinedPlayers: Joi.array().required()
    }
};

let register = {
    body: {
        firstname: Joi.string().max(MAXCHAR).required(),
        lastname: Joi.string().max(MAXCHAR).required(),
        nickname: Joi.string().max(MAXCHAR).required(),
        password: Joi.string().max(MAXCHAR).required()
    }
};

let login = {
    body: {
        nickname: Joi.string().max(MAXCHAR).required(),
        password: Joi.string().max(MAXCHAR).required(),
    }
};

module.exports = {
    newUser: newUser,
    updateUser: updateUser,
    newGame: newGame,
    updateGame: updateGame,
    login: login,
    register: register
};