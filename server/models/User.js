const mongoose = require('mongoose');
const CONSTANTS = require('../constants');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 5,
        maxLength: 64,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 200,
        required: true,
    },
    achievements: {
        icons: {
            bishop: { type: Number, default: 0 },
            horse: { type: Number, default: 0 },
            rook: { type: Number, default: 0 },
            ferz: { type: Number, default: 0 },
            king: { type: Number, default: 0 },
            soldier: { type: Number, default: 0 },

            elephant: { type: Number, default: 0 },
            firzan: { type: Number, default: 0 },
            knight: { type: Number, default: 0 },
            prince: { type: Number, default: 0 },
            duke: { type: Number, default: 0 },
        },
        selectedIcon: {
            type: String,
            default: null,
        },
        unlockedIcons: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        selectedPieceSet: {
            type: String,
            default: "standart",
        },
        pieceSets: {
            bronze: { type: Boolean, default: false },
            silver: { type: Boolean, default: false },
            gold: { type: Boolean, default: false },
            platinum: { type: Boolean, default: false },
            iridium: { type: Boolean, default: false },
        },
        stats: {
            bishop: { type: Number, default: 0 },
            rook: { type: Number, default: 0 },
            horse: { type: Number, default: 0 },
            ferz: { type: Number, default: 0 },
            soldier: { type: Number, default: 0 },
            king: { type: Number, default: 0 },

            elephant: { type: Number, default: 0 },
            firzan: { type: Number, default: 0 },
            knight: { type: Number, default: 0 },
            prince: { type: Number, default: 0 },
            duke: { type: Number, default: 0 },
        },
    },
    pieceStyle: {
        type: String,
        default: "default", // default | bronze | silver | gold | platinum
    },
    boardColor: {
        light: { type: String, default: 'linear-gradient(160deg,rgb(255, 255, 255) 0%, rgb(162, 249, 255) 50%, rgb(81, 177, 255) 100%)' },
        dark: { type: String, default: 'linear-gradient(160deg,rgb(89, 142, 255) 0%, rgb(0, 43, 122) 50%, rgb(2, 0, 36) 100%)' }
    },
    arrowColor: {
        type: String,
        default: "rgba(255, 170, 0, 0.85)",
    },
    squareColor: {
        type: String,
        default: "rgba(0, 17, 255, 0.5)",
    },
    rookType: {
        type: String,
        default: 'rook',
    },
    horseType: {
        type: String,
        default: 'horse',
    },
    avatar: {
        type: String,
        default: null,
    },
    wins: {
        type: Number,
        default: 0,
    },
    draws: {
        type: Number,
        default: 0,
    },
    loses: {
        type: Number,
        default: 0,
    },
    botWins: {
        type: Number,
        default: 0,
    },
    botDraws: {
        type: Number,
        default: 0,
    },
    botLoses: {
        type: Number,
        default: 0,
    },
    multiWins: {
        type: Number,
        default: 0,
    },
    multiDraws: {
        type: Number,
        default: 0,
    },
    multiLoses: {
        type: Number,
        default: 0,
    },
    role: {
        type: String,
        enum: CONSTANTS.USER_ROLES, default: CONSTANTS.USER_ROLES[0],
    }
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;