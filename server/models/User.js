const mongoose = require('mongoose');

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
    boardColor: {
        light: { type: String, default: 'linear-gradient(160deg,rgb(255, 255, 255) 0%, rgb(162, 249, 255) 50%, rgb(81, 177, 255) 100%)' },
        dark: { type: String, default: 'linear-gradient(160deg,rgb(89, 142, 255) 0%, rgb(0, 43, 122) 50%, rgb(2, 0, 36) 100%)' }
    },
    rookType: {
        type: String,
        default: 'rook',
    },
    avatar: {
        type: String,
        default: null,
    }
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;